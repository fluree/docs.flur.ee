import React from 'react';
import Layout from '@theme/Layout';
import CommunityCard from './CommunityCard';
import styles from './Community.module.css';

const CommunityList = [
  {
    title: 'Github Discussions',
    Svg: require('../../../static/img/github-icon-light.svg').default,
    description: (
      <>
        Long-lived conversations about Fluree, feature requests, ideas, Fluree love, etc. 
      </>
    ),
    link: 'https://github.com/fluree/db/discussions'
  },
  {
    title: 'Fluree Slack',
    Svg: require('../../../static/img/Slack_Mark.svg').default,
    description: (
      <>
        Come join our community members and Fluree teammates for realtime chat. 
      </>
    ),
    link: 'https://launchpass.com/flureedb'
  },
  {
    title: 'YouTube',
    Svg: require('../../../static/img/youtube-icon.svg').default,
    description: (
      <>
        All the Fluree video content lives on our Youtube. Come check it out. 
      </>
    ),
    link: 'https://youtube.com/c/fluree'
  },
  {
    title: 'Github',
    Svg: require('../../../static/img/github-icon-light.svg').default,
    description: (
      <>
        Where all the magic happens. All our source code lives here. Come check out our repos, projects, and get involved!
      </>
    ),
    link: 'https://github.com/fluree'
  },
  {
    title: 'Reddit',
    Svg: require('../../../static/img/Reddit_Mark_OnWhite.svg').default,
    description: (
      <>
        Join us on the r/Fluree reddit page.   
      </>
    ),
    link: 'https://www.reddit.com/r/Fluree/'
  }
];

export default function Community(){
  return (
    <Layout>
      <main className={styles.community}>
        <div className="container">
          <div className="row">
            {CommunityList.map((props, idx) => (
              <CommunityCard key={idx} {...props} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
