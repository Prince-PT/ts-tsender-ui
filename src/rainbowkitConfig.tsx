"use client";

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

// Create the config only once using a singleton pattern
let config: ReturnType<typeof getDefaultConfig> | null = null;

// Function to get the configuration, ensures it's only created once
export default function getConfig() {
  if (config === null) {
    config = getDefaultConfig({
      appName: "T-Sender",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
      chains: [arbitrum, base, mainnet, optimism, anvil, zksync, sepolia],
      ssr: false,
    });
  }
  return config;
}
