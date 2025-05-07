import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import { MIN_GAS_AMOUNT } from '~/app/constants';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useClaim from '~/app/hooks/useClaim';
import useToast from '~/app/hooks/useToast';
import { useGetCLOBalance1 } from '~/app/hooks/wallet';
import useGetWalletState from '~/app/modules/wallet/hooks';
import { submitClaimAction } from '~/app/utils/apiHelper';
import getSignatures, { requiredSignatures } from '~/app/utils/getSignatures';
import { useSelector } from 'react-redux';
import { blockConfirmations } from '~/app/constants/config';
import ninja from '~/assets/images/ninja-transfer.png';
import shadow from '~/assets/images/ninja-shadow.png';
import './claim.css';

type props = {
  succeed: boolean;
  address?: string;
  confirmedCounts?: number;
  totalBlockCounts?: number;
  web3?: any;
  isApproving: boolean;
  isAdding: boolean;
  isCreating: boolean;
  isTransfering: boolean;
};

export default function Claim({ succeed, totalBlockCounts, isApproving, isAdding, isCreating, isTransfering }: props) {
  const [t] = useTranslation();
  const { chainId } = useActiveWeb3React();
  const navigate = useNavigate();

  const [pending, setPending] = useState(false);

  const { hash, fromNetwork, swapType, toNetwork, selectedToken } = useGetWalletState();
  const cloBalance = useGetCLOBalance1();
  const { onSimpleClaim, onAdvancedClaim } = useClaim();
  const { toastError, toastSuccess } = useToast();
  const [waitingMsg, setWaitingMsg] = useState('Fetching bridge data...');

  const { start_swapping, confirmedBlockCounts } = useSelector((state: any) => state.walletBridge);

  const dispBNumber =
    !start_swapping && confirmedBlockCounts !== 0 ? blockConfirmations[chainId] : confirmedBlockCounts;

  useEffect(() => {
    if (isAdding) {
      setWaitingMsg(`Adding ${selectedToken.symbol} to the bridge...`);
    } else if (isCreating) {
      setWaitingMsg(`Creating wrapped version of ${selectedToken.symbol}...`);
    } else if (isApproving) {
      setWaitingMsg('Please approve the transfer.');
    } else if (succeed) {
      setWaitingMsg(`Your ${selectedToken.symbol} are now on ${toNetwork.name}!`);
    } else if (isTransfering) {
      setWaitingMsg(`Transfering your ${selectedToken.symbol}...`);
    } else {
      setWaitingMsg('Fetching bridge data...');
    }
  }, [isAdding, isCreating, isApproving, isTransfering, succeed, selectedToken, toNetwork]);

  const onClaim = async () => {
    if (hash === '') {
      return;
    }
    setPending(true);

    if (cloBalance < MIN_GAS_AMOUNT[121224] && chainId === 121224) {
      submitClaimAction(hash, fromNetwork.chainId)
        .then((res: any) => {
          if (res?.isSuccess) {
            setPending(false);
            window.localStorage.removeItem('prevData');
            navigate('/transfer');
            toastSuccess(t('Claimed successfully.'));
          } else {
            toastError(`Failed to claim. ${res.message}`);
            setPending(false);
          }
        })
        .catch((err) => {
          toastError(t('Failed to claim. Please try again.'));
          setPending(false);
        });
    } else {
      const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

      if (signatures.length < requiredSignatures) {
        setPending(false);
        toastError('Failed to fetch signatures.');
        return;
      }

      if (respJSON.chainId !== chainId.toString()) {
        toastError(`You are in wrong network. Please switch to ${toNetwork.name}.`);
        setPending(false);
        return;
      }

      if (swapType === 'swap') handleClaim(signatures, respJSON);
      else if (swapType === 'advanced-swap') handleAdvancedClaim(signatures, respJSON);
    }
  };

  async function handleAdvancedClaim(signatures: any, respJSON: any) {
    setPending(true);
    try {
      // const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);

      // if (signatures.length < 3) {
      //   setPending(false);
      //   toastError('Failed to get signature.');
      //   return;
      // }
      try {
        const receipt = await onAdvancedClaim(respJSON, hash, fromNetwork.chainId, signatures);
        if (receipt.status) {
          // await handleSetPending();
          setPending(false);
          window.localStorage.removeItem('prevData');
          navigate('/transfer');
          toastSuccess(t('Claimed successfully.'));
        } else {
          setPending(false);
        }
      } catch (error) {
        setPending(false);
        toastError(t('Failed to claim. Please try again.'));
      }
    } catch (err) {
      setPending(false);
      toastError(t('Failed to get signature. Please try again.'));
    }
  }

  async function handleClaim(signatures: any, respJSON: any) {
    setPending(true);

    try {
      // const { signatures, respJSON } = await getSignatures(hash, fromNetwork.chainId);
      // if (signatures.length < 3) {
      //   setPending(false);
      //   toastError('Invalid signature.');
      //   return;
      // }
      const receipt = await onSimpleClaim(respJSON, hash, fromNetwork.chainId, signatures);
      if (receipt.status) {
        // await handleSetPending();
        setPending(false);
        window.localStorage.removeItem('prevData');
        navigate('/transfer');
        toastSuccess(t('Claimed successfully.'));
      } else {
        setPending(false);
      }
    } catch (err) {
      toastError(t('Failed to get signature. Please try again.'));
      setPending(false);
    }
  }

  // const handleGetFreeCLO = () => {
  //   window.open(faucetLink, '_blank');
  // };

  return (
    <div className="claim container">
      <div className="claim__content">
        <div className="claim__content--blockbox">
          {start_swapping && (
            <div className="energy-ball">
              <span className="block">Block</span>
              <span className="number">{dispBNumber}</span>
            </div>
          )}
          <img src={ninja} className="ninja" alt="ninja" />
          <img src={shadow} className="shadow-ninja" alt="ninja-shadow" />
        </div>
        <div className="claim__content--text">
          <h4>{waitingMsg}</h4>
          <p>
            {succeed
              ? 'You can now claim your transaction.'
              : `${totalBlockCounts} block confirmations are needed to claim this transaction.`}
          </p>
          {/* {(cloBalance < MIN_GAS_AMOUNT[820] || cloBalance < MIN_GAS_AMOUNT[199]) &&
            chainId === Number(toNetwork.chainId) &&
            pending && <p>{t(`Please wait, we are claiming for you...`)}</p>} */}

          {succeed && (
            <CustomButton className="claim__claimbtn" disabled={pending} onClick={onClaim}>
              {pending ? (
                <div>
                  <Spinner className="me-2" size="sm" />
                  {t(`Wait...`)}
                </div>
              ) : (
                t('Claim')
              )}
            </CustomButton>
          )}
          {/* {succeed && cloBalance === 0 && Number(toNetwork.chainId) === 820 && (
            <CustomButton className="claim__getclo" onClick={handleGetFreeCLO}>
              {t('Get CLO')}
            </CustomButton>
          )} */}
        </div>
      </div>
    </div>
  );
}
