-- Pagamentos divididos - CORRIGIDO
WITH split_payments AS (
    SELECT 
        sale_id,
        COUNT(*) as payment_methods_count
    FROM payments 
    WHERE sale_id IN (SELECT id FROM sales WHERE sale_status_desc = 'COMPLETED' AND DATE(created_at) BETWEEN $1 AND $2)
    GROUP BY sale_id
    HAVING COUNT(*) > 1
)
SELECT 
    COUNT(*) as split_payment_orders,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales WHERE sale_status_desc = 'COMPLETED' AND DATE(created_at) BETWEEN $1 AND $2)), 2) as percentage,
    AVG(sp.payment_methods_count) as avg_methods_per_order
FROM split_payments sp;