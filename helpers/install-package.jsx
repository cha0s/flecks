import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function PackageInstall({children, headless, pkg}) {
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">npm install {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        {children}
        <CodeBlock language="bash">yarn add {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="pnpm" label="pnpm">
        {children}
        <CodeBlock language="bash">pnpm add {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun">
        {children}
        <CodeBlock language="bash">bun add {pkg}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
