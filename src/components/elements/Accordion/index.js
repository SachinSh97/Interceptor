import Collapsible from 'react-collapsible';
import './Accordion.scss';
import { useState } from 'react';

const Accordion = ({
  id,
  title,
  description,
  expandIcon,
  shrinkIcon,
  triggerDisabled,
  transitionTime = 200,
  rightContent,
  children,
  onOpen,
  onClose,
  onTriggerOpening,
}) => {
  const [isExpanded, setIsExpended] = useState(false);

  const handleStopPropogation = (event) => event?.stopPropagation();

  const handleOnOpen = () => {
    setIsExpended(true);
    onOpen();
  };

  const handleOnClose = () => {
    setIsExpended(false);
    onClose();
  };

  const renderAccordionTrigger = () => (
    <>
      {expandIcon && shrinkIcon ? (
        <div className="Collapsible__trigger_left-icon">
          <img className="left-icon" src={isExpanded ? expandIcon : shrinkIcon} alt="left-icon" />
        </div>
      ) : (
        <div className="Collapsible__trigger_left-icon">
          <img className="left-icon" src={expandIcon} alt="left-icon" />
        </div>
      )}
      <div className="Collapsible__trigger_content">
        <span className="title">{title ?? ''}</span>
        {description && (
          <span className="description" title={description ?? ''}>
            {description ?? ''}
          </span>
        )}
      </div>
      {rightContent && (
        <div className="Collapsible__trigger_right-icon" onClick={handleStopPropogation}>
          {rightContent}
        </div>
      )}
    </>
  );

  return (
    <Collapsible
      id={id}
      trigger={renderAccordionTrigger()}
      triggerTagName="div"
      triggerDisabled={!!children ? triggerDisabled : true}
      transitionTime={transitionTime}
      onOpen={handleOnOpen}
      onClose={handleOnClose}
      onTriggerOpening={onTriggerOpening}
    >
      {children}
    </Collapsible>
  );
};

Accordion.defaultProps = {
  id: '',
  onOpen: () => {},
  onClose: () => {},
  onTriggerOpening: () => {},
};

export default Accordion;
