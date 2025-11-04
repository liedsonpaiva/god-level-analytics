import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 30000,
})

api.interceptors.request.use(
  (config) => {
    console.log(`🔄 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export const analyticsService = {
  getStoreComparison: async (startDate, endDate, storeIds) => {
    const response = await api.get('/analytics/stores/comparison', {
      params: { 
        start_date: startDate, 
        end_date: endDate,
        store_ids: storeIds.join(',')
      }
    })
    return response
  },

  getStoreRegions: async (startDate, endDate) => {
    const response = await api.get('/analytics/stores/regions', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getStoreRanking: async (startDate, endDate, limit = 10) => {
    const response = await api.get('/analytics/stores/ranking', {
      params: { start_date: startDate, end_date: endDate, limit }
    })
    return response
  },

  getAllStores: async () => {
    const response = await api.get('/analytics/stores/list')
    return response
  },

  getOverviewKpis: async (days = 30) => {
    const response = await api.get('/analytics/overview', {
      params: { days }
    })
    return response
  },

  getTopChannels: async (startDate, endDate) => {
    const response = await api.get('/analytics/top-channels', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTotalSales: async (startDate, endDate) => {
    const response = await api.get('/analytics/total-sales', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTopDays: async (startDate, endDate) => {
    const response = await api.get('/analytics/top-days', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getPeakHours: async (startDate, endDate) => {
    const response = await api.get('/analytics/peak-hours', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getCancellationRate: async (startDate, endDate) => {
    const response = await api.get('/analytics/cancellation-rate', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getSalesPerformance: async (startDate, endDate, channel = null) => {
    const params = { start_date: startDate, end_date: endDate }
    if (channel) params.channel = channel
    const response = await api.get('/analytics/sales-performance', { params })
    return response
  },

  getPeakSalesHours: async (startDate, endDate) => {
    const response = await api.get('/analytics/sales/peak-hours', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTopCategories: async (startDate, endDate) => {
    const response = await api.get('/analytics/top-categories', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTopAddons: async (startDate, endDate) => {
    const response = await api.get('/analytics/top-addons', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTopProducts: async (startDate, endDate, limit = 10) => {
    const response = await api.get('/analytics/top-products', {
      params: { start_date: startDate, end_date: endDate, limit }
    })
    return response
  },

  getAvgProductPrices: async (startDate, endDate) => {
    const response = await api.get('/analytics/avg-product-prices', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getProductCategories: async (startDate, endDate) => {
    const response = await api.get('/analytics/products/top-categories', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getTotalCustomers: async () => {
    const response = await api.get('/analytics/total-customers')
    return response
  },

  getPromotionOptin: async () => {
    const response = await api.get('/analytics/promotion-optin')
    return response
  },

  getCustomerAgeDistribution: async () => {
    const response = await api.get('/analytics/customer-age-distribution')
    return response
  },

  getAvgOrdersPerCustomer: async (startDate, endDate) => {
    const response = await api.get('/analytics/avg-orders-per-customer', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getCustomerMetrics: async (startDate, endDate) => {
    const response = await api.get('/analytics/customer-metrics', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getRepeatCustomers: async () => {
    const response = await api.get('/analytics/repeat-customers')
    return response
  },

  getAvgDeliveryTime: async (startDate, endDate) => {
    const response = await api.get('/analytics/delivery/avg-time-by-channel', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getPaymentMethods: async (startDate, endDate) => {
    const response = await api.get('/analytics/payments/top-methods', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  generateReport: async (reportType, startDate, endDate, format = 'pdf') => {
    const response = await api.post('/analytics/generate-report', {
      report_type: reportType,
      start_date: startDate,
      end_date: endDate,
      format: format
    })
    return response
  },

  checkDataAvailability: async (startDate, endDate) => {
    const response = await api.get('/analytics/data-availability', {
      params: { start_date: startDate, end_date: endDate }
    })
    return response
  },

  getDataDateRange: async () => {
    const response = await api.get('/analytics/data-range')
    return response
  }
}

export default api