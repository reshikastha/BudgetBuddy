import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { getLast12Months, getLast7Days, getYearsRange } from "@/utils/common";
import { scale } from "@/utils/styling";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";

export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
):Promise<ResponseType> =>{
    try{
        const {id, type, walletId, amount, image} = transactionData;
        if(!amount || amount <=0 || !walletId || !type){
            return {success:  false, msg:"Invalid transaction data!"};
        }

        if(id){

            ///
               const transactionRef = doc(firestore, "transactions", id);
                await updateDoc(transactionRef, transactionData);
                return { success: true, msg: "Transaction updated successfully." };
        }else{
            // update wallet for new transaction

            let res = await updateWalletForNewTransaction(walletId,Number(amount),type);
            if(!res.success) return res;

             const transactionRef = id? doc(firestore, "transactions", id) : doc(collection(firestore,"transactions"))

            // ✅ Prepare transaction payload
                const transactionPayload = {
                ...transactionData,
                id: transactionRef.id,
                createdAt: new Date(),
           
                };

                // ✅ Write to Firestore
                await setDoc(transactionRef, transactionPayload, { merge: true });
        // return {success : true, data:{...transactionData, id: transactionRef.id}};
            return { success: true, data: transactionPayload };
        }

       

    } catch (err:any){
        console.log("error creating or updating transaction:", err);
        return {success:false, msg:err.message}
    }
};


const updateWalletForNewTransaction = async (
    walletId: string,
    amount:number,
    type:string
) =>{
    try{
        const walletRef = doc(firestore, "wallets", walletId);
        const walletSnapshot = await getDoc(walletRef);

        if(!walletSnapshot.exists()){
            console.log("error updating wallet for new transaction");
            return{success:false, msg:"wallet not found"};
        }

        const walletData= walletSnapshot.data() as WalletType;

        if(type == "expense" && walletData.amount! - amount <0){
            return {
                success: false,
                msg:"Selected wallet dont have enough balance",
            };
        }

        const updateType = type == "income" ? "totalIncome" : "totalExpense";
        const updateWalletAmount = type == "income" ? Number(walletData.amount) + amount : Number(walletData.amount) - amount;

        const updateTotals = type == "income" ? Number(walletData.totalIncome) + amount : Number(walletData.totalExpenses) + amount;

        await updateDoc(walletRef, {
            amount: updateWalletAmount,
            [updateType]:updateTotals
        })


        return {success: true};
    }catch (err:any){
        console.log("error updating wallet for new transaction:", err);
        return {success: false, msg:err.message}
    }
};



export const fetchWeeklyStats = async(
    uid: string
): Promise<ResponseType> =>{
    try{
        const db = firestore;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate()-7);

        const transactionsQuery = query(
            collection(db, 'transactions'),
            where('date', '>=', Timestamp.fromDate(sevenDaysAgo)),
            where('date', '<=', Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid","==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);
        const weeklyData = getLast7Days();

        const transactions: TransactionType[]=[];

        //maping each transactions in day
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);


            const transactionDate= (transaction.date as Timestamp).toDate().toISOString().split("T")[0];

            const dayData= weeklyData.find((day)=> day.date == transactionDate);

            if(dayData) {
                if(transaction.type =="income"){
                    dayData.income += transaction.amount;
                } else if(transaction.type == 'expense'){
                    dayData.expense += transaction.amount
                }
            }
        })


        // takes each day and creates two entries in an array
        const stats = weeklyData.flatMap((day) =>[
            {
                value:day.income,
                label:day.day,
                spacing:scale(4),
                labelWidth:scale(30),
                frontColor:colors.primary
            },
            {value:day.expense, frontColor:colors.rose}

        ])

        return {success: true, data:{
            stats,
            transactions
        }};
    }catch(err: any){
        console.log("error fetching weekly stats: ", err)
        return{success:false, msg:err.message}
    }
}


export const fetchMonthlyStats = async(
    uid: string
): Promise<ResponseType> =>{
    try{
        const db = firestore;
        const today = new Date();
        const twelveMonthsAgo = new Date(today);
        twelveMonthsAgo.setMonth(today.getMonth()-12);

        const transactionsQuery = query(
            collection(db, 'transactions'),
            where('date', '>=', Timestamp.fromDate(twelveMonthsAgo)),
            where('date', '<=', Timestamp.fromDate(today)),
            orderBy("date", "desc"),
            where("uid","==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);
        const monthlyData = getLast12Months();

        const transactions: TransactionType[]=[];

        //maping each transactions in day
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);


            const transactionDate= (transaction.date as Timestamp).toDate();
            const monthName = transactionDate.toLocaleString('default',{
                month:'short'
            })
            const shortYear = transactionDate.getFullYear().toString().slice(-2)

            const monthData= monthlyData.find((month)=> month.month === `${monthName} ${shortYear}`);

            if(monthData) {
                if(transaction.type =="income"){
                    monthData.income += transaction.amount;
                } else if(transaction.type == 'expense'){
                    monthData.expense += transaction.amount
                }
            }
        })


        // takes each day and creates two entries in an array
        const stats = monthlyData.flatMap((month) =>[
            {
                value:month.income,
                label:month.month,
                spacing:scale(4),
                labelWidth:scale(30),
                frontColor:colors.primary
            },
            {value:month.expense, frontColor:colors.rose}

        ])

        return {success: true, data:{
            stats,
            transactions
        }};
    }catch(err: any){
        console.log("error fetching monthly stats: ", err)
        return{success:false, msg:err.message}
    }
}


export const fetchYearlyStats = async(
    uid: string
): Promise<ResponseType> =>{
    try{
        const db = firestore;


        const transactionsQuery = query(
            collection(db, 'transactions'),
            orderBy("date", "desc"),
            where("uid","==", uid)
        );

        const querySnapshot = await getDocs(transactionsQuery);

        const transactions: TransactionType[]=[];

        const firstTransaction = querySnapshot.docs.reduce((earliest, doc) => {
            const transactionDate = doc.data().date.toDate();
            return transactionDate < earliest ? transactionDate : earliest;
        }, new Date());

        const firstYear = firstTransaction.getFullYear();
        const currentyear = new Date().getFullYear();

        const yearlyData = getYearsRange(firstYear,currentyear);

        //process transactions to calculate income and expense for each month
        querySnapshot.forEach((doc) => {
            const transaction = doc.data() as TransactionType;
            transaction.id = doc.id;
            transactions.push(transaction);


            const transactionYear= (transaction.date as Timestamp).toDate().getFullYear();
            

            const yearData= yearlyData.find((item: any)=> item.year === transactionYear.toString());

            if(yearData) {
                if(transaction.type =="income"){
                    yearData.income += transaction.amount;
                } else if(transaction.type == 'expense'){
                    yearData.expense += transaction.amount
                }
            }
        })


        // takes each day and creates two entries in an array
        const stats = yearlyData.flatMap((year: any) =>[
            {
                value:year.income,
                label:year.year,
                spacing:scale(4),
                labelWidth:scale(35),
                frontColor:colors.primary
            },
            {value:year.expense, frontColor:colors.rose}

        ])

        return {success: true, data:{
            stats,
            transactions
        }};
    }catch(err: any){
        console.log("error fetching yearly stats: ", err)
        return{success:false, msg:err.message}
    }
}