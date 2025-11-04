import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { SimpleBarChart } from '../components/charts/BarChart.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { LoadingState } from '../components/ui/LoadingState.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { Button } from '../components/ui/Button.jsx'
import { analyticsService } from '../services/api.js'
import { useDate } from '../contexts/DateContext.jsx'

export function ReportsPage() {
  const { globalDateRange, setGlobalDateRange, dateError, clearDateError } = useDate()
  
  const [salesTrend, setSalesTrend] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [orderStatus, setOrderStatus] = useState([])
  const [customerRetention, setCustomerRetention] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (dateError) {
      setError(dateError)
      setLoading(false)
    }
  }, [dateError])

  useEffect(() => {
    console.log('🔄 ReportsPage: DateRange GLOBAL mudou', globalDateRange)
    loadReportsData()
  }, [globalDateRange])

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  const loadReportsData = async () => {
    if (dateError) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)
      
      console.log('📋 ReportsPage: Carregando dados REAIS para', startStr, 'até', endStr)
      
      const [
        trendRes, 
        paymentRes,
        statusRes,
        retentionRes
      ] = await Promise.all([
        analyticsService.getSalesTrend(startStr, endStr),
        analyticsService.getPaymentMethods(startStr, endStr),
        analyticsService.getOrderStatus(startStr, endStr),
        analyticsService.getCustomerRetention(startStr, endStr)
      ])

      console.log('✅ ReportsPage: Dados REAIS recebidos', {
        trend: trendRes.data,
        payment: paymentRes.data,
        status: statusRes.data,
        retention: retentionRes.data
      })

      setSalesTrend(trendRes.data?.data || [])
      setPaymentMethods(paymentRes.data?.data || [])
      setOrderStatus(statusRes.data?.data || [])
      setCustomerRetention(retentionRes.data?.data || {})
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de relatórios:', error)
      
      setError('Erro ao carregar dados do servidor. Verifique se o backend está rodando.')
      
      setSalesTrend([])
      setPaymentMethods([])
      setOrderStatus([])
      setCustomerRetention({})
      
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    clearDateError()
    setError(null)
    loadReportsData()
  }

  const handleExportPDF = () => {
    alert('Funcionalidade de exportação em PDF será implementada em breve!')
  }

  const handleExportCSV = () => {
    alert('Funcionalidade de exportação em CSV será implementada em breve!')
  }

  if (loading) {
    return <LoadingState message="Carregando dados de relatórios..." />
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={handleRetry}
        additionalInfo="Verifique se o backend está rodando em http://localhost:8000"
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios Avançados</h1>
              <p className="text-gray-600">Análises detalhadas e tendências - Dados Reais</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportPDF}>
                  📄 Exportar PDF
                </Button>
                <Button variant="outline" onClick={handleExportCSV}>
                  📊 Exportar CSV
                </Button>
              </div>
              <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {salesTrend.reduce((sum, day) => sum + (day.total_orders || 0), 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Total de Pedidos</div>
            <div className="text-xs text-gray-400 mt-1">
              no período
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-success-600">
              R$ {salesTrend.reduce((sum, day) => sum + (day.total_revenue || 0), 0).toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Faturamento Total</div>
            <div className="text-xs text-gray-400 mt-1">
              {salesTrend.length} dias analisados
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {customerRetention.retention_rate ? `${(customerRetention.retention_rate * 100).toFixed(1)}%` : '0%'}
            </div>
            <div className="text-gray-600 text-sm">Taxa de Retenção</div>
            <div className="text-xs text-gray-400 mt-1">
              {customerRetention.returning_customers || 0} clientes retornaram
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {orderStatus.find(s => s.status === 'DELIVERED')?.order_count?.toLocaleString('pt-BR') || 0}
            </div>
            <div className="text-gray-600 text-sm">Pedidos Entregues</div>
            <div className="text-xs text-gray-400 mt-1">
              {((orderStatus.find(s => s.status === 'DELIVERED')?.order_count || 0) / (salesTrend.reduce((sum, day) => sum + (day.total_orders || 0), 1)) * 100).toFixed(1)}% do total
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Tendência de Vendas ao Longo do Período">
            {salesTrend.length > 0 ? (
              <SimpleBarChart
                data={salesTrend}
                xKey="date"
                yKey="total_revenue"
                color="#3b82f6"
                height={300}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de tendência disponível
              </div>
            )}
          </Card>

          <Card title="Distribuição por Método de Pagamento">
            {paymentMethods.length > 0 ? (
              <SimplePieChart
                data={paymentMethods}
                dataKey="order_count"
                nameKey="payment_method"
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de pagamento disponível
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card title="Status dos Pedidos">
            {orderStatus.length > 0 ? (
              <SimpleBarChart
                data={orderStatus}
                xKey="status"
                yKey="order_count"
                color="#ef4444"
                height={300}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de status disponível
              </div>
            )}
          </Card>

          <Card title="Retenção de Clientes">
            {customerRetention.retention_rate ? (
              <div className="space-y-4 py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {(customerRetention.retention_rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-gray-600">Taxa de Retenção</div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {customerRetention.returning_customers?.toLocaleString('pt-BR') || 0}
                    </div>
                    <div className="text-sm text-gray-600">Clientes Retornaram</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">
                      {customerRetention.total_customers?.toLocaleString('pt-BR') || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total de Clientes</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de retenção disponível
              </div>
            )}
          </Card>
        </div>

        {salesTrend.length > 0 && (
          <Card title="Tendência Diária de Vendas" className="mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Pedidos
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Faturamento
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Ticket Médio
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Clientes Únicos
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {salesTrend.map((day, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {day.total_orders?.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        R$ {day.total_revenue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        R$ {((day.total_revenue || 0) / (day.total_orders || 1)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {day.unique_customers?.toLocaleString('pt-BR') || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <Card title="Informações do Período Analisado" className="mt-8">
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Período do relatório:</span>
              <span className="font-medium">
                {globalDateRange.startDate.toLocaleDateString('pt-BR')} até {globalDateRange.endDate.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total de dias analisados:</span>
              <span className="font-medium">{salesTrend.length} dias</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Média diária de pedidos:</span>
              <span className="font-medium">
                {salesTrend.length > 0 ? Math.round(salesTrend.reduce((sum, day) => sum + (day.total_orders || 0), 0) / salesTrend.length) : 0} pedidos/dia
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status do relatório:</span>
              <span className="font-medium text-green-600">✓ Atualizado</span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}