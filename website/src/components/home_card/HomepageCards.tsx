import React from 'react';
import HomepageCard from '../../components/home_card/HomepageCard';
import { HomepageCardDetails } from '../../components/home_card/HomepageCardDetails';
import styles from './homepagecard.module.css';

export default function HomepageCards(): JSX.Element {
    return (
        <section className={styles.sectionContainer}>
            <div className='container'>
                <h6>GET STARTED</h6>
                <h2>Everything you need to run Fluree</h2>
                <aside>Select a topic to learn more</aside>
                <div className='row'>
                    {HomepageCardDetails.map((props, idx) => (
                        <HomepageCard key={idx} {...props} />
                    ))}
                </div>
            </div>
        </section>
    )
}