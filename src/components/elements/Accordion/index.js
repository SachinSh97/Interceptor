import Collapsible from 'react-collapsible';
import './Accordion.scss';

const Accordion = ({
  title,
  description,
  expandIcon,
  rightIcon,
  triggerDisabled,
  transitionTime = 200,
  rightOnClick,
  children,
}) => {
  const handleOnRightClick = (event) => {
    event?.stopPropagation();
    rightOnClick(event);
  };

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
      {rightIcon && (
        <div className="Collapsible__trigger_icon" onClick={handleOnRightClick}>
          <img src={rightIcon ?? ''} alt="left-icon" />
        </div>
      )}
    </>
  );
  return (
    <Collapsible
      trigger={renderAccordionTrigger()}
      triggerTagName="div"
      triggerDisabled={!!children ? triggerDisabled : true}
      transitionTime={transitionTime}>
      {children}
    </Collapsible>
  );
};

export default Accordion;
