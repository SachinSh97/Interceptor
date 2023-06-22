import classNames from 'classnames';

import './Button.scss';

const Button = ({ id, className, content, fullWidth, onClick }) => {
  return (
    <button id={id} className={classNames('app-btn', className, { fullWidth })} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
