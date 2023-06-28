import { lazy, useState } from 'react';
import './Rules.scss';

const Button = lazy(() => import('../elements/Button'));
const Tabs = lazy(() => import('../elements/Tabs'));
const TabPanel = lazy(() => import('../elements/TabPanel'));

const Activity = lazy(() => import('../Activity'));
const Collection = lazy(() => import('../Collection'));

const RulesTabPane = () => {
  const [activeRuleTabIndex, setActiveRuleTabIndex] = useState(0);

  const handleTabsOnClick = (activeIndex) => setActiveRuleTabIndex(activeIndex);

  return (
    <div className="rules">
      <div className="rules_header">
        <div className="rules_header_title">CLIENT AGENT</div>
        <Button id="new-request-btn" content="New Rule" fullWidth={true} />
      </div>
      <Tabs
        className="rules_rules-tabs"
        activeTabIndex={activeRuleTabIndex}
        tabs={['Activity', 'Collections', 'Env']}
        onClick={handleTabsOnClick}
      />
      <TabPanel value={activeRuleTabIndex} index={0}>
        <Activity />
      </TabPanel>
      <TabPanel value={activeRuleTabIndex} index={1}>
        <Collection />
      </TabPanel>
      <TabPanel value={activeRuleTabIndex} index={2}>
        <Activity />
      </TabPanel>
    </div>
  );
};

export default RulesTabPane;
