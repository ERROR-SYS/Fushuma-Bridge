import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import { getErc20Contract } from '~/app/hooks/wallet';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useToast from '~/app/hooks/useToast';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { registerToken } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import { useRpcProvider } from '~/app/hooks/wallet';
import './transfer.css';

export default function Transfer() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const { toastError } = useToast();
  const { account, chainId } = useActiveWeb3React();
  const { selectedToken, toNetwork } = useGetWalletState();
  const RPC_URL = useRpcProvider(toNetwork?.rpcs);
  const [tokenSymbol, setTokenSymbol] = useState();

  const fetchSymbolRef = useRef(null);

  useEffect(() => {
    if (chainId === Number(toNetwork.chainId)) {
      fetchSymbolRef.current();
    }
  }, [selectedToken, chainId, toNetwork]);

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  fetchSymbolRef.current = async () => {
    if (selectedToken.isCustom) {
      const contract = getErc20Contract(selectedToken.toAddress, RPC_URL);
      const contractSymbol = await contract.symbol();
      setTokenSymbol(contractSymbol);
    } else if (!selectedToken.address[toNetwork.chainId].startsWith('0x00000000000000000000000000000000000000')) {
      const contract = getErc20Contract(selectedToken.address[toNetwork.chainId], RPC_URL);
      const contractSymbol = await contract.symbol();
      setTokenSymbol(contractSymbol);
    } else {
      setTokenSymbol(selectedToken.symbol);
    }
  };

  const onSelectToken = async () => {
    if (chainId === Number(toNetwork.chainId)) {
      if (selectedToken.isCustom) {
        registerToken(selectedToken.toAddress, tokenSymbol, selectedToken.decimals[toNetwork.chainId], toNetwork);
      } else {
        registerToken(
          selectedToken.address[toNetwork.chainId],
          tokenSymbol,
          selectedToken.decimals[toNetwork.chainId],
          toNetwork
        );
      }
    } else {
      toastError(`Please switch to ${toNetwork.name} to add this token.`);
    }
  };

  const onPrevious = () => {
    navigate('/');
  };

  return (
    <div className="transfer container">
      <div className="transfer__content">
        <CustomButton className="previous_btn" onClick={onPrevious}>
          <div>
            <img src={previousIcon} alt="previousIcon" className="me-2" />
            {t('Previous')}
          </div>
        </CustomButton>

        <div className="transfer__content__steps">
          <h4>{t('Transfer Complete!')}</h4>
          {(selectedToken.toAddress
            ? !selectedToken.toAddress.startsWith('0x00000000000000000000000000000000000000')
            : !selectedToken.address[toNetwork.chainId].startsWith('0x00000000000000000000000000000000000000')) && (
            <>
              <h6 className="mt-1">
                You don&apos;t see your <b>{tokenSymbol}</b>?
              </h6>
              <h6 className="mt-3">
                Add them to your wallet by clicking <button onClick={onSelectToken}>here</button>!
              </h6>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
