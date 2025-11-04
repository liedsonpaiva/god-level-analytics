-- Percentual de vendas canceladas - CORRIGIDO
SELECT 
    sale_status_desc as status,
    COUNT(*) as order_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales WHERE DATE(created_at) BETWEEN $1 AND $2)), 2) as percentage
FROM sales 
WHERE DATE(created_at) BETWEEN $1 AND $2
GROUP BY sale_status_desc;