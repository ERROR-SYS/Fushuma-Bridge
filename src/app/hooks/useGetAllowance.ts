import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { getTokenContract } from '../utils';
import { getBridgeAddress } from '../utils/addressHelpers';
import useActiveWeb3React from './useActiveWeb3React';

const useGetAllowance = (tokenAddress: string, succeed?: boolean, tokenChainId?: number) => {
  const { account, library, chainId } = useActiveWeb3React();
  const [allowed, setAllowed] = useState('0');

  useEffect(() => {
    if (Number(tokenChainId) === chainId) {
      const get = async () => {
        try {
          const bridgeAddr = await getBridgeAddress(chainId);
          const tkContract = await getTokenContract(tokenAddress, library, account);

          if (tkContract) {
            const allowance = await tkContract.allowance(account, bridgeAddr, { value: 0 });
            setAllowed(allowance.toString());
          }
        } catch (error) {
          console.error(error);
        }
      };
      if (
        account &&
        tokenAddress.slice(0, -2) !== '0x00000000000000000000000000000000000000' &&
        tokenAddress !== '' &&
        !succeed
      ) {
        get();
      }
    }
  }, [library, account, chainId, tokenAddress, succeed, tokenChainId]);

  const handleApprove = useCallback(async () => {
    if (tokenAddress !== '') {
      const bridgeAddr = await getBridgeAddress(chainId);
      const tkContract = await getTokenContract(tokenAddress, library, account);
      const tx = await tkContract.approve(bridgeAddr, ethers.constants.MaxUint256, { value: 0 });
      const receipt = await tx.wait();
      return receipt.status;
    }
  }, [library, account, chainId, tokenAddress]);

  return { onApprove: handleApprove, allowed };
};

export default useGetAllowance;
