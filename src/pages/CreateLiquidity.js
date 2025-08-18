import React, { useState } from 'react';
import {
    Input,
    Button,
    Typography,
    Tooltip,
} from "@material-tailwind/react";
import { IoIosInformationCircleOutline } from "react-icons/io";

const CreateLiquidity = () => {
    const [formData, setFormData] = useState({
        baseTokenQuantity: '',
        quoteTokenQuantity: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log(formData);
    };

    return (
        <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
            <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <Typography variant="h2" className="font-bold text-white text-[20px] max-md:text-16">
                        Create <span className='text-primary'>Liquidity Pool</span>
                    </Typography>
                    <Typography className="!text-gray-400 text-12 md:text-12 leading-tight mt-2">
                        Launch your memecoin liquidity for only 0.1 SOL.
                    </Typography>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Base Token Quantity */}
                    <div>
                        <Input
                            name="baseTokenQuantity"
                            value={formData.baseTokenQuantity}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40 h-12"
                            placeholder="Base Token Quantity"
                        />
                    </div>

                    {/* Quote Token Quantity */}
                    <div>
                        <Input
                            name="quoteTokenQuantity"
                            value={formData.quoteTokenQuantity}
                            onChange={handleInputChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40 h-12"
                            placeholder="Quote Token Quantity"
                        />
                    </div>

                    {/* Fee Information */}
                    <div className="flex items-center justify-center py-2">
                        <div className="flex items-center gap-2">
                            <div className="text-label text-12">
                                Liquidity setup fee: 0.01 SOL
                            </div>
                            <Tooltip>
                                <Tooltip.Trigger>
                                    <div className='flex items-center gap-1 cursor-help'>
                                        <IoIosInformationCircleOutline className="w-4 h-4 text-yellow-400" />
                                        <div className='leading-none text-yellow-400 border-b border-yellow-400 border-dotted text-12'>Why is there a fee?</div>
                                    </div>
                                </Tooltip.Trigger>
                                <Tooltip.Content className="border bg-secondary border-border max-w-[300px]">
                                    <div className="p-2 text-white text-12">
                                        A small fee is required to launch your token on the Solana network. This includes transaction fees, token creation, and liquidity setup. These are standard Solana blockchain costs.
                                    </div>
                                    <Tooltip.Arrow className="fill-secondary" />
                                </Tooltip.Content>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full font-medium text-white bg-primary text-16"
                        size='md'
                    >
                        Create Liquidity
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateLiquidity;
