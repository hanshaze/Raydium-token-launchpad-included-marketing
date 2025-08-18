import { Accordion } from "@material-tailwind/react";
import { FaChevronDown } from "react-icons/fa";

const faqItems = [
    {
        value: "token-cost",
        title: "How much does it cost to launch a token?",
        content: "Creating a token on TokenLaunch costs 0.25 SOL. You can optionally revoke mint, freeze, or update authority for 0.05 SOL each."
    },
    {
        value: "wallet-requirement",
        title: "Is Phantom wallet required?",
        content: "Yes. Phantom is required to connect your wallet, approve transactions, and interact with Solana mainnet."
    },
    {
        value: "liquidity-management",
        title: "Can I add or remove liquidity after launch?",
        content: "Yes. Adding liquidity costs 0.1 SOL. Removing liquidity (rugpull) also costs 0.1 SOL and sends all funds to your wallet."
    }
];

const Footer = () => {
    return (
        <footer className="border-t bg-secondary border-border">
            <div className="container max-w-[900px] mx-auto px-4 pt-8 md:pt-16 pb-2">
                <div className="mb-8">
                    <h2 className="mb-6 font-bold text-center md:mb-10 text-primary text-24 md:text-30">Frequently Asked Questions</h2>
                    <Accordion>
                        {faqItems.map((item) => (
                            <Accordion.Item
                                key={item.value}
                                value={item.value}
                                className="p-2 mb-4 border rounded-lg md:p-3 md:mb-6 border-border bg-primary/5"
                            >
                                <Accordion.Trigger className="px-2 py-2 text-white md:px-3 md:py-3 text-16 md:text-20">
                                    {item.title}
                                    <FaChevronDown className="h-3 w-3 md:h-4 md:w-4 group-data-[open=true]:rotate-180 text-label" />
                                </Accordion.Trigger>
                                <Accordion.Content className="pb-2 md:pb-3 px-2 md:px-3 !text-label text-14 md:text-16">
                                    {item.content}
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
            </div>
            
            <div className="w-full h-px my-4 md:my-8 bg-border" />
            <div className="mb-2 text-center md:mb-4 text-primary text-12 md:text-14">
                © 2025 TokenLaunch — Built on Solana
            </div>
            <div className="mb-4 text-center md:mb-8">
                <a
                    href="https://github.com/hanshaze"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-label hover:text-primary underline text-12 md:text-14 transition-colors"
                >
                    github.com/hanshaze
                </a>
            </div>
        </footer>
    );
};

export default Footer; 