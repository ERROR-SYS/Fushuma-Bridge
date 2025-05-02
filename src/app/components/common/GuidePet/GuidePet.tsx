import { useTranslation } from 'react-i18next';
import guidePet from '~/assets/images/help-ninja.png';
import CustomButton from '../CustomButton';
import './guidepet.css';

export default function GuidePet() {
  const [t] = useTranslation();

  return (
    <div className="guidepet">
      <img src={guidePet} alt="guidePet" />
      <div>
        <CustomButton
          className="guidepet__videoguide"
          onClick={() => {
            window.open('https://youtu.be/pCh_qC_2ROY', '_blank');
          }}
        >
          {t(`Video Guide`)}
        </CustomButton>
      </div>
    </div>
  );
}
