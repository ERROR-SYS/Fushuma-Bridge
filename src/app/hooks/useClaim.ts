import { useCallback } from 'react';
import { getBridgeContract } from '../utils';
import useActiveWeb3React from './useActiveWeb3React';

const useClaim = () => {
  const { library, account } = useActiveWeb3React();

  const handleSimpleClaim = useCallback(
    async (respJson: any, txHash: string, fromChainId: number, sig: string) => {
      const bridgeContract = await getBridgeContract(respJson.bridge, library, account);
      const gasLimit = await bridgeContract.estimateGas.claim(
        respJson.originalToken,
        respJson.originalChainID,
        txHash,
        respJson.to,
        respJson.value,
        fromChainId,
        sig,
        { value: 0 }
      );
      const tx = await bridgeContract.claim(
        respJson.originalToken,
        respJson.originalChainID,
        txHash,
        respJson.to,
        respJson.value,
        fromChainId,
        sig,
        {
          value: 0,
          gasLimit: gasLimit.add(30000)
        }
      );
      const receipt = tx.wait();
      return receipt;
    },
    [library, account]
  );

  const handleAdvancedClaim = useCallback(
    async (respJson: any, txHash: string, fromChainId: number, sig: string) => {
      const bridgeContract = await getBridgeContract(respJson.bridge, library, account);
      const gasLimit = await bridgeContract.estimateGas.claimToContract(
        respJson.originalToken,
        respJson.originalChainID,
        txHash,
        respJson.to,
        respJson.value,
        fromChainId,
        respJson.toContract,
        respJson.data,
        sig,
        {
          value: 0
        }
      );
      const tx = await bridgeContract.claimToContract(
        respJson.originalToken,
        respJson.originalChainID,
        txHash,
        respJson.to,
        respJson.value,
        fromChainId,
        respJson.toContract,
        respJson.data,
        sig,
        {
          value: 0,
          gasLimit: gasLimit.add(30000)
        }
      );
      const receipt = tx.wait();
      return receipt;
    },
    [library, account]
  );

  return { onSimpleClaim: handleSimpleClaim, onAdvancedClaim: handleAdvancedClaim };
};

export default useClaim;
