"use client";

import { type ReactNode, useMemo } from "react";
import { WagmiProvider } from "wagmi";
import {
  RainbowKitProvider,
  ConnectButton,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { arbitrum, base, mainnet, optimism, anvil, zksync, sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// Create the query client once (outside of component rendering)
const queryClient = new QueryClient();

export default function Providers(props: { children: ReactNode }) {
  // Memoize the Wagmi/RainbowKit config to prevent double initialization
  const wagmiProviderConfig = useMemo(
    () =>
      getDefaultConfig({
        appName: "T-Sender",
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
        chains: [arbitrum, base, mainnet, optimism, anvil, zksync, sepolia],
        ssr: false,
      }),
    []
  );
  return (
    <WagmiProvider config={wagmiProviderConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" theme={darkTheme()} coolMode>
          {props.children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
