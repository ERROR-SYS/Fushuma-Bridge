import { useWeb3React } from '@web3-react/core';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import BorderContainer from '~/app/components/common/BorderContainer';
import Spinner from '~/app/components/common/Spinner';
import defaultTokens from '~/app/constants/tokenLists/tokenLists2.json';
import { AppState } from '~/app/core/store';
import useAuth from '~/app/hooks/useAuth';
import useToast from '~/app/hooks/useToast';
import { getAddress } from '~/app/utils/addressHelpers';
import { registerToken } from '~/app/utils/wallet';
import copyIcon from '~/assets/images/copy.svg';
import metamaskIcon from '~/assets/images/metamask.svg';
import './walletinfo.css';

type walletInfoProps = {
  pending?: boolean;
  fromNetwork?: any;
};

export default function WalletInfo({ pending, fromNetwork }: walletInfoProps) {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const { toastWarning } = useToast();
  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const { account, active, chainId } = useWeb3React();

  const tokenList = useMemo(() => {
    return defaultTokens.tokens.filter((token: any) => token.address[`${fromNetwork.chainId}`] !== '');
  }, [fromNetwork.chainId]);

  const { logout } = useAuth();
  const accountEllipsis = account ? `${account?.substring(0, 8)}...${account?.substring(account.length - 4)}` : null;

  const { balance } = useSelector((state: AppState) => state.walletBridge);
  const balanceLen = Object.keys(balance).length;

  useEffect(() => {
    if (!active) {
      navigate('/');
    }
  }, [active, navigate]);

  const onClickDisconnect = () => {
    logout();
    navigate('/');
  };

  const handleAddToken = async (item: any) => {
    const address = getAddress(item.address, chainId);
    if (address === '') {
      toastWarning('WARNING!', 'Not supported asset!');
      return;
    }
    const decimal = item.decimals[chainId];
    await registerToken(address, item.symbol, decimal, item.logoURI, item.chainId);
  };

  const handleClipboard = async () => {
    navigator.clipboard.writeText(account).then(() => {
      displayTooltip();
    });
  };

  function displayTooltip() {
    setIsTooltipDisplayed(true);
    setTimeout(() => {
      setIsTooltipDisplayed(false);
    }, 1000);
  }

  return (
    <>
      {!isMobile ? (
        <BorderContainer className="walletinfo__balance">
          <div>
            <img src={metamaskIcon} alt="metamaskIcon" />
            <div className="d-flex justify-center">
              <p className="me-1">{accountEllipsis}</p>
              <img src={copyIcon} className="walletinfo__copyicon" alt="copyIcon" onClick={handleClipboard} />
            </div>
            {isTooltipDisplayed && (
              <div className="d-flex justify-center">
                <p className="me-copied">Copied</p>
              </div>
            )}
            <p className="walletinfo__balance--title">{t('Balance')}</p>
            {pending || tokenList.length !== balanceLen ? (
              <Spinner className="mt-5" size="sm" />
            ) : (
              <div className="tokens_container">
                {tokenList.map((item, index) => {
                  if (balance[`${item.symbol}`] === undefined) return null;
                  const bb = Math.floor(balance[`${item.symbol}`] * 100000);

                  return (
                    <li className="tokenitem" key={index}>
                      <div className="d-flex align-items-center">
                        <img
                          className="me-2 token-icon"
                          src={
                            item.symbol === 'USDT' && fromNetwork.chainId === '8453' ? 'images/usdc.png' : item.logoURI
                          }
                          alt="icon"
                        />
                        <p className="ms-2">{`${bb / 100000}`}</p>
                        <button className="walletinfo__addtoken--button" onClick={() => handleAddToken(item)}>
                          <img className="me-2 token-icon" src={metamaskIcon} alt="icon" />
                        </button>
                      </div>
                      <p style={{ marginRight: 10 }}>
                        {item.symbol === 'USDT' ? (fromNetwork.chainId === '8453' ? 'USDC' : 'USDT') : item.symbol}
                      </p>
                    </li>
                  );
                })}
              </div>
            )}

            <hr className="solid mt-5"></hr>
            <p className="walletinfo__balance--disconnect" onClick={onClickDisconnect}>
              {t('Disconnect')}
            </p>
          </div>
        </BorderContainer>
      ) : (
        <div className="walletinfo__balance d-flex align-items-center justify-content-center">
          <div>
            <img src={metamaskIcon} alt="metamaskIcon" />
          </div>
          <div className="ms-4">
            <div className="d-flex">
              <p className="me-1">{accountEllipsis}</p>
              <img src={copyIcon} alt="copyIcon" />
            </div>
            <hr className="solid"></hr>
            <p className="walletinfo__balance--disconnect" onClick={onClickDisconnect}>
              {t('Disconnect')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
