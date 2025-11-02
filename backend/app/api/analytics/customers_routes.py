from fastapi import APIRouter, Depends, Query
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
    
# backend/app/api/analytics/customers_routes.py - ADICIONAR ESTE ENDPOINT
@router.get("/customers/insights")
def get_customer_insights(
    days: int = Query(30, description="Período em dias"),
    session: Session = Depends(get_session)
):
    # Taxa de retorno
    repeat_query = text(f"""
        WITH customer_orders AS (
            SELECT 
                customer_id,
                COUNT(DISTINCT DATE(created_at)) as order_days,
                COUNT(*) as total_orders
            FROM sales 
            WHERE created_at >= CURRENT_DATE - INTERVAL '{days} days'
              AND sale_status_desc = 'COMPLETED'
              AND customer_id IS NOT NULL
            GROUP BY customer_id
        )
        SELECT 
            ROUND(
                COUNT(CASE WHEN total_orders > 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0),
                1
            ) as repeat_rate,
            ROUND(AVG(total_orders), 1) as avg_orders_per_customer,
            ROUND(AVG(s.total_amount), 2) as avg_customer_value
        FROM customer_orders co
        JOIN sales s ON s.customer_id = co.customer_id
    """)
    
    repeat_result = session.exec(repeat_query).first()
    
    # Clientes em risco
    at_risk_query = text(f"""
        WITH last_purchases AS (
            SELECT 
                c.id as customer_id,
                c.customer_name,
                MAX(s.created_at) as last_purchase,
                COUNT(s.id) as total_orders,
                SUM(s.total_amount) as total_spent
            FROM customers c
            JOIN sales s ON s.customer_id = c.id
            WHERE s.sale_status_desc = 'COMPLETED'
            GROUP BY c.id, c.customer_name
        )
        SELECT 
            customer_id,
            customer_name,
            total_orders,
            total_spent,
            EXTRACT(DAYS FROM (NOW() - last_purchase)) as last_purchase_days
        FROM last_purchases
        WHERE last_purchase < NOW() - INTERVAL '30 days'
          AND total_orders >= 3
        ORDER BY total_spent DESC
        LIMIT 10
    """)
    
    at_risk_result = session.exec(at_risk_query).all()
    
    # Clientes fiéis
    loyal_query = text(f"""
        SELECT 
            c.id as customer_id,
            c.customer_name,
            COUNT(s.id) as total_orders,
            SUM(s.total_amount) as total_spent
        FROM customers c
        JOIN sales s ON s.customer_id = c.id
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY c.id, c.customer_name
        HAVING COUNT(s.id) >= 5
        ORDER BY total_spent DESC
        LIMIT 5
    """)
    
    loyal_result = session.exec(loyal_query).all()

    return {
        "repeat_rate": repeat_result[0] if repeat_result else 0,
        "avg_customer_value": float(repeat_result[2]) if repeat_result and repeat_result[2] else 0,
        "at_risk_customers": [
            {
                "customer_id": row[0],
                "name": row[1],
                "total_orders": row[2],
                "total_spent": float(row[3]) if row[3] else 0,
                "last_purchase_days": int(row[4]) if row[4] else 0
            }
            for row in at_risk_result
        ],
        "loyal_customers": [
            {
                "customer_id": row[0],
                "name": row[1],
                "total_orders": row[2],
                "total_spent": float(row[3]) if row[3] else 0
            }
            for row in loyal_result
        ]
    }