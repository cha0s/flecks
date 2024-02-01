import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Run({children, cmd, headless = false}) {
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">npm run {cmd}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        {children}
        <CodeBlock language="bash">yarn run {cmd}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        {children}
        <CodeBlock language="bash">pnpm run {cmd}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun">
        {children}
        <CodeBlock language="bash">bun run {cmd}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
