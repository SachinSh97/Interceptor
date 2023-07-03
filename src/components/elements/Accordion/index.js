import Collapsible from 'react-collapsible';
import './Accordion.scss';

const Accordion = ({
  title,
  description,
  expandIcon,
  triggerDisabled,
  transitionTime = 200,
  rightContent,
  children,
  onOpen,
  onClose,
  onTriggerOpening,
}) => {
  const handleStopPropogation = (event) => event?.stopPropagation();

  const renderAccordionTrigger = () => (
    <>
      {expandIcon && (
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
      trigger={renderAccordionTrigger()}
      triggerTagName="div"
      triggerDisabled={!!children ? triggerDisabled : true}
      transitionTime={transitionTime}
      onOpen={onOpen}
      onClose={onClose}
      onTriggerOpening={onTriggerOpening}
    >
      {children}
    </Collapsible>
  );
};

export default Accordion;
