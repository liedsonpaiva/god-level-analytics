SELECT 
    st.name as store_name,
    st.city,
    COUNT(*) as order_count,
    SUM(s.total_amount) as total_revenue,
    AVG(s.total_amount) as avg_ticket
FROM sales s
JOIN stores st ON s.store_id = st.id
WHERE s.sale_status_desc = 'COMPLETED'
AND DATE(s.created_at) BETWEEN $1 AND $2
GROUP BY st.id, st.name, st.city
ORDER BY total_revenue DESC;