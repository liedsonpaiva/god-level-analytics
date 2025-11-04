import React, { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { SimpleBarChart } from '../components/charts/BarChart.jsx'
import { SimplePieChart } from '../components/charts/PieChart.jsx'
import { DateRangeFilter } from '../components/filters/DateRangeFilter.jsx'
import { LoadingState } from '../components/ui/LoadingState.jsx'
import { ErrorState } from '../components/ui/ErrorState.jsx'
import { analyticsService } from '../services/api.js'
import { useDate } from '../contexts/DateContext.jsx'

export function ProductsPage() {
  const { globalDateRange, setGlobalDateRange, dateError, clearDateError } = useDate()
  
  const [topCategories, setTopCategories] = useState([])
  const [topAddons, setTopAddons] = useState([])
  const [topProducts, setTopProducts] = useState([])
  const [avgProductPrices, setAvgProductPrices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (dateError) {
      setError(dateError)
      setLoading(false)
    }
  }, [dateError])

  useEffect(() => {
    console.log('🔄 ProductsPage: DateRange GLOBAL mudou', globalDateRange)
    loadProductsData()
  }, [globalDateRange])

  const formatDateForAPI = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) {
      return new Date().toISOString().split('T')[0]
    }
    return date.toISOString().split('T')[0]
  }

  const loadProductsData = async () => {
    if (dateError) {
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      const startStr = formatDateForAPI(globalDateRange.startDate)
      const endStr = formatDateForAPI(globalDateRange.endDate)
      
      console.log('🍔 ProductsPage: Carregando dados REAIS para', startStr, 'até', endStr)
      
      const [
        categoriesRes, 
        addonsRes,
        productsRes,
        pricesRes
      ] = await Promise.all([
        analyticsService.getTopCategories(startStr, endStr),
        analyticsService.getTopAddons(startStr, endStr),
        analyticsService.getTopProducts(startStr, endStr, 10),
        analyticsService.getAvgProductPrices(startStr, endStr)
      ])

      console.log('✅ ProductsPage: Dados REAIS recebidos', {
        categories: categoriesRes.data,
        addons: addonsRes.data,
        products: productsRes.data,
        prices: pricesRes.data
      })

      setTopCategories(categoriesRes.data?.data || [])
      setTopAddons(addonsRes.data?.data || [])
      setTopProducts(productsRes.data?.data || [])
      setAvgProductPrices(pricesRes.data?.data || {})
      
    } catch (error) {
      console.error('❌ Erro ao carregar dados de produtos:', error)
      
      setError('Erro ao carregar dados do servidor. Verifique se o backend está rodando.')
      
      setTopCategories([])
      setTopAddons([])
      setTopProducts([])
      setAvgProductPrices({})
      
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    clearDateError()
    setError(null)
    loadProductsData()
  }

  const totalProductOrders = topCategories.reduce((sum, cat) => sum + (cat.order_count || 0), 0)
  const totalAddonsSold = topAddons.reduce((sum, addon) => sum + (addon.times_added || 0), 0)
  const dailyAverage = Math.floor(totalProductOrders / 30)

  if (loading) {
    return <LoadingState message="Carregando dados de produtos..." />
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
              <h1 className="text-2xl font-bold text-gray-900">Análise de Produtos</h1>
              <p className="text-gray-600">Desempenho de categorias e itens - Dados Reais</p>
            </div>
            <DateRangeFilter value={globalDateRange} onChange={setGlobalDateRange} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {totalProductOrders.toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Pedidos com Produtos</div>
            <div className="text-xs text-gray-400 mt-1">
              {topCategories.length} categorias
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-success-600">
              R$ {avgProductPrices.avg_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className="text-gray-600 text-sm">Preço Médio</div>
            <div className="text-xs text-gray-400 mt-1">
              {avgProductPrices.min_price && `De R$ ${avgProductPrices.min_price}`}
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-warning-600">
              {totalAddonsSold.toLocaleString('pt-BR')}
            </div>
            <div className="text-gray-600 text-sm">Adicionais Vendidos</div>
            <div className="text-xs text-gray-400 mt-1">
              {topAddons.length} tipos
            </div>
          </Card>
          
          <Card className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {dailyAverage.toLocaleString('pt-BR')}/dia
            </div>
            <div className="text-gray-600 text-sm">Média Diária</div>
            <div className="text-xs text-gray-400 mt-1">
              últimos 30 dias
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card title="Categorias com Maior Receita">
            {topCategories.length > 0 ? (
              <SimpleBarChart
                data={topCategories}
                xKey="category_name"
                yKey="total_revenue"
                color="#10b981"
                height={300}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de categoria disponível
              </div>
            )}
          </Card>

          <Card title="Itens Adicionais Mais Pedidos">
            {topAddons.length > 0 ? (
              <SimpleBarChart
                data={topAddons.slice(0, 8)}
                xKey="item_name"
                yKey="times_added"
                color="#f59e0b"
                height={300}
              />
            ) : (
              <div className="text-center text-gray-500 py-8">
                Nenhum dado de adicionais disponível
              </div>
            )}
          </Card>
        </div>

        <Card title="Produtos Mais Vendidos" className="mt-8">
          {topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produto
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Vezes Vendido
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Quantidade
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Receita Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {product.product_name || product.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {product.category || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {(product.times_sold || product.times_ordered)?.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {(product.total_quantity || product.quantity)?.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        R$ {(product.total_revenue || product.revenue)?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              Nenhum dado de produtos disponível para o período
            </div>
          )}
        </Card>

        {avgProductPrices.avg_price && (
          <Card title="Estatísticas de Preços" className="mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  R$ {avgProductPrices.avg_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Preço Médio</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  R$ {avgProductPrices.min_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Preço Mínimo</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">
                  R$ {avgProductPrices.max_price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">Preço Máximo</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {avgProductPrices.product_count?.toLocaleString('pt-BR')}
                </div>
                <div className="text-sm text-gray-600">Produtos Ativos</div>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}