import React from 'react'

export default function Card({ title, description, href }) {
   <div className="card-demo">
  <div className="card">
    <div className="card__header">
      <h3>{title}</h3>
    </div>
    <div className="card__body">
      <p>
      {description}
      </p>
    </div>
    <div className="card__footer">
               <a href={href} className="button button--secondary button--block">See All</a>
    </div>
  </div>
</div>
}