import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

import Flecks from './flecks';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Flecks />
        <Heading as="h1" className="hero__title">
          Craft modular apps with ease
        </Heading>
        <p className="hero__subtitle">Uncomplicated, efficient, and customizable</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/"
          >
            Let&apos;s go!
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Build a flexible and powerful application in no time"
      description="flecks is an exceptionally-extensible fullstack application production system. Its true purpose is to make application development a more joyful endeavor. Intelligent defaults combined with a highly dynamic structure motivate consistency while allowing you to easily express your own architectural opinions."
    >
      <HomepageHeader />
    </Layout>
  );
}
