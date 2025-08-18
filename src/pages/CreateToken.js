import React, { useEffect, useState, useCallback } from 'react';
import {
    Input,
    Button,
    Checkbox,
    Textarea,
    Dialog,
    IconButton,
} from "@material-tailwind/react";
import { FaUpload, FaCopy, FaExternalLinkAlt } from "react-icons/fa";
import { useDropzone } from 'react-dropzone';
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import ReactConfetti from 'react-confetti';
import { createConnection } from "../web3/connection";
import { createTokenCreationTransaction, calculateTotalFees } from "../web3/token";
import { Config } from '../web3/config';
import { uploadToPinata, testPinataConnection } from '../utils/pinata';
import { FaXmark } from 'react-icons/fa6';

const CreateToken = () => {
    const { publicKey, signTransaction } = useWallet();
    const [formData, setFormData] = useState({
        tokenName: '',
        tokenSymbol: '',
        description: '',
        websiteLink: '',
        twitterLink: '',
        telegramLink: '',
        revokeMint: false,
        revokeFreeze: false,
        revokeUpdate: false,
        decimals: '9',
        supply: '1000000000',
    });

    const [isCreating, setIsCreating] = useState(false);
    const [creationProgress, setCreationProgress] = useState(0);
    const [requiredBalance, setRequiredBalance] = useState(0);
    const [logoFile, setLogoFile] = useState(null);
    const [isPinataConfigured, setIsPinataConfigured] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [tokenAddress, setTokenAddress] = useState('');

    // Initialize Pinata connection check
    useEffect(() => {
        const checkPinataConnection = async () => {
            try {
                const isConnected = await testPinataConnection();
                setIsPinataConfigured(isConnected);
                if (!isConnected) {
                    console.warn('Pinata credentials are not configured or connection failed');
                }
            } catch (error) {
                console.error('Error checking Pinata connection:', error);
                setIsPinataConfigured(false);
            }
        };

        checkPinataConnection();
    }, []);

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }
            setLogoFile(file);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif']
        },
        maxFiles: 1,
        multiple: false
    });

    useEffect(() => {
        const totalRequired = calculateTotalFees({
            revokeMint: formData.revokeMint,
            revokeFreeze: formData.revokeFreeze,
            revokeUpdate: formData.revokeUpdate,
        });

        setRequiredBalance(totalRequired);
    }, [formData.revokeMint, formData.revokeFreeze, formData.revokeUpdate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation checks
        if (!publicKey) {
            toast.error("Wallet not connected");
            return;
        }

        if (!signTransaction) {
            toast.error("Wallet doesn't support required methods");
            return;
        }

        try {
            setIsCreating(true);
            setCreationProgress(10);
            toast.info("Preparing token creation...");

            const connection = createConnection();

            // Upload to IPFS if we have a logo and Pinata is configured
            let metadataUrl = null;
            if (logoFile && isPinataConfigured) {
                try {
                    setCreationProgress(20);
                    toast.info("Uploading logo to IPFS...");

                    const metadataForPinata = {
                        name: formData.tokenName,
                        symbol: formData.tokenSymbol,
                        description: formData.description || "",
                        decimals: parseInt(formData.decimals, 10),
                        supply: formData.supply,
                        external_url: formData.websiteLink || null,
                        seller_fee_basis_points: 0,
                        properties: {
                            creators: [
                                {
                                    address: publicKey.toString(),
                                    share: 100,
                                },
                            ],
                        },
                        links: [],
                    };

                    // Add social links when available
                    if (formData.websiteLink) {
                        metadataForPinata.links.push({
                            name: "website",
                            url: formData.websiteLink,
                        });
                    }
                    if (formData.twitterLink) {
                        metadataForPinata.links.push({
                            name: "twitter",
                            url: formData.twitterLink,
                        });
                    }
                    if (formData.telegramLink) {
                        metadataForPinata.links.push({
                            name: "telegram",
                            url: formData.telegramLink,
                        });
                    }

                    const ipfsData = await uploadToPinata(logoFile, metadataForPinata);
                    metadataUrl = ipfsData.metadataUri;
                    setCreationProgress(30);
                    toast.success("Logo uploaded successfully!");
                } catch (error) {
                    console.error("IPFS upload error:", error);
                    toast.warning("Could not upload to IPFS. Continuing without metadata.");
                }
            }

            // Calculate additional fees
            const totalFees = calculateTotalFees({
                revokeMint: formData.revokeMint,
                revokeFreeze: formData.revokeFreeze,
                revokeUpdate: formData.revokeUpdate,
            });

            // Create transaction
            const { transaction, mintKeypair } = await createTokenCreationTransaction({
                connection,
                payer: publicKey,
                tokenData: {
                    name: formData.tokenName,
                    symbol: formData.tokenSymbol,
                    decimals: '9',
                    supply: '1000000000',
                    revokeMint: formData.revokeMint,
                    revokeFreeze: formData.revokeFreeze,
                    revokeUpdate: formData.revokeUpdate,
                },
                metadataUrl,
                totalFees,
            });

            setCreationProgress(50);

            // Get latest blockhash and finalize transaction
            const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;
            transaction.sign(mintKeypair);

            setCreationProgress(70);

            // Sign with wallet
            const signedTransaction = await signTransaction(transaction);

            setCreationProgress(85);

            // Send and confirm transaction
            const signature = await connection.sendRawTransaction(
                signedTransaction.serialize()
            );

            try {
                await connection.confirmTransaction(
                    {
                        signature,
                        blockhash,
                        lastValidBlockHeight,
                    },
                    "confirmed"
                );

                setCreationProgress(100);
                setTokenAddress(mintKeypair.publicKey.toString());
                setShowConfetti(true);
                setShowSuccessModal(true);
                toast.success("Token created successfully!");
                console.log("Token address:", mintKeypair.publicKey.toString());
            } catch (confirmError) {
                console.error("Confirmation error:", confirmError);

                // Check transaction status as fallback
                const status = await connection.getSignatureStatus(signature);

                if (status?.value && !status.value.err) {
                    setCreationProgress(100);
                    setTokenAddress(mintKeypair.publicKey.toString());
                    setShowConfetti(true);
                    setShowSuccessModal(true);
                    toast.success("Token created successfully!");
                    console.log("Token address:", mintKeypair.publicKey.toString());
                } else if (status?.value?.err) {
                    throw new Error(`Transaction failed: ${status.value.err}`);
                } else {
                    const explorerUrl = `https://solscan.io/tx/${signature}` + Config.isDevnet ? "?cluster=devnet" : "";
                    toast.success(
                        <div>
                            Transaction submitted.
                            <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-primary hover:underline"
                            >
                                View on Explorer
                            </a>
                        </div>
                    );
                    console.log("Token address:", mintKeypair.publicKey.toString());
                }
            }
        } catch (error) {
            console.error("Token creation error:", error);

            // User-friendly error message
            let errorMessage = error.message || "Unknown error occurred";
            let explorerUrl = null;

            if (errorMessage.includes("slice") || errorMessage.includes("null")) {
                errorMessage = "Error with wallet connection. Please reconnect your wallet and try again.";
            } else if (errorMessage.includes("insufficient")) {
                errorMessage = "Not enough SOL in your wallet to complete this transaction.";
            } else if (errorMessage.includes("blockhash")) {
                errorMessage = "Network timeout. Please try again.";
            } else if (errorMessage.includes("0x1")) {
                errorMessage = "Transaction simulation failed. Please check your wallet balance.";
            } else if (errorMessage.includes("timeout")) {
                errorMessage = "Transaction confirmation timed out. Your token may still have been created.";
            }

            if (explorerUrl) {
                toast.error(
                    <div>
                        {errorMessage}
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-primary hover:underline"
                        >
                            Check Explorer
                        </a>
                    </div>
                );
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
            {showConfetti && (
                <ReactConfetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
                />
            )}

            <Dialog 
                open={showSuccessModal} 
                handler={() => setShowSuccessModal(false)}
                className="bg-secondary/95 backdrop-blur-md"
            >
                <Dialog.Overlay className="bg-black/50 backdrop-blur-sm">
                    <Dialog.Content className="bg-secondary border border-border max-w-[600px] w-[95%] mx-auto">
                        <div className="flex items-center justify-between gap-4">
                            <div className="text-xl font-bold text-white max-md:text-lg">
                                Token Created Successfully!
                            </div>
                            <IconButton
                                onClick={() => setShowSuccessModal(false)}
                                size="sm"
                                variant="ghost"
                                color="secondary"
                                className="absolute text-white right-2 top-2 hover:text-primary"
                                isCircular
                            >
                                <FaXmark className="w-5 h-5" />
                            </IconButton>
                        </div>

                        <div className="mt-6 space-y-4">
                            {/* Token Logo and Basic Info */}
                            <div className="flex items-center gap-4 p-4 border rounded-lg bg-primary/5 border-border max-md:flex-col max-md:text-center">
                                <div className="flex items-center justify-center w-16 h-16 overflow-hidden rounded-lg bg-primary/10 max-md:mx-auto">
                                    {logoFile ? (
                                        <img
                                            src={URL.createObjectURL(logoFile)}
                                            alt="Token logo"
                                            className="object-contain w-full h-full"
                                        />
                                    ) : (
                                        <div className="text-2xl font-bold text-primary">
                                            {formData.tokenSymbol?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="max-md:w-full">
                                    <div className="text-xl font-bold text-white max-md:text-lg">{formData.tokenName}</div>
                                    <div className="font-medium text-primary">{formData.tokenSymbol}</div>
                                </div>
                            </div>

                            {/* Token Details */}
                            <div className="p-4 border rounded-lg bg-primary/5 border-border">
                                <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
                                    <div>
                                        <div className="text-sm text-gray-400">Token Name</div>
                                        <div className="font-medium text-white">{formData.tokenName}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Token Symbol</div>
                                        <div className="font-medium text-white">{formData.tokenSymbol}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Decimals</div>
                                        <div className="font-medium text-white">9</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Initial Supply</div>
                                        <div className="font-medium text-white">1,000,000,000</div>
                                    </div>
                                </div>
                            </div>

                            {/* Token Address */}
                            <div>
                                <div className="mb-2 text-sm text-gray-400">Token Address</div>
                                <div className="p-3 break-all border rounded-lg bg-primary/5 border-border">
                                    <div className="flex items-center justify-between gap-2 max-md:flex-col max-md:items-start">
                                        <div className="font-mono text-sm text-primary max-md:w-full max-md:break-all">
                                            {tokenAddress}
                                        </div>
                                        <div className="flex items-center gap-2 max-md:w-full max-md:justify-end">
                                            <IconButton
                                                onClick={() => {
                                                    navigator.clipboard.writeText(tokenAddress);
                                                    toast.success("Token address copied to clipboard!");
                                                }}
                                                className="text-primary bg-primary/10 hover:bg-primary hover:text-white"
                                                size="sm"
                                            >
                                                <FaCopy className="w-4 h-4" />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => window.open(`https://solscan.io/token/${tokenAddress}${Config.isDevnet ? "?cluster=devnet" : ""}`, '_blank')}
                                                className="text-primary bg-primary/10 hover:bg-primary hover:text-white"
                                                size="sm"
                                            >
                                                <FaExternalLinkAlt className="w-4 h-4" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            {(formData.websiteLink || formData.twitterLink || formData.telegramLink) && (
                                <div>
                                    <div className="mb-2 text-sm text-gray-400">Social Links</div>
                                    <div className="p-3 border rounded-lg bg-primary/5 border-border">
                                        <div className="space-y-2">
                                            {formData.websiteLink && (
                                                <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                                                    <div className="text-white">Website:</div>
                                                    <a href={formData.websiteLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-md:w-full max-md:break-all">
                                                        {formData.websiteLink}
                                                    </a>
                                                </div>
                                            )}
                                            {formData.twitterLink && (
                                                <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                                                    <div className="text-white">Twitter:</div>
                                                    <a href={formData.twitterLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-md:w-full max-md:break-all">
                                                        {formData.twitterLink}
                                                    </a>
                                                </div>
                                            )}
                                            {formData.telegramLink && (
                                                <div className="flex items-center gap-2 max-md:flex-col max-md:items-start">
                                                    <div className="text-white">Telegram:</div>
                                                    <a href={formData.telegramLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline max-md:w-full max-md:break-all">
                                                        {formData.telegramLink}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 max-md:flex-col max-md:w-full">
                                <Button
                                    onClick={() => window.open(`/marketing/${tokenAddress}`, '_blank')}
                                    className="max-md:w-full"
                                >
                                    Go to Marketing Page
                                </Button>
                                <Button
                                    onClick={() => window.open(`https://raydium.io/clmm/create-pool/`, '_blank')}
                                    className="max-md:w-full"
                                >
                                    Create Raydium Pool
                                </Button>
                            </div>
                        </div>
                    </Dialog.Content>
                </Dialog.Overlay>
            </Dialog>

            <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div variant="h2" className="font-bold text-white text-[20px] max-md:text-16">
                        Create Your Own <span className='text-primary'>Meme Coin</span> FAST
                    </div>
                    <div className="!text-gray-400 text-12 md:text-12 leading-tight mt-2">
                        Launch a Solana token with 1 click. No coding needed.
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex items-center gap-3">
                        {/* Logo Upload */}
                        <div className="flex items-center">
                            <div
                                {...getRootProps()}
                                className={`flex flex-col items-center justify-center h-[88px] border border-dashed rounded-md cursor-pointer aspect-square border-label/40 bg-primary/5 hover:bg-primary/10 transition-colors ${
                                    isDragActive ? 'border-primary bg-primary/10' : ''
                                }`}
                            >
                                <input {...getInputProps()} />
                                <div className="flex flex-col items-center justify-center">
                                    {logoFile ? (
                                        <img
                                            src={URL.createObjectURL(logoFile)}
                                            alt="Token logo"
                                            className="object-contain w-12 h-12 rounded-md"
                                        />
                                    ) : (
                                        <>
                                            <FaUpload className="w-5 h-5 mb-1 text-primary/70" />
                                            <div className="px-2 leading-snug text-center text-label text-12">
                                                {isDragActive ? 'Drop the file here' : 'Logo Upload'}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col w-full gap-3'>
                            {/* Token Name */}
                            <div>
                                <Input
                                    type="text"
                                    name="tokenName"
                                    value={formData.tokenName}
                                    onChange={handleInputChange}
                                    className="!text-white placeholder:text-label bg-primary/5 border-label/40"
                                    placeholder="Token Name"
                                />
                            </div>

                            {/* Token Symbol */}
                            <div>
                                <Input
                                    type="text"
                                    name="tokenSymbol"
                                    value={formData.tokenSymbol}
                                    onChange={handleInputChange}
                                    className="!text-white placeholder:text-label bg-primary/5 border-label/40"
                                    placeholder="Token Symbol"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <Textarea
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40 h-[100px]"
                            placeholder="Description"
                        />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-3">
                        <Input
                            type="text"
                            name="websiteLink"
                            value={formData.websiteLink}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40"
                            placeholder="Website Link"
                        />
                        <Input
                            type="text"
                            name="twitterLink"
                            value={formData.twitterLink}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40"
                            placeholder="Twitter Link"
                        />
                        <Input
                            type="text"
                            name="telegramLink"
                            value={formData.telegramLink}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40"
                            placeholder="Telegram Link"
                        />
                    </div>

                    {/* Revoke Options */}
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                name="revokeMint"
                                checked={formData.revokeMint}
                                onChange={handleCheckboxChange}
                                id="revoke-mint"
                                className="border-label/40 bg-primary/5"
                                color="green"
                            >
                                <Checkbox.Indicator className="text-primary" />
                            </Checkbox>
                            <div
                                as="label"
                                htmlFor="revoke-mint"
                                className="text-white cursor-pointer !text-14"
                            >
                                Revoke Mint
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                name="revokeFreeze"
                                checked={formData.revokeFreeze}
                                onChange={handleCheckboxChange}
                                id="revoke-freeze"
                                className="border-label/40 bg-primary/5"
                                color="green"
                            >
                                <Checkbox.Indicator className="text-primary" />
                            </Checkbox>
                            <div
                                as="label"
                                htmlFor="revoke-freeze"
                                className="text-white cursor-pointer !text-14"
                            >
                                Revoke Freeze
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                name="revokeUpdate"
                                checked={formData.revokeUpdate}
                                onChange={handleCheckboxChange}
                                id="revoke-update"
                                className="border-label/40 bg-primary/5"
                                color="green"
                            >
                                <Checkbox.Indicator className="text-primary" />
                            </Checkbox>
                            <div
                                as="label"
                                htmlFor="revoke-update"
                                className="text-white cursor-pointer !text-14"
                            >
                                Revoke Update
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    {isCreating && (
                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="text-white text-14">
                                    Creating Token
                                </div>
                                <div className="text-primary text-14">
                                    {creationProgress}%
                                </div>
                            </div>
                            <div className="w-full h-2 overflow-hidden rounded-full bg-primary/10">
                                <div
                                    className="h-full transition-all duration-300 ease-in-out bg-gradient-to-r from-primary to-primary/70"
                                    style={{ width: `${creationProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className={`w-full font-medium text-white bg-primary text-16 ${isCreating ? "opacity-75 cursor-not-allowed" : ""
                            }`}
                        size='md'
                        disabled={isCreating || !publicKey}
                    >
                        {isCreating ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 mr-2 border-t-2 border-white rounded-full animate-spin"></div>
                                Creating Token...
                            </div>
                        ) : (
                            `Create Token (${requiredBalance.toFixed(2)} SOL)`
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateToken;
