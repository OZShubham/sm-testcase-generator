import React from 'react'
import clsx from 'clsx'
import './Card.css'

const Card = ({
  children,
  className,
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  ...props
}) => {
  const cardClass = clsx(
    'card',
    `card--padding-${padding}`,
    `card--shadow-${shadow}`,
    {
      'card--hover': hover
    },
    className
  )

  return (
    <div className={cardClass} {...props}>
      {children}
    </div>
  )
}

export default Card
