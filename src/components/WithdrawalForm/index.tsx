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
import { tokenIcons, ZETA_CHAIN_ID_TESTNET } from '@/config/constants';
import useGetTokenBalance from '@/hooks/useGetTokenBalance';
import InputText from '../InputText';
import { encodeApprove, encodeWithdrawal } from './utils';
import useGetAllowance from '@/hooks/useGetAllowance';
import useWeb3 from '@/hooks/useWeb3';
import { getZRC20Instance } from '@/utils/zrc20instance';
import { ethers } from 'ethers';
import { TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk';

const WithdrawalForm: React.FC = () => {
  const { safe, sdk } = useSafeAppsSDK();
  const { web3 } = useWeb3();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => fetchTokens(safe.chainId === ZETA_CHAIN_ID_TESTNET),
  });
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [txHash, setTxHash] = useState<string | undefined>();
  const [zrcBalance, setZrcBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<number>(0);
  const getTokenBalance = useGetTokenBalance();
  const getAllowance = useGetAllowance();

  const optionIcon = React.useCallback(
    (option?: Option<Token>) => (
      <Image
        w={6}
        h={6}
        mr={1}
        src={
          tokenIcons[
            option?.value?.foreign_chain_id as keyof typeof tokenIcons
          ] || ''
        }
        alt={option?.label}
      />
    ),
    []
  );

  const selectedTokenIcon = React.useCallback(() => {
    const token = data?.find(
      (token) => token.zrc20_contract_address === selectedToken
    );
    return token
      ? optionIcon({
          label: token?.name || '',
          value: token,
        })
      : null;
  }, [selectedToken, data, optionIcon]);

  const waitTx = React.useCallback(
    (txHash: string) => {
      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          const tx = await sdk.txs.getBySafeTxHash(txHash);
          if (tx.txStatus === TransactionStatus.SUCCESS) {
            clearInterval(interval);
            resolve(tx);
          }
        }, 1000);
      });
    },
    [sdk]
  );

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleTokenSelect = React.useCallback(
    (token: Token) => {
      if (!token) {
        setSelectedToken('');
        return;
      }
      setSelectedToken(token.zrc20_contract_address);
      getTokenBalance(token.zrc20_contract_address, safe.safeAddress).then(
        (balance) => setZrcBalance(balance)
      );
      getAllowance(token.zrc20_contract_address, safe.safeAddress).then(
        (allowance) => setAllowance(allowance)
      );
      setAmount(0);
    },
    [getTokenBalance, safe.safeAddress, getAllowance]
  );

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleSubmitAsync = async () => {
    const zrc20Instance = getZRC20Instance(selectedToken, web3!);
    const amountInWei = ethers.parseUnits(
      amount.toString(),
      await zrc20Instance.decimals()
    );
    const allowanceInWei = ethers.parseUnits(
      allowance.toString(),
      await zrc20Instance.decimals()
    );
    if (allowanceInWei < amountInWei) {
      const txData = encodeApprove(selectedToken, amountInWei);
      const tx = await sdk.txs.send({ txs: [txData] });
      setTxHash(tx.safeTxHash);
      await waitTx(tx.safeTxHash);
      const allowance = await getAllowance(selectedToken, safe.safeAddress);
      setAllowance(allowance);
      setTxHash(undefined);
      return;
    }
    const txData = encodeWithdrawal(
      recipientAddress,
      amountInWei,
      selectedToken
    );
    console.log(txData);
    console.log(
      `Withdrawing ${amount} of ${selectedToken} to ${recipientAddress}`
    );
    const tx = await sdk.txs.send({ txs: [txData] });
    setTxHash(tx.safeTxHash);
    await waitTx(tx.safeTxHash);
    await refetch();
    const balance = await getTokenBalance(selectedToken, safe.safeAddress);
    setZrcBalance(balance);
    setTxHash(undefined);
    setAmount(0);
  };

  const handleSubmit = () => {
    handleSubmitAsync().catch((error) => {
      console.error('Error submitting transaction:', error);
    });
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
        <Box mb={2}>
          <InputText
            label="Recipient address *"
            value={recipientAddress}
            onChange={handleRecipientAddressChange}
            isHexAddress
            isDisabled={!!txHash}
          />
        </Box>
        <Box mb={2}>
          <Selector<Token>
            onClear={() => {
              setSelectedToken('');
              setZrcBalance(0);
              setAllowance(0);
              setAmount(0);
            }}
            label="ZRC-20 Token *"
            options={options}
            onChange={handleTokenSelect}
            inputLeftElement={selectedTokenIcon}
            isDisabled={!!txHash}
            optionTemplate={(option) => (
              <Box display="flex" alignItems="center">
                {optionIcon(option)}
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
            label="Withdrawal amount *"
            value={amount}
            onChange={handleAmountChange}
            min={0}
            max={zrcBalance}
            isDisabled={!!txHash}
          />
          <Text fontSize="xs">Available amount is {zrcBalance}</Text>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            isDisabled={
              !recipientAddress || !selectedToken || !amount || !!txHash || !zrcBalance
            }
            onClick={handleSubmit}
            colorScheme="teal"
            mt={4}
          >
            Withdraw
          </Button>
        </Box>
      </Box>

      <Box width="380px">
        {!!zrcBalance && allowance < amount && (
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
