-- database/queries/vendas_e_desempenho/product_performance_by_channel_time.sql
WITH product_metrics AS (
    SELECT 
        p.name as product_name,
        c.name as category,
        ch.name as channel,
        EXTRACT(HOUR FROM s.created_at) as hour,
        EXTRACT(DOW FROM s.created_at) as day_of_week,
        COUNT(*) as total_orders,
        SUM(ps.quantity) as total_quantity,
        SUM(ps.total_price) as total_revenue,
        AVG(ps.total_price) as avg_price_per_order
    FROM products p
    JOIN product_sales ps ON p.id = ps.product_id
    JOIN sales s ON ps.sale_id = s.id
    JOIN categories cat ON p.category_id = cat.id
    JOIN channels ch ON s.channel_id = ch.id
    WHERE s.sale_status_desc = 'COMPLETED'
      AND s.created_at >= %(start_date)s
      AND s.created_at <= %(end_date)s
    GROUP BY p.name, c.name, ch.name, hour, day_of_week
)
SELECT * FROM product_metrics
ORDER BY total_revenue DESC;

-- database/queries/clientes/repeat_customer_analysis.sql
WITH customer_metrics AS (
    SELECT 
        c.id as customer_id,
        c.customer_name,
        COUNT(DISTINCT DATE(s.created_at)) as distinct_days_visited,
        COUNT(s.id) as total_orders,
        SUM(s.total_amount) as total_spent,
        AVG(s.total_amount) as avg_ticket,
        MAX(s.created_at) as last_order_date,
        MIN(s.created_at) as first_order_date
    FROM customers c
    JOIN sales s ON c.id = s.customer_id
    WHERE s.sale_status_desc = 'COMPLETED'
    GROUP BY c.id, c.customer_name
    HAVING COUNT(s.id) >= 3  -- Clientes com 3+ pedidos
)
SELECT 
    *,
    CASE 
        WHEN last_order_date < CURRENT_DATE - INTERVAL '30 days' THEN 'CHURN_RISK'
        WHEN last_order_date < CURRENT_DATE - INTERVAL '60 days' THEN 'CHURNED'
        ELSE 'ACTIVE'
    END as customer_status
FROM customer_metrics
ORDER BY total_spent DESC;