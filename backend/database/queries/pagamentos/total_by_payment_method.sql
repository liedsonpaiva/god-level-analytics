-- Valor total por método - CORRIGIDO
SELECT 
    pt.description as payment_method,
    SUM(p.value) as total_amount,
    COUNT(DISTINCT p.sale_id) as orders_count,
    AVG(p.value) as avg_payment_value
FROM payments p
JOIN payment_types pt ON p.payment_type_id = pt.id
JOIN sales s ON p.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY pt.id, pt.description
ORDER BY total_amount DESC;