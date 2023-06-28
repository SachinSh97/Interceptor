import { lazy } from 'react';
import classNames from 'classnames';

import { getRequestColor } from '../../../selectors';

import './RequestItem.scss';

const Tag = lazy(() => import('../Tag'));

const RequestItem = ({ title, active, method, timestamp, rightContent, onClick }) => {
  const handleStopPropogation = (event) => event?.stopPropagation();
  return (
    <div
      className={classNames('request-item flex align-center justify-between', { active })}
      title={title}
      onClick={onClick}
    >
      <span className="flex flex-column">
        <span className="flex align-center">
          <Tag type={getRequestColor(method ?? '')} content={method ?? ''} />
          <span className="title">{title ?? ''}</span>
        </span>
        {timestamp && <span className="timestamp">{timestamp}</span>}
      </span>
      {rightContent && (
        <span className="icon" onClick={handleStopPropogation}>
          {rightContent}
        </span>
      )}
    </div>
  );
};

export default RequestItem;
