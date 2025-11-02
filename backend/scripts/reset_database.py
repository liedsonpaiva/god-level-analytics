#!/usr/bin/env python3
"""
Script para resetar COMPLETAMENTE o banco de dados
"""

import psycopg2

def reset_database(db_url='postgresql://postgres:37106@localhost:5432/food_analytics'):
    conn = psycopg2.connect(db_url)
    cursor = conn.cursor()
    
    print("🔄 Resetando banco de dados COMPLETAMENTE...")
    
    # Desabilitar constraints temporariamente
    cursor.execute("SET session_replication_role = 'replica';")
    
    # Ordem IMPORTANTE (devido a foreign keys) - do mais específico para o mais geral
    tables = [
        'item_item_product_sales',
        'item_product_sales', 
        'product_sales',
        'delivery_addresses',
        'delivery_sales',
        'payments',
        'sales',
        'customers',
        'items',
        'products',
        'categories',
        'option_groups',
        'stores',
        'channels',
        'payment_types',
        'sub_brands',
        'brands'
    ]
    
    # Limpar todas as tabelas
    for table in tables:
        try:
            cursor.execute(f"TRUNCATE TABLE {table} RESTART IDENTITY CASCADE")
            print(f"✓ {table} resetada")
        except Exception as e:
            print(f"⚠️  {table}: {e}")
    
    # Re-habilitar constraints
    cursor.execute("SET session_replication_role = 'origin';")
    
    conn.commit()
    conn.close()
    print("✅ Banco resetado com sucesso! Sequences reiniciadas.")

if __name__ == '__main__':
    reset_database()