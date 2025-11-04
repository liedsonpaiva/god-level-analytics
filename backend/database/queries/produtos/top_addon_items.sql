-- Itens adicionais mais escolhidos - CORRIGIDO
SELECT 
    i.name as item_name,
    c.name as category,
    COUNT(*) as times_added,
    SUM(ips.additional_price) as total_addon_revenue,
    AVG(ips.additional_price) as avg_addon_price
FROM item_product_sales ips
JOIN items i ON ips.item_id = i.id
JOIN categories c ON i.category_id = c.id
JOIN product_sales ps ON ips.product_sale_id = ps.id
JOIN sales s ON ps.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
AND c.type = 'I'  -- Apenas categorias de itens
GROUP BY i.id, i.name, c.name
ORDER BY times_added DESC;