-- Canal de venda com mais pedidos - CORRIGIDO
SELECT 
    c.name as channel,
    COUNT(*) as order_count,
    SUM(s.total_amount) as total_revenue,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales WHERE sale_status_desc = 'COMPLETED' AND DATE(created_at) BETWEEN $1 AND $2)), 2) as percentage
FROM sales s
JOIN channels c ON s.channel_id = c.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY c.id, c.name
ORDER BY order_count DESC;