import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-toastify';

const Affiliate = () => {
    const { publicKey } = useWallet();
    const [walletAddress, setWalletAddress] = useState("");
    const [referralLink, setReferralLink] = useState("");

    useEffect(() => {
        if (publicKey) {
            const address = publicKey.toString();
            setWalletAddress(address);
            setReferralLink(`https://localhost:3000?ref=${address}`);
        }
    }, [publicKey]);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied");
    };

    if (!publicKey) {
        return (
            <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
                <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                    <div className="text-center">
                        <div className="font-bold text-white text-[20px] max-md:text-16">
                            Please connect your wallet to view affiliate dashboard
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
            <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="font-bold text-white text-[20px] max-md:text-16">
                        <span className='text-primary'>Affiliate</span> Dashboard
                    </div>
                </div>

                {/* Wallet Address */}
                <div className="mb-6">
                    <div className="mb-2 text-label text-14">
                        Your Address
                    </div>
                    <div className="flex-1 p-3 border rounded-lg bg-primary/5 border-label/20">
                        <div className="font-mono text-white break-all text-14">
                            {walletAddress}
                        </div>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="mb-8">
                    <div className="mb-2 text-label text-14">
                        Your Referral Link
                    </div>
                    <div
                        className="flex-1 p-3 transition-all border rounded-lg cursor-pointer bg-primary/5 border-label/20 hover:bg-primary/10"
                        onClick={() => handleCopy(referralLink)}
                    >
                        <div className="text-white break-all text-14">
                            {referralLink}
                        </div>
                    </div>
                </div>

                {/* Earnings */}
                <div className="text-center">
                    <div className="mb-2 text-label text-14">
                        You've earned
                    </div>
                    <div className="font-bold text-white text-32">
                        0.00 <span className="text-primary">SOL</span>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Affiliate; 