from fastapi import APIRouter, Depends
from sqlmodel import Session, text, create_engine
from app.core.connect import get_db_connection_string

router = APIRouter(tags=["Customers"])

connection_string = get_db_connection_string()
engine = create_engine(connection_string)

def get_session():
    with Session(engine) as session:
        yield session
        
@router.get("/customers/insights")
def get_customers_insights(session: Session = Depends(get_session)):
    result = session.exec(
        text("""
        SELECT 
            CASE 
                WHEN age < 25 THEN '18-24'
                WHEN age BETWEEN 25 AND 34 THEN '25-34'
                WHEN age BETWEEN 35 AND 44 THEN '35-44'
                WHEN age BETWEEN 45 AND 54 THEN '45-54'
                ELSE '55+' 
            END AS age_group,
            COUNT(*) AS customer_count,
            AVG(total_spent) AS avg_spent
        FROM (
            SELECT 
                c.id,
                DATE_PART('year', AGE(c.birth_date)) AS age,
                SUM(s.total_amount) AS total_spent
            FROM customers c  -- ⬅️ CORRIGIDO: customers
            JOIN sales s ON c.id = s.customer_id  -- ⬅️ CORRIGIDO: sales
            WHERE s.sale_status_desc = 'COMPLETED'
            GROUP BY c.id, c.birth_date
        ) sub
        GROUP BY age_group
        ORDER BY age_group
        """)
    ).all()

    return {
        "customer_insights": [
            {
                "age_group": row[0],
                "customer_count": row[1],
                "avg_spent": float(row[2]) if row[2] else 0
            }
            for row in result
        ]
    }