import { ethers } from 'ethers';
import sample from 'lodash/sample';
import { Networks } from '~/app/constants/strings';

// Array of available nodes to connect to
export const nodes = [process.env.REACT_APP_FUSHUMA_NODE_1];

const getNodeUrl = () => {
  return sample(nodes);
};

export const getRpcForMulti = (rpcs: string[]) => {
  return sample(rpcs);
};

export const getProviderByChainId = (chainId: number) => {
  const filtered = Networks.filter((_) => Number(_.chainId) === chainId);
  if (filtered.length > 0) {
    const RPC = getRpcForMulti(filtered[0]?.rpcs);
    const pvd = new ethers.providers.JsonRpcProvider(RPC);
    return pvd;
  }
  return null;
};

export default getNodeUrl;
