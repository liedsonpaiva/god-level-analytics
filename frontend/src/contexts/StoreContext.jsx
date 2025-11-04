import React, { createContext, useContext, useState, useEffect } from 'react'
import { analyticsService } from '../services/api.js'

const StoreContext = createContext()

export function StoreProvider({ children }) {
  const [selectedStores, setSelectedStores] = useState([])
  const [allStores, setAllStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadAllStores()
  }, [])

  const loadAllStores = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await analyticsService.getAllStores()
      setAllStores(response.data.data || [])
      
      if (response.data.data && response.data.data.length > 0) {
        const initialStores = response.data.data.slice(0, 3).map(store => store.id)
        setSelectedStores(initialStores)
      }
    } catch (err) {
      console.error('❌ Erro ao carregar lojas:', err)
      setError('Erro ao carregar lista de lojas')
    } finally {
      setLoading(false)
    }
  }

  const toggleStoreSelection = (storeId) => {
    setSelectedStores(prev => {
      if (prev.includes(storeId)) {
        return prev.filter(id => id !== storeId)
      } else {
        if (prev.length >= 5) {
          alert('Máximo de 5 lojas podem ser comparadas simultaneamente')
          return prev
        }
        return [...prev, storeId]
      }
    })
  }

  const clearSelectedStores = () => {
    setSelectedStores([])
  }

  const selectStoresByRegion = (city) => {
    const storesInCity = allStores
      .filter(store => store.city === city)
      .map(store => store.id)
    
    if (storesInCity.length > 0) {
      setSelectedStores(storesInCity.slice(0, 5))
    }
  }

  const value = {
    selectedStores,
    allStores,
    loading,
    error,
    toggleStoreSelection,
    clearSelectedStores,
    selectStoresByRegion,
    reloadStores: loadAllStores
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider')
  }
  return context
}