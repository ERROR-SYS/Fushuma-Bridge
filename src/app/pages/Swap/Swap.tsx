import { Token } from '@callisto-enterprise/soy-sdk';
import BigNumber from 'bignumber.js';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import BorderContainer from '~/app/components/common/BorderContainer';
import CustomButton from '~/app/components/common/CustomButton';
import { getSignaturesAddWrapped, requiredSignatures } from '~/app/utils/getSignatures';
import { getBridgeAddress } from '~/app/utils/addressHelpers';
import { getBridgeContract } from '~/app/utils';
import { blockConfirmations } from '~/app/constants/config';
import { NATIVE_W_COINS } from '~/app/constants/tokens';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useCurrentBlockTimestamp from '~/app/hooks/useCurrentBlockTimestamp';
import useGetAllowance from '~/app/hooks/useGetAllowance';
import useGetWeb3 from '~/app/hooks/useGetWeb3';
import useSwap from '~/app/hooks/useSwap';
import useToast from '~/app/hooks/useToast';
import getNativeTokenABI from '~/app/constants/abis/getNativeToken.json';
import { setSelectedToken } from '~/app/modules/wallet/action';
import getWrappedTokenABI from '~/app/constants/abis/getWrappedToken.json';
import { MIN_GAS_AMOUNT } from '~/app/constants';
import { ethers } from 'ethers';
import {
  setConfirmedBlockCounts,
  setDestinationAddress,
  setHash,
  setStartSwapping,
  setSwapType
} from '~/app/modules/wallet/action';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { getDecimalAmount } from '~/app/utils/decimal';
import getEncodedData, { getEncodedData2 } from '~/app/utils/getEncodedData';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import Claim from './Claim';
import './swap.css';
import SwapForm from './SwapForm';
import { useGetTokenBalance } from '~/app/hooks/wallet';

const Swap = () => {
  const { account, library, chainId } = useActiveWeb3React();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [succeed, setSucced] = useState(false);
  const [canBuyCLO, setCanBuyCLO] = useState(false);
  const [txBlockNumber, setTxBlockNumber] = useState(0);
  const [switched, setSwitched] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [addingToken, setAddingToken] = useState(false);
  const [addingBridge, setAddingBridge] = useState(false);
  const [originalToken, setOriginalToken] = useState<any>();
  const [transfering, setTransfering] = useState(false);

  const { balance, selectedToken, fromNetwork, toNetwork } = useGetWalletState();
  const swapTokenAddr = selectedToken?.address[`${fromNetwork.chainId}`];
  const swapTokenAddrInCallisto = selectedToken?.address[`${toNetwork.chainId}`];
  const wAddr = NATIVE_W_COINS[`${toNetwork.chainId}`];

  const { onApprove, allowed } = useGetAllowance(swapTokenAddr, succeed, fromNetwork.chainId);
  const { onAdvancedSwap, onSimpleSwap } = useSwap();
  const web3 = useGetWeb3(fromNetwork?.rpcs[0]);
  const deadline = useCurrentBlockTimestamp();

  const [claimAddress, setClaimAddress] = useState('');
  const { toastError, toastWarning } = useToast();
  const [tokenBalance, setTokenBalance] = useState();
  const [waitingNetworkSwitch, setWaitingNetworkSwitch] = useState(false);
  const [waitingNetworkSwitchBack, setWaitingNetworkSwitchBack] = useState(false);
  const [swapCustomInfo, setSwapCustomInfo] = useState<any>();
  const swapCustomInfoRef = useRef(swapCustomInfo);

  const addWrappedTokenRef = useRef<any>(null);
  const swapCustomTokenRef = useRef<any>(null);
  const currentChainRef = useRef<any>(null);

  const pendingBalance = useGetTokenBalance(fromNetwork, selectedToken, chainId);

  // const disable =
  //   (selectedToken.symbol !== 'CLO' && toNetwork.chainId === '820') ||
  //   (selectedToken.symbol !== 'BTT' && toNetwork.chainId === '199');
  const disable = false;

  const inputCurrency =
    swapTokenAddrInCallisto === ''
      ? undefined
      : new Token(
          Number(toNetwork.chainId),
          swapTokenAddrInCallisto,
          Number(selectedToken?.decimals[`${toNetwork.chainId}`]),
          selectedToken?.symbol,
          selectedToken?.name
        );

  // const outputCurrency =
  //   wAddr === ''
  //     ? undefined
  //     : new Token(
  //         Number(toNetwork.chainId),
  //         wAddr,
  //         18,
  //         toNetwork.chainId === '820' ? 'WCLO' : 'BTT',
  //         toNetwork.chainId === '820' ? 'Wrapped CLO' : 'Wrapped BTT'
  //       );

  const outputCurrency: any = undefined;

  addWrappedTokenRef.current = async () => {
    if (originalToken) {
      setWaitingNetworkSwitch(false);
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      const signer = await library.getSigner(account);
      const getTokenContract = await new ethers.Contract(bridgeAddr, getWrappedTokenABI, signer);

      const isTokenAdded = await getTokenContract.getToken(originalToken.address, originalToken.chainId);
      const chainIdFromData = ethers.BigNumber.from(isTokenAdded[1]).toNumber();

      if (chainIdFromData) {
        if (
          isTokenAdded[2] !== selectedToken.address[fromNetwork.chainId] &&
          isTokenAdded[2] !== '0x0000000000000000000000000000000000000000'
        ) {
          const token = { ...selectedToken };
          token.toAddress = isTokenAdded[2];
          dispatch(setSelectedToken(token));
        }
        addWrappedTokenResultHandler();
        return true;
      } else {
        setAddingBridge(true);
        const { signatures } = await getSignaturesAddWrapped(
          selectedToken.address[fromNetwork.chainId],
          fromNetwork.chainId
        );

        if (signatures.length < requiredSignatures) {
          toastError('Failed to fetch signatures.');
          setPending(false);
          return { status: false, hash: null } as any;
        }
        const value = '0';
        let addWrappedTx;
        try {
          const addWrappedGasLimit = await bridgeContract.estimateGas.addWrappedToken(
            selectedToken.address[toNetwork.chainId],
            fromNetwork.chainId,
            selectedToken.decimals[toNetwork.chainId],
            selectedToken.name,
            selectedToken.symbol,
            signatures,
            { value }
          );
          addWrappedTx = await bridgeContract.addWrappedToken(
            selectedToken.address[toNetwork.chainId],
            fromNetwork.chainId,
            selectedToken.decimals[toNetwork.chainId],
            selectedToken.name,
            selectedToken.symbol,
            signatures,
            {
              value,
              gasLimit: addWrappedGasLimit.add(30000)
            }
          );
          addWrappedTx.wait();
          const isTokenAdded = await getTokenContract.getToken(originalToken.address, originalToken.chainId);
          const token = { ...selectedToken };
          token.toAddress = isTokenAdded[2];
          dispatch(setSelectedToken(token));
        } catch (e: any) {
          setPending(false);
          if (e.code === 4001) {
            toastError('You declined the transaction.');
          } else {
            toastError('An error occured, please try again later.');
          }
        }
        addWrappedTx.wait();
        addWrappedTokenResultHandler();
        return addWrappedTx;
      }
    }
  };

  swapCustomTokenRef.current = async () => {
    const { address, bigAmount, value } = swapCustomInfoRef.current;
    try {
      const tx = await onSimpleSwap(address, swapTokenAddr, bigAmount, toNetwork.chainId, value);
      if (tx.hash) {
        await handleSetPending(tx.hash, address);
      }
    } catch (e: any) {
      setPending(false);
      if (!e.message.includes('hash')) {
        toastError('An error occured, please try again later.');
      }
    }
  };

  useEffect(() => {
    if (currentChainRef.current === Number(fromNetwork.chainId) && waitingNetworkSwitchBack) {
      setWaitingNetworkSwitchBack(false);
      swapCustomTokenRef.current();
    } else if (currentChainRef.current === Number(toNetwork.chainId) && waitingNetworkSwitch) {
      addWrappedTokenRef.current();
    }
  }, [library, fromNetwork, toNetwork, waitingNetworkSwitch, waitingNetworkSwitchBack]);

  const onPrevious = () => {
    navigate('/tokens');
  };

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  useEffect(() => {
    if (!pendingBalance) {
      setTokenBalance(balance[`${selectedToken.symbol}`]);
    }
  }, [pendingBalance, balance, selectedToken]);

  useEffect(() => {
    currentChainRef.current = chainId;
  }, [chainId]);

  useEffect(() => {
    const getCurrentBlock = () => {
      const timer = setInterval(async () => {
        const b = await web3.eth.getBlockNumber();
        if (b - txBlockNumber >= blockConfirmations[fromNetwork.chainId]) {
          clearInterval(timer);
          setSucced(true);
          setPending(false);
          dispatch(setStartSwapping(false));
          await switchNetwork(toNetwork, library);
          setSwitched(true);
          setTxBlockNumber(0);
          dispatch(setConfirmedBlockCounts(0));
        } else {
          dispatch(setConfirmedBlockCounts(b - txBlockNumber));
        }
      }, 1000);
    };
    if (txBlockNumber !== 0 && pending && !addingToken && !addingBridge) {
      getCurrentBlock();
    }
  }, [dispatch, txBlockNumber, pending, library, toNetwork, web3, fromNetwork, addingToken, addingBridge]);

  const onSubmit = (values: any) => {
    const currentBalance = Number(tokenBalance);
    let minGasFees;

    // switch (chainId) {
    //   case 121224:
    //     minGasFees = MIN_GAS_AMOUNT[121224];
    //     break;
    //   default:
    //     minGasFees = 0.005;
    // }

    if (MIN_GAS_AMOUNT[chainId as keyof typeof MIN_GAS_AMOUNT]) {
      minGasFees = MIN_GAS_AMOUNT[chainId as keyof typeof MIN_GAS_AMOUNT];
    } else {
      minGasFees = 0.001; // Default value if chainId is not found in MIN_GAS_AMOUNT
    }

    // Check selected token balance
    if (!selectedToken.isCustom) {
      if (selectedToken.symbol === fromNetwork.symbol && currentBalance < Number(values.swap_amount) + minGasFees) {
        if (currentBalance < Number(values.swap_amount)) {
          toastWarning('WARNING!', `Insufficient ${selectedToken.symbol} balance.`);
          return;
        } else {
          toastWarning('WARNING!', `Insufficient ${selectedToken.symbol} for gas fees.`);
          return;
        }
      } else if (selectedToken.symbol !== fromNetwork.symbol && currentBalance < Number(values.swap_amount)) {
        toastWarning('WARNING!', `Insufficient ${selectedToken.symbol} balance.`);
        return;
      }
    } else if (currentBalance < Number(values.swap_amount)) {
      toastWarning('WARNING!', `Insufficient ${selectedToken.symbol} balance.`);
      return;
    }

    // Check network fees balance
    if (Number(balance[`${fromNetwork.symbol}`]) < minGasFees) {
      toastWarning('WARNING!', `Insufficient ${fromNetwork.symbol} for gas fees.`);
      return;
    }
    if (canBuyCLO) {
      advancedSwap(
        values.swap_amount,
        values.destination_wallet,
        values.buy_amount,
        values.amountsIn,
        values.amountsOut
      );
      dispatch(setSwapType('advanced-swap'));
    } else {
      onClickSwap(values.swap_amount, values.destination_wallet);
      dispatch(setSwapType('swap'));
    }
  };

  async function advancedSwap(
    amount: any,
    distinationAddress: string,
    buy_amount: any,
    amountsIn: any,
    amountsOut: any
  ) {
    setPending(true);
    const address: any = distinationAddress === '' ? account : distinationAddress;
    setClaimAddress(address);

    const bigAmount = getDecimalAmount(
      new BigNumber(amount.toString()),
      selectedToken.decimals[`${fromNetwork.chainId}`]
    );
    const buyBigAmount = getDecimalAmount(
      new BigNumber(buy_amount.toString()),
      selectedToken.decimals[`${toNetwork.chainId}`]
    );

    let value = '0';
    if (swapTokenAddr.slice(0, -2) === '0x00000000000000000000000000000000000000') {
      value = bigAmount.toString();
    } else {
      if (bigAmount.gt(allowed)) {
        setPending(true);
        setIsApproving(true);
        await onApprove();
        setIsApproving(false);
      }
    }

    const amt = selectedToken.symbol === fromNetwork.symbol ? Number(amount) + 0.005 : Number(amount);
    const isMax = amt === Number(tokenBalance);
    try {
      const maxAmountsIn = Math.floor(1.05 * Number(amountsIn));
      const byte_data = isMax
        ? await getEncodedData2(web3, [
            buyBigAmount,
            new BigNumber(maxAmountsIn),
            [swapTokenAddrInCallisto, wAddr],
            distinationAddress,
            new BigNumber(deadline + 15000)
          ])
        : await getEncodedData(web3, [
            buyBigAmount,
            new BigNumber(maxAmountsIn),
            [swapTokenAddrInCallisto, wAddr],
            distinationAddress,
            new BigNumber(deadline + 15000)
          ]);
      try {
        const tx = await onAdvancedSwap(address, swapTokenAddr, bigAmount, toNetwork.chainId, byte_data, value);
        if (tx.hash) {
          await handleSetPending(tx.hash, address);
        }
      } catch (error) {
        toastError('Execution reverted: There is no pair!');
        setPending(false);
        setSucced(false);
        dispatch(setStartSwapping(false));
      }
    } catch (error) {
      setPending(false);
      setSucced(false);
      dispatch(setStartSwapping(false));
    }
  }

  const addTokenFunction = async () => {
    const bridgeAddr = await getBridgeAddress(chainId);
    const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
    const signer = await library.getSigner(account);
    const getTokenContract = await new ethers.Contract(bridgeAddr, getNativeTokenABI, signer);

    const isTokenAdded = await getTokenContract.getToken(selectedToken.address[fromNetwork.chainId]);
    const chainIdFromData = ethers.BigNumber.from(isTokenAdded[1]).toNumber();
    const value = '0';
    let addTokenTx;

    if (!chainIdFromData) {
      setAddingToken(true);
      try {
        const addTokenGas = await bridgeContract.estimateGas.addToken(selectedToken.address[fromNetwork.chainId], {
          value
        });
        addTokenTx = await bridgeContract.addToken(selectedToken.address[fromNetwork.chainId], {
          value,
          gasLimit: addTokenGas.add(30000)
        });
        await addTokenTx.wait();
        const original = {
          address: selectedToken.address[fromNetwork.chainId],
          chainId: Number(fromNetwork.chainId)
        };
        setOriginalToken(original);
        return addTokenTx;
      } catch (e: any) {
        setPending(false);
        if (e.code === 4001) {
          toastError('You declined the transaction.');
        } else {
          toastError('An error occured, please try again later.');
        }
      }
    } else {
      const original = {
        address: isTokenAdded[0],
        chainId: chainIdFromData
      };
      setOriginalToken(original);
      if (isTokenAdded[0] !== selectedToken.address[fromNetwork.chainId]) {
        const token = { ...selectedToken };
        token.toAddress = isTokenAdded[0];
        dispatch(setSelectedToken(token));
      }
      return true;
    }
  };

  const addWrappedTokenResultHandler = () => {
    setAddingBridge(false);
    setWaitingNetworkSwitchBack(true);
    switchNetwork(fromNetwork, library);
  };

  const updateSwapInfo = (newInfo: any) => {
    swapCustomInfoRef.current = newInfo; // Updates instantly
    setSwapCustomInfo({ ...newInfo }); // Triggers a re-render
  };

  async function onClickSwap(amount: any, distinationAddress: string) {
    const address: any = distinationAddress === '' ? account : distinationAddress;
    setClaimAddress(address);

    const bigAmount = getDecimalAmount(
      new BigNumber(amount.toString()),
      selectedToken.decimals[`${fromNetwork.chainId}`]
    );

    if (swapTokenAddr === '') {
      toastError('Please select another asset. Current asset is not supported yet!');
    } else {
      let value = '0';
      if (swapTokenAddr.slice(0, -2) === '0x00000000000000000000000000000000000000' && !selectedToken.isCustom) {
        value = bigAmount.toString();
      } else {
        if (bigAmount.gt(allowed)) {
          try {
            setPending(true);
            setIsApproving(true);
            await onApprove();
            setIsApproving(false);
          } catch (err) {
            setPending(false);
            setSucced(false);
            return;
          }
        }
      }

      try {
        setPending(true);
        if (!selectedToken.isCustom) {
          setPending(true);
          const tx = await onSimpleSwap(address, swapTokenAddr, bigAmount, toNetwork.chainId, value);
          if (tx.hash) {
            await handleSetPending(tx.hash, address);
          }
        } else {
          if (Number(fromNetwork.chainId) === chainId) {
            const swapInfo = {
              address: address,
              bigAmount: bigAmount,
              value: value
            };
            updateSwapInfo(swapInfo);
            // Add the token if its not added already
            await addTokenFunction();
            setAddingToken(false);
            // Add the wrapped version of the token if not added already
            setWaitingNetworkSwitch(true);
            await switchNetwork(toNetwork, library);
          }
        }
      } catch (error: any) {
        if (error.message.includes('hash')) {
          setPending(false);
          setSucced(false);
          dispatch(setStartSwapping(false));
        } else {
          toastError('Execution reverted: There is no pair!');
          setPending(false);
          setSucced(false);
          dispatch(setStartSwapping(false));
        }
      }
    }
  }

  const handleSetPending = async (hash: string, toAddr: string) => {
    setTransfering(true);
    dispatch(setStartSwapping(true));
    const lastBlock = await web3.eth.getBlockNumber();
    setTxBlockNumber(lastBlock);
    dispatch(setHash(hash));
    dispatch(setDestinationAddress(toAddr));
  };

  const claim_address = useMemo(() => claimAddress, [claimAddress]);

  return (
    <>
      {pending || succeed ? (
        <Claim
          succeed={succeed}
          address={claim_address}
          totalBlockCounts={switched ? 1 : blockConfirmations[fromNetwork.chainId]}
          web3={web3}
          isApproving={isApproving}
          isAdding={addingToken}
          isCreating={addingBridge}
          isTransfering={transfering}
        />
      ) : (
        <div className="swap container">
          <div className="swap__content">
            <div className="swap__content--mainboard">
              <div className="swap__content__steps">
                <BorderContainer className="swap__content__bordercontainer">
                  <div>
                    <p className="swap__content--row">
                      <strong>{t('Step 4:')}</strong> {t('Transfer')}
                    </p>
                    <SwapForm
                      submit={onSubmit}
                      pending={pending}
                      disable={disable}
                      canBuyCLO={canBuyCLO}
                      initialData={{ swap_amount: '0', buy_amount: '0', destination_wallet: account }}
                      setBuyCLO={() => setCanBuyCLO(!canBuyCLO)}
                      tokenBalance={tokenBalance}
                      inputCurrency={inputCurrency}
                      outputCurrency={outputCurrency}
                    />
                  </div>
                </BorderContainer>
              </div>
            </div>
            <CustomButton className="previous_btn" onClick={onPrevious}>
              <div>
                <img src={previousIcon} alt="previousIcon" className="me-2" />
                {t('Previous')}
              </div>
            </CustomButton>
          </div>
        </div>
      )}
    </>
  );
};

export default Swap;
