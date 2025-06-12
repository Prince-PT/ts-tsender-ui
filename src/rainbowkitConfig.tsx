import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  anvil,
  zksync,
  sepolia,
} from "wagmi/chains";

// Initialize WalletConnect Core once when module is loaded
const wagmiProviderConfig = getDefaultConfig({
  appName: "T-Sender",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [arbitrum, base, mainnet, optimism, anvil, zksync, sepolia],
  ssr: false,
});

export default wagmiProviderConfig;
