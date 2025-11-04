SELECT 
    pt.description as payment_method,
    COUNT(*) as transaction_count,
    SUM(p.value) as total_amount,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM payments p2 JOIN sales s ON p2.sale_id = s.id WHERE s.sale_status_desc = 'COMPLETED' AND DATE(s.created_at) BETWEEN $1 AND $2)), 2) as percentage
FROM payments p
JOIN payment_types pt ON p.payment_type_id = pt.id
JOIN sales s ON p.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY pt.id, pt.description
ORDER BY transaction_count DESC;