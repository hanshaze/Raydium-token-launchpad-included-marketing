import React, { useState, useEffect } from 'react';
import {
    Input,
    Button,
} from "@material-tailwind/react";
import { FaInstagram, FaTiktok, FaTwitter, FaWeibo } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import { useWallet } from "@solana/wallet-adapter-react";
import { createConnection } from "../web3/connection";
import { createMarketingPaymentTransaction } from "../web3/marketing";
import { isValidSolanaAddress } from "../utils/validation";
import { toast } from "react-toastify";

const Marketing = () => {
    const { token } = useParams();
    const { publicKey, signTransaction } = useWallet();
    const [processingPlatform, setProcessingPlatform] = useState(null);
    const [marketingData, setMarketingData] = useState({
        tokenAddress: '',
        twitter: '',
        tiktok: '',
        instagram: '',
        chinese: '',
    });

    // Update token address when URL parameter changes
    useEffect(() => {
        setMarketingData(prev => ({
            ...prev,
            tokenAddress: token || ''
        }));
    }, [token]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const adImages = [
        '/assets/marketing/marketing1.webp',
        '/assets/marketing/marketing2.webp',
        '/assets/marketing/marketing3.webp',
        '/assets/marketing/marketing4.webp',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) => 
                prevIndex === adImages.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [adImages.length]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMarketingData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (platform) => async (e) => {
        e.preventDefault();
        
        if (!publicKey) {
            toast.error("Please connect your wallet first");
            return;
        }

        if (!signTransaction) {
            toast.error("Wallet doesn't support required methods");
            return;
        }

        if (!marketingData.tokenAddress) {
            toast.error("Please enter a token address");
            return;
        }

        if (!isValidSolanaAddress(marketingData.tokenAddress)) {
            toast.error("Invalid token address");
            return;
        }

        try {
            setProcessingPlatform(platform);
            const connection = createConnection();
            const marketingOption = marketingOptions.find(opt => opt.name === platform);

            // Create and sign transaction
            const { transaction, blockhash, lastValidBlockHeight } = await createMarketingPaymentTransaction({
                connection,
                payer: publicKey,
                amount: marketingOption.price,
            });

            const signedTransaction = await signTransaction(transaction);

            // Send transaction
            const signature = await connection.sendRawTransaction(
                signedTransaction.serialize()
            );

            // Wait for confirmation
            await connection.confirmTransaction({
                signature,
                blockhash,
                lastValidBlockHeight,
            });

            toast.success("Payment successful!");
            console.log("Transaction signature:", signature);

        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.message || "Payment failed");
        } finally {
            setProcessingPlatform(null);
        }
    };

    const marketingOptions = [
        {
            name: 'twitter',
            title: 'Twitter Marketing',
            price: 0.25,
            icon: <FaTwitter className='text-white size-5' />,
            color: 'bg-[#1DA1F2]',
        },
        {
            name: 'instagram',
            title: 'Instagram Marketing',
            price: 0.25,
            icon: <FaInstagram className='text-white size-4' />,
            color: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737]',
        },
        {
            name: 'tiktok',
            title: 'Tiktok Marketing',
            price: 0.25,
            icon: <FaTiktok className='text-white size-5' />,
            color: 'bg-black',
        },
        {
            name: 'chinese',
            title: 'Chinese Social Media Marketing',
            price: 0.4,
            icon: <FaWeibo className='text-white size-5' />,
            color: 'bg-[#E6162D]',
        },
    ];

    return (
        <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
            <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="font-bold text-white text-[20px] max-md:text-16">
                        Buy MemeCoin <span className='text-primary'>Marketing</span>
                    </div>
                    <div className="!text-gray-400 text-12 md:text-12 leading-tight mt-2">
                        Boost your token visibility — fake it 'til you make it 🌱
                    </div>
                </div>

                {/* Ad Images Carousel */}
                <div className="relative mb-6 overflow-hidden bg-black rounded-md">
                    <div className="relative h-[200px]">
                        {adImages.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Ad ${index + 1}`}
                                className={`absolute w-full h-full object-contain transition-opacity duration-500 ${
                                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                }`}
                            />
                        ))}
                    </div>
                    {/* Image Indicators */}
                    <div className="absolute flex space-x-2 transform -translate-x-1/2 bottom-3 left-1/2">
                        {adImages.map((_, index) => (
                            <div
                                key={index}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentImageIndex ? 'bg-primary w-4' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>

                <div className='mb-6'>
                    <Input
                        name="tokenAddress"
                        value={marketingData.tokenAddress}
                        onChange={handleInputChange}
                        className="!text-white placeholder:text-label bg-primary/5 border-label/40 h-12"
                        placeholder="Enter token address"
                    />
                </div>

                {/* Marketing Options */}
                <div className="space-y-4">
                    {marketingOptions.map((option) => (
                        <form 
                            key={option.name}
                            onSubmit={handleSubmit(option.name)}
                            className={`p-4 border rounded-xl bg-black/10 border-white/10 flex items-center justify-between hover:bg-label/10 transition-all`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`${option.color} p-2 rounded-lg`}>
                                    {option.icon}
                                </div>
                                <div>
                                    <div className="font-medium text-white text-14">
                                        {option.title}
                                    </div>
                                    <div className={`text-gray-400 font-medium text-12`}>
                                        {option.price} SOL
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Button
                                    type="submit"
                                    className={`${option.color} text-white font-medium text-16 border-0`}
                                    size='md'
                                    disabled={processingPlatform === option.name}
                                >
                                    {processingPlatform === option.name ? 'Processing...' : 'Buy Now'}
                                </Button>
                            </div>
                        </form>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Marketing;
