import React from 'react';
import styles from './Community.module.css';

export default function CommunityCard({Svg, title, description, link}) {
    return (
        <article className='col col--4 margin-vert--lg'>
            <div className={styles.communityCard} >
                <div className="text--left">
                    <Svg className={styles.communitySvg} alt={title} />
                </div>
                <div className="text--left padding-top--sm padding-right--lg padding-bottom--sm padding-left--sm">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>
            </div>
        </article>
    );
  }