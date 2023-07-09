import { lazy } from 'react';

import './ConfirmationDialog.scss';

const Dialog = lazy(() => import('../elements/Dialog'));
const Button = lazy(() => import('../elements/Button'));

const ConfirmationDialog = ({ open, content, onClose, onConfirm }) => {
  return (
    <Dialog className="confirmation-dialog" open={open} onClose={onClose}>
      <div className="confirmation-dialog_content">{content}</div>
      <div className="flex justify-end confirmation-dialog_footer">
        <Button fullWidth={true} content="Confirm" onClick={onConfirm} />
        <Button fullWidth={true} type="secondary" content="Cancel" onClick={onClose} />
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
