import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';
import CustomButton from '~/app/components/common/CustomButton';
import logo from '~/assets/images/newLogo.png';
import './header.css';

export default function Header() {
  const [t] = useTranslation();

  const handleLaunchWebsite = () => {
    window.open('https://fushuma.com/bridge-security-model/', '_blank');
  };

  return (
    <Navbar className="header" expand="lg">
      <Navbar.Brand href="/">
        <img src={logo} className="header__logo" alt="logo" />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="header__right justify-content-end">
        {/* <a href="https://callisto.network/cross-chain-bridges-security-model/" target="_blank" rel="noreferrer">
          {t('Fushuma Security Model')}
        </a> */}
        <CustomButton onClick={handleLaunchWebsite}>{t('Bridge Security Model')}</CustomButton>
      </Navbar.Collapse>
    </Navbar>
  );
}
