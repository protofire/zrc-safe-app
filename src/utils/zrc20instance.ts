import { ZRC20ABI } from "@/config/zrc20abi";
import { ethers, BrowserProvider } from "ethers";

export const getZRC20Instance = (address: string, provider: BrowserProvider) => {
  return new ethers.Contract(address, ZRC20ABI, provider);
};