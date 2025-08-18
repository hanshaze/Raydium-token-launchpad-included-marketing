import {
    Keypair,
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";
import {
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
    createMintToCheckedInstruction,
    AuthorityType,
    createSetAuthorityInstruction,
} from "@solana/spl-token";
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import { Fee } from "./config";

// Create token creation transaction
export const createTokenCreationTransaction = async ({
    connection,
    payer,
    tokenData,
    metadataUrl,
    totalFees,
}) => {
    const transaction = new Transaction();

    // Generate mint keypair
    const mintKeypair = Keypair.generate();
    const lamportsForMint = await getMinimumBalanceForRentExemptMint(connection);

    // Calculate total fees
    const totalFeesLamports = Math.round(totalFees * LAMPORTS_PER_SOL);

    // Add commission fee transfer
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: payer,
            toPubkey: new PublicKey(Fee.Receiver),
            lamports: totalFeesLamports,
        })
    );

    // Create mint account
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: payer,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: lamportsForMint,
            programId: TOKEN_PROGRAM_ID,
        })
    );

    // Initialize mint
    transaction.add(
        createInitializeMintInstruction(
            mintKeypair.publicKey,
            parseInt(tokenData.decimals, 10),
            payer,
            payer,
            TOKEN_PROGRAM_ID
        )
    );

    if (metadataUrl) {
        const metadataProgramId = new PublicKey(
            "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        );
        const [metadataAccount] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("metadata"),
                metadataProgramId.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
            ],
            metadataProgramId
        );

        const metadataData = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            uri: metadataUrl,
            sellerFeeBasisPoints: 0,
            creators: [
                {
                    address: payer,
                    verified: true,
                    share: 100,
                },
            ],
            collection: null,
            uses: null,
        };

        transaction.add(
            createCreateMetadataAccountV3Instruction(
                {
                    metadata: metadataAccount,
                    mint: mintKeypair.publicKey,
                    mintAuthority: payer,
                    payer: payer,
                    updateAuthority: payer,
                },
                {
                    createMetadataAccountArgsV3: {
                        data: metadataData,
                        isMutable: !tokenData.revokeUpdate,
                        collectionDetails: null,
                    },
                }
            )
        );
    }

    // Mint initial supply if specified
    if (parseInt(tokenData.supply) > 0) {
        const ata = await getAssociatedTokenAddress(
            mintKeypair.publicKey,
            payer
        );

        transaction.add(
            createAssociatedTokenAccountInstruction(
                payer,
                ata,
                payer,
                mintKeypair.publicKey
            )
        );

        const decimals = parseInt(tokenData.decimals, 10);
        const multiplier = Math.pow(10, decimals);
        const adjustedAmount = Math.floor(parseFloat(tokenData.supply) * multiplier);

        transaction.add(
            createMintToCheckedInstruction(
                mintKeypair.publicKey,
                ata,
                payer,
                adjustedAmount,
                decimals
            )
        );
    }

    // Add revoke authority instructions if requested
    if (tokenData.revokeMint) {
        transaction.add(
            createSetAuthorityInstruction(
                mintKeypair.publicKey,
                payer,
                AuthorityType.MintTokens,
                null
            )
        );
    }

    if (tokenData.revokeFreeze) {
        transaction.add(
            createSetAuthorityInstruction(
                mintKeypair.publicKey,
                payer,
                AuthorityType.FreezeAccount,
                null
            )
        );
    }

    return { transaction, mintKeypair };
};

export const calculateTotalFees = (revokeOptions) => {
    const additionalFees = Object.values(revokeOptions).reduce(
        (sum, isRevoked) => sum + (isRevoked ? Fee.Token.Revoke : 0),
        0
    );
    return Fee.Token.Creation + additionalFees;
}; 