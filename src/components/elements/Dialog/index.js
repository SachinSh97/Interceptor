import classNames from 'classnames';

import closeIcon from '../../../assets/Icons/close-icon.svg';
import './Dialog.scss';

const Dialog = ({ className, open, hideCloseIcon, children, onKeyDown, onClose }) => {
  return (
    <>
      <dialog
        className={classNames('dialog', className, { open })}
        open={open}
        onKeyDown={onKeyDown}
      >
        {!hideCloseIcon && (
          <img className="dialog_close-icon" src={closeIcon} alt="x" onClick={onClose} />
        )}
        {children}
      </dialog>
      {open && <div className="dialog_overlay" onClick={onClose} />}
    </>
  );
};

export default Dialog;
