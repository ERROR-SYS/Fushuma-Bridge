//import { BscConnector } from '@binance-chain/bsc-connector';
import { ConnectorNames } from '@callisto-enterprise/soy-uikit2';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { ethers } from 'ethers';
import getNodeUrl from './getRpcUrl';

const POLLING_INTERVAL = 12000;
const rpcUrl = getNodeUrl();
const chainId = process.env.REACT_APP_FUSHUMA_NODE_1;

const injected = new InjectedConnector({
  supportedChainIds: [1, 56, 137, 8453, 130, 42161, 121224]
});

const walletconnect = new WalletConnectConnector({
  rpc: { [chainId]: rpcUrl },
  // bridge: 'https://bridge.walletconnect.org/',
  qrcode: true
  // pollingInterval: 12000
  // supportedChainIds: [1, 4, 56, 61, 820, 20729, 97]
});

//const bscConnector = new BscConnector({ supportedChainIds: [1, 4, 56, 61, 820, 20729, 97, 199] });

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
  [ConnectorNames.Injected]: injected,
  [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.BSC]: injected,
  [ConnectorNames.Unstoppable]: undefined
};

export const getLibrary = (provider: any): ethers.providers.Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = POLLING_INTERVAL;
  return library;
};

export const getConnectorsByName = (curNet: any): any => {
  const rpc = curNet.rpc;
  const walletconnect1 = new WalletConnectConnector({
    rpc: { [curNet.chainId]: rpc },
    qrcode: true
  });
  const connectorsByName1: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletConnect]: walletconnect1,
    [ConnectorNames.BSC]: injected,
    [ConnectorNames.Unstoppable]: undefined
  };
  return connectorsByName1;
};
