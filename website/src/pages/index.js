import React from 'react';
import clsx from 'clsx';

import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageCard from '../components/home_card/HomepageCard';
import { HomepageCardDetails } from '../components/home_card/HomepageCardDetails';

const HomepageHeader = () => {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">Fluree for Developers</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons} >
          <Link
            className="button button--secondary margin-horiz--lg"
            to="/docs/overview/getting_started">
            Get Started
          </Link>
          <Link
            className="button button--secondary margin-horiz--lg"
            to="/docs/overview/fluree_basics">
            Fluree Basics
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
      title={`${siteConfig.title}`}
      description={`${siteConfig.tagline}`}>
      <HomepageHeader />
      <section className='container homepage-cards'>
        <div className='row'>
          {HomepageCardDetails.map((props, idx) => (
            <HomepageCard key={idx} {...props} />
          ))}
        </div>
        <HomepageFeatures />
      </section>
    </Layout>
  );
}
