import React from 'react';
import Link from '@docusaurus/Link';
import { CardDetails } from '../CardDetails.interface';

export default function HomepageCard({ title, description, link }: CardDetails
): JSX.Element {
    return (
        <article className="card">
            <Link to={link}>
                <div className="card__header">
                    <h3>
                        {title}
                    </h3>
                </div>
                <div className="card__body">
                    <p>
                        {description}
                    </p>
                </div>
            </Link>
        </article>
    );
}