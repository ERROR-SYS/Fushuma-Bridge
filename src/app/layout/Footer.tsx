import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Facebook from '~/app/components/Svg/Icons/Facebook';
// import Medium from '~/app/components/Svg/Icons/Medium';
import Redit from '~/app/components/Svg/Icons/Redit';
import Telegram from '~/app/components/Svg/Icons/Telegram';
import Twitter from '~/app/components/Svg/Icons/Twitter';
import Instagram from '~/app/components/Svg/Icons/Instagram';
import whiteLogo from '~/assets/images/white-logo.png';
import './footer.css';

export default function Footer() {
  const [t] = useTranslation();

  const { start_swapping } = useSelector((state: any) => state.walletBridge);

  return (
    <div className={classNames('footer', { footer__animation: start_swapping })}>
      <div className="footer__content">
        <a href="https://fushuma.com/" target="_blank" rel="noreferrer">
          <img src={whiteLogo} width={'240'} alt="whitelogo" />
        </a>

        <div className="footer__center">
          <div className="footer__center__dropdown">
            <p className="footer__bold">{t('Resources')}</p>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: false })}>
            <a
              className="footer__link"
              href="https://soy-finance.gitbook.io/soy-finance/soy-products/safety-on-yields/soy-finance-security-audit/"
              target="_blank"
              rel="noreferrer"
            >
              {t('Platform Audit Report')}
            </a>
            <a className="footer__link" href="https://github.com/Fushuma/" target="_blank" rel="noreferrer">
              {t('Github')}
            </a>
            <a
              className="footer__link"
              href="https://github.com/Fushuma/Dev_grants/issues/"
              target="_blank"
              rel="noreferrer"
            >
              {t('Dev Grants')}
            </a>
          </div>
        </div>

        <div className="footer__center">
          <div className="footer__center__dropdown">
            <p className="footer__bold">{t('Others')}</p>
          </div>
          <div className={classNames('footer__column', { footer__center__linklist: false })}>
            <a
              className="footer__link"
              href="https://fushuma.com/blueprint-for-decentralization/"
              target="_blank"
              rel="noreferrer"
            >
              {t('Blueprint')}
            </a>
            <a className="footer__link" href="https://fushuma.com/fuma-tokenomics/" target="_blank" rel="noreferrer">
              {t('Fuma Tokenomics')}
            </a>
            <a className="footer__link" href="https://fushuma.com/dojo/" target="_blank" rel="noreferrer">
              {t('Fushu-news')}
            </a>
          </div>
        </div>

        <div className="footer__socialmedia">
          <div className="mt-3">
            <a href="https://t.me/FushumaChain" target="_blank" rel="noreferrer">
              <Telegram />
            </a>
            <a href="https://x.com/FushumaChain" target="_blank" rel="noreferrer">
              <Twitter />
            </a>
            <a href="https://www.instagram.com/fushumachain/" target="_blank" rel="noreferrer">
              <Instagram />
            </a>
            <a href="https://www.reddit.com/r/Fushuma/" target="_blank" rel="noreferrer">
              <Redit />
            </a>
            <a href="https://www.facebook.com/FushumaChain/" target="_blank" rel="noreferrer">
              <Facebook />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
