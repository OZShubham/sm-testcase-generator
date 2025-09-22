import React from 'react'
import './ComplianceStatus.css'

const ComplianceStatus = ({
  title,
  percentage,
  total,
  compliant,
  color,
  description
}) => {
  return (
    <div className="compliance-status">
      <div className="compliance-status__header">
        <span className="compliance-status__title">{title}</span>
        <span 
          className="compliance-status__percentage"
          style={{ color }}
        >
          {percentage}%
        </span>
      </div>
      <div className="compliance-status__bar">
        <div 
          className="compliance-status__progress"
          style={{ 
            width: `${percentage}%`, 
            backgroundColor: color 
          }}
        />
      </div>
      <div className="compliance-status__details">
        {compliant} of {total} test cases compliant
      </div>
      {description && (
        <div className="compliance-status__description">
          {description}
        </div>
      )}
    </div>
  )
}

export default ComplianceStatus
