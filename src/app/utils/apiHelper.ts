import axios from 'axios';
import { CLAIMAPI } from '../constants/endpoints';

export const submitClaimAction = async (tx: string, chainId: number | string) => {
  return new Promise((resolve, reject) => {
    const url = `${CLAIMAPI}tx=${tx}&chain=${chainId}`;
    try {
      axios.get(url).then((res) => {
        console.log(res.data);
        resolve(res.data);
      });
    } catch (err) {
      console.log(url);
      reject(false);
    }
  });
};
