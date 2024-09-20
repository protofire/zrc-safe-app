export interface Token {
  id: string;
  name: string;
  symbol: string;
  zrc20_contract_address: string;
  asset: string;
  foreign_chain_id: string;
  decimals: number;
  coin_type: string;
  gas_limit: string;
  paused: boolean;
  liquidity_cap: string;
}

export interface FetchTokensResponse {
  foreignCoins: Token[];
  pagination: {
    next_key: string | null;
    total: string;
  };
}

const mainNetUrl = 'https://zetachain.blockpi.network/lcd/v1/public/zeta-chain/fungible/foreign_coins';
const testNetUrl = 'https://zetachain-athens.blockpi.network/lcd/v1/public/zeta-chain/fungible/foreign_coins';

export const fetchTokens = async (isTestnet: boolean): Promise<Token[]> => {
  const response = await fetch(
    isTestnet ? testNetUrl : mainNetUrl
  );
  if (!response.ok) throw new Error('Network response was not ok');
  const json = (await response.json()) as FetchTokensResponse;
  return json.foreignCoins;
};