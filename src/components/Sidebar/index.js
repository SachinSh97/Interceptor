import { Suspense, lazy, useState } from 'react';

import './Sidebar.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Tabs = lazy(() => import('../elements/Tabs'));
const TabPanel = lazy(() => import('../elements/TabPanel'));
const Button = lazy(() => import('../elements/Button'));
const Collection = lazy(() => import('../Collection'));

const SidebarTab = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(1);

  const handleTabsOnClick = (activeIndex) => setActiveTabIndex(activeIndex);

  return (
    <Suspense fallback={<Loader />}>
      <div className="sidebar">
        <div className="sidebar_header">
          <div className="sidebar_header_title">CLIENT AGENT</div>
          <Button id="new-request-btn" content="New Request" fullWidth={true} />
        </div>
        <Tabs
          className="sidebar_rules-tabs"
          activeTabIndex={activeTabIndex}
          tabs={['Activity', 'Collections', 'Env']}
          onClick={handleTabsOnClick}
        />
        <TabPanel value={activeTabIndex} index={1}>
          <Collection />
        </TabPanel>
      </div>
    </Suspense>
  );
};

export default SidebarTab;
