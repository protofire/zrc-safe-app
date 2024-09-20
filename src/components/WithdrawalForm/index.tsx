import React, { useState } from 'react';
import { Button, Box, Text, Image } from '@chakra-ui/react';
import InputNumber from '../InputNumber';
import Selector from '../Selector';
import { Option } from '../Selector/types';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useQuery } from '@tanstack/react-query';
import { fetchTokens } from '@/queries/getZRCTokens';
import CircularProgress from '../CircularProgress';
import { Token } from '@/queries/getZRCTokens';
import { tokenIcons, ZETA_CHAIN_ID_TESTNET } from "@/config/constants";

const WithdrawalForm: React.FC = () => {
  const { safe, sdk } = useSafeAppsSDK();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => fetchTokens(safe.chainId === ZETA_CHAIN_ID_TESTNET),
  });
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);

  const isNeedApproval = false;

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const handleTokenSelect = (token: Token) => {
    if (!token) {
      return;
    }
    setSelectedToken(token.zrc20_contract_address);
    sdk.eth.getBalance([safe.safeAddress, 'latest']).then((balance) => {
      console.log('balance', balance);
    });
  };

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleSubmit = () => {
    // Execute withdrawal logic here
    console.log(`Withdrawing ${amount} of ${selectedToken}`);
  };

  const tokens = data || [];
  const options: Option<Token>[] = tokens.map((token) => ({
    label: token.symbol,
    value: token,
  }));

  return (
    <>
      <Box
        p={6}
        borderWidth="1px"
        borderRadius="md"
        borderColor="gray.400"
        width="360px"
      >
        <Box mb={4}>
          <Selector<Token>
            onClear={() => setSelectedToken('')}
            label="ZRC-20 Token"
            options={options}
            onChange={handleTokenSelect}
            optionTemplate={(option) => (
              <Box display="flex" alignItems="center">
                <Image w={6} h={6} mr={1} src={tokenIcons[option?.value?.foreign_chain_id as keyof typeof tokenIcons] || ''} alt={option?.label} />
                <Text fontSize="sm">{option?.label}</Text>
              </Box>
            )}
            filterWith={(option, query) => {
              const regexp = new RegExp(query, 'i');
              return (
                regexp.test(option.label || '') ||
                regexp.test(option.value?.zrc20_contract_address || '')
              );
            }}
          />
        </Box>
        <Box mb={6}>
          <InputNumber
            label="Withdrawal amount"
            value={amount}
            onChange={handleAmountChange}
            min={0.00001}
          />
          <Text fontSize="xs">Available amount is 20</Text>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button onClick={handleSubmit} colorScheme="teal" mt={4}>
            Withdraw
          </Button>
        </Box>
      </Box>

      <Box width="380px">
        {isNeedApproval && (
          <Box>
            <Text fontSize="sm" align="center">
              <b>Approval Required</b> <br /> We need your permission to proceed
              with the withdrawal.
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default WithdrawalForm;
