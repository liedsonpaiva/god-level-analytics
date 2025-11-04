SELECT 
    cat.name as category_name,
    COUNT(ps.id) as order_count,
    SUM(ps.quantity) as total_quantity,
    SUM(ps.total_price) as total_revenue,
    ROUND(CAST(SUM(ps.total_price) AS NUMERIC), 2) as rounded_revenue
FROM product_sales ps
JOIN products p ON p.id = ps.product_id
JOIN categories cat ON cat.id = p.category_id
JOIN sales s ON s.id = ps.sale_id
WHERE s.sale_status_desc = 'COMPLETED'
  AND cat.type = 'P'
  AND s.created_at BETWEEN $1 AND $2
GROUP BY cat.id, cat.name
ORDER BY total_revenue DESC