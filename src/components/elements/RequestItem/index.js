import { lazy } from 'react';
import classNames from 'classnames';

import { getRequestColor } from '../../../selectors';
import { formatDateTime } from '../../../utils/localizationHelper';

import './RequestItem.scss';

const Tag = lazy(() => import('../Tag'));

const RequestItem = ({ active, requestDetail, rightContent, onClick }) => {
  const handleStopPropogation = (event) => event?.stopPropagation();
  return (
    <div
      className={classNames('request-item flex align-center justify-between', { active })}
      title={requestDetail?.name ?? ''}
      onClick={onClick}
    >
      <span className="flex flex-column">
        <span className="flex align-center">
          <Tag type={getRequestColor(requestDetail?.method ?? '')} content={requestDetail?.method ?? ''} />
          <span className="title">{requestDetail?.name ?? ''}</span>
        </span>
        {requestDetail?.timestamp && <span className="timestamp">{formatDateTime(requestDetail?.timestamp)}</span>}
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
