import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
import { INetwork } from '~/app/constants/interface';
import './networkselection.css';

type props = {
  options: Array<INetwork>;
  selected?: string;
  disabled?: string;
  onChange?: (option: INetwork) => void;
  networkOne?: any;
};

export default function NetworkSelection({ options, disabled, onChange, networkOne }: props) {
  const [currentNetwork, setCurrentNetwork] = useState<INetwork>();

  const handleChange = (option: INetwork) => {
    setCurrentNetwork(option);
    onChange(option);
  };

  const returnNull = () => {
    return;
  };

  useEffect(() => {
    setCurrentNetwork(null);
  }, [networkOne]);

  return (
    <div className="networkselection">
      <RadioGroup containerStyle={classNames('networkselection-container')} onChange={returnNull}>
        {options.map((option, index) => (
          <Radio
            key={index}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('networkselection-option', {
                  'networkselection-selected': option.name === currentNetwork?.name
                })}
                onClick={() => handleChange(option)}
              >
                <div>
                  <img src={option.img} alt="icon" />
                  {option.name}
                </div>
              </button>
            )}
            isDisabled={option.name === disabled}
          />
        ))}
      </RadioGroup>
    </div>
  );
}
