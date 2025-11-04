import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { SimpleBarChart } from '../components/charts/BarChart.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { LoadingState } from '../components/ui/LoadingState.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { analyticsService } from '../services/api.js'
import { useDate } from '../contexts/DateContext.jsx'

export function CustomersPage() {
  const { globalDateRange, setGlobalDateRange, dateError, clearDateError } = useDate()
  
  const [totalCustomers, setTotalCustomers] = useState({})
  const [promotionOptin, setPromotionOptin] = useState([])
  const [ageDistribution, setAgeDistribution] = useState([])
  const [avgOrders, setAvgOrders] = useState({})
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
    console.log('🔄 CustomersPage: DateRange GLOBAL mudou', globalDateRange)
    loadCustomersData()
  }, [globalDateRange])

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  const loadCustomersData = async () => {
    // ✅ Não carregar dados se há erro de período
    if (dateError) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)
      
      console.log('👥 CustomersPage: Carregando dados REAIS para', startStr, 'até', endStr)
      
      const [totalRes, promotionRes, ageRes, avgOrdersRes] = await Promise.all([
        analyticsService.getTotalCustomers(),
        analyticsService.getPromotionOptin(),
        analyticsService.getCustomerAgeDistribution(),
        analyticsService.getAvgOrdersPerCustomer(startStr, endStr)
      ])

      console.log('✅ CustomersPage: Dados REAIS recebidos', {
        total: totalRes.data,
        promotion: promotionRes.data,
        age: ageRes.data,
        avgOrders: avgOrdersRes.data
      })

      setTotalCustomers(totalRes.data?.data?.[0] || {})
      setPromotionOptin(promotionRes.data?.data || [])
      setAgeDistribution(ageRes.data?.data || [])
      setAvgOrders(avgOrdersRes.data?.data?.[0] || {})
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de clientes:', error)
      
      // ✅ Remover tratamento duplicado do período longo (agora é tratado no contexto)
      setError('Erro ao carregar dados do servidor. Verifique se o backend está rodando.')
      
      setTotalCustomers({})
      setPromotionOptin([])
      setAgeDistribution([])
      setAvgOrders({})
      
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    // ✅ Limpar erro do contexto também
    clearDateError()
    setError(null)
    loadCustomersData()
  }

  // Calcular totais baseados nos dados reais
  const totalCustomersCount = totalCustomers.total_customers || 0
  const newCustomersCount = totalCustomers.new_customers_30d || 0
  const avgOrdersPerCustomer = avgOrders.avg_orders_per_customer || avgOrders.avg_orders_per_customer_monthly || 0

  if (loading) {
    return <LoadingState message="Carregando dados de clientes..." />
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
              <h1 className="text-2xl font-bold text-gray-900">Análise de Clientes</h1>
              <p className="text-gray-600">Comportamento e perfil dos clientes - Dados Reais</p>
            </div>
            <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs de Clientes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {totalCustomersCount.toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Total de Clientes</div>
            <div className="text-xs text-gray-400 mt-1">
              Cadastrados no sistema
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-success-600">
              {newCustomersCount.toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Novos Clientes</div>
            <div className="text-xs text-gray-400 mt-1">
              últimos 30 dias
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {avgOrdersPerCustomer.toFixed(1)}
            </div>
            <div className="text-gray-600 text-sm">Pedidos/Cliente</div>
            <div className="text-xs text-gray-400 mt-1">
              média mensal
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Aceitação de Promoções */}
          <Card title="Aceitação de Promoções por Email">
            {promotionOptin.length > 0 ? (
              <div>
                <SimplePieChart
                  data={promotionOptin}
                  dataKey="customer_count"
                  nameKey="accepts_promotions"
                />
                <div className="mt-4 space-y-2">
                  {promotionOptin.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">
                        {item.accepts_promotions ? 'Aceita promoções' : 'Não aceita promoções'}
                      </span>
                      <span className="font-medium">
                        {item.customer_count?.toLocaleString('pt-BR')} clientes
                        {item.percentage && ` (${item.percentage}%)`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de aceitação de promoções disponível
              </div>
            )}
          </Card>

          {/* Distribuição por Idade */}
          <Card title="Distribuição por Faixa Etária">
            {ageDistribution.length > 0 ? (
              <SimpleBarChart
                data={ageDistribution}
                xKey="age_group"
                yKey="customer_count"
                color="#8b5cf6"
                height={300}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de distribuição etária disponível
              </div>
            )}
          </Card>
        </div>

        {/* Tabela de Detalhes por Idade */}
        {ageDistribution.length > 0 && (
          <Card title="Detalhes por Faixa Etária" className="mt-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Faixa Etária
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Clientes
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Idade Média
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Percentual
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ageDistribution.map((ageGroup, index) => {
                    const percentage = totalCustomersCount > 0 
                      ? ((ageGroup.customer_count / totalCustomersCount) * 100) 
                      : 0
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {ageGroup.age_group}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {ageGroup.customer_count?.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {ageGroup.avg_age_in_group ? `${ageGroup.avg_age_in_group.toFixed(0)} anos` : 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">
                          {percentage.toFixed(1)}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Insights de Clientes */}
        <Card title="Insights de Clientes" className="mt-8">
          <div className="space-y-3">
            {newCustomersCount > 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-600">📈</span>
                <div>
                  <h4 className="font-medium text-green-600 text-sm">Crescimento de Base</h4>
                  <p className="text-gray-600 text-sm">
                    {newCustomersCount} novos clientes nos últimos 30 dias
                  </p>
                </div>
              </div>
            )}
            
            {promotionOptin.find(p => p.accepts_promotions === true)?.percentage > 50 && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-600">📧</span>
                <div>
                  <h4 className="font-medium text-blue-600 text-sm">Alta Aceitação de Promoções</h4>
                  <p className="text-gray-600 text-sm">
                    {promotionOptin.find(p => p.accepts_promotions === true)?.percentage}% dos clientes aceitam promoções por email
                  </p>
                </div>
              </div>
            )}

            {ageDistribution.length > 0 && (
              <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-purple-600">🎯</span>
                <div>
                  <h4 className="font-medium text-purple-600 text-sm">Perfil Demográfico</h4>
                  <p className="text-gray-600 text-sm">
                    {ageDistribution.length} faixas etárias identificadas
                  </p>
                </div>
              </div>
            )}

            {avgOrdersPerCustomer > 2 && (
              <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                <span className="text-orange-600">🛒</span>
                <div>
                  <h4 className="font-medium text-orange-600 text-sm">Boa Frequência de Compra</h4>
                  <p className="text-gray-600 text-sm">
                    Média de {avgOrdersPerCustomer.toFixed(1)} pedidos por cliente
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Informações do Período */}
        <Card title="Informações do Período" className="mt-8">
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Período analisado:</span>
              <span className="font-medium">
                {globalDateRange.startDate.toLocaleDateString('pt-BR')} até {globalDateRange.endDate.toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base de clientes:</span>
              <span className="font-medium text-success-600">
                {totalCustomersCount > 0 ? `${totalCustomersCount} clientes` : 'Sem dados'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Taxa de crescimento:</span>
              <span className="font-medium">
                {totalCustomersCount > 0 ? `${((newCustomersCount / totalCustomersCount) * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}