-- Ticket médio - CORRIGIDO
SELECT 
    AVG(total_amount) as avg_ticket,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY total_amount) as median_ticket
FROM sales 
WHERE sale_status_desc = 'COMPLETED'
AND DATE(created_at) BETWEEN $1 AND $2;