-- Aceitação de promoções por email - CORRIGIDO (SEM parâmetros)
SELECT 
    receive_promotions_email as accepts_promotions,
    COUNT(*) as customer_count,
    ROUND(
        (COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers WHERE receive_promotions_email IS NOT NULL)), 
        2
    ) as percentage
FROM customers 
WHERE receive_promotions_email IS NOT NULL
GROUP BY receive_promotions_email