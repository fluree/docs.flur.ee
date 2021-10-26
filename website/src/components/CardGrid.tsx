import React from 'react';
import Card from './Card';


export default function CardGrid({ cardDetails }) {
  return (
    <section>
      <div className='container'>
        <div className='col'>
          <div className='row'>
            { cardDetails.map((props, index) => (
              <Card key={index} {...props} />
            ))}
          </div>
        </div>
      </div>
   </section>
 )
}