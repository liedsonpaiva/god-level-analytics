SELECT 
    COUNT(*) as total_orders,
    SUM(total_amount) as total_revenue,
    AVG(total_amount) as avg_ticket
FROM sales 
WHERE DATE(created_at) BETWEEN $1 AND $2 
AND sale_status_desc = 'COMPLETED';