import { lazy, useId } from 'react';
import classNames from 'classnames';

import './TextField.scss';

const Tag = lazy(() => import('../Tag'));

const TextField = ({
  id,
  className,
  type,
  name,
  label,
  rows,
  cols,
  placeholder,
  isRequired,
  helperText,
  fullWidth,
  value,
  onBlur,
  onChange,
}) => {
  const defaultId = useId();

  return (
    <div className={classNames('textfield', className, { fullWidth })}>
      {label && (
        <label htmlFor={id ?? defaultId} className="textfield_label">
          {label}
        </label>
      )}
      <Tag type={isRequired ? 'danger' : ''} content={isRequired ? 'REQUIRED' : 'OPTIONAL'} />
      {type === 'textarea' && (
        <textarea
          id={id ?? defaultId}
          className="textfield_input"
          name={name}
          placeholder={placeholder}
          cols={cols}
          rows={rows}
          spellCheck={false}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
      {type !== 'textarea' && (
        <input
          id={id ?? defaultId}
          className="textfield_input"
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
        />
      )}
      {helperText && <small className="textfield_helper-text">{helperText}</small>}
    </div>
  );
};

export default TextField;
