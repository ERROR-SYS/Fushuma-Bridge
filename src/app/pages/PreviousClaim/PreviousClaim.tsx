import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import BorderContainer from '~/app/components/common/BorderContainer';
import CustomButton from '~/app/components/common/CustomButton';
import Spinner from '~/app/components/common/Spinner';
import NetworkSelection from '~/app/components/NetworkSelection/NetworkOneSelection';
import { MIN_GAS_AMOUNT } from '~/app/constants';
import { INetwork } from '~/app/constants/interface';
import { Networks, NetworksObj } from '~/app/constants/strings';
import useActiveWeb3React from '~/app/hooks/useActiveWeb3React';
import useGetWeb3 from '~/app/hooks/useGetWeb3';
import useToast from '~/app/hooks/useToast';
import { useGetCLOBalance1 } from '~/app/hooks/wallet';
import { setFromNetwork } from '~/app/modules/wallet/action';
import { getBridgeContract, shortAddress } from '~/app/utils';
import { submitClaimAction } from '~/app/utils/apiHelper';
import getSignatures, { requiredSignatures } from '~/app/utils/getSignatures';
import { setSelectedToken } from '~/app/modules/wallet/action';
import { getErc20Contract } from '~/app/hooks/wallet';
import getWrappedTokenABI from '~/app/constants/abis/getWrappedToken.json';
import { switchNetwork } from '~/app/utils/wallet';
import previousIcon from '~/assets/images/previous.svg';
import { getBridgeAddress } from '~/app/utils/addressHelpers';
import { useRpcProvider } from '~/app/hooks/wallet';
import { ethers } from 'ethers';
import './previousclaim.css';

export default function PreviousClaim() {
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [pending, setPending] = useState<boolean>(false);
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [hash, setHash] = useState<string>('');

  const { fromNetwork } = useSelector((state: any) => state.walletBridge);
  const web3 = useGetWeb3(fromNetwork?.rpcs[0]);

  const { library, chainId, account } = useActiveWeb3React();
  const [networkOne, setNetworkOne] = useState(NetworksObj[chainId ?? 121224]);
  const [switchingNetwork, setSwitchingNetwork] = useState(false);
  const RPC_URL = useRpcProvider(NetworksObj[chainId]?.rpcs);

  const { toastError, toastWarning, toastSuccess } = useToast();

  const pendingRef = useRef(pending);
  const switchingNetworkRef = useRef(switchingNetwork);
  const handleClaimRef = useRef<any>();

  const cloBalance = useGetCLOBalance1();

  useEffect(() => {
    const get = async () => {
      web3.eth
        .getTransaction(hash)
        .then((response: any) => {
          if (response) {
            if (response.input.substring(0, 10) === '0x487cda0d') {
              const reciever = `0x${response.input.substring(34, 74)}`;
              //console.log(reciever);
              setDestinationAddress(reciever);
            }
          } else {
            setDestinationAddress('');
          }
        })
        .catch((error: any) => {
          console.error(error);
        });
    };
    if (web3 && hash !== '') {
      get();
    }
  }, [web3, hash]);

  useEffect(() => {
    pendingRef.current = pending;
    switchingNetworkRef.current = switchingNetwork;
  }, [pending, switchingNetwork]);

  handleClaimRef.current = async () => {
    try {
      const { signatures, respJSON } = await getSig3();
      if (signatures.length < requiredSignatures) {
        setPending(false);
        toastWarning(
          'Warning!',
          'Failed to get the signatures. Please check the network connection or select the correct network.'
        );
        return;
      }
      if (respJSON.chainId !== chainId.toString()) {
        const toNetwork = Networks.find((item) => item.chainId === respJSON.chainId);
        try {
          await switchNetwork(toNetwork, library);
          return;
        } catch (error) {
          toastWarning('Warning!', 'Error occured while switching the network.');
          setPending(false);
          return;
        }
      } else {
        if (!hash) {
          toastError('Transaction Hash is undefined.');
          return;
        }
        try {
          const bridgeAddr = await getBridgeAddress(chainId);
          const signer = await library.getSigner(account);
          const getTokenContract = await new ethers.Contract(bridgeAddr, getWrappedTokenABI, signer);
          const isTokenAdded = await getTokenContract.getToken(respJSON.originalToken, respJSON.originalChainID);
          let toAddress;
          if (Number(respJSON.originalChainID) === chainId) {
            toAddress = isTokenAdded[0];
          } else {
            toAddress = isTokenAdded[2];
          }
          let tokenDecimals;
          if (toAddress.startsWith('0x00000000000000000000000000000000000000')) {
            tokenDecimals = 18;
          } else {
            const tokenContract = getErc20Contract(toAddress, RPC_URL);
            tokenDecimals = await tokenContract.decimals();
          }
          const tokenData = {
            isCustom: true,
            toAddress: toAddress,
            decimals: {}
          } as {
            isCustom: boolean;
            toAddress: `0x${string}`;
            decimals: any;
          };
          tokenData.decimals[chainId] = tokenDecimals;
          dispatch(setSelectedToken(tokenData));
        } catch (e) {
          console.log(e);
        }
        if (cloBalance < MIN_GAS_AMOUNT[121224] && chainId === 121224) {
          submitClaimAction(hash, fromNetwork.chainId)
            .then((res: any) => {
              if (res?.isSuccess) {
                setPending(false);
                window.localStorage.removeItem('prevData');
                navigate('/transfer');
                setHash('');
                toastSuccess(t('Claimed successfully.'));
              } else {
                toastError(`Failed to claim. ${res.message}`);
                setPending(false);
                setHash('');
              }
            })
            .catch((err) => {
              toastError(t('Failed to claim. Please try again.'));
              console.log(err);
              setPending(false);
              setHash('');
            });
        } else {
          // const dest = destinationAddress === '' ? account : destinationAddress;
          const bridgeContract = await getBridgeContract(respJSON.bridge, library, account);

          let tx;
          if (respJSON.data && respJSON.toContract) {
            const gasLimit = await bridgeContract.estimateGas.claimToContract(
              respJSON.originalToken,
              respJSON.originalChainID,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              respJSON.toContract,
              respJSON.data,
              signatures,
              {
                value: 0
              }
            );

            tx = await bridgeContract.claimToContract(
              respJSON.originalToken,
              respJSON.originalChainID,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              respJSON.toContract,
              respJSON.data,
              signatures,
              {
                value: 0,
                gasLimit: gasLimit.add(30000)
              }
            );
          } else {
            const gasLimit = await bridgeContract.estimateGas.claim(
              respJSON.originalToken,
              respJSON.originalChainID,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              signatures,
              { value: 0 }
            );

            tx = await bridgeContract.claim(
              respJSON.originalToken,
              respJSON.originalChainID,
              hash,
              respJSON.to,
              respJSON.value,
              fromNetwork.chainId,
              signatures,
              { value: 0, gasLimit: gasLimit.add(30000) }
            );
          }

          const receipt = await tx.wait();
          if (receipt.status) {
            window.localStorage.removeItem('prevData');
            setPending(false);
            setHash('');
            navigate('/transfer');
            toastSuccess(t('Success!'), t('Claimed successfully.'));
          } else {
            console.log(receipt);
            setPending(false);
            toastError(t('Error!'), t('Failed to claim. Please try again.'));
          }
          setPending(false);
        }
      }
    } catch (err: any) {
      console.log(err);
      if (err.message.includes('Transaction already processed')) {
        toastError(t('Error!'), t('Transaction already claimed.'));
      } else {
        toastError(t('Error!'), t('Failed to claim. Please try again.'));
      }
      setPending(false);
    }
  };

  useEffect(() => {
    if (pendingRef.current) {
      handleClaimRef.current();
    } else if (switchingNetworkRef.current) {
      setSwitchingNetwork(false);
    }
  }, [library]);

  useEffect(() => {
    if (hash === '' || hash.length !== 66) {
      setDestinationAddress('');
    }
  }, [hash]);

  const onPrevious = () => {
    navigate('/select');
  };

  const onPreviousClaim = () => {
    setPending(true);
    handleClaimRef.current();
  };

  const switchNetworkCatch = () => {
    setNetworkOne(NetworksObj[chainId]);
    dispatch(setFromNetwork(NetworksObj[chainId]));
    setSwitchingNetwork(false);
  };

  const onChangeNetworkOne = async (option: INetwork) => {
    if (!switchingNetwork && option.name !== networkOne.name) {
      try {
        console.log(option);
        setSwitchingNetwork(true);
        setNetworkOne(option);
        dispatch(setFromNetwork(option));
        switchNetwork(option, library, switchNetworkCatch);
      } catch (e) {
        console.log(option);
        setNetworkOne(NetworksObj[chainId]);
        dispatch(setFromNetwork(NetworksObj[chainId]));
        setSwitchingNetwork(false);
      }
    }
  };

  async function getSig3() {
    const sig = await getSignatures(hash, fromNetwork.chainId);

    if (sig.signatures.length >= requiredSignatures) {
      return sig;
    }

    return { signatures: [], respJSON: {} };
  }

  return (
    <div className="previousclaim container">
      <div className="previousclaim__content">
        <div>
          <CustomButton className="previous_btn mt-4" onClick={onPrevious}>
            <div>
              <img src={previousIcon} alt="previousIcon" className="me-2" />
              Previous
            </div>
          </CustomButton>
        </div>
        <div className="previousclaim__content__steps">
          <h5>Claim Uncompleted Transaction</h5>
          <p className="mt-5">{t('Select Origin Network')}</p>
          {switchingNetwork ? (
            <div className="chain-loading">
              <Spinner></Spinner>
              <span>Switching to {networkOne.name}...</span>
            </div>
          ) : (
            <NetworkSelection
              options={Networks}
              selected={networkOne.name}
              onChange={onChangeNetworkOne}
              isChanging={switchingNetwork as boolean}
            />
          )}
        </div>
        <BorderContainer className="previousclaim__claiminfo">
          <div className="container">
            <p>Uncompleted Transaction Hash</p>
            <input
              className="previousclaim__claiminfo__hashInput"
              value={hash}
              onChange={(e) => setHash(e.target.value)}
              placeholder="Previous transaction hash"
              autoFocus
            />
            <p className="mt-5">Destination wallet</p>
            <h6>{shortAddress(destinationAddress, 21, 7)}</h6>
          </div>
          <button
            color="success"
            disabled={hash === '' || pending || switchingNetwork || destinationAddress === ''}
            className="previousclaim__claiminfo__button"
            onClick={onPreviousClaim}
          >
            {pending ? (
              <div>
                <Spinner className="me-2" size="sm" />
                {t(`Wait...`)}
              </div>
            ) : (
              t('Claim')
            )}
          </button>
        </BorderContainer>
      </div>
    </div>
  );
}
