from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Deliveries"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/deliveries/status")
def get_deliveries_status(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            status,  -- ⬅️ CORRIGIDO: campo direto da tabela
            COUNT(*) AS count,
            ROUND(AVG(delivery_seconds) / 60.0, 2) AS avg_time_minutes  -- ⬅️ CORRIGIDO: usando delivery_seconds
        FROM delivery_sales  -- ⬅️ CORRIGIDO: delivery_sales
        GROUP BY status
        ORDER BY count DESC
        """)
    ).all()

    return {
        "deliveries": [
            {
                "status": row[0],
                "count": row[1],
                "avg_time_minutes": float(row[2]) if row[2] else 0
            }
            for row in result
        ]
    }