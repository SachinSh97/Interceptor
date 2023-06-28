import { Suspense, lazy, useState } from 'react';

import './TabSidebar.scss';

const Loader = lazy(() => import('../elements/Loader'));
const Tabs = lazy(() => import('../elements/Tabs'));
const TabPanel = lazy(() => import('../elements/TabPanel'));

const Rules = lazy(() => import('../Rules'));

const TabSidebar = () => {
  const [activeFeatureTabIndex, setActiveFeatureTabIndex] = useState(0);

  const handleParentTabsOnClick = (activeIndex) => setActiveFeatureTabIndex(activeIndex);

  return (
    <Suspense fallback={<Loader />}>
      <div className="tabsidebar">
        <Tabs
          className="tabsidebar_feature-tabs"
          activeTabIndex={activeFeatureTabIndex}
          tabs={['Rules', 'Requests']}
          onClick={handleParentTabsOnClick}
        />
        <TabPanel value={activeFeatureTabIndex} index={0}>
          <Rules />
        </TabPanel>
      </div>
    </Suspense>
  );
};

export default TabSidebar;
