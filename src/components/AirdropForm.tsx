"use client";

import React, { useState, useEffect } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId } from "wagmi";

const AirdropForm = () => {
  // State for form inputs
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [initialChainId, setInitialChainId] = useState<number | null>(null);

  // Get current chain ID using wagmi
  const chainId = useChainId();

  // Track network changes
  useEffect(() => {
    if (initialChainId === null) {
      setInitialChainId(chainId);
    } else if (initialChainId !== chainId && (tokenAddress || recipients || amounts)) {
      // Only warn if the user has started filling out the form
      alert("Warning: Network has changed. Please ensure you're on the correct network for your transaction.");
      setInitialChainId(chainId);
    }
  }, [chainId, initialChainId, tokenAddress, recipients, amounts]);

  // Mock token details (in a real app, this would come from fetching token info)
  const [tokenDetails, setTokenDetails] = useState({
    name: "---",
    symbol: "---",
    totalAmountWei: "0",
    totalAmountTokens: "0",
  });

  // Update token details when inputs change (just for demo purposes)
  const handleTokenAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAddress(e.target.value);
    // In a real app, you would fetch token details here
    if (e.target.value.length >= 42) {
      setTokenDetails({
        name: "Demo Token",
        symbol: "DEMO",
        totalAmountWei: calculateTotalWei(),
        totalAmountTokens: calculateTotalTokens(),
      });
    } else {
      setTokenDetails({
        name: "---",
        symbol: "---",
        totalAmountWei: "0",
        totalAmountTokens: "0",
      });
    }
  };

  const handleRecipientsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRecipients(e.target.value);
    updateTokenDetails();
  };

  const handleAmountsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAmounts(e.target.value);
    updateTokenDetails();
  };

  // Helper functions to calculate totals
  const calculateTotalWei = () => {
    if (!amounts) return "0";
    const amountList = amounts.split(/[\n,]+/).filter((a) => a.trim());
    try {
      const total = amountList.reduce(
        (sum, amount) => sum + BigInt(amount.trim()),
        BigInt(0)
      );
      return total.toString();
    } catch (e) {
      return "0";
    }
  };

  const calculateTotalTokens = () => {
    const weiTotal = calculateTotalWei();
    // Mock conversion, in real app would use token decimals
    if (weiTotal === "0") return "0";
    try {
      return (Number(weiTotal) / 10 ** 18).toFixed(6);
    } catch (e) {
      return "0";
    }
  };

  const updateTokenDetails = () => {
    if (tokenAddress.length >= 42) {
      setTokenDetails({
        ...tokenDetails,
        totalAmountWei: calculateTotalWei(),
        totalAmountTokens: calculateTotalTokens(),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Show loading state
      const button = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      if (button) {
        const originalText = button.innerText;
        button.innerText = "Processing...";
        button.disabled = true;

        // Get the tSender contract address for the current chain
        const tSenderAddress = chainsToTSender[chainId]?.tsender;

        if (!tSenderAddress) {
          throw new Error(
            `TSender not deployed on current chain (Chain ID: ${chainId})`
          );
        }
        
        // For local development chains, check if we need to warn about connection
        if (chainId === 31337 || chainId === 1337) {
          // Add an alert for local networks to remind users
          if (window.confirm("You are connected to a local development network. Make sure your Anvil/Hardhat/Ganache node is running on http://127.0.0.1:8545. Continue with transaction?")) {
            // User confirmed, continue
          } else {
            // User cancelled
            throw new Error("Transaction cancelled");
          }
        }
        
        // Verify we're still on the same chain that we started with
        if (initialChainId !== null && initialChainId !== chainId) {
          throw new Error("Network changed during transaction. Please try again.");
        }

        console.log(
          `Using TSender contract at ${tSenderAddress} on chain ${chainId}`
        );

        // In a real app, you would:
        // 1. Parse recipients and amounts into arrays
        // 2. Calculate total amount for approval
        // 3. Request ERC20 approval to the tSender contract
        // 4. Call tSender.airdrop with the token, recipients, and amounts

        // Parse recipients and amounts
        const recipientsList = recipients
          .split(/[\n,]+/)
          .filter((r) => r.trim());
        const amountsList = amounts
          .split(/[\n,]+/)
          .filter((a) => a.trim())
          .map((a) => BigInt(a.trim()));
        const totalAmount = amountsList.reduce(
          (sum, amount) => sum + amount,
          BigInt(0)
        );

        console.log({
          tokenAddress,
          recipientsList,
          amountsList,
          totalAmount: totalAmount.toString(),
          tSenderAddress,
        });

        // Simulate a blockchain transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Show success
        alert("Tokens successfully sent!");

        // Reset form state
        setTokenAddress("");
        setRecipients("");
        setAmounts("");
        setTokenDetails({
          name: "---",
          symbol: "---",
          totalAmountWei: "0",
          totalAmountTokens: "0",
        });

        // Reset button
        button.innerText = originalText;
        button.disabled = false;
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      
      // Handle specific errors
      if (error instanceof Error) {
        // Network change error
        if (error.message.includes("network") || 
            error.message.includes("chain") || 
            error.message.includes("MetaMask - RPC Error")) {
          alert("Network changed during transaction. Please ensure you stay on the same network and try again.");
        } 
        // Connection refused error
        else if (error.message.includes("CONNECTION_REFUSED") || 
                error.message.includes("http://127.0.0.1:8545") ||
                error.message.includes("could not detect network")) {
          alert("Cannot connect to local development network. Please make sure your local Ethereum node (Anvil/Hardhat/Ganache) is running, or switch to a public network.");
        } 
        // Other errors
        else {
          alert(`Transaction failed: ${error.message}`);
        }
      } else {
        alert("Transaction failed: Unknown error");
      }

      // Reset button on error
      const button = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement;
      if (button) {
        button.innerText = "Send Tokens";
        button.disabled = false;
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Token Airdrop</h2>

      <form onSubmit={handleSubmit}>
        {/* Token Address Input */}
        <div className="mb-4">
          <label
            htmlFor="tokenAddress"
            className="block text-sm font-medium mb-1"
          >
            Token Address
          </label>
          <input
            id="tokenAddress"
            type="text"
            placeholder="0x..."
            value={tokenAddress}
            onChange={handleTokenAddressChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Recipients Input */}
        <div className="mb-4">
          <label
            htmlFor="recipients"
            className="block text-sm font-medium mb-1"
          >
            Recipients (comma or new line separated)
          </label>
          <textarea
            id="recipients"
            placeholder="0x1234..., 0xabcd..., ..."
            value={recipients}
            onChange={handleRecipientsChange}
            rows={4}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Amounts Input */}
        <div className="mb-6">
          <label htmlFor="amounts" className="block text-sm font-medium mb-1">
            Amounts (wei, comma or new line separated)
          </label>
          <textarea
            id="amounts"
            placeholder="1000000000000000000, 2000000000000000000, ..."
            value={amounts}
            onChange={handleAmountsChange}
            rows={4}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-black dark:text-white"
            required
          />
        </div>

        {/* Transaction Details */}
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Transaction Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Token Name:</div>
            <div className="font-medium">
              {tokenDetails.name} ({tokenDetails.symbol})
            </div>

            <div>Total Amount (wei):</div>
            <div className="font-medium">{tokenDetails.totalAmountWei}</div>

            <div>Total Amount (tokens):</div>
            <div className="font-medium">{tokenDetails.totalAmountTokens}</div>

            <div>Recipients:</div>
            <div className="font-medium">
              {recipients
                ? recipients.split(/[\n,]+/).filter((r) => r.trim()).length
                : 0}
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200"
        >
          Send Tokens
        </button>
      </form>
    </div>
  );
};

export default AirdropForm;
