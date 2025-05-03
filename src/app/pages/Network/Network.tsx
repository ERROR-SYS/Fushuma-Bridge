/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import GuidePet from '~/app/components/common/GuidePet';
import NetworkSelectionOne from '~/app/components/NetworkSelection/NetworkOneSelection';
import NetworkSelectionTwo from '~/app/components/NetworkSelection/NetworkTwoSelection';
import { INetwork } from '~/app/constants/interface';
import { Networks, NetworksObj } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import { setFromNetwork, setStartSwapping, setToNetwork } from '~/app/modules/wallet/action';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import './network.css';
import Spinner from '~/app/components/common/Spinner';

const Default = ({ children }: any) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

export default function Network() {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { library, chainId } = useActiveWeb3React();

  const [networkOne, setNetworkOne] = useState(NetworksObj[chainId ?? 121224]);
  const [networkTwo, setNetworkTwo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>();

  const loadingRef = useRef<any>(null);

  // const pendingBalance = useGetTokenBalances(networkOne);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    if (networkOne?.symbol === networkTwo?.symbol) {
      setNetworkTwo(null);
    }
  }, [networkOne, networkTwo]);

  useEffect(() => {
    setNetworkTwo(null);
    const changeNetwork = async () => {
      await switchNetwork(networkOne, library, () => setLoading(false));
    };
    changeNetwork();
  }, [networkOne, library]);

  useEffect(() => {
    if (loadingRef.current) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [library]);

  useEffect(() => {
    dispatch(setStartSwapping(false));
  }, [dispatch]);

  const onChangeNetworkOne = async (option: INetwork) => {
    setLoading(true);
    dispatch(setFromNetwork(option));
    setNetworkOne(option);
    localStorage.setItem('toChainId', option.chainId);
  };

  const onChangeNetworkTwo = (option: INetwork) => {
    dispatch(setToNetwork(option));
    setNetworkTwo(option);
  };

  const onPrevious = () => {
    navigate('/select');
  };

  const onNext = () => {
    if (networkOne !== null && networkTwo !== null) {
      navigate('/tokens');
    }
  };

  return (
    <div className="network container">
      <div className="network__content">
        <CustomButton className="previous_btn" onClick={onPrevious}>
          <div>
            <img src={previousIcon} alt="Icon" className="me-2" />
            {t('Previous')}
          </div>
        </CustomButton>
        <Default>
          <GuidePet />
        </Default>
        <div className="network__content__steps">
          <p>
            <strong>{t('Step 1:')}</strong> {t('Select The Origin Network')}
          </p>
          <h6>{t('The network from which you want to send your assets.')}</h6>
          <NetworkSelectionOne
            options={Networks}
            selected={networkOne.name}
            onChange={onChangeNetworkOne}
            isChanging={loading}
          />
          <div style={{ position: 'relative' }}>
            <p className="mt-5">
              <strong>{t('Step 2:')}</strong> {t('Select The Destination Network')}
            </p>
            <h6>{t('The network to which you want to send your assets.')}</h6>
            {!loading ? (
              <NetworkSelectionTwo
                options={
                  networkOne.symbol === 'FUMA'
                    ? [Networks[1], Networks[2], Networks[3], Networks[4], Networks[5], Networks[6]]
                    : [Networks[0]]
                }
                onChange={onChangeNetworkTwo}
                networkOne={networkOne}
              />
            ) : (
              <div className="chain-loading">
                <Spinner></Spinner>
                <span>Switching to {networkOne.name}...</span>
              </div>
            )}
          </div>

          <CustomButton className="mt-5 next-btn" onClick={onNext} disabled={networkTwo === null}>
            {t('Next')}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
