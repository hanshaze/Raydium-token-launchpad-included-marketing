import React, { useState } from 'react';
import {
    Input,
    Button,
    Typography,
} from "@material-tailwind/react";
import { IoAddCircle } from "react-icons/io5";
import { IoRemoveCircle } from "react-icons/io5";

const ManageLiquidity = () => {
    const [addLiquidity, setAddLiquidity] = useState({
        amount: '',
    });

    const [withdrawLiquidity, setWithdrawLiquidity] = useState({
        amount: '',
    });

    const handleAddLiquidityChange = (e) => {
        const { name, value } = e.target;
        setAddLiquidity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleWithdrawLiquidityChange = (e) => {
        const { name, value } = e.target;
        setWithdrawLiquidity(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddLiquidity = (e) => {
        e.preventDefault();
        console.log('Add Liquidity:', addLiquidity);
    };

    const handleWithdrawLiquidity = (e) => {
        e.preventDefault();
        console.log('Withdraw Liquidity:', withdrawLiquidity);
    };

    return (
        <div className="w-full max-w-[500px] max-md:max-w-full mx-auto px-4 py-8">
            <div className="px-4 py-6 border rounded-2xl bg-secondary backdrop-blur-md border-border md:px-6 md:py-8">
                {/* Header */}
                <div className="mb-6 text-center">
                    <Typography variant="h2" className="font-bold text-white text-[20px] max-md:text-16">
                        Manage <span className='text-primary'>Liquidity</span>
                    </Typography>
                    <Typography className="!text-gray-400 text-12 md:text-12 leading-tight mt-2">
                        Add or remove your liquidity with ease.
                    </Typography>
                </div>

                {/* Add Liquidity Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1 font-medium leading-none text-label text-14">
                        <IoAddCircle className='w-4 h-4' /> Add Liquidity
                    </div>
                    <form onSubmit={handleAddLiquidity} className="space-y-3">
                        <Input
                            name="amount"
                            value={addLiquidity.amount}
                            onChange={handleAddLiquidityChange}
                            className="!text-white placeholder:text-label bg-primary/5 border-label/40 h-10"
                            placeholder="0.1"
                        />
                        <Button
                            type="submit"
                            className="w-full font-medium text-white bg-primary text-16"
                            size='md'
                        >
                            Add Liquidity
                        </Button>
                    </form>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                    </div>
                    <div className="relative flex justify-center">
                        <span className="px-2 text-label text-12 bg-secondary">or</span>
                    </div>
                </div>

                {/* Withdraw Liquidity Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1 font-medium leading-none text-red-400 text-14">
                        <IoRemoveCircle className='w-4 h-4' /> Withdraw Liquidity
                    </div>
                    <form onSubmit={handleWithdrawLiquidity} className="space-y-3">
                        <Input
                            name="amount"
                            value={withdrawLiquidity.amount}
                            onChange={handleWithdrawLiquidityChange}
                            className="!text-white placeholder:text-red-400 bg-red-400/5 border-red-400/40 h-10 hover:red-300"
                            placeholder="0.1"
                            color='error'
                        />
                        <Button
                            type="submit"
                            className="w-full font-medium text-white text-16"
                            size='md'
                            color='error'
                        >
                            Withdraw Liquidity
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ManageLiquidity;
