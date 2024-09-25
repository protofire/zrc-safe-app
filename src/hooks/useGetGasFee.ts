import { ZRC20ABI } from "@/config/zrc20abi";
import { ethers } from "ethers";
import React from 'react';
import useWeb3 from "./useWeb3";

export interface GasFee {
  gasFeeAddress: string;
  gasFeeAmount: number;
  gasFeeAmountInWei: bigint;
}

function useGetGasFee() {
  const { web3 } = useWeb3();

  return React.useCallback(
    async (
      tokenAddress: string,
    ): Promise<GasFee> => {
      if (!web3) return { gasFeeAddress: '', gasFeeAmount: 0, gasFeeAmountInWei: BigInt(0) };
      const contract = new ethers.Contract(tokenAddress, ZRC20ABI, web3);
      const [gasFeeAddress, gasFeeAmountInWei] = await contract.withdrawGasFee();
      const gasFeeContract = new ethers.Contract(gasFeeAddress, ZRC20ABI, web3);
      const gasFeeAmount = +ethers.formatUnits(gasFeeAmountInWei, await gasFeeContract.decimals());
      return { gasFeeAddress, gasFeeAmount, gasFeeAmountInWei: gasFeeAmountInWei }
    },
    [web3]
  );
}

export default useGetGasFee;