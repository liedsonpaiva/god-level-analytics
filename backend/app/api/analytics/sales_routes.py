from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Sales"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/sales/trend")
def get_sales_trend(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            DATE(created_at) as date,
            COUNT(*) as sales_count,
            SUM(total_amount) as daily_revenue
        FROM sales  -- ⬅️ CORRIGIDO: sales
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
        """)
    ).all()

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