import { ZRC20ABI } from "@/config/zrc20abi";
import { SafeTransactionDataPartial } from "@safe-global/safe-core-sdk-types";
import { Interface } from "ethers";

export const encodeWithdrawal = (recipientAddress: string, amount: unknown, tokenAddress: string): SafeTransactionDataPartial => {
  const zrc20Interface = new Interface(ZRC20ABI);
  const args = [recipientAddress, amount]
  return {
    to: tokenAddress,
    value: '0',
    data: zrc20Interface.encodeFunctionData("withdraw", args),
  };
};

export const encodeApprove = (tokenAddress: string, amount: unknown): SafeTransactionDataPartial => {
  const zrc20Interface = new Interface(ZRC20ABI);
  const args = [tokenAddress, amount]
  return {
    to: tokenAddress,
    value: '0',
    data: zrc20Interface.encodeFunctionData("approve", args),
  };
};