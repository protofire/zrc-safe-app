import { useQuery } from '@tanstack/react-query';
import React from 'react';
import styles from './styles.module.css';
import CircularProgress from '../CircularProgress';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { testnetNetworks, mainnetNetworks } from '@/config/constants';

const TokenList: React.FC = () => {
  const { safe } = useSafeAppsSDK();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const tokens = safe.chainId === 0 ? data?.testnetTokens : data?.mainnetTokens;
  return (
    <div className={styles.tokenList}>
      <table>
        <thead>
          <tr>
            <th>Chain</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>ZRC-20 Decimals</th>
            <th>ZRC-20 on ZetaChain</th>
            <th>ERC-20 on Connected Chain</th>
          </tr>
        </thead>
        <tbody>
          {tokens?.map((token, index) => (
            <tr key={`${token.id}-${index}`} className="token-list-item">
              <td>{token.name}</td>
              <td>({token.symbol})</td>
              <td>{token.coin_type}</td>
              <td>{token.decimals}</td>
              <td>{token.zrc20_contract_address}</td>
              <td>{token.asset}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TokenList;
