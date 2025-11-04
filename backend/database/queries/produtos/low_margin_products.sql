-- Produtos com menor margem (usando preços fixos como exemplo)
SELECT 
    p.name,
    p.category_id,
    c.name as category,
    p.cost_price,
    p.sale_price,
    (p.sale_price - p.cost_price) as margin_absolute,
    ROUND(((p.sale_price - p.cost_price) / p.sale_price) * 100, 2) as margin_percentage,
    COUNT(ps.id) as total_sold,
    SUM(ps.total_price) as total_revenue
FROM products p
LEFT JOIN categories c ON p.category_id = c.id
LEFT JOIN product_sales ps ON p.id = ps.product_id
LEFT JOIN sales s ON ps.sale_id = s.id AND s.sale_status_desc = 'COMPLETED'
WHERE p.cost_price > 0 AND p.sale_price > 0
AND (s.created_at IS NULL OR DATE(s.created_at) BETWEEN $1 AND $2)
GROUP BY p.id, p.name, p.category_id, c.name, p.cost_price, p.sale_price
HAVING ((p.sale_price - p.cost_price) / p.sale_price) * 100 < 30  -- Margem < 30%
ORDER BY margin_percentage ASC
LIMIT 15;