import React from 'react'
import { Wand2, FileCheck, Upload, Edit } from 'lucide-react'
import './RecentActivity.css'

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'generation': return Wand2
      case 'approval': return FileCheck
      case 'upload': return Upload
      case 'update': return Edit
      default: return FileCheck
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'generation': return '#2563eb'
      case 'approval': return '#10b981'
      case 'upload': return '#f59e0b'
      case 'update': return '#8b5cf6'
      default: return '#6b7280'
    }
  }

  return (
    <div className="recent-activity">
      <div className="recent-activity__header">
        <h3 className="recent-activity__title">Recent Activity</h3>
      </div>
      <div className="recent-activity__list">
        {activities.map((activity) => {
          const Icon = getActivityIcon(activity.type)
          const color = getActivityColor(activity.type)
          
          return (
            <div key={activity.id} className="recent-activity__item">
              <div 
                className="recent-activity__icon"
                style={{ backgroundColor: color }}
              >
                <Icon size={14} />
              </div>
              <div className="recent-activity__content">
                <div className="recent-activity__action">{activity.action}</div>
                <div className="recent-activity__document">{activity.document}</div>
                <div className="recent-activity__meta">
                  <span>{activity.time}</span>
                  <span>•</span>
                  <span>{activity.user}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity
