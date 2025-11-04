-- Personalização vs sem personalização - CORRIGIDO
WITH sales_customization AS (
    SELECT 
        s.id,
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM product_sales ps 
                JOIN item_product_sales ips ON ps.id = ips.product_sale_id 
                WHERE ps.sale_id = s.id
            ) THEN 'Com personalização'
            ELSE 'Sem personalização' 
        END as customization_type
    FROM sales s
    WHERE s.sale_status_desc = 'COMPLETED'
    AND DATE(s.created_at) BETWEEN $1 AND $2
)
SELECT 
    customization_type,
    COUNT(*) as order_count,
    ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM sales_customization)), 2) as percentage
FROM sales_customization
GROUP BY customization_type;