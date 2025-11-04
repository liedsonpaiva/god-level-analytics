WITH product_sales AS (
    SELECT 
        p.id,
        p.name,
        p.category_id,
        COUNT(*) as times_ordered,
        SUM(ps.quantity) as total_quantity,
        SUM(ps.total_price) as total_revenue
    FROM product_sales ps
    JOIN products p ON ps.product_id = p.id
    JOIN sales s ON ps.sale_id = s.id
    WHERE s.sale_status_desc = 'COMPLETED'
    AND DATE(s.created_at) BETWEEN $1 AND $2
    GROUP BY p.id, p.name, p.category_id
)
SELECT 
    *,
    RANK() OVER (ORDER BY total_quantity DESC) as quantity_rank
FROM product_sales
ORDER BY total_quantity DESC;