import BigNumber from 'bignumber.js';
import { useCallback } from 'react';
import { getBridgeContract } from '../utils';
import { getBridgeAddress, getSoyRouterAddressByChain } from '../utils/addressHelpers';
import useActiveWeb3React from './useActiveWeb3React';
import useToast from './useToast';

const useSwap = () => {
  const { library, account, chainId } = useActiveWeb3React();
  const { toastError } = useToast();

  const handleSimpleSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, value: string) => {
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      let tx;
      try {
        const gasLimit = await bridgeContract.estimateGas.depositTokens(
          receiver,
          tkAddress,
          amount.toString(),
          toChainId,
          { value }
        );
        tx = await bridgeContract.depositTokens(receiver, tkAddress, amount.toString(), toChainId, {
          value,
          gasLimit: gasLimit.add(30000)
        });
      } catch (e: any) {
        if (e.code === 4001) {
          toastError('You declined the transaction.');
        } else {
          toastError('An error occured, please try again later.');
        }
      }

      return {
        status: false,
        hash: tx.hash
      };
    },
    [library, account, chainId, toastError]
  );

  const handleAdvancedSwap = useCallback(
    async (receiver: string, tkAddress: string, amount: BigNumber, toChainId: number, byteData: any, value: string) => {
      const router = await getSoyRouterAddressByChain(toChainId);
      const bridgeAddr = await getBridgeAddress(chainId);
      const bridgeContract = await getBridgeContract(bridgeAddr, library, account);
      const gasLimit = await bridgeContract.estimateGas.bridgeToContract(
        receiver,
        tkAddress,
        amount.toString(),
        toChainId,
        router,
        byteData,
        {
          value
        }
      );

      const tx = await bridgeContract.bridgeToContract(
        receiver,
        tkAddress,
        amount.toString(),
        toChainId,
        router,
        byteData,
        {
          value,
          gasLimit: gasLimit.add(30000)
        }
      );

      return {
        status: false,
        hash: tx.hash
      };
    },
    [library, account, chainId]
  );

  return { onSimpleSwap: handleSimpleSwap, onAdvancedSwap: handleAdvancedSwap };
};

export default useSwap;
