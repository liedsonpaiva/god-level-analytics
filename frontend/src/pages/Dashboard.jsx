import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../components/ui/Card.jsx'
import { InsightBadge } from '../components/ui/InsightBadge.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { Button } from '../components/ui/Button.jsx'
import { analyticsService } from '../services/api.js'
import { useDate } from '../contexts/DateContext.jsx'

export function Dashboard() {
  const { globalDateRange, setGlobalDateRange, dateError, clearDateError } = useDate()
  const navigate = useNavigate()
  
  const [kpis, setKpis] = useState({
    sales: {
      total_revenue: 0,
      total_orders: 0,
      avg_ticket: 0,
      unique_customers: 0
    },
    customers: {
      total: 0,
      new_last_30d: 0
    }
  })
  
  const [topChannels, setTopChannels] = useState([])
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dataStatus, setDataStatus] = useState('checking')

  useEffect(() => {
    if (dateError) {
      setError(dateError)
      setDataStatus('error')
      setLoading(false)
    }
  }, [dateError])

  useEffect(() => {
    console.log('🔄 DateRange GLOBAL mudou, recarregando dados...', globalDateRange)
    loadDashboardData()
  }, [globalDateRange])

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      console.warn('❌ Data inválida:', date)
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  const checkDataAvailability = async () => {
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)
      
      const response = await analyticsService.checkDataAvailability(startStr, endStr)
      return response.data?.has_data || false
    } catch (error) {
      console.warn('⚠️ Não foi possível verificar disponibilidade de dados:', error)
      return true
    }
  }

  const loadDashboardData = async () => {
    if (dateError) {
      return
    }

    setLoading(true)
    setError(null)
    setDataStatus('loading')
    
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)
      
      console.log('📅 Carregando dados reais para período GLOBAL:', startStr, 'até', endStr)
      
      const hasData = await checkDataAvailability()
      if (!hasData) {
        setDataStatus('no_data')
        setLoading(false)
        return
      }

      const daysDiff = Math.ceil((globalDateRange.endDate - globalDateRange.startDate) / (1000 * 60 * 60 * 24))
      const overviewDays = Math.min(daysDiff, 90)
      
      const [kpisRes, channelsRes, salesRes] = await Promise.all([
        analyticsService.getOverviewKpis(overviewDays),
        analyticsService.getTopChannels(startStr, endStr),
        analyticsService.getTotalSales(startStr, endStr)
      ])

      console.log('✅ Dados reais carregados:', {
        kpis: kpisRes.data,
        channels: channelsRes.data,
        sales: salesRes.data
      })

      setKpis(kpisRes.data || {})

      const channelsData = channelsRes.data?.data || channelsRes.data || []
      setTopChannels(Array.isArray(channelsData) ? channelsData : [])
      setInsights(channelsRes.data?.insights || [])

      if (salesRes.data?.data?.[0]) {
        const salesData = salesRes.data.data[0]
        setKpis(prev => ({
          ...prev,
          sales: {
            total_revenue: salesData.total_revenue || prev.sales?.total_revenue || 0,
            total_orders: salesData.total_orders || prev.sales?.total_orders || 0,
            avg_ticket: salesData.avg_ticket || prev.sales?.avg_ticket || 0,
            unique_customers: prev.sales?.unique_customers || 0
          }
        }))
      }

      setDataStatus('success')

    } catch (error) {
      console.error('❌ Erro ao carregar dados reais:', error)
      setDataStatus('error')
      
      if (error.response?.status === 404) {
        setError('Endpoints não encontrados. Verifique se o backend está com as rotas corretas.')
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor. Verifique os logs do backend.')
      } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
        setError('Não foi possível conectar ao backend. Verifique se está rodando na porta 8000.')
      } else {
        setError(`Erro: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    clearDateError()
    setError(null)
    loadDashboardData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando dados do banco...</p>
          <p className="text-sm text-gray-400 mt-2">Conectando à base real</p>
        </div>
      </div>
    )
  }

  if (error || dataStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Erro de Conexão</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRetry} className="bg-primary-600 text-white">
            Tentar Novamente
          </Button>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Verifique se o backend está rodando:</p>
            <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:8000</code>
            <p>Teste manualmente:</p>
            <code className="bg-gray-100 px-2 py-1 rounded">curl http://localhost:8000/api/v1/analytics/health</code>
          </div>
        </div>
      </div>
    )
  }

  if (dataStatus === 'no_data') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-yellow-500 text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Sem Dados</h2>
          <p className="text-gray-600 mb-4">
            Não foram encontrados dados para o período selecionado.
            Verifique se o banco de dados foi populado corretamente.
          </p>
          <Button onClick={handleRetry} className="bg-primary-600 text-white">
            Tentar Novamente
          </Button>
          <div className="mt-4 text-sm text-gray-500">
            <p>Execute o script de geração de dados:</p>
            <code className="bg-gray-100 px-2 py-1 rounded block mt-2">
              python backend/scripts/generate_data.py
            </code>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Painel de Controle</h1>
              <p className="text-gray-600">Dados em tempo real do seu negócio</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Conectado ao banco real</span>
              </div>
              <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              R$ {kpis.sales?.total_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="text-gray-600 text-sm">Faturamento Total</div>
            <div className="text-xs text-gray-400 mt-1">
              {kpis.sales?.total_orders || 0} pedidos
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {kpis.sales?.total_orders?.toLocaleString('pt-BR') || 0}
            </div>
            <div className="text-gray-600 text-sm">Pedidos Realizados</div>
            <div className="text-xs text-gray-400 mt-1">
              {kpis.sales?.unique_customers || 0} clientes únicos
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              R$ {kpis.sales?.avg_ticket?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="text-gray-600 text-sm">Ticket Médio</div>
            <div className="text-xs text-gray-400 mt-1">
              por pedido
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {kpis.customers?.total?.toLocaleString('pt-BR') || 0}
            </div>
            <div className="text-gray-600 text-sm">Clientes Cadastrados</div>
            <div className="text-xs text-gray-400 mt-1">
              +{kpis.customers?.new_last_30d || 0} novos
            </div>
          </Card>
        </div>

        {insights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Insights Automáticos</h2>
            <div className="space-y-3">
              {insights.map((insight, index) => (
                <InsightBadge key={index} insight={insight} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Canais de Venda">
            {topChannels.length > 0 ? (
              <div>
                <SimplePieChart
                  data={topChannels}
                  dataKey="order_count"
                  nameKey="channel"
                />
                <div className="mt-4 space-y-2">
                  {topChannels.map((channel, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">{channel.channel}</span>
                      <span className="font-medium">
                        {channel.order_count} pedidos 
                        {channel.percentage && ` (${channel.percentage}%)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de canal disponível para o período
              </div>
            )}
          </Card>

          <Card title="Informações do Período">
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Período analisado:</span>
                <span className="font-medium">
                  {globalDateRange.startDate.toLocaleDateString('pt-BR')} até {globalDateRange.endDate.toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dados carregados:</span>
                <span className="font-medium text-success-600">Em tempo real</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última atualização:</span>
                <span className="font-medium">
                  {new Date().toLocaleTimeString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-green-600">✓ Conectado</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-4"
            onClick={() => navigate('/vendas')}
          >
            <div className="text-lg font-semibold text-primary-600">📊</div>
            <div className="text-sm text-gray-600 mt-1">Ver Vendas</div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-4"
            onClick={() => navigate('/produtos')}
          >
            <div className="text-lg font-semibold text-success-600">🍔</div>
            <div className="text-sm text-gray-600 mt-1">Produtos</div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-4"
            onClick={() => navigate('/clientes')}
          >
            <div className="text-lg font-semibold text-warning-600">👥</div>
            <div className="text-sm text-gray-600 mt-1">Clientes</div>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center py-4"
            onClick={() => navigate('/relatorios')}
          >
            <div className="text-lg font-semibold text-purple-600">📋</div>
            <div className="text-sm text-gray-600 mt-1">Relatórios</div>
          </Button>
        </div>
      </main>
    </div>
  )
}