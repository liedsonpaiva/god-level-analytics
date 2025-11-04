-- backend/database/queries/stores/store_ranking.sql
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.city,
    s.state,
    COUNT(sa.id) as total_orders,
    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
    COUNT(DISTINCT sa.customer_id) as unique_customers,
    RANK() OVER (ORDER BY SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) DESC) as revenue_rank
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id 
    AND sa.created_at BETWEEN $1 AND $2
WHERE s.is_active = true
GROUP BY s.id, s.name, s.city, s.state
ORDER BY total_revenue DESC
LIMIT 10