SELECT 
    s.city,
    s.state,
    COUNT(DISTINCT s.id) as store_count,
    COUNT(sa.id) as total_orders,
    SUM(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN sa.sale_status_desc = 'COMPLETED' THEN sa.total_amount ELSE NULL END) as avg_ticket,
    ROUND(
        COUNT(CASE WHEN sa.sale_status_desc = 'CANCELLED' THEN 1 END) * 100.0 / NULLIF(COUNT(sa.id), 0),
    2) as cancellation_rate
FROM stores s
LEFT JOIN sales sa ON s.id = sa.store_id 
    AND sa.created_at BETWEEN $1 AND $2
WHERE s.is_active = true
GROUP BY s.city, s.state
ORDER BY total_revenue DESC