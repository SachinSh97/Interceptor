import classNames from 'classnames';

import './Tabs.scss';

const Tabs = ({ className, tabs, activeTabIndex = 0, onClick }) => {
  return (
    <div className={classNames('app-tabs', className)}>
      {tabs?.map((tab, index) => (
        <span
          key={tab}
          className={classNames('app-tabs_tab', { active: activeTabIndex === index })}
          onClick={() => onClick(index)}>
          {tab}
        </span>
      ))}
    </div>
  );
};

export default Tabs;
