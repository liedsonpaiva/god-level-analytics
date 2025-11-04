import React from 'react'

export const InsightBadge = ({ insight }) => {
  const getConfig = (type) => {
    switch (type) {
      case 'success':
        return { emoji: '✅', color: 'text-success-600', bg: 'bg-success-50' }
      case 'warning':
        return { emoji: '⚠️', color: 'text-warning-600', bg: 'bg-warning-50' }
      case 'critical':
        return { emoji: '🚨', color: 'text-danger-600', bg: 'bg-danger-50' }
      default:
        return { emoji: 'ℹ️', color: 'text-primary-600', bg: 'bg-primary-50' }
    }
  }

  const { emoji, color, bg } = getConfig(insight.type)

  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg ${bg} border border-current border-opacity-20`}>
      <span className={`text-lg ${color}`}>{emoji}</span>
      <div className="flex-1">
        <h4 className={`font-medium ${color} text-sm`}>{insight.title}</h4>
        <p className="text-gray-600 text-sm">{insight.message}</p>
      </div>
    </div>
  )
}