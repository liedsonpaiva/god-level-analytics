-- backend/database/queries/stores/store_comparison.sql
SELECT 
    s.id as store_id,
    s.name as store_name,
    s.city,
    s.state,
    COUNT(sa.id) as total_orders,
    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
    COUNT(DISTINCT sa.customer_id) as unique_customers,
    ROUND(
        COUNT(CASE WHEN sa.sale_status_desc = 'CANCELLED' THEN 1 END) * 100.0 / NULLIF(COUNT(sa.id), 0),
    2) as cancellation_rate,
    -- Métricas de eficiência
    AVG(sa.production_seconds) as avg_production_time,
    AVG(sa.delivery_seconds) as avg_delivery_time
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id 
    AND sa.created_at BETWEEN $1 AND $2
WHERE s.id = ANY($3)  -- Filtro por IDs de lojas
GROUP BY s.id, s.name, s.city, s.state
ORDER BY total_revenue DESC