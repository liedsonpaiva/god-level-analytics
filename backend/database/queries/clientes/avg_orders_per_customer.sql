-- Pedidos médios por cliente - CORRIGIDO
WITH customer_monthly_orders AS (
    SELECT 
        c.id,
        DATE_TRUNC('month', s.created_at) as month,
        COUNT(*) as monthly_orders
    FROM customers c
    JOIN sales s ON c.id = s.customer_id
    WHERE s.sale_status_desc = 'COMPLETED'
    AND DATE(s.created_at) BETWEEN $1 AND $2
    GROUP BY c.id, month
)
SELECT 
    ROUND(AVG(monthly_orders), 2) as avg_orders_per_customer_monthly,
    MAX(monthly_orders) as max_orders_customer,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY monthly_orders) as median_orders
FROM customer_monthly_orders;