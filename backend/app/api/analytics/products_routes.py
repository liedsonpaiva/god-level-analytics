from fastapi import APIRouter, Depends, Query
from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Products"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/products/top-insights")
def get_products_insights(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            p.name as product_name,
            COUNT(ps.id) as times_sold,
            SUM(ps.quantity) as total_quantity,
            SUM(ps.total_price) as total_revenue,
            COUNT(DISTINCT ips.id) as total_customizations
        FROM products p  -- ⬅️ CORRIGIDO: products
        JOIN product_sales ps ON p.id = ps.product_id  -- ⬅️ CORRIGIDO: product_sales
        JOIN sales s ON s.id = ps.sale_id  -- ⬅️ CORRIGIDO: sales
        LEFT JOIN item_product_sales ips ON ips.product_sale_id = ps.id  -- ⬅️ CORRIGIDO: item_product_sales
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY p.id, p.name
        ORDER BY total_revenue DESC
        LIMIT 10
        """)
    ).all()

    return {
        "top_products": [
            {
                "name": row[0],
                "times_sold": row[1],
                "total_quantity": row[2],
                "total_revenue": float(row[3]) if row[3] else 0,
                "customization_rate": f"{(row[4]/row[1]*100 if row[1] > 0 else 0):.1f}%"
            }
            for row in result
        ]
    }
    
# NOVO ENDPOINT - Performance Detalhada com Margens (CORRIGIDO SEM SUBQUERY)
@router.get("/products/performance")
def get_products_performance(
    days: int = Query(30, description="Período em dias"),
    channel: str = Query(None, description="Filtrar por canal"),
    session: Session = Depends(get_session)
):
    query_base = """
        SELECT 
            p.id,
            p.name,
            cat.name as category,
            COUNT(ps.id) as times_sold,
            SUM(ps.total_price) as total_revenue,
            -- Margem estimada (baseada em regra de negócio) - CORRIGIDO
            CAST(
                (SUM(ps.total_price) - (COUNT(ps.id) * 8.0)) * 100.0 / NULLIF(SUM(ps.total_price), 0) 
                AS NUMERIC(10,1)
            ) as profit_margin,
            -- Taxa de customização - CORRIGIDO
            CAST(
                COUNT(DISTINCT CASE WHEN ips.id IS NOT NULL THEN ps.id END) * 100.0 / NULLIF(COUNT(DISTINCT ps.id), 0)
                AS NUMERIC(10,1)
            ) as customization_rate,
            -- Item mais adicionado (CORRIGIDO - sem subquery problemática)
            (
                SELECT i.name 
                FROM item_product_sales ips2
                JOIN items i ON i.id = ips2.item_id  
                JOIN product_sales ps2 ON ps2.id = ips2.product_sale_id
                WHERE ps2.product_id = p.id
                GROUP BY i.name
                ORDER BY COUNT(*) DESC
                LIMIT 1
            ) as most_added_item
        FROM products p
        JOIN categories cat ON cat.id = p.category_id
        JOIN product_sales ps ON ps.product_id = p.id
        JOIN sales s ON s.id = ps.sale_id
        LEFT JOIN item_product_sales ips ON ips.product_sale_id = ps.id
        WHERE s.sale_status_desc = 'COMPLETED'
        AND s.created_at >= CURRENT_DATE - INTERVAL '{days} days'
    """
    
    if channel:
        query_base += f" AND s.channel_id IN (SELECT id FROM channels WHERE name = '{channel}')"
    
    query_base += " GROUP BY p.id, p.name, cat.name ORDER BY total_revenue DESC LIMIT 15"
    
    result = session.exec(text(query_base.format(days=days))).all()

    return {
        "products_performance": [
            {
                "id": row[0],
                "name": row[1],
                "category": row[2],
                "times_sold": row[3],
                "total_revenue": float(row[4]) if row[4] else 0,
                "profit_margin": float(row[5]) if row[5] else 0,
                "customization_rate": f"{row[6]}%" if row[6] else "0%",
                "most_added_item": row[7] or "Nenhum"
            }
            for row in result
        ]
    }