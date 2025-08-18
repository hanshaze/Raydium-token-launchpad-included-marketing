import { Connection } from "@solana/web3.js";
import { Config } from "./config";

export const createConnection = () => {
    const endpoint = !Config.isDevnet ? process.env.REACT_APP_RPC : "https://api.devnet.solana.com";
    return new Connection(endpoint, "confirmed");
}; 