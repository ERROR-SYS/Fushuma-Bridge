export const COINGECKO_URL = 'https://api.coingecko.com/api/v3/';
export const STAKE_URL = 'https://wallet.callisto.network/';
export const GETCLO_URL = 'https://trading.bitfinex.com/t/CLO:USD?demo=true';

export const deposit_event_abi = [
  { type: 'address', name: 'token', internalType: 'address', indexed: true },
  { type: 'address', name: 'sender', internalType: 'address', indexed: true },
  { type: 'uint256', name: 'value', internalType: 'uint256', indexed: false },
  { type: 'uint256', name: 'toChainId', internalType: 'uint256', indexed: false },
  { type: 'address', name: 'toToken', internalType: 'address', indexed: false }
];

// Always add 2 block confirmations to make sure the transaction is confirmed on backend
export const blockConfirmations: { [chainId: number]: number } = {
  '56': 5,
  '1': 6,
  '137': 302,
  '121224': 66,
  '8453': 302,
  '130': 602,
  '42161': 1202
};
