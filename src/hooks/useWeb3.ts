import { useEffect, useState } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { SafeAppProvider } from '@safe-global/safe-apps-provider';

function useWeb3() {
  const [web3, setWeb3] = useState<BrowserProvider | undefined>();
  const { safe, sdk } = useSafeAppsSDK();

  useEffect(() => {
    const safeProvider = new SafeAppProvider(safe, sdk);
    const web3Instance = new ethers.BrowserProvider(safeProvider);

    setWeb3(web3Instance);
  }, [safe, sdk]);

  return {
    web3,
  };
}

export default useWeb3;