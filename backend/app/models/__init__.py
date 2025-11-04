from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from decimal import Decimal

class AnalyticsResponse(BaseModel):
    data: List[Dict[str, Any]]
    insights: Optional[List[Dict[str, Any]]] = []
    summary: Optional[Dict[str, Any]] = {}

class DateRangeRequest(BaseModel):
    start_date: date
    end_date: date

class SalesSummaryResponse(BaseModel):
    total_orders: int
    total_revenue: float
    avg_ticket: float

class ChannelPerformanceResponse(BaseModel):
    channel: str
    order_count: int
    total_revenue: float
    percentage: float

class ProductPerformanceResponse(BaseModel):
    product_name: str
    category: str
    times_ordered: int
    total_quantity: int
    total_revenue: float

class CustomerStatsResponse(BaseModel):
    total_customers: int
    new_customers_30d: int
    promotion_optin_rate: float

class DeliveryPerformanceResponse(BaseModel):
    channel: str
    avg_delivery_time_seconds: float
    delivery_count: int

class PaymentMethodsResponse(BaseModel):
    payment_method: str
    transaction_count: int
    total_amount: float
    percentage: float