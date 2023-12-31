import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function PackageInstall({pkg}) {
  return (
    <Tabs>
      <TabItem value="npm" label="npm" default>
        <CodeBlock language="bash">npm install {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn" default>
        <CodeBlock language="bash">yarn add {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun" default>
        <CodeBlock language="bash">bun install {pkg}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
