import { lazy } from 'react';
import './Content.scss';

const MockRequestForm = lazy(() => import('../MockRequestForm'));

const Content = () => {
  return (
    <div className="flex content">
      <div className="content_left">
        <MockRequestForm />
      </div>
      <div className="vertical-divider" />
      <div className="content_right"></div>
    </div>
  );
};

export default Content;
