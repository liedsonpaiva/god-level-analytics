import React, { createContext, useContext, useState } from 'react'

const DateContext = createContext()

export function DateProvider({ children }) {
  const [globalDateRange, setGlobalDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  })

  const [dateError, setDateError] = useState(null)

  const validateDateRange = (startDate, endDate) => {
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
    
    setDateError(null)
    
    if (daysDiff > 180) {
      const errorMessage = 'O período selecionado é muito longo. O banco possui apenas 6 meses de dados.'
      setDateError(errorMessage)
      throw new Error(errorMessage)
    }
    return true
  }

  const updateDateRange = (newDateRange) => {
    try {
      validateDateRange(newDateRange.startDate, newDateRange.endDate)
      setGlobalDateRange(newDateRange)
    } catch (error) {
      console.warn('❌ Período inválido:', error.message)
    }
  }

  const clearDateError = () => {
    setDateError(null)
  }

  return (
    <DateContext.Provider value={{ 
      globalDateRange, 
      setGlobalDateRange: updateDateRange,
      validateDateRange,
      dateError,
      clearDateError
    }}>
      {children}
    </DateContext.Provider>
  )
}

export const useDate = () => {
  const context = useContext(DateContext)
  if (!context) {
    throw new Error('useDate deve ser usado dentro de um DateProvider')
  }
  return context
}