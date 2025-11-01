from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Channels"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/channels/performance")
def get_channels_performance(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            c.name as channel_name,
            c.type as channel_type,
            COUNT(s.id) as sales_count,
            SUM(s.total_amount) as total_revenue,
            AVG(s.total_amount) as avg_ticket
        FROM channels c  -- ⬅️ CORRIGIDO: channels
        JOIN sales s ON c.id = s.channel_id  -- ⬅️ CORRIGIDO: sales
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY c.id, c.name, c.type
        ORDER BY total_revenue DESC
        """)
    ).all()

    return {
        "channels": [
            {
                "name": row[0],
                "type": row[1],
                "sales_count": row[2],
                "total_revenue": float(row[3]) if row[3] else 0,
                "avg_ticket": float(row[4]) if row[4] else 0
            }
            for row in result
        ]
    }