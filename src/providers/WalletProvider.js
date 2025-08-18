import { useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { BitpieWalletAdapter } from "@solana/wallet-adapter-bitpie";
import { CloverWalletAdapter } from "@solana/wallet-adapter-clover";
import { Coin98WalletAdapter } from "@solana/wallet-adapter-coin98";
import { CoinbaseWalletAdapter } from "@solana/wallet-adapter-coinbase";
import { CoinhubWalletAdapter } from "@solana/wallet-adapter-coinhub";
import { MathWalletAdapter } from "@solana/wallet-adapter-mathwallet";
import { SafePalWalletAdapter } from "@solana/wallet-adapter-safepal";
import { TokenPocketWalletAdapter } from "@solana/wallet-adapter-tokenpocket";
import { TrustWalletAdapter } from "@solana/wallet-adapter-trust";
import { WalletConnectWalletAdapter } from "@solana/wallet-adapter-walletconnect";
import { Config } from "../web3/config";

function SolanaWalletProvider({ children }) {
    const endpoint = Config.isDevnet ? "https://api.devnet.solana.com" : process.env.REACT_APP_RPC;
    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new TrustWalletAdapter(),
            new MathWalletAdapter({ endpoint }),
            new TokenPocketWalletAdapter(),
            new CoinbaseWalletAdapter({ endpoint }),
            new Coin98WalletAdapter({ endpoint }),
            new SafePalWalletAdapter({ endpoint }),
            new BitpieWalletAdapter({ endpoint }),
            new CloverWalletAdapter(),
            new CoinhubWalletAdapter(),
            new WalletConnectWalletAdapter({
                network: WalletAdapterNetwork.Mainnet, // const only, cannot use condition to use dev/main, guess is relative to walletconnect connection init
                options: {
                    projectId: "Token-Launcher-Solana",
                    metadata: {
                        name: "Raydium",
                        description: "Raydium",
                        url: "https://raydium.io/",
                        icons: ["https://raydium.io/logo/logo-only-icon.svg"]
                    }
                }
            }),
        ],
        [endpoint]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    {children}
                    {/* <WalletModal container="body" /> */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default SolanaWalletProvider;
