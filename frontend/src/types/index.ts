export interface AnalyticsData {
  data: any[]
  insights?: Insight[]
  summary?: Record<string, any>
}

export interface Insight {
  type: 'success' | 'warning' | 'info' | 'critical'
  title: string
  message: string
  [key: string]: any
}

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface FilterState {
  dateRange: DateRange
  channels: string[]
  stores: string[]
  categories: string[]
}

export interface SalesSummary {
  total_orders: number
  total_revenue: number
  avg_ticket: number
}

export interface ChannelPerformance {
  channel: string
  order_count: number
  total_revenue: number
  percentage: number
}

export interface ProductPerformance {
  name: string
  category: string
  times_ordered: number
  total_quantity: number
  total_revenue: number
}