import {React, useFlecks} from '@flecks/react';
import {
  Tab,
  Tabs,
  TabList,
  TabPanel,
} from '@flecks/react/tabs';

function Login() {
  const flecks = useFlecks();
  const strategies = Object.entries(flecks.invokeMergeUnique('@flecks/passport-react.strategies'));
  return (
    <Tabs>
      <TabList>
        {strategies.map(([tab]) => <Tab key={tab}>{tab}</Tab>)}
      </TabList>
      <div className="behaved__tab-panels">
        {strategies.map(([tab, panel]) => <TabPanel key={tab}>{panel}</TabPanel>)}
      </div>
    </Tabs>
  );
}

export default Login;
