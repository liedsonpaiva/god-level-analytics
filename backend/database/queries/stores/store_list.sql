-- backend/database/queries/stores/store_list.sql
SELECT 
    s.id,
    s.name as store_name,
    s.city,
    s.state,
    s.district,
    sb.name as sub_brand_name,
    s.is_active,
    s.latitude,
    s.longitude
FROM stores s
LEFT JOIN sub_brands sb ON s.sub_brand_id = sb.id
WHERE s.is_active = true
ORDER BY s.city, s.name