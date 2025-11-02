# backend/app/api/analytics/sales_routes.py
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Sales"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/sales/trend")
def get_sales_trend(
    days: int = Query(30, description="Período em dias"),
    channel: str = Query(None, description="Filtrar por canal"),
    session: Session = Depends(get_session)
):
    query_base = """
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as sales_count,
            SUM(total_amount) as daily_revenue
        FROM sales
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '{days} days'
    """
    
    if channel:
        query_base += f" AND channel_id IN (SELECT id FROM channels WHERE name = '{channel}')"
    
    query_base += " GROUP BY DATE(created_at) ORDER BY date"
    
    result = session.exec(text(query_base.format(days=days))).all()

    return {
        "sales_trend": [
            {
                "date": row[0].strftime("%Y-%m-%d"),
                "sales_count": row[1],
                "daily_revenue": float(row[2]) if row[2] else 0
            }
            for row in result
        ]
    }

# NOVO ENDPOINT - Análise por Horário
@router.get("/sales/time-analysis")
def get_time_analysis(
    days: int = Query(30, description="Período em dias"),
    channel: str = Query(None, description="Filtrar por canal"),
    session: Session = Depends(get_session)
):
    query_base = """
        SELECT 
            EXTRACT(HOUR FROM created_at) as hour,
            COUNT(*) as sales_count,
            SUM(total_amount) as total_revenue,
            AVG(delivery_seconds / 60.0) as avg_delivery_minutes,
            AVG(production_seconds / 60.0) as avg_production_minutes
        FROM sales
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '{days} days'
    """
    
    if channel:
        query_base += f" AND channel_id IN (SELECT id FROM channels WHERE name = '{channel}')"
    
    query_base += " GROUP BY EXTRACT(HOUR FROM created_at) ORDER BY hour"
    
    result = session.exec(text(query_base.format(days=days))).all()

    return {
        "time_analysis": [
            {
                "hour": int(row[0]),
                "sales_count": row[1],
                "total_revenue": float(row[2]) if row[2] else 0,
                "avg_delivery_time": float(row[3]) if row[3] else 0,
                "avg_production_time": float(row[4]) if row[4] else 0
            }
            for row in result
        ]
    }