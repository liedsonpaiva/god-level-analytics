# backend/app/api/analytics/overview_routes.py
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Overview"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/overview")
def get_overview(
    days: int = Query(30, description="Período em dias"),
    channel: str = Query(None, description="Filtrar por canal"),
    session: Session = Depends(get_session)
):
    # Construir query dinâmica baseada nos filtros
    query_base = """
        SELECT 
            COUNT(*) as total_sales,
            SUM(total_amount) as total_revenue,
            AVG(total_amount) as avg_ticket,
            COUNT(DISTINCT customer_id) as unique_customers
        FROM sales
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '{days} days'
    """
    
    if channel:
        query_base += f" AND channel_id IN (SELECT id FROM channels WHERE name = '{channel}')"
    
    result = session.exec(text(query_base.format(days=days))).first()

    return {
        "total_sales": result[0] or 0,
        "total_revenue": float(result[1]) if result[1] else 0,
        "avg_ticket": float(result[2]) if result[2] else 0,
        "unique_customers": result[3] or 0
    }