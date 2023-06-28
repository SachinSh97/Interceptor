import { useId, lazy } from 'react';
import classNames from 'classnames';
import Select from 'react-select';

import './Select.scss';

const Tag = lazy(() => import('../Tag'));

const CustomSelect = ({
  id,
  className,
  name,
  label,
  helperText,
  placeholder,
  options,
  getOptionLabel,
  isRequired,
  value,
  onChange,
  ...props
}) => {
  const defaultId = useId();

  const handleOnChange = (option) => onChange({ target: { name, value: option } });
  return (
    <div className={classNames('select', className)}>
      {label && (
        <label htmlFor={id ?? defaultId} className="select_label">
          {label}
        </label>
      )}
      <Tag type={isRequired ? 'danger' : ''} content={isRequired ? 'REQUIRED' : 'OPTIONAL'} />
      <Select
        classNamePrefix="select_field"
        id={id}
        name={name}
        placeholder={placeholder}
        options={options}
        getOptionLabel={getOptionLabel}
        value={value}
        onChange={handleOnChange}
        {...props}
      />
      {helperText && <small className="select_helper-text">{helperText}</small>}
    </div>
  );
};

export default CustomSelect;
