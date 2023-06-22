import classNames from 'classnames';

import './Tag.scss';

const Tags = ({ type, content }) => {
  return <span className={classNames('tag', type)}>{content}</span>;
};
export default Tags;
