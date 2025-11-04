import asyncpg
import os
from typing import Dict, List, Any, Tuple, Optional
from datetime import date
from pathlib import Path

class QueryBuilder:
    def __init__(self, db_pool: asyncpg.Pool):
        self.db_pool = db_pool
        self.queries_base_path = Path("database/queries")
    
    async def load_query(self, category: str, query_name: str) -> str:
        query_path = self.queries_base_path / category / f"{query_name}.sql"
        
        print(f"🔍 Buscando query: {query_path}")
        
        if not query_path.exists():
            raise FileNotFoundError(f"Query não encontrada: {query_path}")
        
        with open(query_path, 'r', encoding='utf-8') as f:
            query_content = f.read()
            print(f"✅ Query carregada: {query_path} ({len(query_content)} chars)")
            return query_content
    
    async def execute_query(self, category: str, query_name: str, params: Optional[Tuple] = None) -> List[Dict]:
        try:
            query = await self.load_query(category, query_name)
            
            print(f"🚀 Executando query: {category}/{query_name}")
            print(f"📋 Parâmetros: {params}")
            print(f"📝 Query preview: {query[:200]}...")
            
            async with self.db_pool.acquire() as connection:
                if params and any(f'${i+1}' in query for i in range(len(params))):
                    print(f"🔧 Query USA parâmetros: {params}")
                    result = await connection.fetch(query, *params)
                else:
                    print("🔧 Query SEM parâmetros")
                    result = await connection.fetch(query)
                
                print(f"✅ Query executada com sucesso: {len(result)} resultados")
                return [dict(row) for row in result]
                
        except Exception as e:
            print(f"❌ Erro executando query {category}/{query_name}: {e}")
            raise e

    async def get_total_sales_period(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'total_sales_period', (start_date, end_date))
    
    async def get_avg_ticket(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'avg_ticket', (start_date, end_date))
    
    async def get_top_sales_channel(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'top_sales_channel', (start_date, end_date))
    
    async def get_top_sales_day_week(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'top_sales_day_week', (start_date, end_date))
    
    async def get_peak_sales_hours(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'peak_sales_hours', (start_date, end_date))
    
    async def get_total_discounts_month(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'total_discounts_month', (start_date, end_date))
    
    async def get_cancellation_rate(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'cancellation_rate', (start_date, end_date))
    
    async def get_avg_delivery_fees(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'avg_delivery_fees', (start_date, end_date))
    
    async def get_sales_by_store_city(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('vendas_e_desempenho', 'sales_by_store_city', (start_date, end_date))

    async def get_top_revenue_categories(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'top_revenue_categories', (start_date, end_date))
    
    async def get_top_addon_items(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'top_addon_items', (start_date, end_date))
    
    async def get_avg_product_prices(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'avg_product_prices', (start_date, end_date))
    
    async def get_customization_distribution(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'customization_distribution', (start_date, end_date))
    
    async def get_top_bottom_products(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'top_bottom_products', (start_date, end_date))
    
    async def get_low_margin_products(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('produtos', 'low_margin_products', (start_date, end_date))

    async def get_total_customers(self) -> List[Dict]:
        return await self.execute_query('clientes', 'total_customers')
    
    async def get_promotion_optin_rate(self) -> List[Dict]:
        return await self.execute_query('clientes', 'promotion_optin_rate')
    
    async def get_customer_age_distribution(self) -> List[Dict]:
        return await self.execute_query('clientes', 'customer_age_distribution')
    
    async def get_avg_orders_per_customer(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('clientes', 'avg_orders_per_customer', (start_date, end_date))

    async def get_avg_delivery_time_by_channel(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('entregas', 'avg_delivery_time_by_channel', (start_date, end_date))
    
    async def get_top_delivery_cities_neighborhoods(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('entregas', 'top_delivery_cities_neighborhoods', (start_date, end_date))
    
    async def get_delivery_type_distribution(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('entregas', 'delivery_type_distribution', (start_date, end_date))
    
    async def get_avg_delivery_cost(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('entregas', 'avg_delivery_cost', (start_date, end_date))

    async def get_top_payment_methods(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('pagamentos', 'top_payment_methods', (start_date, end_date))
    
    async def get_total_by_payment_method(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('pagamentos', 'total_by_payment_method', (start_date, end_date))
    
    async def get_split_payment_analysis(self, start_date: date, end_date: date) -> List[Dict]:
        return await self.execute_query('pagamentos', 'split_payment_analysis', (start_date, end_date))