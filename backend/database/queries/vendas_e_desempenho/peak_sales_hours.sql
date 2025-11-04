SELECT 
    EXTRACT(HOUR FROM s.created_at) as hour_of_day,
    COUNT(*) as order_count,
    SUM(s.total_amount) as total_revenue
FROM sales s
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY hour_of_day
ORDER BY order_count DESC;