import classNames from 'classnames';

import './Button.scss';

const Button = ({ id, type, className, content, fullWidth, onClick }) => {
  return (
    <button id={id} className={classNames('app-btn', className, type, { fullWidth })} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
