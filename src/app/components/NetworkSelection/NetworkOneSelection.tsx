import classNames from 'classnames';
import { Radio, RadioGroup } from 'react-custom-radio-buttons';
import { INetwork } from '~/app/constants/interface';
import './networkselection.css';

type props = {
  options: Array<INetwork>;
  selected?: string;
  disabled?: string;
  onChange?: (option: INetwork) => void;
  isChanging?: boolean;
};

export default function NetworkSelection({ options, selected, disabled, onChange, isChanging }: props) {
  const onClick = (option: any) => {
    if (!isChanging && option.name !== selected) {
      onChange(option);
    }
  };

  const emptyFunction = () => {
    return;
  };

  return (
    <div className="networkselection">
      <RadioGroup containerStyle={classNames('networkselection-container')} onChange={emptyFunction}>
        {options.map((option, index) => (
          <Radio
            key={index}
            value={option}
            render={({ isSelected }: any) => (
              <button
                className={classNames('networkselection-option', {
                  'networkselection-selected': option.name === selected
                })}
                onClick={() => onClick(option)}
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
