import React from 'react';
import Link from '@docusaurus/Link';

const CardDetails = [
  {
    title: 'Network Infrastructure',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    to: '/docs/concepts/infrastructure/network_infrastructure/',
  },
  {
    title: 'Auth',  
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    to: '/docs/concepts/identity/auth_records/'
  },
  {
    title: 'Smart Functions',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    to: '/docs/concepts/smart-functions/smartfunctions/'
  },
  {
    title: 'Analytical Queries',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    to: '/docs/concepts/analytical-queries/inner-joins-in-fluree/'
  },
]

const Card = ({ title, description, to }) => {
  return(
  <>
   <Link to={to} className="button button--secondary button--block box__a margin--md">
     <div className="card-demo">
  <div className="card">
    <div className="card__header">
      <h3>{title}</h3>
    </div>
    <div className="card__body text__body">
      <p>
      {description}
      </p>
    </div>
    <div className="card__footer">
    </div>
  </div>
    </div>
    </Link>
    </>
);
}

export default function CardGrid() {
  return (
    <section>
      <div className='container'>
        <div className='col col--6'>
          <div className='row'>
            <Card title description to ></Card>
          </div>
        </div>
      </div>
   </section>
 )
}