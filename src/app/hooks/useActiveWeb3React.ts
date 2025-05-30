// import { Web3Provider } from '@ethersproject/providers'
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React, useWeb3React as useWeb3ReactCore } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useEffect, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { getProviderByChainId } from '~/app/utils/getRpcUrl';

declare let window: any;

export const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 137, 8453, 130, 42161, 121224]
});

export function useEagerConnect() {
  const { activate, active } = useWeb3ReactCore(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else if (isMobile && window.ethereum) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

/**
 * Use for network and injected - logs user in
 * and out after checking what network theyre on
 */
export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        // eat errors
        activate(injected, undefined, true).catch((err) => {
          console.error('Failed to activate after chain changed', err);
        });
      };

      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          // eat errors
          activate(injected, undefined, true).catch((err) => {
            console.error('Failed to activate after accounts changed', err);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
    return undefined;
  }, [active, error, suppress, activate]);
}

const useGetSimpleRpcProvider = (chainId: number) => {
  const [provider, setSimpleProvider] = useState(null);

  useEffect(() => {
    const get = async () => {
      const pvd = getProviderByChainId(chainId);
      setSimpleProvider(pvd);
    };
    if (chainId) {
      get();
    } else {
      setSimpleProvider(null);
    }
  }, [chainId]);

  return provider;
};
/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
const useActiveWeb3React = (): Web3ReactContextInterface<Web3Provider> => {
  const { library, chainId, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const simpleRpcProviderForMulti = useGetSimpleRpcProvider(chainId);
  const [provider, setprovider] = useState(library || simpleRpcProviderForMulti);

  useEffect(() => {
    if (library !== refEth.current && library) {
      setprovider(library || simpleRpcProviderForMulti);
      library?.provider?.removeAllListeners(['networkChanged']);
      refEth.current = library;
    }
  }, [library, simpleRpcProviderForMulti]);

  return { library: provider, chainId, ...web3React };
};

export default useActiveWeb3React;
