import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Create({pkg, type}) {
  return (
    <Tabs>
      <TabItem value="npm" label="npm">
        <CodeBlock language="bash">npx @flecks/create-{type} {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="Yarn">
        <CodeBlock language="bash">yarn create @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
      <TabItem value="bun" label="Bun">
        <CodeBlock language="bash">bun create @flecks/{type} {pkg}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
