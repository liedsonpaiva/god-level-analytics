import { useState, useEffect } from 'react';
import axios from 'axios';

// Components
import LoadingSkeleton from './ui/LoadingSkeleton';
import ErrorState from './ui/ErrorState';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import KpiCards from './layout/KpiCards';
import SalesTrendChart from './charts/SalesTrendChart';
import ChannelsPerformanceChart from './charts/ChannelsPerformanceChart';
import RevenuePieChart from './charts/RevenuePieChart';
import TopProductsList from './charts/TopProductsList';
import TimeAnalysis from './insights/TimeAnalysis';
import CustomerInsights from './insights/CustomerInsights';
import ProductPerformance from './insights/ProductPerformance';
import QuickFilters from './filters/QuickFilters';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [salesTrend, setSalesTrend] = useState([]);
  const [channels, setChannels] = useState([]);
  const [products, setProducts] = useState([]);
  const [timeAnalysis, setTimeAnalysis] = useState([]);
  const [customerInsights, setCustomerInsights] = useState(null);
  const [filters, setFilters] = useState({
    dateRange: '30d',
    channel: 'all'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Função para buscar dados
  // Função para buscar dados
const fetchDashboardData = async (filterParams = null) => {
  try {
    setLoading(true);
    setError(null);
    
    // Usa os filters do estado ou os parâmetros passados
    const currentFilters = filterParams || filters;
    
    // Constrói os parâmetros da query baseado nos filtros
    const queryParams = new URLSearchParams();
    
    // Converter dateRange para dias
    const daysMap = {
      '7d': 7,
      '30d': 30, 
      '90d': 90
    };
    queryParams.append('days', daysMap[currentFilters.dateRange] || 30);
    
    if (currentFilters.channel !== 'all') {
      queryParams.append('channel', currentFilters.channel);
    }
    
    const queryString = queryParams.toString();
    const urlSuffix = queryString ? `?${queryString}` : '';
    
    // AGORA COM AS NOVAS APIS REAIS - removemos os mocks!
    const [overviewRes, trendRes, channelsRes, timeRes, customersRes, performanceRes] = await Promise.all([
      axios.get(`http://localhost:8000/api/analytics/overview${urlSuffix}`),
      axios.get(`http://localhost:8000/api/analytics/sales/trend${urlSuffix}`),
      axios.get(`http://localhost:8000/api/analytics/channels/performance${urlSuffix}`),
      axios.get(`http://localhost:8000/api/analytics/products/top-insights${urlSuffix}`),
      // NOVAS APIS - substituindo os mocks
      axios.get(`http://localhost:8000/api/analytics/sales/time-analysis${urlSuffix}`),
      axios.get(`http://localhost:8000/api/analytics/customers/insights${urlSuffix}`),
      axios.get(`http://localhost:8000/api/analytics/products/performance${urlSuffix}`)
    ]);

    // Atualizar todos os estados com dados REAIS
    setOverview(overviewRes.data);
    setSalesTrend(trendRes.data.sales_trend || []);
    setChannels(channelsRes.data.channels || []);
    setProducts(performanceRes.data.products_performance || []); // Usar performance que tem margens
    setTimeAnalysis(timeRes.data.time_analysis || []);
    setCustomerInsights(customersRes.data);
    
    // REMOVER TODOS OS MOCKS - agora temos dados reais!
    
  } catch (error) {
    console.error('Erro ao carregar dashboard:', error);
    setError('Erro ao carregar dados. Verifique se o backend está rodando na porta 8000.');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Passa os novos filtros explicitamente
    fetchDashboardData(newFilters);
  };

  if (loading) return <LoadingSkeleton />;
  if (error) return <ErrorState error={error} onRetry={() => fetchDashboardData()} />;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 lg:hidden">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="text-gray-600">☰</span>
          </button>
          <h1 className="text-lg font-bold text-gray-800">Food Analytics</h1>
          <div className="w-8"></div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <Header overview={overview} />
            
            {/* Filtros Rápidos */}
            <QuickFilters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
            />
            
            <KpiCards overview={overview} />
            
            {/* Insights Acionáveis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <TimeAnalysis data={timeAnalysis} />
              <CustomerInsights data={customerInsights} />
            </div>
            
            {/* Visualizações Tradicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <SalesTrendChart data={salesTrend} />
              <ChannelsPerformanceChart data={channels} />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ProductPerformance products={products} filters={filters} />
              <RevenuePieChart data={channels} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}