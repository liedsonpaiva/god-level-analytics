from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Dict, Any
from datetime import date, datetime, timedelta
from app.services.analytics_service import AnalyticsService
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.services.query_builder import QueryBuilder
from app.services.insight_detector import InsightDetector
from app.core.dependencies import get_db

router = APIRouter(prefix="/analytics", tags=["analytics"])

# ==================== 📊 NOVOS ENDPOINTS PARA O FRONTEND ====================

@router.get("/debug/queries")
async def debug_queries(db_pool = Depends(get_db)):
    """Debug endpoint para verificar queries"""
    try:
        query_builder = QueryBuilder(db_pool)
        
        # Testar cada query
        queries_to_test = [
            ('vendas_e_desempenho', 'total_sales_period'),
            ('vendas_e_desempenho', 'top_sales_channel'),
            ('vendas_e_desempenho', 'top_sales_day_week'),
            ('vendas_e_desempenho', 'peak_sales_hours'),
            ('vendas_e_desempenho', 'cancellation_rate'),
            ('produtos', 'top_revenue_categories'),
            ('produtos', 'top_addon_items'),
            ('produtos', 'avg_product_prices'),
            ('produtos', 'top_bottom_products'),
            ('clientes', 'total_customers'),
            ('clientes', 'promotion_optin_rate'),
            ('clientes', 'customer_age_distribution'),
            ('clientes', 'avg_orders_per_customer'),
        ]
        
        results = {}
        for category, query_name in queries_to_test:
            try:
                # Tentar carregar a query
                query_content = await query_builder.load_query(category, query_name)
                results[f"{category}/{query_name}"] = {
                    "status": "✅ Encontrada",
                    "size": len(query_content),
                    "preview": query_content[:100] + "..." if len(query_content) > 100 else query_content
                }
                
                # Tentar executar a query com datas padrão
                start_date = date(2024, 1, 1)
                end_date = date(2024, 1, 31)
                query_data = await query_builder.execute_query(category, query_name, (start_date, end_date))
                results[f"{category}/{query_name}"]["execution"] = {
                    "status": "✅ Sucesso",
                    "results_count": len(query_data)
                }
                
            except FileNotFoundError:
                results[f"{category}/{query_name}"] = {
                    "status": "❌ Arquivo não encontrado"
                }
            except Exception as e:
                results[f"{category}/{query_name}"] = {
                    "status": "❌ Erro",
                    "error": str(e)
                }
        
        return {"queries": results}
        
    except Exception as e:
        return {"error": f"Erro no debug: {str(e)}"}
    
@router.get("/stores/comparison")
async def compare_stores(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    store_ids: str = Query(..., description="IDs das lojas separados por vírgula"),
    db_pool = Depends(get_db)  # MUDAR para db_pool
):
    """Comparação detalhada entre múltiplas lojas"""
    try:
        print(f"🏪 Comparando lojas: {store_ids} - {start_date} até {end_date}")
        
        # Converter string de IDs para lista
        store_ids_list = [int(id.strip()) for id in store_ids.split(',')]
        
        analytics_service = AnalyticsService(db_pool)
        data = await analytics_service.get_store_comparison(  # MUDAR: adicionar await
            datetime.strptime(start_date, "%Y-%m-%d").date(),
            datetime.strptime(end_date, "%Y-%m-%d").date(),
            store_ids_list
        )
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        print(f"❌ Erro na comparação: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na comparação: {str(e)}")

@router.get("/stores/regions")
async def get_store_regions(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)  # MUDAR: db_pool em vez de db: Session
):
    """Métricas agrupadas por região (cidade/estado)"""
    try:
        print(f"🗺️ Buscando regiões: {start_date} até {end_date}")
        
        # CRIAR AnalyticsService com pool assíncrono
        analytics_service = AnalyticsService(db_pool)
        data = await analytics_service.get_store_regions(  # MUDAR: adicionar await
            datetime.strptime(start_date, "%Y-%m-%d").date(),
            datetime.strptime(end_date, "%Y-%m-%d").date()
        )
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        print(f"❌ Erro nas regiões: {e}")
        raise HTTPException(status_code=500, detail=f"Erro nas regiões: {str(e)}")

@router.get("/stores/ranking")
async def get_store_ranking(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    limit: int = Query(10, ge=1, le=50),
    db_pool = Depends(get_db)  # MUDAR: db_pool em vez de db: Session
):
    """Ranking das lojas por performance"""
    try:
        print(f"🏆 Buscando ranking top {limit}: {start_date} até {end_date}")
        
        # CRIAR AnalyticsService com pool assíncrono
        analytics_service = AnalyticsService(db_pool)
        data = await analytics_service.get_store_ranking(  # MUDAR: adicionar await
            datetime.strptime(start_date, "%Y-%m-%d").date(),
            datetime.strptime(end_date, "%Y-%m-%d").date(),
            limit
        )
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        print(f"❌ Erro no ranking: {e}")
        raise HTTPException(status_code=500, detail=f"Erro no ranking: {str(e)}")

@router.get("/stores/ranking")
async def get_store_ranking(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db)
):
    """Ranking das lojas por performance"""
    try:
        print(f"🏆 Buscando ranking top {limit}: {start_date} até {end_date}")
        
        analytics_service = AnalyticsService(db)
        data = analytics_service.get_store_ranking(
            datetime.strptime(start_date, "%Y-%m-%d").date(),
            datetime.strptime(end_date, "%Y-%m-%d").date(),
            limit
        )
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no ranking: {str(e)}")

@router.get("/stores/list")
async def get_all_stores(db_pool = Depends(get_db)):  # MUDAR para db_pool
    """Lista todas as lojas ativas"""
    try:
        print("🏪 Buscando lista de lojas")
        
        analytics_service = AnalyticsService(db_pool)
        data = await analytics_service.get_all_stores()  # MUDAR: adicionar await
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        print(f"❌ Erro na lista de lojas: {e}")
        raise HTTPException(status_code=500, detail=f"Erro na lista de lojas: {str(e)}")

@router.get("/overview")
async def get_overview_kpis(
    days: int = Query(30, ge=1, le=365),
    db_pool = Depends(get_db)
):
    """KPIs gerais para o dashboard"""
    try:
        print(f"📊 Dashboard requisitou overview: {days} dias")
        
        # ✅ CORREÇÃO: Usar datas do período real dos dados (2025)
        end_date = datetime(2025, 11, 3).date()  # Data do seu banco
        start_date = end_date - timedelta(days=days)
        
        print(f"📅 Usando período real: {start_date} até {end_date}")
        
        # Buscar dados reais
        query_builder = QueryBuilder(db_pool)
        
        # Buscar vendas totais
        sales_data = await query_builder.get_total_sales_period(start_date, end_date)
        total_customers_data = await query_builder.get_total_customers()
        
        # Formatar resposta
        sales_summary = sales_data[0] if sales_data else {}
        customers_summary = total_customers_data[0] if total_customers_data else {}
        
        overview_data = {
            "sales": {
                "total_orders": sales_summary.get("total_orders", 0),
                "total_revenue": float(sales_summary.get("total_revenue", 0)),
                "avg_ticket": float(sales_summary.get("avg_ticket", 0)),
                "unique_customers": int(sales_summary.get("total_orders", 0) * 0.7)  # Estimativa
            },
            "customers": {
                "total": customers_summary.get("total_customers", 0),
                "new_last_30d": int(customers_summary.get("total_customers", 0) * 0.03)  # Estimativa
            }
        }
        
        print(f"✅ Overview data: {overview_data}")
        return overview_data
        
    except Exception as e:
        print(f"❌ Erro no overview: {e}")
        raise HTTPException(status_code=500, detail=f"Erro no overview: {str(e)}")
    
@router.get("/top-channels")
async def get_top_channels(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Performance por canal de venda - para Dashboard"""
    try:
        print(f"📊 Requisitado top-channels: {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_top_sales_channel(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos canais: {str(e)}")

@router.get("/total-sales")
async def get_total_sales(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Totais de vendas para validação - para Dashboard"""
    try:
        print(f"📊 Requisitado total-sales: {start_date} até {end_date}")
        
        # ✅ CORREÇÃO: Usar as datas do frontend (que são de 2025)
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_total_sales_period(start_dt, end_dt)
        
        # Formatar para o formato esperado pelo frontend
        sales_summary = data[0] if data else {}
        sales_data = {
            "total_orders": sales_summary.get("total_orders", 0),
            "total_revenue": float(sales_summary.get("total_revenue", 0)),
            "avg_ticket": float(sales_summary.get("avg_ticket", 0))
        }
        
        return {
            "data": [sales_data],
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nas vendas totais: {str(e)}")

@router.get("/top-days")
async def get_top_days(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Dias da semana com maior volume de vendas - para SalesPage"""
    try:
        print(f"📊 SalesPage: top-days para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_top_sales_day_week(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos dias: {str(e)}")

@router.get("/peak-hours")
async def get_peak_hours(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Horários de pico de vendas - para SalesPage"""
    try:
        print(f"📊 SalesPage: peak-hours para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_peak_sales_hours(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos horários: {str(e)}")

@router.get("/cancellation-rate")
async def get_cancellation_rate(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Taxa de cancelamento de pedidos - para SalesPage"""
    try:
        print(f"📊 SalesPage: cancellation-rate para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_cancellation_rate(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no cancelamento: {str(e)}")

@router.get("/top-categories")
async def get_top_categories(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Categorias de produtos com melhor performance - para ProductsPage"""
    try:
        print(f"🍔 ProductsPage: top-categories para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_top_revenue_categories(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nas categorias: {str(e)}")

@router.get("/top-addons")
async def get_top_addons(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Itens adicionais mais pedidos - para ProductsPage"""
    try:
        print(f"🍔 ProductsPage: top-addons para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_top_addon_items(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos adicionais: {str(e)}")

@router.get("/top-products")
async def get_top_products(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    limit: int = Query(10, ge=1, le=50),
    db_pool = Depends(get_db)
):
    """Produtos mais vendidos - para ProductsPage"""
    try:
        print(f"🍔 ProductsPage: top-products para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_top_bottom_products(start_dt, end_dt)
        
        # Filtrar apenas os top produtos (primeiros da lista)
        top_products = data[:limit] if data else []
        
        return {
            "data": top_products,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos produtos: {str(e)}")

@router.get("/avg-product-prices")
async def get_avg_product_prices(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Estatísticas de preços dos produtos - para ProductsPage"""
    try:
        print(f"🍔 ProductsPage: avg-product-prices para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_avg_product_prices(start_dt, end_dt)
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro nos preços: {str(e)}")

@router.get("/total-customers")
async def get_total_customers(db_pool = Depends(get_db)):
    """Total de clientes cadastrados - para CustomersPage"""
    try:
        print(f"👥 CustomersPage: total-customers")
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_total_customers()
        
        customers_summary = data[0] if data else {}
        
        return {
            "data": [customers_summary],
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no total de clientes: {str(e)}")

@router.get("/promotion-optin")
async def get_promotion_optin(db_pool = Depends(get_db)):
    """Aceitação de promoções por email - para CustomersPage"""
    try:
        print(f"👥 CustomersPage: promotion-optin")
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_promotion_optin_rate()
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no opt-in: {str(e)}")

@router.get("/customer-age-distribution")
async def get_customer_age_distribution(db_pool = Depends(get_db)):
    """Distribuição de clientes por faixa etária - para CustomersPage"""
    try:
        print(f"👥 CustomersPage: customer-age-distribution")
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_customer_age_distribution()
        
        return {
            "data": data,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na distribuição etária: {str(e)}")

@router.get("/avg-orders-per-customer")
async def get_avg_orders_per_customer(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Média de pedidos por cliente - para CustomersPage"""
    try:
        print(f"👥 CustomersPage: avg-orders-per-customer para {start_date} até {end_date}")
        
        # Converter strings para date
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query_builder = QueryBuilder(db_pool)
        data = await query_builder.get_avg_orders_per_customer(start_dt, end_dt)
        
        orders_summary = data[0] if data else {}
        
        return {
            "data": [orders_summary],
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na média de pedidos: {str(e)}")

# ==================== 📊 ENDPOINTS ADICIONAIS ====================

@router.get("/data-availability")
async def get_data_availability(
    start_date: str = Query(..., description="Data inicial (YYYY-MM-DD)"),
    end_date: str = Query(..., description="Data final (YYYY-MM-DD)"),
    db_pool = Depends(get_db)
):
    """Verifica se existem dados para o período solicitado"""
    try:
        start_dt = datetime.strptime(start_date, "%Y-%m-%d").date()
        end_dt = datetime.strptime(end_date, "%Y-%m-%d").date()
        
        query = """
            SELECT 
                COUNT(*) as total_sales,
                MIN(DATE(created_at)) as data_start,
                MAX(DATE(created_at)) as data_end
            FROM sales 
            WHERE created_at BETWEEN $1 AND $2
            AND sale_status_desc = 'COMPLETED'
        """
        
        result = await db_pool.fetchrow(query, start_dt, end_dt)
        
        return {
            "has_data": result["total_sales"] > 0 if result else False,
            "total_sales": result["total_sales"] if result else 0,
            "data_start": str(result["data_start"]) if result and result["data_start"] else None,
            "data_end": str(result["data_end"]) if result and result["data_end"] else None,
            "requested_period": f"{start_date} to {end_date}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar dados: {str(e)}")

@router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# ==================== 📊 ENDPOINTS EXISTENTES (COMPATIBILIDADE) ====================

# Health check simples
@router.get("/")
async def analytics_root():
    return {"message": "Analytics API", "endpoints": "Use /docs para ver todos os endpoints"}