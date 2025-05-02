export interface INetwork {
  name: string;
  symbol: string;
  devNet: string;
  img: string;
  chainId: string;
  decimals: string;
  rpcs: Array<string>;
  explorer: string;
}

export interface IToken {
  name: string;
  symbol: string;
  variation?: string;
  icon: string;
  decimals: {
    CLO: number;
    BNB: number;
    ETH: number;
    POL: number;
    FUMA: number;
    BASE: number;
    UNI: number;
    ARB: number;
  };
  addresses: {
    CLO: string;
    BNB: string;
    ETH: string;
    POL: string;
    FUMA: string;
    BASE: string;
    UNI: string;
    ARB: string;
  };
  addressesTest?: {
    CLO: string;
    BNB: string;
    ETH: string;
    POL: string;
    FUMA: string;
    BASE: string;
    UNI: string;
    ARB: string;
  };
}
