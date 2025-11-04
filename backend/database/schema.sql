-- backend/database/schema.sql - ADICIONAR
-- Índices críticos para queries analíticas
CREATE INDEX CONCURRENTLY idx_sales_created_at_channel ON sales(created_at, channel_id);
CREATE INDEX CONCURRENTLY idx_sales_store_date_status ON sales(store_id, DATE(created_at), sale_status_desc);
CREATE INDEX CONCURRENTLY idx_sales_customer_date ON sales(customer_id, created_at) WHERE customer_id IS NOT NULL;
CREATE INDEX CONCURRENTLY idx_product_sales_product_date ON product_sales(product_id, (SELECT created_at FROM sales WHERE sales.id = product_sales.sale_id));
CREATE INDEX CONCURRENTLY idx_delivery_times ON sales(delivery_seconds) WHERE delivery_seconds IS NOT NULL;

-- Índices para métricas de performance
CREATE INDEX CONCURRENTLY idx_sales_date_amount ON sales(DATE(created_at), total_amount);
CREATE INDEX CONCURRENTLY idx_sales_channel_status ON sales(channel_id, sale_status_desc, created_at);

-- backend/database/schema.sql - ADICIONAR
-- View materializada para métricas diárias (refresh a cada hora)
CREATE MATERIALIZED VIEW mv_daily_metrics AS
SELECT 
    DATE(s.created_at) as metric_date,
    s.store_id,
    s.channel_id,
    COUNT(*) as total_orders,
    COUNT(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN 1 END) as completed_orders,
    SUM(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN s.total_amount ELSE 0 END) as total_revenue,
    AVG(CASE WHEN s.sale_status_desc = 'COMPLETED' THEN s.total_amount ELSE NULL END) as avg_ticket,
    SUM(s.total_discount) as total_discounts,
    AVG(s.production_seconds) as avg_production_time,
    AVG(s.delivery_seconds) as avg_delivery_time
FROM sales s
WHERE s.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY DATE(s.created_at), s.store_id, s.channel_id;

CREATE UNIQUE INDEX idx_mv_daily_metrics ON mv_daily_metrics(metric_date, store_id, channel_id);

-- View para análise de produtos
CREATE MATERIALIZED VIEW mv_product_performance AS
SELECT 
    p.id as product_id,
    p.name as product_name,
    c.name as category,
    DATE(s.created_at) as sale_date,
    COUNT(ps.id) as times_sold,
    SUM(ps.quantity) as total_quantity,
    SUM(ps.total_price) as total_revenue,
    AVG(ps.base_price) as avg_price
FROM products p
JOIN product_sales ps ON p.id = ps.product_id
JOIN sales s ON ps.sale_id = s.id
JOIN categories c ON p.category_id = c.id
WHERE s.sale_status_desc = 'COMPLETED'
  AND s.created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY p.id, p.name, c.name, DATE(s.created_at);

CREATE UNIQUE INDEX idx_mv_product_performance ON mv_product_performance(product_id, sale_date);