from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Overview"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/overview")
def get_overview(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            COUNT(*) as total_sales,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_ticket,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM sales  -- ⬅️ CORRIGIDO: sales
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        """)
    ).first()

    return {
        "total_sales": result[0] or 0,
        "total_revenue": float(result[1]) if result[1] else 0,
        "avg_ticket": float(result[2]) if result[2] else 0,
        "unique_customers": result[3] or 0
    }