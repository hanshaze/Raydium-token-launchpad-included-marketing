import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { FaRegCopy, FaSignOutAlt, FaWallet } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import {
  Dialog,
  Typography,
  IconButton,
  Menu,
  Button,
} from "@material-tailwind/react";

const imageURL = {
  "Phantom": "/assets/wallets/phantom.svg",
  "MetaMask": "/assets/wallets/metamask.svg",
  "OKX Wallet": "/assets/wallets/okx.svg",
  "Trust": "/assets/wallets/trust.svg",
  "MathWallet": "/assets/wallets/mathwallet.svg",
  "TokenPocket": "/assets/wallets/tokenpocket.svg",
  "Coinbase Wallet": "/assets/wallets/coinbase.svg",
  "Coin98": "/assets/wallets/coin98.svg",
  "SafePal": "/assets/wallets/safepal.svg",
  "Bitpie": "/assets/wallets/bitpie.svg",
  "Clover": "/assets/wallets/clover.svg",
  "Coinhub": "/assets/wallets/coinhub.svg",
  "WalletConnect": "/assets/wallets/walletconnect.svg",
}

export default function ConnectWalletButton() {
  const [copied, setCopied] = useState(false);
  const [walletModalConfig, setWalletModalConfig] = useState(null);
  const { buttonState, onConnect, onDisconnect, onSelectWallet } = useWalletMultiButton({ onSelectWallet: setWalletModalConfig });
  const { publicKey, connected, wallet } = useWallet();

  const getEllipsisAddress = (address) => {
    return address.slice(0, 5) + "..." + address.slice(-5);
  };

  let label = "";
  switch (buttonState) {
    case "connected":
      if (connected)
        label = getEllipsisAddress(publicKey.toBase58());
      else
        label = "Disconnect";
      break;
    case "connecting":
      label = "Connecting";
      break;
    case "disconnecting":
      label = "Disconnecting";
      break;
    case "has-wallet":
      label = "Connect";
      break;
    case "no-wallet":
      label = "Select Wallet";
      break;
    default:
      break;
  }

  const copyToClipboard = async (text) => {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    else
      console.error('Clipboard not supported');
  };

  const handleClick = useCallback(() => {
    console.log("Connect button clicked:", buttonState);
    switch (buttonState) {
      case 'connected':
        // onDisconnect();
        break;
      case 'connecting':
      case 'disconnecting':
        break;
      case 'has-wallet':
        onConnect();
        break;
      case 'no-wallet':
        onSelectWallet();
        break;
      default:
        break;
    }
  }, [buttonState, onConnect, onSelectWallet]);

  return (
    <>
      {!connected &&
        <Button className="font-bold uppercase"
          disabled={buttonState === "connecting" || buttonState === "disconnecting"}
          onClick={handleClick}>
          {label}
        </Button>
      }
      {
        connected && publicKey &&
        (
          <Menu>
            <Menu.Trigger as={Button} className="pl-3 pr-4 h-button rounded-[4px] justify-center items-center gap-1 inline-flex bg-primary active:scale-95 transition duration-90 ease-in-out transform focus:outline-none text-16 font-semibold text-center text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap">
              {wallet && <img src={imageURL[wallet.adapter.name.replace(/\uFEFF/g, "")]} className="w-6 h-6 mr-1" alt={wallet.adapter.name} />}
              <p className="font-medium leading-none text-center text-14">{label}</p>
            </Menu.Trigger>
            <Menu.Content className="min-w-[153px] bg-secondary text-white border-border">
              <Menu.Item className="flex items-center h-8 p-2 hover:!bg-primary" onClick={() => copyToClipboard(publicKey.toBase58())}>
                <div className="flex items-center justify-center flex-shrink-0 text-white">
                  {
                    copied ?
                      (<svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>) :
                      (<FaRegCopy className="w-3.5 h-3.5" />)
                  }
                </div>
                <div className="ml-2">
                  <p className="font-medium text-white text-14">Copy Address</p>
                </div>
              </Menu.Item>
              <Menu.Item className="flex items-center h-8 p-2 hover:!bg-primary" onClick={onSelectWallet}>
                <div className="flex items-center justify-center flex-shrink-0 text-white">
                  <FaWallet className="w-3.5 h-3.5" />
                </div>
                <div className="ml-2">
                  <p className="font-medium text-white text-14">Select Wallet</p>
                </div>
              </Menu.Item>
              <Menu.Item className="flex items-center h-8 p-2 hover:!bg-primary" onClick={onDisconnect}>
                <div className="flex items-center justify-center flex-shrink-0 text-white">
                  <FaSignOutAlt className="w-3.5 h-3.5" />
                </div>
                <div className="ml-2">
                  <p className="font-medium text-white text-14">Disconnect</p>
                </div>
              </Menu.Item>
            </Menu.Content>
          </Menu>
        )
      }
      {
        walletModalConfig &&
        (
          <Dialog open={walletModalConfig !== null} handler={() => setWalletModalConfig(null)}>
            <Dialog.Overlay>
              <Dialog.Content className="bg-secondary border-border !w-[450px] max-md:!w-[90%]">
                <div className="flex items-center justify-between gap-4 px-5 py-3">
                  <Typography className="font-medium !text-primary text-18">
                    Select Wallets
                  </Typography>
                  <Dialog.DismissTrigger
                    as={IconButton}
                    size="sm"
                    variant="ghost"
                    color="white"
                    className="absolute border-none right-2 top-2"
                    isCircular
                    onClick={() => setWalletModalConfig(null)}
                  >
                    <FaXmark className="w-5 h-5 text-primary" />
                  </Dialog.DismissTrigger>
                </div>
                <div className="grid grid-cols-3 gap-3 px-5 py-5 bg-gray-dark rounded-b-md text-gray-normal">
                  {
                    walletModalConfig.wallets.map((item, index) => {
                      return (
                        <div key={index} className="col-span-1 relative cursor-pointer hover:bg-[#ffffff05] hover:text-white">
                          <div className="flex flex-col items-center justify-center h-full gap-2 p-3 transition-all ease-in-out rounded-md hover:bg-gray-highlight"
                            onClick={() => {
                              walletModalConfig.onSelectWallet(item.adapter.name);
                              setWalletModalConfig(null);
                            }}>
                            <img src={imageURL[item.adapter.name.replace(/\uFEFF/g, "")]} alt={item.adapter.name} className="w-10 h-10 rounded-md" />
                            <p className="leading-none text-center">
                              {item.adapter.name}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </Dialog.Content>
            </Dialog.Overlay>
          </Dialog>
        )
      }
    </>
  );
}
