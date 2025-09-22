import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'
import './StatsWidget.css'

const StatsWidget = ({
  title,
  value,
  change,
  trend = 'up',
  icon: Icon,
  color = '#2563eb'
}) => {
  return (
    <div className="stats-widget">
      <div className="stats-widget__header">
        <span className="stats-widget__title">{title}</span>
        <div className="stats-widget__icon" style={{ backgroundColor: color }}>
          <Icon size={16} />
        </div>
      </div>
      <div className="stats-widget__value">{value}</div>
      <div className={`stats-widget__change stats-widget__change--${trend}`}>
        {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {change}
      </div>
    </div>
  )
}

export default StatsWidget
