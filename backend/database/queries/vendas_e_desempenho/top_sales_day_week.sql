-- Dia da semana com maior volume - CORRIGIDO
SELECT 
    EXTRACT(DOW FROM s.created_at) as day_of_week,
    CASE EXTRACT(DOW FROM s.created_at)
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Segunda'
        WHEN 2 THEN 'Terça' 
        WHEN 3 THEN 'Quarta'
        WHEN 4 THEN 'Quinta'
        WHEN 5 THEN 'Sexta'
        WHEN 6 THEN 'Sábado'
    END as day_name,
    COUNT(*) as order_count,
    SUM(s.total_amount) as total_revenue
FROM sales s
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY day_of_week
ORDER BY order_count DESC;