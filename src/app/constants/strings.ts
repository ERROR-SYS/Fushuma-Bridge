export const social = [
  {
    name: 'telegram',
    link: 'https://t.me/FushumaChain'
  },
  {
    name: 'twitter',
    link: 'https://x.com/FushumaChain'
  },
  {
    name: 'reddit',
    link: 'https://www.reddit.com/r/Fushuma/'
  },
  {
    name: 'youtube',
    link: 'https://www.youtube.com/@FushumaChain'
  },
  {
    name: 'instagram',
    link: 'https://www.instagram.com/fushumachain/'
  },
  {
    name: 'facebook',
    link: 'https://www.facebook.com/FushumaChain'
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/company/fushuma'
  },
  {
    name: 'bitcoin',
    link: 'https://bitcointalk.org/index.php?topic=3380156.0'
  }
];

export const resources = [
  {
    name: 'Blueprint',
    link: 'https://fushuma.com/blueprint-for-decentralization/'
  },
  {
    name: 'FUMA tokenomics',
    link: 'https://fushuma.com/fuma-tokenomics/'
  },
  {
    name: 'Dev Grants',
    link: 'https://github.com/Fushuma/Dev_grants/issues/'
  }
];

export const callisto = [
  {
    name: 'Dojo',
    link: 'https://fushuma.com/dojo/'
  },
  {
    name: 'GitHub',
    link: 'https://github.com/Fushuma/'
  },
  {
    name: 'Contact us',
    link: 'https://fushuma.com/contact/'
  }
];

export const tokenList: Array<any> = [
  {
    name: 'CLO',
    symbol: 'CLO',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 18,
      ETC: 18,
      BTT: 18,
      FUMA: 18
    },
    addresses: {
      CLO: '0x0000000000000000000000000000000000000001',
      BNB: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
      ETH: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
      ETC: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
      BTT: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
      FUMA: ''
    },
    addressesTest: {
      CLO: '0x0000000000000000000000000000000000000001',
      BNB: '0xCCEA50dDA26F141Fcc41Ad7e94755936d8C57e28',
      ETH: '0xCC48d2250b55b82696978184E75811F1c0eF383F'
    }
  },
  {
    name: 'BNB',
    symbol: 'BNB',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 18,
      ETC: 18,
      BTT: 18
    },
    addresses: {
      CLO: '0xcCDe29903E621Ca12DF33BB0aD9D1ADD7261Ace9',
      BNB: '0x0000000000000000000000000000000000000007',
      ETH: '',
      ETC: '',
      BTT: ''
    }
  },
  {
    name: 'ETH',
    symbol: 'ETH',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 18,
      ETC: 18,
      BTT: 18,
      FUMA: '0x838b5327D2e7E248e0A2Be4a56494AD702A4567F'
    },
    addresses: {
      CLO: '0xcC208c32Cc6919af5d8026dAB7A3eC7A57CD1796',
      BNB: '',
      ETH: '0x0000000000000000000000000000000000000006',
      ETC: '',
      BTT: '',
      FUMA: '0x838b5327D2e7E248e0A2Be4a56494AD702A4567F'
    }
  },
  {
    name: 'ETC',
    symbol: 'ETC',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 18,
      ETC: 18,
      BTT: 18
    },
    addresses: {
      CLO: '0xCCc766f97629a4E14b3af8C91EC54f0b5664A69F',
      BNB: '',
      ETH: '',
      ETC: '0x0000000000000000000000000000000000000005',
      BTT: ''
    }
  },
  {
    name: 'USDT',
    symbol: 'USDT',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 6,
      ETC: 18,
      BTT: 18
    },
    addresses: {
      CLO: '0xbf6c50889d3a620eb42C0F188b65aDe90De958c4',
      BNB: '0x55d398326f99059fF775485246999027B3197955',
      ETH: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      ETC: '',
      BTT: ''
    }
  },
  {
    name: 'BTT',
    symbol: 'BTT',
    decimals: {
      CLO: 18,
      BNB: 18,
      ETH: 18,
      ETC: 18,
      BTT: 18
    },
    addresses: {
      CLO: '0xCc99C6635Fae4DAcF967a3fc2913ab9fa2b349C3',
      BNB: '',
      ETH: '',
      ETC: '',
      BTT: '0x0000000000000000000000000000000000000003'
    }
  }
];
// ETC in BSC : 0x3d6545b08693daE087E957cb1180ee38B9e3c25E
export const Networks = [
  {
    name: 'Fushuma',
    symbol: 'FUMA',
    devNet: 'mainnet',
    img: '/images/Fushuma.svg',
    chainId: '121224',
    decimals: '18',
    rpcs: [process.env.REACT_APP_FUSHUMA_NODE_1],
    explorer: 'https://fumascan.com/'
  },
  {
    name: 'BSC',
    symbol: 'BNB',
    devNet: 'mainnet',
    img: '/images/bnb.svg',
    chainId: '56',
    decimals: '18',
    rpcs: [process.env.REACT_APP_BSC_NODE_1, process.env.REACT_APP_BSC_NODE_2],
    explorer: 'https://bscscan.com/'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/eth.svg',
    chainId: '1',
    decimals: '18',
    rpcs: [process.env.REACT_APP_ETH_NODE_1],
    explorer: 'https://etherscan.io/'
  },
  {
    name: 'Polygon',
    symbol: 'POL',
    devNet: 'mainnet',
    img: '/images/polygon.svg',
    chainId: '137',
    decimals: '18',
    rpcs: [process.env.REACT_APP_POL_NODE_1],
    explorer: 'https://polygonscan.com/'
  },
  {
    name: 'Arbitrum',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/arbitrum.svg',
    chainId: '42161',
    decimals: '18',
    rpcs: [process.env.REACT_APP_ARBITRUM_NODE_1],
    explorer: 'https://arbiscan.io/'
  },
  {
    name: 'Base',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/base.svg',
    chainId: '8453',
    decimals: '18',
    rpcs: [process.env.REACT_APP_BASE_NODE_1],
    explorer: 'https://base.blockscout.com/'
  },
  {
    name: 'Unichain',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/unichain.svg',
    chainId: '130',
    decimals: '18',
    rpcs: [process.env.REACT_APP_UNICHAIN_NODE_1],
    explorer: 'https://uniscan.xyz/'
  }
];
export const NetworksObj: { [chainId: number | string]: any } = {
  121224: {
    name: 'Fushuma',
    symbol: 'FUMA',
    devNet: 'mainnet',
    img: '/images/Fushuma.svg',
    chainId: '121224',
    decimals: '18',
    rpcs: [process.env.REACT_APP_FUSHUMA_NODE_1],
    explorer: 'https://fumascan.com/'
  },
  42161: {
    name: 'Arbitrum',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/arbitrum.svg',
    chainId: '42161',
    decimals: '18',
    rpcs: [process.env.REACT_APP_ARBITRUM_NODE_1],
    explorer: 'https://arbiscan.io/'
  },
  8453: {
    name: 'Base',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/base.svg',
    chainId: '8453',
    decimals: '18',
    rpcs: [process.env.REACT_APP_BASE_NODE_1],
    explorer: 'https://base.blockscout.com/'
  },
  130: {
    name: 'Unichain',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/unichain.svg',
    chainId: '130',
    decimals: '18',
    rpcs: [process.env.REACT_APP_UNICHAIN_NODE_1],
    explorer: 'https://uniscan.xyz/'
  },
  56: {
    name: 'BSC',
    symbol: 'BNB',
    devNet: 'mainnet',
    img: '/images/bnb.svg',
    chainId: '56',
    decimals: '18',
    rpcs: [process.env.REACT_APP_BSC_NODE_1, process.env.REACT_APP_BSC_NODE_2],
    explorer: 'https://bscscan.com/'
  },
  1: {
    name: 'Ethereum',
    symbol: 'ETH',
    devNet: 'mainnet',
    img: '/images/eth.svg',
    chainId: '1',
    decimals: '18',
    rpcs: [process.env.REACT_APP_ETH_NODE_1],
    explorer: 'https://etherscan.io/'
  },
  137: {
    name: 'Polygon',
    symbol: 'POL',
    devNet: 'mainnet',
    img: '/images/polygon.png',
    chainId: '137',
    decimals: '18',
    rpcs: [process.env.REACT_APP_POL_NODE_1],
    explorer: 'https://polygonscan.com/'
  }
};

export const addTokenList = [
  {
    symbol: 'ccCLO',
    chainId: 1,
    address: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
    network: 'Ethereum',
    decimals: 18
  }
  // {
  //   symbol: 'ccCLO',
  //   chainId: 56,
  //   address: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
  //   network: 'BSC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccCLO',
  //   chainId: 61,
  //   address: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
  //   network: 'ETC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccETH',
  //   chainId: 61,
  //   address: '0xcc74b43F5092B9Dd0A4a86c85794C7d19ff10d88',
  //   network: 'ETC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBNB',
  //   chainId: 61,
  //   address: '0xcC653d74E087D35577049AB23e2141D619D95AEe',
  //   network: 'ETC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'SOY',
  //   chainId: 61,
  //   address: '0xcC67D978Ddf07971D9050d2b424f36f6C1a15893',
  //   network: 'ETC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'BUSDT',
  //   chainId: 61,
  //   address: '0xCC48CD0B4a6f50b8f8bf0f9b80eD7881fA547968',
  //   network: 'ETC',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccCLO',
  //   chainId: 199,
  //   address: '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'SOY',
  //   chainId: 199,
  //   address: '0xcC00860947035a26Ffe24EcB1301ffAd3a89f910',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'BUSDT',
  //   chainId: 199,
  //   address: '0xCC78D0A86B0c0a3b32DEBd773Ec815130F9527CF',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBNB',
  //   chainId: 199,
  //   address: '0x185a4091027E2dB459a2433F85f894dC3013aeB5',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccETH',
  //   chainId: 199,
  //   address: '0x1249C65AfB11D179FFB3CE7D4eEDd1D9b98AD006',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccETC',
  //   chainId: 199,
  //   address: '0xCc944bF3e76d483e41CC6154d5196E2e5d348fB0',
  //   network: 'Bittorent',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBNB',
  //   chainId: 820,
  //   address: '0xcCDe29903E621Ca12DF33BB0aD9D1ADD7261Ace9',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccETH',
  //   chainId: 820,
  //   address: '0xcC208c32Cc6919af5d8026dAB7A3eC7A57CD1796',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccETC',
  //   chainId: 820,
  //   address: '0xCCc766f97629a4E14b3af8C91EC54f0b5664A69F',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'BUSDT',
  //   chainId: 820,
  //   address: '0xbf6c50889d3a620eb42C0F188b65aDe90De958c4',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccCAKE',
  //   chainId: 820,
  //   address: '0xCC2D45F7fE1b8864a13F5D552345eB3f5a005FEd',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccTWT',
  //   chainId: 820,
  //   address: '0xCC099e75152ACCda96d54FAbaf6e333ca44AD86e',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccWSG',
  //   chainId: 820,
  //   address: '0xccEbb9f0EE6D720DebccEE42f52915037f774A70',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccREEF',
  //   chainId: 820,
  //   address: '0xCc1530716A7eBecFdc7572eDCbF01766f042155c',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBAKE',
  //   chainId: 820,
  //   address: '0xCCeC9F26F52E8e0D1d88365004f4F475f5274279',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccSHIB',
  //   chainId: 820,
  //   address: '0xccA4F2ED7Fc093461c13f7F5d79870625329549A',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccRACA',
  //   chainId: 820,
  //   address: '0xCC8B04c0f7d0797B3BD6b7BE8E0061ac0c3c0A9b',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccLINA',
  //   chainId: 820,
  //   address: '0xCC10A4050917f771210407DF7A4C048e8934332c',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccTON',
  //   chainId: 820,
  //   address: '0xCC50D400042177B9DAb6bd31ede73aE8e1ED6F08',
  //   network: 'Callisto',
  //   decimals: 9
  // },
  // {
  //   symbol: 'ccXMS',
  //   chainId: 820,
  //   address: '0xcc45afedd2065EDcA770801055d1E376473a871B',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccFTM',
  //   chainId: 820,
  //   address: '0xcc50aB63766660C6C1157B8d6A5D51ceA82Dff34',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBTT',
  //   chainId: 820,
  //   address: '0xCc99C6635Fae4DAcF967a3fc2913ab9fa2b349C3',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBBT',
  //   chainId: 820,
  //   address: '0xcCCaC2f22752bbe77D4DAb4e9421F2AC6c988427',
  //   network: 'Callisto',
  //   decimals: 8
  // },
  // {
  //   symbol: 'ccANTEX',
  //   chainId: 820,
  //   address: '0xCCd792f5D06b73685a1b54A32fE786346cAd1894',
  //   network: 'Callisto',
  //   decimals: 8
  // },
  // {
  //   symbol: 'ccZOO',
  //   chainId: 820,
  //   address: '0xCC9aFcE1e164fC2b381A3a104909e2D9E52cfB5D',
  //   network: 'Callisto',
  //   decimals: 18
  // },
  // {
  //   symbol: 'ccBCOIN',
  //   chainId: 820,
  //   address: '0xcC6e7E97A46B6F0eD3bC81518Fc816da78F7cb65',
  //   network: 'Callisto',
  //   decimals: 18
  // }
];

export const migrationTokens = [
  {
    symbol: 'ccBNB',
    symbol2: 'BNB',
    chainId: 820,
    addresses: {
      CLO: '0xCC78D0A86B0c0a3b32DEBd773Ec815130F9527CF'
    },
    network: 'Callisto'
  },
  {
    symbol: 'ccETH',
    symbol2: 'ETH',
    chainId: 820,
    addresses: {
      CLO: '0xcC00860947035a26Ffe24EcB1301ffAd3a89f910'
    },
    network: 'Callisto'
  }
];
