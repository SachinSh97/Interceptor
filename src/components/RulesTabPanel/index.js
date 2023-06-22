import { lazy, useState } from 'react';
import './RulesTabPanel.scss';

const Button = lazy(() => import('../elements/Button'));
const Tabs = lazy(() => import('../elements/Tabs'));
const TabPanel = lazy(() => import('../elements/TabPanel'));

const ActivityTabPanel = lazy(() => import('../ActivityTabPanel'));
const CollectionTabPanel = lazy(() => import('../CollectionTabPanel'));

const RulesTabPane = () => {
  const [activeRuleTabIndex, setActiveRuleTabIndex] = useState(0);

  const handleTabsOnClick = (activeIndex) => setActiveRuleTabIndex(activeIndex);

  return (
    <div className="rules-tab-panel">
      <div className="rules-tab-panel_header">
        <div className="rules-tab-panel_header_title">CLIENT AGENT</div>
        <Button id="new-request-btn" content="New Rule" fullWidth={true} />
      </div>
      <Tabs
        className="rules-tab-panel_rules-tabs"
        activeTabIndex={activeRuleTabIndex}
        tabs={['Activity', 'Collections', 'Env']}
        onClick={handleTabsOnClick}
      />
      <TabPanel value={activeRuleTabIndex} index={0}>
        <ActivityTabPanel />
      </TabPanel>
      <TabPanel value={activeRuleTabIndex} index={1}>
        <CollectionTabPanel />
      </TabPanel>
      <TabPanel value={activeRuleTabIndex} index={2}>
        <ActivityTabPanel />
      </TabPanel>
    </div>
  );
};

export default RulesTabPane;
