SELECT 
    AVG(ds.courier_fee) as avg_delivery_cost,
    SUM(ds.courier_fee) as total_delivery_costs,
    AVG(ds.delivery_fee - ds.courier_fee) as avg_delivery_margin
FROM delivery_sales ds
JOIN sales s ON ds.sale_id = s.id
WHERE s.sale_status_desc = 'COMPLETED'
AND ds.courier_fee IS NOT NULL
AND ds.courier_fee > 0
AND DATE(s.created_at) BETWEEN $1 AND $2;