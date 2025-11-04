-- Valor total de descontos - CORRIGIDO
SELECT 
    SUM(total_discount) as total_discounts,
    AVG(total_discount) as avg_discount_per_order,
    ROUND((SUM(total_discount) * 100.0 / NULLIF(SUM(total_amount + total_discount), 0)), 2) as discount_percentage
FROM sales 
WHERE sale_status_desc = 'COMPLETED'
AND DATE(created_at) BETWEEN $1 AND $2;