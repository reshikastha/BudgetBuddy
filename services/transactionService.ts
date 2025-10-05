import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
}