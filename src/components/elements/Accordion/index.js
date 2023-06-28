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
}) => {
  const handleStopPropogation = (event) => event?.stopPropagation();

  const renderAccordionTrigger = () => (
    <>
      {expandIcon && (
        <div className="Collapsible__trigger_icon">
          <img src={expandIcon} alt="left-icon" />
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
        <div className="Collapsible__trigger_icon" onClick={handleStopPropogation}>
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
    >
      {children}
    </Collapsible>
  );
};

export default Accordion;
