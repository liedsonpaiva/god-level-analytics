SELECT 
    ds.delivery_type,
    COUNT(*) as order_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM delivery_sales ds2 JOIN sales s ON ds2.sale_id = s.id WHERE s.sale_status_desc = 'COMPLETED' AND DATE(s.created_at) BETWEEN $1 AND $2)), 2) as percentage,
    AVG(s.total_amount) as avg_ticket
FROM delivery_sales ds
JOIN sales s ON ds.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY ds.delivery_type
ORDER BY order_count DESC;