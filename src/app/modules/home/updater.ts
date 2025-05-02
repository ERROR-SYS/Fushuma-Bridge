import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { RPCs } from '~/app/constants';
import useDebounce from '~/app/hooks/useDebounce';
import useIsWindowVisible from '~/app/hooks/useIsWindowVisible';
import { useRpcProvider } from '~/app/hooks/wallet';
import { updateBlockNumber } from './action';

export default function Updater(): null {
  // const { library, chainId } = useActiveWeb3React();
  const chainId = localStorage.getItem('toChainId') ? Number(localStorage.getItem('toChainId')) : 121224;
  const provider = useRpcProvider([RPCs[`${chainId}`]]);
  const library = provider;

  const dispatch = useDispatch();

  const windowVisible = useIsWindowVisible();
  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | null }>({
    chainId,
    blockNumber: null
  });

  const blockNumberCallback = useCallback(
    (blockNumber: number) => {
      setState((prev) => {
        if (chainId === prev.chainId) {
          if (typeof prev.blockNumber !== 'number') return { chainId, blockNumber };
          return { chainId, blockNumber: Math.max(blockNumber, prev.blockNumber) };
        }
        return prev;
      });
    },
    [chainId, setState]
  );

  // attach/detach listeners
  useEffect(() => {
    if (!library || !chainId || !windowVisible) return undefined;

    setState({ chainId, blockNumber: null });

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.error(`Failed to get block number for chainId: ${chainId}`, error));

    library.on('block', blockNumberCallback);
    return () => {
      library.removeListener('block', blockNumberCallback);
    };
  }, [dispatch, chainId, library, blockNumberCallback, windowVisible]);

  const debouncedState = useDebounce(state, 100);

  useEffect(() => {
    if (!debouncedState.chainId || !debouncedState.blockNumber || !windowVisible) return;
    dispatch(updateBlockNumber({ chainId: debouncedState.chainId, blockNumber: debouncedState.blockNumber }));
  }, [windowVisible, dispatch, debouncedState.blockNumber, debouncedState.chainId]);

  return null;
}
