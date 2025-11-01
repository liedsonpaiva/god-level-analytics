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