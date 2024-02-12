import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Execute({children, cmd, headless = true}) {
  const normalized = Array.isArray(cmd) ? cmd : [cmd];
  const lines = (prefix) => normalized.map((cmd) => `${prefix} ${cmd}`).join('\n');
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">{lines('npx')}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
