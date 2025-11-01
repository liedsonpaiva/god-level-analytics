from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Categories"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/categories/performance")
def get_categories_performance(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            cat.name AS category_name,
            COUNT(ps.id) AS total_sales,
            SUM(ps.quantity) AS total_units,
            SUM(ps.total_price) AS total_revenue
        FROM categories cat  -- ⬅️ CORRIGIDO: categories
        JOIN products p ON cat.id = p.category_id  -- ⬅️ CORRIGIDO: products
        JOIN product_sales ps ON p.id = ps.product_id  -- ⬅️ CORRIGIDO: product_sales
        JOIN sales s ON s.id = ps.sale_id  -- ⬅️ CORRIGIDO: sales
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY cat.id, cat.name
        ORDER BY total_revenue DESC
        """)
    ).all()

    return {
        "categories": [
            {
                "name": row[0],
                "total_sales": row[1],
                "total_units": row[2],
                "total_revenue": float(row[3]) if row[3] else 0
            }
            for row in result
        ]
    }