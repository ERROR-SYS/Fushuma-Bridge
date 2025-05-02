import { ChainId, Token } from '@callisto-enterprise/soy-sdk';

export const SOY: { [chainId: number]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x9FaE2529863bD691B4A7171bDfCf33C7ebB10a65',
    18,
    'SOY',
    'SoyERC223-Token'
  ),
  [ChainId.CLOTESTNET]: new Token(
    ChainId.CLOTESTNET,
    '0x9FaE2529863bD691B4A7171bDfCf33C7ebB10a65',
    18,
    'SOY',
    'SoyERC223-Token'
  )
};

export const WCLO = new Token(ChainId.MAINNET, '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a', 18, 'WCLO', 'Wrapped CLO');
export const DAI = new Token(
  ChainId.MAINNET,
  '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  18,
  'DAI',
  'Dai Stablecoin'
);
export const USDT = new Token(ChainId.MAINNET, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 18, 'USDT', 'Tether USD');
export const BTCB = new Token(ChainId.MAINNET, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC ', 'Wrapped BTC');

export const UST = new Token(
  ChainId.MAINNET,
  '0x692597b009d13C4049a947CAB2239b7d6517875F',
  18,
  'UST',
  'Wrapped UST Token'
);
export const ETH = new Token(
  ChainId.MAINNET,
  '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
  18,
  'WETH',
  'Wrapped Ether'
);
export const USDC = new Token(
  ChainId.MAINNET,
  '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // '0xc950a687e8d08e70fc072ca8c3596b62aef91faf',
  18,
  'USDC',
  'Polygon-Peg USD Coin'
);

const tokens = {
  clo: {
    symbol: 'CLO',
    projectLink: 'https://callisto.network/'
  },
  wclo: {
    symbol: 'WCLO',
    address: {
      820: '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a',
      20729: '0xbd2D3BCe975FD72E44A73cC8e834aD1B8441BdDa'
    },
    decimals: 18,
    projectLink: 'https://explorer.callisto.network/token/0xA648A7824780780d272b6811ce8186a11b9c6591'
  },
  busdt: {
    symbol: 'USDT',
    address: {
      820: '0xbf6c50889d3a620eb42C0F188b65aDe90De958c4',
      20729: ''
    },
    decimals: 18,
    projectLink: 'https://explorer.callisto.network/token/0xbf6c50889d3a620eb42C0F188b65aDe90De958c4'
  },
  ccbnb: {
    symbol: 'ccBNB',
    address: {
      820: '0xCC78D0A86B0c0a3b32DEBd773Ec815130F9527CF',
      20729: ''
    },
    decimals: 18,
    projectLink: 'https://callisto.enterprise/'
  },
  cceth: {
    symbol: 'ccETH',
    address: {
      820: '0xcC00860947035a26Ffe24EcB1301ffAd3a89f910',
      20729: ''
    },
    decimals: 18,
    projectLink: 'https://callisto.enterprise/'
  }
};

export const NATIVE_W_COINS: { [chainId: number | string]: string } = {
  '20729': '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a',
  '820': '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a',
  '56': '',
  '97': '',
  '1': '',
  '42': '',
  '61': '',
  '137': '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
};

export const NATIVE_W_CURRENCY: { [chainId: number | string]: any } = {
  '20729': '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a',
  '820': '0xF5AD6F6EDeC824C7fD54A66d241a227F6503aD3a',
  '56': '',
  '97': '',
  '1': '',
  '42': '',
  '61': '',
  '137': '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
};

export default tokens;
