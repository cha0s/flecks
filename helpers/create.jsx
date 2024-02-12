import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function Create({children, headless = true, pkg, type}) {
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">
          {
            'fleck' === type
              ? `npm init @flecks/${type} -w ${pkg}`
              : `npm init @flecks/${type} ${pkg}`
          }
        </CodeBlock>
      </TabItem>
    </Tabs>
  );
}
