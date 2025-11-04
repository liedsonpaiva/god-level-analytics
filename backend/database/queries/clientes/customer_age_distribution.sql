-- Distribuição de clientes por faixa etária - CORRIGIDO (SEM parâmetros)
SELECT 
    CASE 
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 18 AND 25 THEN '18-25'
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 26 AND 35 THEN '26-35' 
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 36 AND 45 THEN '36-45'
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 46 AND 55 THEN '46-55'
        ELSE 'Maior 55'
    END as age_group,
    COUNT(*) as customer_count,
    ROUND(AVG(EXTRACT(YEAR FROM AGE(birth_date))), 1) as avg_age_in_group
FROM customers 
WHERE birth_date IS NOT NULL
GROUP BY 
    CASE 
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 18 AND 25 THEN '18-25'
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 26 AND 35 THEN '26-35'
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 36 AND 45 THEN '36-45'
        WHEN EXTRACT(YEAR FROM AGE(birth_date)) BETWEEN 46 AND 55 THEN '46-55'
        ELSE 'Maior 55'
    END
ORDER BY age_group