import React from 'react'
import { Link } from 'react-router-dom'
import { Upload, Wand2, Eye } from 'lucide-react'
import './QuickActions.css'

const QuickActions = () => {
  const actions = [
    {
      to: '/upload',
      icon: Upload,
      title: 'Upload Requirements',
      description: 'Upload healthcare specifications and requirements',
      color: '#2563eb'
    },
    {
      to: '/generate',
      icon: Wand2,
      title: 'Generate Test Cases',
      description: 'AI-powered test case generation',
      color: '#10b981'
    },
    {
      to: '/test-cases',
      icon: Eye,
      title: 'View Test Cases',
      description: 'Manage and review generated test cases',
      color: '#f59e0b'
    }
  ]

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <Link
          key={action.to}
          to={action.to}
          className="quick-action"
        >
          <div 
            className="quick-action__icon"
            style={{ backgroundColor: action.color }}
          >
            <action.icon size={20} />
          </div>
          <h3 className="quick-action__title">{action.title}</h3>
          <p className="quick-action__description">{action.description}</p>
        </Link>
      ))}
    </div>
  )
}

export default QuickActions
