import classNames from 'classnames';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
import { getTokenLogoLink } from '~/app/utils/getImageUrl';
import { useSelector } from 'react-redux';
import { AppState } from '~/app/core/store';
import './tokenselection.css';
import { useState } from 'react';
import { IToken } from '~/app/constants/interface';

type props = {
  options: Array<any>;
  fromNetwork?: any;
  onChange?: (option: any) => void;
  className?: string;
};

export default function TokenSelection({ options, fromNetwork, className, onChange }: props) {
  console.log(options);
  const { balance } = useSelector((state: AppState) => state.walletBridge);
  const [currentToken, setCurrentToken] = useState<IToken>();

  const clickEvent = (option: IToken) => {
    setCurrentToken(option);
    onChange(option);
  };

  const returnNull = () => {
    return;
  };

  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)} onChange={returnNull}>
        {options.map((option, index) => (
          <Radio
            key={`${option.address}-${index}`}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': currentToken === option
                })}
                onClick={() => clickEvent(option)}
              >
                <div>
                  <img className="tokenselection-logo" src={option.logoURI} alt="icon" />
                  {option.symbol}
                  <p>
                    <b>Balance: </b>
                    {Math.floor(balance[`${option.symbol}`] * 100000) / 100000}
                  </p>
                </div>
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
}

export const TokenSelection2 = ({ options, fromNetwork, className, onChange }: props) => {
  return (
    <div className="tokenselection">
      <RadioGroup containerStyle={classNames('tokenselection-container', className)}>
        {options.map((option, index) => (
          <Radio
            key={`${option.address}-${index}`}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('tokenselection-option', {
                  'tokenselection-selected': isSelected
                })}
                onClick={() => onChange(option)}
              >
                <div>
                  <img
                    className="tokenselection-logo"
                    src={getTokenLogoLink(option.address, option.chainId)}
                    alt="icon"
                  />
                  {option.symbol}
                </div>
                {`(${option.network})`}
              </button>
            )}
          />
        ))}
      </RadioGroup>
    </div>
  );
};
