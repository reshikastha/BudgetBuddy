import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

export const createOrUpdateWallet = async (
    walletData:Partial<WalletType>
): Promise<ResponseType> => {
    try{
        let walletToSave = {...walletData};

        if(!walletData.id) {
            //new wallet
            walletToSave.amount = 0;
            walletToSave.totalIncome = 0;
            walletToSave.totalExpenses = 0;
            walletToSave.created = new Date();
        }

        const walletRef = walletData?.id ? doc(firestore, "wallets", walletData?.id) : doc(collection(firestore, "wallets"));

        await setDoc(walletRef, walletToSave, {merge: true}); /// update only the data provided
        return{success: true, data: {...walletToSave, id: walletRef.id}};
    }catch(error: any){
        console.log("error creating or updating wallet:", error);
        return {success: false, msg: error.message}
    }
}

export const deleteWallet = async (walletId: string) : Promise<ResponseType> => {
    try{
        const walletRef = doc(firestore, "wallets", walletId);
        await deleteDoc(walletRef);

        // todo : delete all transactions related to this wallet

        return {success: true, msg:"Wallet delete succesfully"};
    }catch(error: any){
        console.log("error deleting wallet:", error);
        return {success: false, msg: error.message}
    }
}