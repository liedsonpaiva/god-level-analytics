SELECT 
    AVG(delivery_fee) as avg_delivery_fee,
    AVG(service_tax_fee) as avg_service_fee,
    SUM(delivery_fee) as total_delivery_fees,
    SUM(service_tax_fee) as total_service_fees
FROM sales 
WHERE sale_status_desc = 'COMPLETED'
AND DATE(created_at) BETWEEN $1 AND $2;