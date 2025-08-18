import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Fee } from "./config";

export const createMarketingPaymentTransaction = async ({
    connection,
    payer,
    amount,
}) => {
    const transaction = new Transaction();
    
    // Add payment transfer
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: new PublicKey(Fee.Receiver),
            lamports: Math.round(amount * LAMPORTS_PER_SOL),
        })
    );

    // Get latest blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    return { transaction, blockhash, lastValidBlockHeight };
}; 