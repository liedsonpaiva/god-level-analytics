-- Preço médio dos produtos - CORRIGIDO
SELECT 
    AVG(ps.base_price) as avg_product_price,
    MIN(ps.base_price) as min_price,
    MAX(ps.base_price) as max_price,
    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ps.base_price) as median_price
FROM product_sales ps
JOIN sales s ON ps.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2;