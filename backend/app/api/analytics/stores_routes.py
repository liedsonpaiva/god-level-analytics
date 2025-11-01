from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Stores"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/stores/performance")
def get_stores_performance(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            st.name AS store_name,
            COUNT(s.id) AS total_sales,
            SUM(s.total_amount) AS total_revenue,
            AVG(s.total_amount) AS avg_ticket
        FROM stores st  -- ⬅️ CORRIGIDO: stores
        JOIN sales s ON st.id = s.store_id  -- ⬅️ CORRIGIDO: sales
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY st.id, st.name
        ORDER BY total_revenue DESC
        """)
    ).all()

    return {
        "stores_performance": [
            {
                "store_name": row[0],
                "total_sales": row[1],
                "total_revenue": float(row[2]) if row[2] else 0,
                "avg_ticket": float(row[3]) if row[3] else 0
            }
            for row in result
        ]
    }