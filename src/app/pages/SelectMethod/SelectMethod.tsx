import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useToast from '~/app/hooks/useToast';
import { setStartSwapping } from '~/app/modules/wallet/action';
import animal from '~/assets/images/home-ninja.png';
import LongButton from '~/app/components/Svg/Icons/LongButton';
import CustomButton from '~/app/components/common/CustomButton';
import previousIcon from '~/assets/images/previous.svg';
import './selectmethod.css';

export default function SelectMethod() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { toastWarning } = useToast();

  const { account } = useActiveWeb3React();

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  const onClaim = () => {
    navigate('/network');
  };

  const onPrevious = () => {
    navigate('/');
  };

  const onPreviousClaim = async () => {
    if (!account) {
      toastWarning('Warning!', 'Please connect wallet.');
      return;
    }
    navigate('/previousclaim');
  };

  return (
    <div className="home container">
      <p className="home__title">{t('Welcome to Fushuma!')}</p>
      <div className="home__content bordercontainer--noborder">
        <div className="home__wallets wallet-selected">
          <div className="select-method">
            <p className="home__wallets__title">{t('What Would You Like To Do?')}</p>
            <div className="container">
              <div className="home__claimbtnbox bridge" onClick={onClaim}>
                <LongButton />
                <span>Transfer Assets Across Networks</span>
              </div>
              <div className="home__claimbtnbox" onClick={onPreviousClaim}>
                <LongButton />
                <span>Claim Uncompleted Transaction</span>
              </div>
            </div>
          </div>
          <CustomButton className="previous_btn" onClick={onPrevious}>
            <div>
              <img src={previousIcon} alt="Icon" className="me-2" />
              {t('Previous')}
            </div>
          </CustomButton>
        </div>
        <div className="home__animal home__animal@m">
          <img src={animal} alt="animal" width={'225px'} />
        </div>
      </div>
    </div>
  );
}
