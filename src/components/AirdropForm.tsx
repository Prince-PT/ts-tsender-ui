"use client";

import React, { useState, useEffect, useMemo } from "react";
import { chainsToTSender, tsenderAbi, erc20Abi } from "@/constants";
import { useChainId, useConfig, useAccount, useWriteContract } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { calculateTotal } from "@/utils";

const AirdropForm = () => {
  // State for form inputs
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [initialChainId, setInitialChainId] = useState<number | null>(null);

  // Get current chain ID using wagmi
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const total: number = useMemo(() => calculateTotal(amounts), [amounts]); //So what this does is it calculates the total amount of tokens to be sent based on the amounts input field. It uses a memoized function to avoid unnecessary recalculations when the amounts change.
  // Function to calculate total amount from amounts input

  const { data: hash, isPending, writeContractAsync } = useWriteContract();

  // Load from localStorage on mount
  useEffect(() => {
    const savedTokenAddress = localStorage.getItem("airdropFormTokenAddress");
    if (savedTokenAddress) {
      setTokenAddress(savedTokenAddress);
    }
    const savedRecipients = localStorage.getItem("airdropFormRecipients");
    if (savedRecipients) {
      setRecipients(savedRecipients);
    }
    const savedAmounts = localStorage.getItem("airdropFormAmounts");
    if (savedAmounts) {
      setAmounts(savedAmounts);
    }
  }, []); // Runs once on mount

  // Save to localStorage whenever inputs change
  useEffect(() => {
    localStorage.setItem("airdropFormTokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem("airdropFormRecipients", recipients);
  }, [recipients]);

  useEffect(() => {
    localStorage.setItem("airdropFormAmounts", amounts);
  }, [amounts]);

  // Track network changes
  useEffect(() => {
    if (initialChainId === null) {
      setInitialChainId(chainId);
    } else if (
      initialChainId !== chainId &&
      (tokenAddress || recipients || amounts)
    ) {
      // Only warn if the user has started filling out the form
      alert(
        "Warning: Network has changed. Please ensure you're on the correct network for your transaction."
      );
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
    const newAddress = e.target.value;
    setTokenAddress(newAddress);
    // Token details update is now handled by the useEffect below
  };

  // Recalculate and set token details when tokenAddress or amounts change
  // This handles initial load from localStorage and subsequent user input.
  useEffect(() => {
    if (tokenAddress.length >= 42) {
      setTokenDetails({
        name: "Demo Token", // Mock name, as in original logic
        symbol: "DEMO", // Mock symbol
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
  }, [tokenAddress, amounts]); // Dependencies ensure this runs when these values change

  const handleRecipientsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setRecipients(e.target.value);
    // updateTokenDetails(); // Token details update is now handled by the useEffect above
  };

  const handleAmountsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAmounts(e.target.value);
    // updateTokenDetails(); // Token details update is now handled by the useEffect above
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

  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert("No address found , please use a supported chain");
      return 0;
    }
    // Read from the chain to see if we have approved enough tokens

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [await account.address, tSenderAddress as `0x${string}`],
      chainId: chainId,
    }); // similar to useContractRead
    // Similar to token.allowance(account.address, tSenderAddress) in Solidity
    return Number(response);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    try {
      // Show loading state - REMOVED: isPending will handle button state
      // const button = document.querySelector(
      // 'button[type="submit"]'
      // ) as HTMLButtonElement;
      // if (button) {
      // const originalText = button.innerText;
      // button.innerText = "Processing...";
      // button.disabled = true;

      // Get the tSender contract address for the current chain
      const tSenderAddress = chainsToTSender[chainId]?.tsender;
      console.log("ChainId:", chainId);
      console.log("Available chains:", Object.keys(chainsToTSender));
      console.log("TSender address:", tSenderAddress);

      if (!tSenderAddress) {
        throw new Error(
          `TSender not deployed on current chain (Chain ID: ${chainId})`
        );
      }
      const approvedAmount = await getApprovedAmount(tSenderAddress);
      console.log("Approved amount:", approvedAmount);
      console.log("Total amount needed:", total);

      if (approvedAmount < total) {
        console.log("Approval needed. Requesting approval...");
        console.log("Token address:", tokenAddress);
        console.log("Approval amount:", BigInt(total).toString());
        console.log("Check your wallet for a confirmation popup");

        // Set a timeout to alert the user if they don't respond to the wallet popup
        const timeoutId = setTimeout(() => {
          alert(
            "Wallet confirmation timeout. Please check if your wallet popup is visible and confirm the transaction."
          );
          // REMOVED: Button state handled by isPending
          // if (button) {
          //   button.innerText = originalText;
          //   button.disabled = false;
          // }
        }, 30000); // 30 seconds timeout

        try {
          const approvalHash = await writeContractAsync({
            abi: erc20Abi,
            address: tokenAddress as `0x${string}`,
            functionName: "approve",
            args: [tSenderAddress as `0x${string}`, BigInt(total)],
          });

          // Clear the timeout since we got a response
          clearTimeout(timeoutId);

          console.log("Approval transaction submitted:", approvalHash);

          const approvalReceipt = await waitForTransactionReceipt(config, {
            hash: approvalHash,
          });
          console.log("Approval transaction receipt:", approvalReceipt);
          if (!approvalReceipt.status) {
            throw new Error("Token approval failed");
          }
          alert("Token approval successful!");
        } catch (approvalError) {
          // Clear the timeout since we got an error
          clearTimeout(timeoutId);
          console.error("Approval error:", approvalError);
          throw approvalError; // Re-throw to be caught by the outer catch block
        }
      } else {
        console.log("Already approved. Proceeding with airdrop...");
        await writeContractAsync({
          abi: tsenderAbi,
          address: tSenderAddress as `0x${string}`,
          functionName: "airdropERC20",
          args: [
            tokenAddress,
            recipients.split(/[\n,]+/).filter((addr) => addr.trim()),
            amounts
              .split(/[\n,]+/)
              .filter((amt) => amt.trim())
              .map((amt) => BigInt(amt.trim())),
            total,
          ],
        });
        alert("Airdrop transaction successful!");
      }

      // Verify we're still on the same chain that we started with
      if (initialChainId !== null && initialChainId !== chainId) {
        throw new Error(
          "Network changed during transaction. Please try again."
        );
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
      const recipientsList = recipients.split(/[\n,]+/).filter((r) => r.trim());
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
      // Token details will reset via the useEffect watching tokenAddress and amounts

      // REMOVED: Reset button - Handled by isPending
      // button.innerText = originalText;
      // button.disabled = false;
      // } // Removed corresponding if(button)
    } catch (error) {
      console.error("Transaction failed:", error);

      // Handle specific errors
      if (error instanceof Error) {
        // Network change error
        if (
          error.message.includes("network") ||
          error.message.includes("chain") ||
          error.message.includes("MetaMask - RPC Error")
        ) {
          alert(
            "Network changed during transaction. Please ensure you stay on the same network and try again."
          );
        }
        // Connection refused error
        else if (
          error.message.includes("CONNECTION_REFUSED") ||
          error.message.includes("http://127.0.0.1:8545") ||
          error.message.includes("could not detect network")
        ) {
          alert(
            "Cannot connect to local development network. Please make sure your local Ethereum node (Anvil/Hardhat/Ganache) is running, or switch to a public network."
          );
        }
        // Other errors
        else {
          alert(`Transaction failed: ${error.message}`);
        }
      } else {
        alert("Transaction failed: Unknown error");
      }

      // REMOVED: Reset button on error - Handled by isPending
      // const button = document.querySelector(
      // 'button[type="submit"]'
      // ) as HTMLButtonElement;
      // if (button) {
      //   button.innerText = "Send Tokens";
      //   button.disabled = false;
      // }
    }
  };

  if (!account.isConnected) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold mb-6">Token Airdrop</h2>
        <p className="text-lg">Please connect your wallet to use...</p>
      </div>
    );
  }

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
          className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center justify-center"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Send Tokens"
          )}
        </button>
      </form>
    </div>
  );
};

export default AirdropForm;
