import { useState, useEffect } from 'react'
import { analyticsService } from '../services/api'

export const useAnalyticsData = (endpoint, params = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hasData, setHasData] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        if (params.startDate && params.endDate) {
          const availability = await analyticsService.checkDataAvailability(
            params.startDate, 
            params.endDate
          )
          
          if (!availability.data.has_data) {
            setError('Não existem dados para o período selecionado')
            setHasData(false)
            setData(null)
            setLoading(false)
            return
          }
          
          setHasData(true)
        }

        const response = await endpoint(params)
        setData(response.data)
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err)
        
        if (err.response?.status === 404) {
          setError('Serviço temporariamente indisponível')
        } else if (err.message?.includes('Não existem dados')) {
          setError(err.message)
        } else {
          setError('Erro ao carregar dados do servidor')
        }
        
        setData(null)
        setHasData(false)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, JSON.stringify(params)])

  return { data, loading, error, hasData }
}