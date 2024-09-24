import { ZRC20ABI } from "@/config/zrc20abi";
import { ethers } from "ethers";
import React from 'react';
import useWeb3 from "./useWeb3";

function useGetAllowance() {
  const { web3 } = useWeb3();

  return React.useCallback(
    (
      tokenAddress: string,
      walletAddress: string,
    ) => {
      const getBalance = async () => {
        if (!web3) return 0;
        const contract = new ethers.Contract(tokenAddress, ZRC20ABI, web3);
        const allowanceHex = await contract.allowance(walletAddress, tokenAddress);
        const allowance = ethers.formatUnits(allowanceHex, await contract.decimals());
        console.log('allowance', allowance);
        return +allowance;
      };
      return getBalance();
    },
    [web3]
  );
}

export default useGetAllowance;