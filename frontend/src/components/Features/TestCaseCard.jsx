import React from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import Button from '../UI/Button'
import './TestCaseCard.css'

const TestCaseCard = ({ testCase, onView, onEdit, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical': return '#ef4444'
      case 'high': return '#f59e0b'
      case 'medium': return '#2563eb'
      case 'low': return '#6b7280'
      default: return '#6b7280'
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return '#10b981'
      case 'generated': return '#2563eb'
      case 'in review': return '#f59e0b'
      case 'rejected': return '#ef4444'
      default: return '#6b7280'
    }
  }

  return (
    <div className="test-case-card">
      <div className="test-case-card__header">
        <div className="test-case-card__id">{testCase.id}</div>
        <div className="test-case-card__actions">
          <Button
            variant="ghost"
            size="small"
            icon={Eye}
            onClick={() => onView(testCase)}
          />
          <Button
            variant="ghost"
            size="small"
            icon={Edit}
            onClick={() => onEdit(testCase)}
          />
          <Button
            variant="ghost"
            size="small"
            icon={Trash2}
            onClick={() => onDelete(testCase.id)}
          />
        </div>
      </div>

      <div className="test-case-card__content">
        <h3 className="test-case-card__title">{testCase.title}</h3>
        <p className="test-case-card__description">{testCase.description}</p>

        <div className="test-case-card__meta">
          <div className="test-case-card__badge-group">
            <span 
              className="test-case-card__badge test-case-card__badge--priority"
              style={{ backgroundColor: getPriorityColor(testCase.priority) }}
            >
              {testCase.priority}
            </span>
            <span 
              className="test-case-card__badge test-case-card__badge--status"
              style={{ backgroundColor: getStatusColor(testCase.status) }}
            >
              {testCase.status}
            </span>
          </div>
        </div>

        <div className="test-case-card__compliance">
          {testCase.compliance.map((standard, index) => (
            <span key={index} className="test-case-card__compliance-tag">
              {standard}
            </span>
          ))}
        </div>

        <div className="test-case-card__footer">
          <span className="test-case-card__created">
            Created by {testCase.createdBy}
          </span>
          <span className="test-case-card__date">
            {new Date(testCase.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TestCaseCard
