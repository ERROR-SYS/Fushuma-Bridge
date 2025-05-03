import { useEffect, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CustomButton from '~/app/components/common/CustomButton';
import TokenSelection from '~/app/components/TokenSelection';
import { IToken } from '~/app/constants/interface';
import defaultTokens from '~/app/constants/tokenLists/tokenLists2.json';
import { setSelectedToken } from '~/app/modules/wallet/action';
import useGetWalletState from '~/app/modules/wallet/hooks';
import previousIcon from '~/assets/images/previous.svg';
import copyIcon from '~/assets/images/copy.png';
import addIcon from '~/assets/images/addSign.png';
import { useGetTokenBalances } from '~/app/hooks/wallet';
import './tokenlist.css';
import Spinner from '~/app/components/common/Spinner';
import { getErc20Contract, useRpcProvider } from '~/app/hooks/wallet';

export default function TokenList() {
  const { account } = useWeb3React();
  const [t] = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fromNetwork, toNetwork } = useGetWalletState();

  const [token, setToken] = useState(null);
  const [value, setValue] = useState('');
  const [isCustomToken, setIsCustomToken] = useState(false);
  const [customContract, setCustomContract] = useState<`0x${string}`>('0x');
  const [customName, setCustomName] = useState<string>('');
  const [customSymbol, setCustomSymbol] = useState<string>('');
  const [customDecimals, setCustomDecimals] = useState<string | number>();
  const [enableNext, setEnableNext] = useState(false);
  const [fetchedBalance, setFetchedBalance] = useState(false);
  const RPC_URL = useRpcProvider(fromNetwork?.rpcs);
  const nameRef = useRef<HTMLInputElement>();
  const symbolRef = useRef<HTMLInputElement>();
  const decimalsRef = useRef<HTMLInputElement>();

  const [isTooltipDisplayed, setIsTooltipDisplayed] = useState(false);

  const accountEllipsis = account ? `${account?.substring(0, 8)}...${account?.substring(account.length - 4)}` : null;

  const tokenList = defaultTokens.tokens.filter(
    (t: any) => t.address[`${fromNetwork.chainId}`] && t.address[`${toNetwork.chainId}`]
  );

  const pendingBalance = useGetTokenBalances(fromNetwork, toNetwork);

  const onChangeToken = (option: IToken) => {
    setToken(option.symbol);
    dispatch(setSelectedToken(option));
  };

  const onPrevious = () => {
    if (isCustomToken) {
      setIsCustomToken(false);
    } else {
      navigate('/network');
    }
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
    }, 2500);
  }

  const switchToCustom = () => {
    setIsCustomToken(true);
    setToken(null);
  };

  const onContractAddressChange = async (e: any) => {
    setCustomContract(e.target.value as `0x${string}`);
    if (e.target.value.startsWith('0x') && e.target.value.length === 42) {
      const contract = getErc20Contract(e.target.value, RPC_URL);
      try {
        if (nameRef.current && symbolRef.current && decimalsRef.current) {
          const contractName = await contract.name();
          const contractSymbol = await contract.symbol();
          const contractDecimals = await contract.decimals();
          nameRef.current.value = contractName;
          symbolRef.current.value = contractSymbol;
          decimalsRef.current.value = contractDecimals;
          setCustomName(contractName);
          setCustomSymbol(contractSymbol);
          setCustomDecimals(contractDecimals);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  const onNext = () => {
    if (isCustomToken) {
      if (customContract.startsWith('0x') && customContract.length === 42) {
        const option = {
          name: customName,
          symbol: customSymbol,
          logoURI: '',
          decimals: {
            '820': customDecimals,
            '56': customDecimals,
            '1': customDecimals,
            '137': customDecimals,
            '121224': customDecimals,
            '8453': customDecimals,
            '130': customDecimals,
            '42161': customDecimals
          },
          address: {
            '820': customContract,
            '56': customContract,
            '1': customContract,
            '137': customContract,
            '121224': customContract,
            '8453': customContract,
            '130': customContract,
            '42161': customContract
          },
          isCustom: true
        };
        dispatch(setSelectedToken(option));
        navigate('/swap');
      }
    } else {
      if (token !== null) {
        navigate('/swap');
      }
    }
  };

  useEffect(() => {
    if (
      isCustomToken &&
      customContract.startsWith('0x') &&
      customContract.length === 42 &&
      Number(customDecimals) > 0 &&
      customSymbol.length >= 3 &&
      customName.length >= 4
    ) {
      setEnableNext(true);
    } else if (!isCustomToken && token !== null) {
      setEnableNext(true);
    } else {
      setEnableNext(false);
    }
  }, [token, customContract, customDecimals, customSymbol, customName, isCustomToken]);

  useEffect(() => {
    if (!pendingBalance) {
      setFetchedBalance(true);
    }
  }, [pendingBalance]);

  useEffect(() => {
    setFetchedBalance(false);
  }, [account]);

  return (
    <div className="tokenlist container">
      <div className="tokenlist__content">
        <div className="tokenlist__content__steps">
          <p className="title">
            <strong>{t('Step 3:')}</strong> {t('Select The Asset To Transfer')}
          </p>
          <span className="connected-wallet-text">
            <div className="connected"></div>
            <b>Connected Wallet: </b>
            {accountEllipsis}
          </span>
          <img src={copyIcon} className="copy-icon" alt="copyIcon" onClick={handleClipboard} />
          {isTooltipDisplayed && <span className="me-copied">Copied</span>}
          {pendingBalance && !fetchedBalance ? (
            <div className="loading-balance">
              <br />
              <Spinner></Spinner>
              <span>Fetching Balances...</span>
              <br />
            </div>
          ) : isCustomToken ? (
            <div className="add-token">
              <p>Enter Contract Address:</p>
              <input type="text" placeholder="0x" onChange={(e) => onContractAddressChange(e)} />
              <p>Enter Token Name:</p>
              <input
                type="text"
                placeholder="ex: Fushuma Coin"
                onChange={(e) => setCustomName(e.target.value)}
                ref={nameRef}
              />
              <p>Enter Token Symbol:</p>
              <input
                type="text"
                placeholder="ex: FUMA"
                onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                ref={symbolRef}
              />
              <p>Enter Token Decimals:</p>
              <input
                type="number"
                placeholder="ex: 18"
                onChange={(e) => setCustomDecimals(e.target.value)}
                ref={decimalsRef}
              />
              {/* {unvalidFormat && <p style={{ color: '#ce1f2e' }}>Unvalid Address.</p>} */}
            </div>
          ) : (
            <div className="select-token">
              <input
                className="form-control tokenlist__content__filter"
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                placeholder={`🔍 ${t('Search for an asset')}`}
              />
              <TokenSelection
                options={tokenList.filter((item) => {
                  if (!value) return true;
                  if (
                    item.symbol.toLowerCase().includes(value.toLowerCase()) ||
                    item.symbol.toLowerCase().includes(value.toLowerCase()) ||
                    item.name.toLowerCase().includes(value.toLowerCase()) ||
                    item.name.toLowerCase().includes(value.toLowerCase())
                  ) {
                    return true;
                  }
                  return false;
                })}
                fromNetwork={fromNetwork}
                onChange={onChangeToken}
              />
              <button className="custom-token-btn" onClick={switchToCustom}>
                <div>
                  <img src={addIcon} alt="" />
                  <span>Transfer Custom Token</span>
                </div>
              </button>
            </div>
          )}
          <CustomButton className="mt-5" onClick={onNext} disabled={!enableNext}>
            {t('Next')}
          </CustomButton>
        </div>
      </div>
      <div>
        <CustomButton className="previous_btn" onClick={onPrevious}>
          <div>
            <img src={previousIcon} alt="previousIcon" className="me-2" />
            {t('Previous')}
          </div>
        </CustomButton>
      </div>
    </div>
  );
}
