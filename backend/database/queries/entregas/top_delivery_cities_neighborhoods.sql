-- Cidades/bairros com mais entregas - CORRIGIDO
SELECT 
    da.city,
    da.neighborhood,
    COUNT(*) as delivery_count,
    AVG(s.delivery_seconds) as avg_delivery_seconds
FROM sales s
JOIN delivery_addresses da ON s.id = da.sale_id
WHERE s.sale_status_desc = 'COMPLETED'
AND da.city IS NOT NULL
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY da.city, da.neighborhood
ORDER BY delivery_count DESC
LIMIT 15;