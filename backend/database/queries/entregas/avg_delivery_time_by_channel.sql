SELECT 
    c.name as channel,
    AVG(s.delivery_seconds) as avg_delivery_time_seconds,
    COUNT(*) as delivery_count,
    MIN(s.delivery_seconds) as min_delivery_time,
    MAX(s.delivery_seconds) as max_delivery_time
FROM sales s
JOIN channels c ON s.channel_id = c.id
WHERE s.sale_status_desc = 'COMPLETED'
AND s.delivery_seconds IS NOT NULL
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY c.id, c.name
ORDER BY avg_delivery_time_seconds;