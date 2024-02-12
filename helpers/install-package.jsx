import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

export default function PackageInstall({children, headless = true, pkg}) {
  return (
    <Tabs className={headless && 'headless'} groupId="package-manager">
      <TabItem value="npm" label="npm">
        {children}
        <CodeBlock language="bash">npm install {pkg}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
