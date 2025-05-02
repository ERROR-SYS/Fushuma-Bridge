import { ConnectorNames } from '@callisto-enterprise/soy-uikit2';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { prevChainIdKey } from '~/app/constants';
import { NetworksObj } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useAuth from '~/app/hooks/useAuth';
import { setFromNetwork, setStartSwapping } from '~/app/modules/wallet/action';
import { setupEthereumNetwork, setupNetwork } from '~/app/utils/wallet';
import animal from '~/assets/images/home-ninja.png';
import metamaskIcon from '~/assets/images/metamask.svg';
import moreWallet from '~/assets/images/3dots.png';
import trustIcon from '~/assets/images/trust.svg';
import walletConnect from '~/assets/images/wallet-connect.svg';
import WalletButton from '~/app/components/Svg/Icons/WalletButton';
import './home.css';

export default function Home() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState<string>('');

  const prevChainId = window.localStorage.getItem(prevChainIdKey);

  const { account } = useActiveWeb3React();
  const { login } = useAuth();

  useEffect(() => {
    if (account) {
      navigate(`/${page}`);
    }
  }, [account, navigate, page]);

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  const onClaim = () => {
    // setPage('select');
  };

  const onClickMetamask = async (connectorId: ConnectorNames) => {
    const chainId = prevChainId ?? 121224;
    login(connectorId, NetworksObj[chainId]);
    const network = NetworksObj[chainId];
    dispatch(setFromNetwork(network));
    if (network.symbol === 'ETH') {
      await setupEthereumNetwork(network);
    } else {
      await setupNetwork(network);
    }
    setPage('select');
  };

  return (
    <div className="home container">
      <p className="home__title">{t('Welcome to Fushuma!')}</p>
      <div className="home__content bordercontainer--noborder">
        <div className={`home__wallets`}>
          <p className="home__wallets__title">{t('Select Your Wallet')}</p>
          <div className="mt-5">
            <div className="home__wallets__block" onClick={() => onClickMetamask(ConnectorNames.Injected)}>
              <div>
                <WalletButton />
                <img src={metamaskIcon} alt="metamaskIcon" width={'60px'} />
                <p className="home__wallets__block--more">Metamask</p>
              </div>
            </div>
            <div className="home__wallets__block" onClick={() => onClickMetamask(ConnectorNames.WalletConnect)}>
              <div>
                <WalletButton />
                <img src={walletConnect} alt="walletConnect" width={'60px'} />
                <p className="home__wallets__block--more">wallet connect</p>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="home__wallets__block" onClick={() => onClickMetamask(ConnectorNames.Injected)}>
              <div>
                <WalletButton />
                <img src={trustIcon} alt="trustIcon" width={'70px'} height={'51px'} />
                <p className="home__wallets__block--more">trust wallet</p>
              </div>
            </div>
            <div className="home__wallets__block others-wallet" onClick={onClaim}>
              <div>
                <WalletButton />
                <img src={moreWallet} alt="moreWallet" width={'40px'} />
                <p className="home__wallets__block--more">others</p>
              </div>
            </div>
          </div>
        </div>
        <div className="home__animal home__animal@m">
          <img src={animal} alt="animal" width={'225px'} />
        </div>
      </div>
    </div>
  );
}
