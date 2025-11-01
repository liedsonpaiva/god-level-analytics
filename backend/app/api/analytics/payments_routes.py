from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Payments"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/payments/summary")
def get_payment_summary(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            pt.description AS payment_method,  -- ⬅️ CORRIGIDO: description
            COUNT(p.id) AS total_payments,
            SUM(p.value) AS total_amount,  -- ⬅️ CORRIGIDO: value (não amount)
            ROUND(AVG(p.value), 2) AS avg_amount  -- ⬅️ CORRIGIDO: value
        FROM payments p  -- ⬅️ CORRIGIDO: payments
        JOIN payment_types pt ON p.payment_type_id = pt.id  -- ⬅️ CORRIGIDO: payment_types
        JOIN sales s ON s.id = p.sale_id  -- ⬅️ CORRIGIDO: sales
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY pt.id, pt.description
        ORDER BY total_amount DESC
        """)
    ).all()

    return {
        "payment_methods": [
            {
                "method": row[0],
                "total_payments": row[1],
                "total_amount": float(row[2]) if row[2] else 0,
                "avg_amount": float(row[3]) if row[3] else 0
            }
            for row in result
        ]
    }