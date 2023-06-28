import closeIcon from '../../../assets/Icons/close-icon.svg';
import './Dialog.scss';

const Dialog = ({ open, children, onClose }) => {
  return (
    <>
      <dialog className="dialog" open={open}>
        <img className="dialog_close-icon" src={closeIcon} alt="x" onClick={onClose} />
        {children}
      </dialog>
      {open && <div className="dialog_overlay" />}
    </>
  );
};

export default Dialog;
