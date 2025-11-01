# backend/app/repositories/analytics_repository.py
from sqlmodel import text

def get_overview(session):
    query = text("""
        SELECT 
            COUNT(*) AS total_sales,
            SUM(total_amount) AS total_revenue,
            AVG(total_amount) AS avg_ticket,
            COUNT(DISTINCT customer_id) AS unique_customers
        FROM sale
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    """)
    return session.exec(query).first()

def get_sales_trend(session):
    query = text("""
        SELECT 
            DATE(created_at) AS date,
            COUNT(*) AS sales_count,
            SUM(total_amount) AS daily_revenue
        FROM sale
        WHERE sale_status_desc = 'COMPLETED'
        AND created_at >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE(created_at)
        ORDER BY date
    """)
    return session.exec(query).all()

def get_channels_performance(session):
    query = text("""
        SELECT 
            c.name AS channel_name,
            c.type AS channel_type,
            COUNT(s.id) AS sales_count,
            SUM(s.total_amount) AS total_revenue,
            AVG(s.total_amount) AS avg_ticket
        FROM channel c
        JOIN sale s ON c.id = s.channel_id
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY c.id, c.name, c.type
        ORDER BY total_revenue DESC
    """)
    return session.exec(query).all()

def get_products_insights(session):
    query = text("""
        SELECT 
            p.name AS product_name,
            COUNT(ps.id) AS times_sold,
            SUM(ps.quantity) AS total_quantity,
            SUM(ps.total_price) AS total_revenue,
            COUNT(DISTINCT ips.id) AS total_customizations
        FROM product p
        JOIN product_sale ps ON p.id = ps.product_id
        JOIN sale s ON s.id = ps.sale_id
        LEFT JOIN item_product_sale ips ON ips.product_sale_id = ps.id
        WHERE s.sale_status_desc = 'COMPLETED'
        GROUP BY p.id, p.name
        ORDER BY total_revenue DESC
        LIMIT 10
    """)
    return session.exec(query).all()
