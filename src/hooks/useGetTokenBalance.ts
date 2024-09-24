import { ZRC20ABI } from "@/config/zrc20abi";
import { ethers } from "ethers";
import React from 'react';
import useWeb3 from "./useWeb3";

function useGetTokenBalance() {
  const { web3 } = useWeb3();

  return React.useCallback(
    (
      tokenAddress: string,
      walletAddress: string,
    ) => {
      const getBalance = async () => {
        if (!web3) return 0;
        const contract = new ethers.Contract(tokenAddress, ZRC20ABI, web3);
        const balanceHex = await contract.balanceOf(walletAddress);
        console.log('balanceHex', balanceHex);
        const balance = ethers.formatUnits(balanceHex, await contract.decimals());
        console.log('balance', balance);
        return +balance;
      };
      return getBalance();
    },
    [web3]
  );
}

export default useGetTokenBalance;