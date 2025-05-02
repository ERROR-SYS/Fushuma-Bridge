export const getTokenLogoLink = (address: string, chainId = 820) => {
  return address === '0xCcbf1C9E8b4f2cDF3Bfba1098b8f56f97d219D53'
    ? `./images/coins/clo.png`
    : `./images/coins/${chainId}/${address}.png`;
};
