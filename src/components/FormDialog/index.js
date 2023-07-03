import { lazy, useState } from 'react';

import './FormDialog.scss';

const Dialog = lazy(() => import('../elements/Dialog'));
const TextField = lazy(() => import('../elements/TextField'));

const FormDialog = ({ open = true, onSubmit, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleOnChange = (event) => {
    const { name, value } = event?.target ?? {};
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      default:
        break;
    }
  };

  const handleOnKeyDown = (event) => {
    const { key } = event;
    switch (key) {
      case 'Enter':
        if (name) onSubmit?.({ name, description });
        break;
      case 'Escape':
        onClose?.();
        break;
      default:
        break;
    }
  };

  return (
    <Dialog
      className="project-form"
      open={open}
      hideCloseIcon={true}
      onClose={onClose}
      onKeyDown={handleOnKeyDown}
    >
      <div className="project-form_wrapper flex flex-column">
        <div className="project-form_field">
          <TextField
            name="name"
            type="text"
            label="Name"
            isRequired={true}
            placeholder="Enter name..."
            value={name}
            onChange={handleOnChange}
          />
        </div>
        <div className="project-form_field">
          <TextField
            name="description"
            type="textarea"
            label="Description"
            placeholder="Enter description..."
            rows={2}
            value={description}
            onChange={handleOnChange}
          />
        </div>
      </div>
      <small>Press 'Enter' to confirm or 'Escape' to cancel</small>
    </Dialog>
  );
};

export default FormDialog;
