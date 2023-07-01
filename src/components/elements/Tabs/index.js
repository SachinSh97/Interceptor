import classNames from 'classnames';

import './Tabs.scss';

const Tabs = ({ className, tabs, activeTabIndex, onClick }) => {
  return (
    <div className={classNames('app-tabs', className)}>
      {tabs?.map((tab, index) => (
        <span
          key={index}
          className={classNames('app-tabs_tab', { active: activeTabIndex === index })}
          onClick={() => onClick(index)}
        >
          {tab}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
