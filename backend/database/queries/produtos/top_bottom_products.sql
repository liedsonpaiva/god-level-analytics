WITH product_sales AS (
    SELECT 
        p.id,
        p.name,
        p.category_id,
        c.name as category_name,
        COUNT(*) as times_ordered,
        SUM(ps.quantity) as total_quantity,
        SUM(ps.total_price) as total_revenue,
        AVG(ps.base_price) as avg_price
    FROM product_sales ps
    JOIN products p ON ps.product_id = p.id
    JOIN categories c ON p.category_id = c.id
    JOIN sales s ON ps.sale_id = s.id
    WHERE s.sale_status_desc = 'COMPLETED'
    AND DATE(s.created_at) BETWEEN $1 AND $2
    GROUP BY p.id, p.name, p.category_id, c.name
)
SELECT 
    *,
    RANK() OVER (ORDER BY total_quantity DESC) as quantity_rank,
    RANK() OVER (ORDER BY total_quantity ASC) as low_sales_rank
FROM product_sales
ORDER BY total_quantity DESC;