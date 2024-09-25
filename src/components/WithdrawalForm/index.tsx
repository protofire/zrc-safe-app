import React from 'react';
import { Button, Box, Text, Image } from '@chakra-ui/react';
import InputNumber from '../InputNumber';
import Selector from '../Selector';
import { Option } from '../Selector/types';
import { useSafeAppsSDK } from '@safe-global/safe-apps-react-sdk';
import { useQuery } from '@tanstack/react-query';
import { fetchTokens } from '@/queries/getZRCTokens';
import CircularProgress from '../CircularProgress';
import { Token } from '@/queries/getZRCTokens';
import {
  blockscoutUrl,
  tokenIcons,
  ZETA_CHAIN_ID_TESTNET,
} from '@/config/constants';
import useGetTokenBalance from '@/hooks/useGetTokenBalance';
import InputText from '../InputText';
import { encodeApprove, encodeWithdrawal } from './utils';
import useGetAllowance from '@/hooks/useGetAllowance';
import useWeb3 from '@/hooks/useWeb3';
import { getZRC20Instance } from '@/utils/zrc20instance';
import { ethers } from 'ethers';
import { TransactionStatus } from '@safe-global/safe-gateway-typescript-sdk';
import useGetGasFee, { GasFee } from '@/hooks/useGetGasFee';

const WithdrawalForm: React.FC = () => {
  const { safe, sdk } = useSafeAppsSDK();
  const { web3 } = useWeb3();
  const { data, isLoading, error } = useQuery({
    queryKey: ['tokens'],
    queryFn: () => fetchTokens(safe.chainId === ZETA_CHAIN_ID_TESTNET),
  });
  const [recipientAddress, setRecipientAddress] = React.useState<string>('');
  const [selectedToken, setSelectedToken] = React.useState<string>('');
  const [amount, setAmount] = React.useState<number>(0);
  const [txHash, setTxHash] = React.useState<string | undefined>();
  const [zrcBalance, setZrcBalance] = React.useState<number>(0);
  const [gasFeeBalance, setGasFeeBalance] = React.useState<number>(0);
  const [isUpdate, setIsUpdate] = React.useState<boolean>(false);
  const [gasFee, setGasFee] = React.useState<GasFee>({
    gasFeeAddress: '',
    gasFeeAmount: 0,
    gasFeeAmountInWei: BigInt(0),
  });
  const [gasTokenAllowance, setGasTokenAllowance] = React.useState<number>(0);
  const getTokenBalance = useGetTokenBalance();
  const getAllowance = useGetAllowance();
  const getGasFee = useGetGasFee();

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

  const updateTokenInfo = React.useCallback(
    async (zrc20ContractAddress: string) => {
      setIsUpdate(true);
      const balance = await getTokenBalance(
        zrc20ContractAddress,
        safe.safeAddress
      );
      setZrcBalance(balance);
      const gasFee = await getGasFee(zrc20ContractAddress);
      setGasFee(gasFee);
      const allowance = await getAllowance(
        gasFee.gasFeeAddress,
        safe.safeAddress,
        zrc20ContractAddress
      );
      setGasTokenAllowance(allowance);
      const gasFeeBalance = await getTokenBalance(
        gasFee.gasFeeAddress,
        safe.safeAddress
      );
      setGasFeeBalance(gasFeeBalance);
      setIsUpdate(false);
    },
    [getTokenBalance, safe.safeAddress, getGasFee, getAllowance]
  );

  const handleTokenSelect = React.useCallback(
    (token: Token) => {
      if (!token) {
        setSelectedToken('');
        return;
      }
      setSelectedToken(token.zrc20_contract_address);
      updateTokenInfo(token.zrc20_contract_address);
      setAmount(0);
    },
    [updateTokenInfo]
  );

  const approve = React.useCallback(async () => {
    const txData = encodeApprove(
      gasFee.gasFeeAddress,
      selectedToken,
      gasFee.gasFeeAmountInWei
    );
    const tx = await sdk.txs.send({ txs: [txData] });
    setTxHash(tx.safeTxHash);
    await waitTx(tx.safeTxHash);
  }, [gasFee, sdk, selectedToken, waitTx]);

  const withdraw = React.useCallback(async () => {
    const zrc20Instance = getZRC20Instance(selectedToken, web3!);
    const amountInWei = ethers.parseUnits(
      amount.toString(),
      await zrc20Instance.decimals()
    );
    const txData = encodeWithdrawal(
      recipientAddress,
      amountInWei,
      selectedToken
    );
    const tx = await sdk.txs.send({ txs: [txData] });
    return tx;
  }, [selectedToken, web3, amount, recipientAddress, sdk]);

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleSubmitAsync = async () => {
    if (gasTokenAllowance < gasFee.gasFeeAmount) {
      await approve();
    }
    const tx = await withdraw();
    setTxHash(tx.safeTxHash);
    await waitTx(tx.safeTxHash);
    await updateTokenInfo(selectedToken);
    setTxHash(undefined);
    setAmount(0);
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
              setGasTokenAllowance(0);
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
              !recipientAddress ||
              !selectedToken ||
              !amount ||
              !!txHash ||
              !zrcBalance
            }
            onClick={() => handleSubmitAsync()}
            colorScheme="teal"
            mt={4}
          >
            {gasTokenAllowance < gasFee.gasFeeAmount ? 'Approve' : 'Withdraw'}
          </Button>
        </Box>
      </Box>

      <Box width="380px">
        {!!zrcBalance &&
          gasTokenAllowance < gasFee.gasFeeAmount &&
          !isUpdate && (
            <Box mb={4}>
              <Text fontSize="sm" align="center">
                <b>Approval Required</b> <br /> We need your permission to
                proceed with the withdrawal.
              </Text>
            </Box>
          )}
        {gasFeeBalance < gasFee.gasFeeAmount && !isUpdate && (
          <Box mb={4}>
            <Text fontSize="sm" align="center">
              <b>Insufficient Gas Fee Balance</b> <br /> You need to have at
              least <b>{gasFee.gasFeeAmount}</b> of{' '}
              <a
                href={`${
                  blockscoutUrl[
                    safe.chainId.toString() as keyof typeof blockscoutUrl
                  ]
                }/address/${gasFee.gasFeeAddress}`}
                target="_blank"
              >
                <b>{gasFee.gasFeeAddress}</b>
              </a>{' '}
              in your balance to proceed with the withdrawal.
            </Text>
          </Box>
        )}
      </Box>
    </>
  );
};

export default WithdrawalForm;
