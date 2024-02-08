import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Create({children, headless = false, pkg, type}) {
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">npm init @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        {children}
        <CodeBlock language="bash">yarn create @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        {children}
        <CodeBlock language="bash">pnpm create @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun">
        {children}
        <CodeBlock language="bash">bun create @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}