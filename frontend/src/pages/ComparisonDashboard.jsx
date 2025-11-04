import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { SimpleBarChart } from '../components/charts/BarChart.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { StoreComparisonFilter } from '../components/filters/StoreComparisonFilter.jsx'
import { RegionSelector } from '../components/filters/RegionSelector.jsx'
import { LoadingState } from '../components/ui/LoadingState.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { useDate } from '../contexts/DateContext.jsx'
import { useStore } from '../contexts/StoreContext.jsx'
import { analyticsService } from '../services/api.js'

export function ComparisonDashboard() {
  const { globalDateRange, setGlobalDateRange } = useDate()
  const { selectedStores, allStores } = useStore()
  
  const [comparisonData, setComparisonData] = useState([])
  const [regionsData, setRegionsData] = useState([])
  const [rankingData, setRankingData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('comparison')

  useEffect(() => {
    if (selectedStores.length > 0) {
      loadComparisonData()
    }
  }, [globalDateRange, selectedStores])

  useEffect(() => {
    loadRegionsData()
    loadRankingData()
  }, [globalDateRange])

  const loadComparisonData = async () => {
    if (selectedStores.length === 0) return
    
    setLoading(true)
    setError(null)
    
    try {
      const startStr = globalDateRange.startDate.toISOString().split('T')[0]
      const endStr = globalDateRange.endDate.toISOString().split('T')[0]
      
      const response = await analyticsService.getStoreComparison(
        startStr, 
        endStr, 
        selectedStores
      )
      
      setComparisonData(response.data.data || [])
    } catch (err) {
      console.error('❌ Erro ao carregar comparação:', err)
      setError('Erro ao carregar dados de comparação')
    } finally {
      setLoading(false)
    }
  }

  const loadRegionsData = async () => {
    try {
      const startStr = globalDateRange.startDate.toISOString().split('T')[0]
      const endStr = globalDateRange.endDate.toISOString().split('T')[0]
      
      const response = await analyticsService.getStoreRegions(startStr, endStr)
      setRegionsData(response.data.data || [])
    } catch (err) {
      console.error('❌ Erro ao carregar regiões:', err)
    }
  }

  const loadRankingData = async () => {
    try {
      const startStr = globalDateRange.startDate.toISOString().split('T')[0]
      const endStr = globalDateRange.endDate.toISOString().split('T')[0]
      
      const response = await analyticsService.getStoreRanking(startStr, endStr, 10)
      setRankingData(response.data.data || [])
    } catch (err) {
      console.error('❌ Erro ao carregar ranking:', err)
    }
  }

  if (loading && comparisonData.length === 0) {
    return <LoadingState message="Carregando comparação de lojas..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadComparisonData} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comparação de Lojas</h1>
              <p className="text-gray-600">
                Análise comparativa entre {allStores.length} lojas - Dados em tempo real
              </p>
            </div>
            <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <StoreComparisonFilter />
            <RegionSelector />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border mb-6">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('comparison')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                    activeTab === 'comparison'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  📊 Comparação Direta
                </button>
                <button
                  onClick={() => setActiveTab('regions')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                    activeTab === 'regions'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🗺️ Análise por Região
                </button>
                <button
                  onClick={() => setActiveTab('ranking')}
                  className={`flex-1 px-4 py-3 text-sm font-medium text-center ${
                    activeTab === 'ranking'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  🏆 Ranking
                </button>
              </div>
            </div>

            {activeTab === 'comparison' && (
              <ComparisonTab 
                data={comparisonData} 
                loading={loading}
                selectedStores={selectedStores}
              />
            )}

            {activeTab === 'regions' && (
              <RegionsTab data={regionsData} />
            )}

            {activeTab === 'ranking' && (
              <RankingTab data={rankingData} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

function ComparisonTab({ data, loading, selectedStores }) {
  if (selectedStores.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-4">🏪</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Selecione lojas para comparar
        </h3>
        <p className="text-gray-600">
          Escolha até 5 lojas no filtro lateral para iniciar a comparação
        </p>
      </Card>
    )
  }

  if (loading) {
    return <LoadingState message="Carregando dados de comparação..." />
  }

  if (data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum dado encontrado
        </h3>
        <p className="text-gray-600">
          Não há dados disponíveis para as lojas selecionadas no período
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <div className="text-2xl font-bold text-primary-600">
            R$ {Math.max(...data.map(d => d.total_revenue)).toLocaleString('pt-BR')}
          </div>
          <div className="text-gray-600 text-sm">Maior Faturamento</div>
          <div className="text-xs text-gray-400 mt-1">
            {data.find(d => d.total_revenue === Math.max(...data.map(d => d.total_revenue)))?.store_name}
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-success-600">
            R$ {Math.max(...data.map(d => d.avg_ticket)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-gray-600 text-sm">Maior Ticket Médio</div>
          <div className="text-xs text-gray-400 mt-1">
            {data.find(d => d.avg_ticket === Math.max(...data.map(d => d.avg_ticket)))?.store_name}
          </div>
        </Card>
        
        <Card className="text-center">
          <div className="text-2xl font-bold text-warning-600">
            {Math.min(...data.map(d => d.cancellation_rate)).toFixed(1)}%
          </div>
          <div className="text-gray-600 text-sm">Menor Cancelamento</div>
          <div className="text-xs text-gray-400 mt-1">
            {data.find(d => d.cancellation_rate === Math.min(...data.map(d => d.cancellation_rate)))?.store_name}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Faturamento por Loja">
          <SimpleBarChart
            data={data}
            xKey="store_name"
            yKey="total_revenue"
            color="#3b82f6"
            height={300}
          />
        </Card>

        <Card title="Ticket Médio">
          <SimpleBarChart
            data={data}
            xKey="store_name"
            yKey="avg_ticket"
            color="#10b981"
            height={300}
          />
        </Card>
      </div>

      <Card title="Métricas Detalhadas">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loja</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clientes Únicos</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Cancelamento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((store, index) => (
                <tr key={store.store_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {store.store_name}
                    <div className="text-xs text-gray-500">{store.city} - {store.state}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {store.total_orders.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    R$ {store.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    R$ {store.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {store.unique_customers.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      store.cancellation_rate < 5 ? 'bg-green-100 text-green-800' :
                      store.cancellation_rate < 10 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {store.cancellation_rate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function RegionsTab({ data }) {
  if (data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-4">🗺️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum dado regional
        </h3>
        <p className="text-gray-600">
          Não há dados disponíveis para análise regional
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card title="Performance por Região">
        <SimpleBarChart
          data={data}
          xKey="city"
          yKey="total_revenue"
          color="#8b5cf6"
          height={400}
        />
      </Card>

      <Card title="Detalhes por Cidade">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade/Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lojas</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((region, index) => (
                <tr key={`${region.city}-${region.state}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {region.city}
                    <div className="text-xs text-gray-500">{region.state}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {region.store_count}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {region.total_orders.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    R$ {region.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    R$ {region.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function RankingTab({ data }) {
  if (data.length === 0) {
    return (
      <Card className="text-center py-12">
        <div className="text-4xl mb-4">🏆</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum dado de ranking
        </h3>
        <p className="text-gray-600">
          Não há dados disponíveis para o ranking
        </p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card title="Top 10 Lojas por Faturamento">
        <SimpleBarChart
          data={data}
          xKey="store_name"
          yKey="total_revenue"
          color="#f59e0b"
          height={400}
        />
      </Card>

      <Card title="Ranking Detalhado">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posição</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loja</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Faturamento</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Pedidos</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ticket Médio</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Clientes Únicos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((store, index) => (
                <tr key={store.store_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      store.revenue_rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                      store.revenue_rank === 2 ? 'bg-gray-100 text-gray-800' :
                      store.revenue_rank === 3 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {store.revenue_rank}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {store.store_name}
                    <div className="text-xs text-gray-500">{store.city} - {store.state}</div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    <span className="font-bold">
                      R$ {store.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {store.total_orders.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    R$ {store.avg_ticket.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {store.unique_customers.toLocaleString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}