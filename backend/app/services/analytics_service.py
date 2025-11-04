import asyncpg
from datetime import datetime
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self, db_pool: asyncpg.Pool):  
        self.db_pool = db_pool
        
    async def get_store_comparison(self, start_date: datetime, end_date: datetime, store_ids: List[int]) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    s.id as store_id,
                    s.name as store_name,
                    s.city,
                    s.state,
                    COUNT(sa.id) as total_orders,
                    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
                    COUNT(DISTINCT sa.customer_id) as unique_customers,
                    ROUND(
                        COUNT(CASE WHEN sa.sale_status_desc = 'CANCELLED' THEN 1 END) * 100.0 / NULLIF(COUNT(sa.id), 0),
                    2) as cancellation_rate,
                    AVG(sa.production_seconds) as avg_production_time,
                    AVG(sa.delivery_seconds) as avg_delivery_time
                FROM stores s
                LEFT JOIN sales sa ON s.id = sa.store_id 
                    AND sa.created_at BETWEEN $1 AND $2
                WHERE s.id = ANY($3)
                GROUP BY s.id, s.name, s.city, s.state
                ORDER BY total_revenue DESC
            """
            
            result = await self.db_pool.fetch(query, start_date, end_date, store_ids)
            
            comparison_data = []
            for row in result:
                comparison_data.append({
                    "store_id": row['store_id'],
                    "store_name": row['store_name'],
                    "city": row['city'],
                    "state": row['state'],
                    "total_orders": row['total_orders'] or 0,
                    "total_revenue": float(row['total_revenue'] or 0),
                    "avg_ticket": float(row['avg_ticket'] or 0),
                    "unique_customers": row['unique_customers'] or 0,
                    "cancellation_rate": float(row['cancellation_rate'] or 0),
                    "avg_production_time": row['avg_production_time'] or 0,
                    "avg_delivery_time": row['avg_delivery_time'] or 0
                })
            
            return comparison_data
            
        except Exception as e:
            logger.error(f"Erro ao comparar lojas: {str(e)}")
            raise

    async def get_store_regions(self, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    s.city,
                    s.state,
                    COUNT(DISTINCT s.id) as store_count,
                    COUNT(sa.id) as total_orders,
                    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
                    ROUND(
                        COUNT(CASE WHEN sa.sale_status_desc = 'CANCELLED' THEN 1 END) * 100.0 / NULLIF(COUNT(sa.id), 0),
                    2) as cancellation_rate
                FROM stores s
                LEFT JOIN sales sa ON s.id = sa.store_id 
                    AND sa.created_at BETWEEN $1 AND $2
                WHERE s.is_active = true
                GROUP BY s.city, s.state
                ORDER BY total_revenue DESC
            """
            
            result = await self.db_pool.fetch(query, start_date, end_date)
            
            regions_data = []
            for row in result:
                regions_data.append({
                    "city": row['city'],
                    "state": row['state'],
                    "store_count": row['store_count'] or 0,
                    "total_orders": row['total_orders'] or 0,
                    "total_revenue": float(row['total_revenue'] or 0),
                    "avg_ticket": float(row['avg_ticket'] or 0),
                    "cancellation_rate": float(row['cancellation_rate'] or 0)
                })
            
            return regions_data
            
        except Exception as e:
            logger.error(f"Erro ao buscar regiões: {str(e)}")
            raise

    async def get_store_ranking(self, start_date: datetime, end_date: datetime, limit: int = 10) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    s.id as store_id,
                    s.name as store_name,
                    s.city,
                    s.state,
                    COUNT(sa.id) as total_orders,
                    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
                    COUNT(DISTINCT sa.customer_id) as unique_customers,
                    RANK() OVER (ORDER BY SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) DESC) as revenue_rank
                FROM stores s
                LEFT JOIN sales sa ON s.id = sa.store_id 
                    AND sa.created_at BETWEEN $1 AND $2
                WHERE s.is_active = true
                GROUP BY s.id, s.name, s.city, s.state
                ORDER BY total_revenue DESC
                LIMIT $3
            """
            
            result = await self.db_pool.fetch(query, start_date, end_date, limit)
            
            ranking_data = []
            for row in result:
                ranking_data.append({
                    "store_id": row['store_id'],
                    "store_name": row['store_name'],
                    "city": row['city'],
                    "state": row['state'],
                    "total_orders": row['total_orders'] or 0,
                    "total_revenue": float(row['total_revenue'] or 0),
                    "avg_ticket": float(row['avg_ticket'] or 0),
                    "unique_customers": row['unique_customers'] or 0,
                    "revenue_rank": row['revenue_rank'] or 0
                })
            
            return ranking_data
            
        except Exception as e:
            logger.error(f"Erro ao buscar ranking: {str(e)}")
            raise

    async def get_all_stores(self) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    s.id,
                    s.name as store_name,
                    s.city,
                    s.state,
                    s.district,
                    sb.name as sub_brand_name,
                    s.is_active,
                    s.latitude,
                    s.longitude
                FROM stores s
                LEFT JOIN sub_brands sb ON s.sub_brand_id = sb.id
                WHERE s.is_active = true
                ORDER BY s.city, s.name
            """
            
            result = await self.db_pool.fetch(query)
            
            stores_data = []
            for row in result:
                stores_data.append({
                    "id": row['id'],
                    "name": row['store_name'],
                    "city": row['city'],
                    "state": row['state'],
                    "district": row['district'],
                    "sub_brand": row['sub_brand_name'],
                    "is_active": row['is_active'],
                    "latitude": float(row['latitude']) if row['latitude'] else None,
                    "longitude": float(row['longitude']) if row['longitude'] else None
                })
            
            return stores_data
            
        except Exception as e:
            logger.error(f"Erro ao buscar lojas: {str(e)}")
            raise

    async def get_overview_kpis(self, start_date: datetime, end_date: datetime) -> Dict[str, Any]:
        try:
            sales_query = """
                SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE NULL END) as avg_ticket,
                    COUNT(DISTINCT customer_id) as unique_customers
                FROM sales 
                WHERE created_at BETWEEN $1 AND $2
            """
            
            sales_result = await self.db_pool.fetchrow(sales_query, start_date, end_date)

            customers_query = """
                SELECT COUNT(*) as total_customers
                FROM customers
                WHERE created_at <= $1
            """
            
            customers_result = await self.db_pool.fetchrow(customers_query, end_date)

            new_customers_query = """
                SELECT COUNT(*) as new_customers
                FROM customers
                WHERE created_at BETWEEN $1 AND $2
            """
            
            new_customers_result = await self.db_pool.fetchrow(new_customers_query, start_date, end_date)

            return {
                "sales": {
                    "total_orders": sales_result['total_orders'] or 0 if sales_result else 0,
                    "total_revenue": float(sales_result['total_revenue'] or 0) if sales_result else 0,
                    "avg_ticket": float(sales_result['avg_ticket'] or 0) if sales_result else 0,
                    "unique_customers": sales_result['unique_customers'] or 0 if sales_result else 0
                },
                "customers": {
                    "total": customers_result['total_customers'] or 0 if customers_result else 0,
                    "new_last_30d": new_customers_result['new_customers'] or 0 if new_customers_result else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Erro ao buscar KPIs: {str(e)}")
            raise

    async def get_channel_performance(self, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    c.name as channel,
                    COUNT(s.id) as order_count,
                    SUM(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN s.total_amount ELSE 0 END) as total_revenue,
                    ROUND(
                        (COUNT(s.id) * 100.0 / NULLIF((
                            SELECT COUNT(*) 
                            FROM sales s2 
                            WHERE s2.created_at BETWEEN $1 AND $2
                        ), 0)),
                    2) as percentage
                FROM sales s
                JOIN channels c ON s.channel_id = c.id
                WHERE s.created_at BETWEEN $1 AND $2
                GROUP BY c.id, c.name
                ORDER BY order_count DESC
            """
            
            result = await self.db_pool.fetch(query, start_date, end_date)
            
            channels_data = []
            for row in result:
                channels_data.append({
                    "channel": row['channel'],
                    "order_count": row['order_count'],
                    "total_revenue": float(row['total_revenue'] or 0),
                    "percentage": float(row['percentage'] or 0)
                })
            
            return channels_data
            
        except Exception as e:
            logger.error(f"Erro ao buscar performance de canais: {str(e)}")
            raise

    async def get_sales_totals(self, start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        try:
            query = """
                SELECT 
                    COUNT(*) as total_orders,
                    SUM(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE 0 END) as total_revenue,
                    AVG(CASE WHEN sale_status_desc = 'COMPLETED' THEN total_amount ELSE NULL END) as avg_ticket
                FROM sales 
                WHERE created_at BETWEEN $1 AND $2
            """
            
            result = await self.db_pool.fetchrow(query, start_date, end_date)
            
            return [{
                "total_orders": result['total_orders'] or 0 if result else 0,
                "total_revenue": float(result['total_revenue'] or 0) if result else 0,
                "avg_ticket": float(result['avg_ticket'] or 0) if result else 0
            }]
            
        except Exception as e:
            logger.error(f"Erro ao buscar totais de vendas: {str(e)}")
            raise

    def generate_channel_insights(self, channels_data: List[Dict]) -> List[Dict[str, Any]]:
        insights = []
        
        if not channels_data:
            return insights
        
        total_orders = sum(channel['order_count'] for channel in channels_data)
        
        if total_orders > 0:
            top_channel = channels_data[0]
            if top_channel['percentage'] > 40:
                insights.append({
                    "type": "success",
                    "title": "Canal Dominante",
                    "message": f"{top_channel['channel']} representa {top_channel['percentage']}% das vendas"
                })
            
            if len(channels_data) >= 3:
                top_3_percentage = sum(channel['percentage'] for channel in channels_data[:3])
                if top_3_percentage > 80:
                    insights.append({
                        "type": "info", 
                        "title": "Vendas Concentradas",
                        "message": "Top 3 canais representam mais de 80% das vendas"
                    })
        
        return insights