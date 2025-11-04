import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { SimpleBarChart } from '../components/charts/BarChart.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { LoadingState, ErrorState, EmptyState } from '../components/ui'
import { analyticsService } from '../services/api.js'
import { useDate } from '../contexts/DateContext.jsx'

export function SalesPage() {
  const { globalDateRange, setGlobalDateRange, dateError, clearDateError } = useDate()
  
  const [salesSummary, setSalesSummary] = useState({})
  const [topChannels, setTopChannels] = useState([])
  const [topDays, setTopDays] = useState([])
  const [peakHours, setPeakHours] = useState([])
  const [cancellationRate, setCancellationRate] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Efeito para mostrar erro de período do contexto
  useEffect(() => {
    if (dateError) {
      setError(dateError)
      setLoading(false)
    }
  }, [dateError])

  useEffect(() => {
    loadSalesData()
  }, [globalDateRange])

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  const loadSalesData = async () => {
    // ✅ Não carregar dados se há erro de período
    if (dateError) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)

      const [
        summaryRes, 
        channelsRes, 
        daysRes, 
        hoursRes,
        cancellationRes
      ] = await Promise.all([
        analyticsService.getTotalSales(startStr, endStr),
        analyticsService.getTopChannels(startStr, endStr),
        analyticsService.getTopDays(startStr, endStr),
        analyticsService.getPeakHours(startStr, endStr),
        analyticsService.getCancellationRate(startStr, endStr)
      ])

      setSalesSummary(summaryRes.data.data?.[0] || {})
      setTopChannels(channelsRes.data.data || [])
      setTopDays(daysRes.data.data || [])
      setPeakHours(hoursRes.data.data || [])
      setCancellationRate(cancellationRes.data.data || [])
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de vendas:', error)
      
      // ✅ Remover tratamento duplicado do período longo (agora é tratado no contexto)
      if (error.response?.status === 404) {
        setError('Serviço temporariamente indisponível')
      } else {
        setError('Erro ao carregar dados do servidor')
      }
      
      setSalesSummary({})
      setTopChannels([])
      setTopDays([])
      setPeakHours([])
      setCancellationRate([])
    } finally {
      setLoading(false)
    }
  }

  const formatHour = (hour) => {
    return `${hour}h`
  }

  const handleRetry = () => {
    // ✅ Limpar erro do contexto também
    clearDateError()
    setError(null)
    loadSalesData()
  }

  if (loading) return <LoadingState message="Carregando dados de vendas..." />
  if (error) return <ErrorState message={error} onRetry={handleRetry} />

  const hasData = topChannels.length > 0 || topDays.length > 0 || peakHours.length > 0

  if (!hasData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Análise de Vendas</h1>
                <p className="text-gray-600">Performance comercial e tendências</p>
              </div>
              <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <EmptyState 
            title="Nenhuma venda encontrada"
            message="Não existem vendas registradas para o período selecionado"
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Análise de Vendas</h1>
              <p className="text-gray-600">Performance comercial e tendências</p>
            </div>
            <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {salesSummary.total_orders > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {salesSummary.total_orders?.toLocaleString('pt-BR') || 0}
              </div>
              <div className="text-gray-600 text-sm">Total de Pedidos</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-success-600">
                R$ {salesSummary.total_revenue?.toLocaleString('pt-BR') || 0}
              </div>
              <div className="text-gray-600 text-sm">Faturamento Total</div>
            </Card>
            
            <Card className="text-center">
              <div className="text-2xl font-bold text-warning-600">
                R$ {salesSummary.avg_ticket?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0.00'}
              </div>
              <div className="text-gray-600 text-sm">Ticket Médio</div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="Vendas por Canal">
            {topChannels.length > 0 ? (
              <SimplePieChart
                data={topChannels}
                dataKey="order_count"
                nameKey="channel"
              />
            ) : (
              <EmptyState 
                title="Sem dados de canais"
                message="Não há vendas por canal no período"
              />
            )}
          </Card>

          <Card title="Performance por Dia da Semana">
            {topDays.length > 0 ? (
              <SimpleBarChart
                data={topDays}
                xKey="day_name"
                yKey="order_count"
                color="#3b82f6"
              />
            ) : (
              <EmptyState 
                title="Sem dados por dia"
                message="Não há vendas por dia da semana no período"
              />
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card title="Horários de Pico de Vendas">
            {peakHours.length > 0 ? (
              <SimpleBarChart
                data={peakHours.map(h => ({ ...h, hour_of_day: formatHour(h.hour_of_day) }))}
                xKey="hour_of_day"
                yKey="order_count"
                color="#ef4444"
              />
            ) : (
              <EmptyState 
                title="Sem dados de horários"
                message="Não há dados de pico de vendas no período"
              />
            )}
          </Card>

          <Card title="Taxa de Cancelamento">
            {cancellationRate.length > 0 ? (
              <SimplePieChart
                data={cancellationRate}
                dataKey="order_count"
                nameKey="status"
                colors={['#10b981', '#ef4444']}
              />
            ) : (
              <EmptyState 
                title="Sem dados de cancelamento"
                message="Não há dados de cancelamento no período"
              />
            )}
          </Card>
        </div>

        {topChannels.length > 0 && (
          <Card title="Detalhamento por Canal de Venda" className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Canal</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentual</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topChannels.map((channel, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{channel.channel}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{channel.order_count?.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">R$ {channel.total_revenue?.toLocaleString('pt-BR')}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{channel.percentage?.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        R$ {((channel.total_revenue || 0) / (channel.order_count || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card title="Insights de Performance">
          <div className="space-y-3">
            {topChannels.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600">📈</span>
                <div>
                  <h4 className="font-medium text-blue-600 text-sm">Canal Principal</h4>
                  <p className="text-gray-600 text-sm">
                    {topChannels[0].channel} representa {topChannels[0].percentage}% das vendas totais
                  </p>
                </div>
              </div>
            )}
            
            {topDays.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-600">📅</span>
                <div>
                  <h4 className="font-medium text-green-600 text-sm">Dia de Maior Movimento</h4>
                  <p className="text-gray-600 text-sm">
                    {topDays[0].day_name} tem {topDays[0].order_count} pedidos
                  </p>
                </div>
              </div>
            )}

            {cancellationRate.find(c => c.status === 'CANCELLED')?.percentage > 8 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-600">⚠️</span>
                <div>
                  <h4 className="font-medium text-red-600 text-sm">Alta Taxa de Cancelamento</h4>
                  <p className="text-gray-600 text-sm">
                    {cancellationRate.find(c => c.status === 'CANCELLED')?.percentage}% dos pedidos são cancelados
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </main>
    </div>
  )
}