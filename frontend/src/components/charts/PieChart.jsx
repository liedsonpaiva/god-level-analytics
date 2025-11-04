import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const DEFAULT_COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']

export const SimplePieChart = ({ data, dataKey, nameKey, height = 300, colors = DEFAULT_COLORS }) => {
  const renderLabel = (entry) => {
    const name = entry[nameKey]
    const percent = entry.percent || 0
    return `${name} (${(percent * 100).toFixed(0)}%)`
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey={dataKey}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [value, 'Quantidade']} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}