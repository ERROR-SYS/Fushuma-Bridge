import { Contract } from '@ethersproject/contracts';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';
import sample from 'lodash/sample';
import { useEffect, useMemo, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import WETH_ABI from '~/app/constants/abis/weth.json';
import defaultTokens from '~/app/constants/tokenLists/tokenLists2.json';
import { setBalance } from '~/app/modules/wallet/action';
import { getContract } from '~/app/utils';
import { getBalanceAmount } from '~/app/utils/decimal';
import { RPCs } from '../constants';
import useActiveWeb3React from './useActiveWeb3React';
import useGetWalletState from '../modules/wallet/hooks';

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { library, account } = useActiveWeb3React();

  return useMemo(() => {
    if (!address || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

const getNodeUrl = (nodes: any) => {
  return sample(nodes);
};

export const useGetCLOBalance = (net: any) => {
  const { account } = useActiveWeb3React();
  const [amt, setAmt] = useState<number>(0);
  const RPC_URL = useRpcProvider(net?.rpcs);

  useEffect(() => {
    const getBalance = async () => {
      const amount = await RPC_URL.getBalance(account);
      const bn = new BigNumber(amount + 'e-' + 18);
      setAmt(bn.toNumber());
    };
    if (net.chainId === '121224' && account) {
      getBalance();
    }
  }, [account, RPC_URL, net]);

  return amt;
};

export const useGetCLOBalance1 = () => {
  const { account, chainId } = useActiveWeb3React();
  const [amt, setAmt] = useState<number>(0);
  const RPC_URL = useRpcProvider([process.env.REACT_APP_FUSHUMA_NODE_1]);

  useEffect(() => {
    const getBalance = async () => {
      const amount = await RPC_URL.getBalance(account);
      const bn = new BigNumber(amount + 'e-' + 18);
      setAmt(bn.toNumber());
    };
    if (account) {
      getBalance();
    }
  }, [account, chainId, RPC_URL]);

  return amt;
};

export const useGetBTTBalance = () => {
  const { account, chainId } = useActiveWeb3React();
  const [amt, setAmt] = useState<number>(0);
  const RPC_URL = useRpcProvider(['https://rpc.bt.io/']);

  useEffect(() => {
    const getBalance = async () => {
      const amount = await RPC_URL.getBalance(account);
      const bn = new BigNumber(amount + 'e-' + 18);
      setAmt(bn.toNumber());
    };
    if (chainId === 199 && account) {
      getBalance();
    }
  }, [account, chainId, RPC_URL]);

  return amt;
};

export const useNativeCoinBalance = (fromNet: any, curAsset?: any) => {
  const { account, chainId } = useActiveWeb3React();
  const [amt, setAmt] = useState<number | string>(0);
  const RPC_URL = useRpcProvider(fromNet?.rpcs);
  const tokenContract = getErc20Contract(curAsset.address[`${fromNet.symbol}`], RPC_URL);

  useEffect(() => {
    const getBalance = async () => {
      if (account && fromNet.symbol === curAsset.symbol && parseInt(fromNet.chainId) === chainId) {
        const amount = await RPC_URL.getBalance(account);
        const bn = new BigNumber(amount + 'e-' + 18);
        setAmt(bn.toFixed(2));
      } else if (account && parseInt(fromNet.chainId) === chainId) {
        const balance: BigNumber = await tokenContract.balanceOf(account, { value: 0 });
        const strBalance = balance.toString();
        const decimal = curAsset.decimals[`${fromNet.symbol}`];
        const decimalBalance = parseInt(((parseInt(strBalance.toString()) / 10 ** decimal) * 1000000).toString());
        setAmt((decimalBalance / 1000000).toFixed(2));
      }
    };
    getBalance();
  }, [
    account,
    tokenContract,
    chainId,
    RPC_URL,
    curAsset.addresses,
    fromNet.rpcs,
    fromNet.chainId,
    fromNet.symbol,
    curAsset.symbol,
    curAsset.decimals
  ]);
  return amt;
};

export const useNativeETHBalance = () => {
  const { account, chainId } = useActiveWeb3React();
  const [amt, setAmt] = useState<number | string>(0);
  const RPC_URL = useRpcProvider([RPCs[`${chainId}`]]);

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        const amount = await RPC_URL.getBalance(account);
        const bn = new BigNumber(amount + 'e-' + 18);
        setAmt(bn.toFixed(2));
      }
    };
    getBalance();
  }, [account, chainId, RPC_URL]);
  return amt;
};

export const useTokenBalance = (fromNet: any, curAsset?: any) => {
  const { account, chainId } = useActiveWeb3React();
  const [amt, setAmt] = useState<number | string>(0);
  const RPC_URL = useRpcProvider(fromNet?.rpcs);
  const tokenContract = getErc20Contract(curAsset.addresses[`${fromNet.symbol}`], RPC_URL);
  useEffect(() => {
    const getBalance = async () => {
      if (account && parseInt(fromNet.chainId) === chainId) {
        const balance: BigNumber = await tokenContract.balanceOf(account, { value: 0 });
        const strBalance = balance.toString();
        const decimalBalance = parseInt(((parseInt(strBalance.toString()) / 10 ** 18) * 1000000).toString());
        setAmt((decimalBalance / 1000000).toString());
      }
    };
    if (chainId === 820) {
      getBalance();
    }
  }, [
    account,
    tokenContract,
    chainId,
    RPC_URL,
    curAsset.addresses,
    fromNet.rpcs,
    fromNet.chainId,
    fromNet.symbol,
    curAsset.symbol
  ]);
  return amt;
};

export const useGetTokenBalance = (fromNet: any, token: any, curNet: any) => {
  const { account, chainId } = useActiveWeb3React();
  const RPC_URL = useRpcProvider(fromNet?.rpcs);
  const dispatch = useDispatch();
  const [pending, setPending] = useState(true);
  const { balance } = useGetWalletState();
  const balanceRef = useRef(balance);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    if (curNet && curNet === Number(fromNet.chainId)) {
      const getBalance = async () => {
        setPending(true);
        const tokenContract = getErc20Contract(token.address[`${fromNet.chainId}`], RPC_URL);
        const tokenBalance: BigNumber = await tokenContract.balanceOf(account, { value: 0 });
        const balanceCopy = { ...balanceRef.current };
        // const strBalance = balance.toString();
        if (tokenBalance) {
          const decimal = token.decimals[`${fromNet.chainId}`];
          const decimalBalance = getBalanceAmount(tokenBalance, decimal);
          balanceCopy[`${token.symbol}`] = decimalBalance.toNumber();
          dispatch(setBalance(balanceCopy));
          setPending(false);
        }
      };
      if (
        account &&
        chainId &&
        chainId === Number(fromNet.chainId) &&
        token.address[`${fromNet.chainId}`].slice(0, -1) !== '0x000000000000000000000000000000000000000'
      ) {
        getBalance();
      } else if (
        account &&
        chainId &&
        chainId === Number(fromNet.chainId) &&
        token.address[`${fromNet.chainId}`].slice(0, -1) === '0x000000000000000000000000000000000000000'
      ) {
        setPending(false);
      }
    }
  }, [account, chainId, RPC_URL, fromNet, dispatch, curNet, token]);
  return pending;
};

export const useGetTokenBalances = (fromNet: any, toNet?: any) => {
  const { account, chainId } = useActiveWeb3React();
  const RPC_URL = useRpcProvider(fromNet?.rpcs);
  const dispatch = useDispatch();
  const [pending, setPending] = useState(true);

  useEffect(() => {
    const getBalance = async () => {
      setPending(true);
      let tokens;
      if (toNet) {
        tokens = defaultTokens.tokens.filter(
          (t: any) => t.address[`${fromNet.chainId}`] && t.address[`${toNet.chainId}`]
        );
      } else {
        tokens = defaultTokens.tokens.filter((t: any) => t.address[`${fromNet.chainId}`]);
      }
      const temp: { [symbol: string]: string | number } = {};

      tokens.forEach(async (curAsset: any, index: number) => {
        if (fromNet.symbol === curAsset.symbol) {
          const amount = await RPC_URL.getBalance(account);
          // const bigAmt = new BigNumber(amount.toString());
          const bn = new BigNumber(amount + 'e-' + 18);
          temp[`${fromNet.symbol}`] = bn.toFixed(5);
        } else {
          const tokenContract = getErc20Contract(curAsset.address[`${fromNet.chainId}`], RPC_URL);
          const balance: BigNumber = await tokenContract.balanceOf(account, { value: 0 });
          // const strBalance = balance.toString();
          const decimal = curAsset.decimals[`${fromNet.chainId}`];
          const decimalBalance = getBalanceAmount(balance, decimal); // parseInt(((parseInt(strBalance.toString()) / 10 ** decimal) * 1000000).toString());
          temp[`${curAsset.symbol}`] = decimalBalance.toNumber();
        }
        if (Object.keys(temp).length === tokens.length) {
          setPending(false);
          dispatch(setBalance(temp));
        }
      });
    };
    if (account && chainId && chainId === Number(fromNet.chainId)) {
      getBalance();
    }
  }, [account, chainId, RPC_URL, fromNet, dispatch, toNet]);
  return pending;
};

export const useERC20 = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getErc20Contract(address, library.getSigner()), [address, library]);
};

export const useRpcProvider = (rpcs: string[]) => {
  const RPC_URL = getNodeUrl(rpcs);
  return useMemo(() => new ethers.providers.JsonRpcProvider(RPC_URL), [RPC_URL]);
};

export const useWeb3Provider = (rpcs: string) => {
  return useMemo(() => new Web3(new Web3.providers.HttpProvider(rpcs)), [rpcs]);
};

export const getErc20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  // const signerOrProvider = signer
  if (!address) return null;
  return new ethers.Contract(address, WETH_ABI, signer);
};

export function useWETHContract(address: string, withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useActiveWeb3React();
  return useContract(chainId ? address : undefined, WETH_ABI, withSignerIfPossible);
}
