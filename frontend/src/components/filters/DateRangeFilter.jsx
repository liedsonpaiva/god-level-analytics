import React from 'react'

export const DateRangeFilter = ({ value, onChange }) => {
  const quickRanges = [
    { label: '7 dias', days: 7 },
    { label: '30 dias', days: 30 },
    { label: '90 dias', days: 90 },
    { label: 'Este mês', days: 'current_month' },
  ]

  const handleQuickRange = (days) => {
    const endDate = new Date()
    let startDate = new Date()
    
    if (days === 'current_month') {
      startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)
    } else {
      startDate.setDate(endDate.getDate() - days)
    }
    
    if (startDate > endDate) {
      startDate = new Date(endDate)
      startDate.setDate(endDate.getDate() - days)
    }
    
    onChange({ startDate, endDate })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('pt-BR')
  }

  const formatForInput = (date) => {
    if (!date) return ''
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleStartDateChange = (e) => {
    const newStartDate = new Date(e.target.value)
    const newEndDate = newStartDate > value.endDate ? new Date(newStartDate) : value.endDate
    onChange({ startDate: newStartDate, endDate: newEndDate })
  }

  const handleEndDateChange = (e) => {
    const newEndDate = new Date(e.target.value)
    const newStartDate = newEndDate < value.startDate ? new Date(newEndDate) : value.startDate
    onChange({ startDate: newStartDate, endDate: newEndDate })
  }

  const isValidDate = (date) => {
    return date instanceof Date && !isNaN(date)
  }

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>📅</span>
        <span>
          {isValidDate(value.startDate) && isValidDate(value.endDate) 
            ? `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`
            : 'Selecione um período'
          }
        </span>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Períodos Rápidos:
        </label>
        <div className="flex gap-2 flex-wrap">
          {quickRanges.map((range) => (
            <button
              key={range.label}
              onClick={() => handleQuickRange(range.days)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors bg-white"
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Período Personalizado:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Data inicial
            </label>
            <input
              type="date"
              value={isValidDate(value.startDate) ? formatForInput(value.startDate) : ''}
              onChange={handleStartDateChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              max={formatForInput(value.endDate)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">
              Data final
            </label>
            <input
              type="date"
              value={isValidDate(value.endDate) ? formatForInput(value.endDate) : ''}
              onChange={handleEndDateChange}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              min={formatForInput(value.startDate)}
              max={formatForInput(new Date())}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        {isValidDate(value.startDate) && isValidDate(value.endDate) && (
          <div>
            <strong>Período selecionado:</strong> {Math.ceil((value.endDate - value.startDate) / (1000 * 60 * 60 * 24))} dias
          </div>
        )}
      </div>
    </div>
  )
}