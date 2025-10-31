import psycopg2 as pg
from psycopg2 import Error
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

def get_db_connection_string():
    """Retorna a string de conexão para SQLModel"""
    pwd = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "5432")
    database = os.getenv("DB_NAME", "food_analytics")
    user = os.getenv("DB_USER", "postgres")
    
    if not pwd:
        raise ValueError("A variável DB_PASSWORD não foi encontrada no arquivo .env")
    
    return f"postgresql://{user}:{pwd}@{host}:{port}/{database}"

def conn():
    """Função original para compatibilidade - usa psycopg2 diretamente"""
    try:
        pwd = os.getenv("DB_PASSWORD")
        host = os.getenv("DB_HOST", "localhost")
        port = os.getenv("DB_PORT", "5432")
        database = os.getenv("DB_NAME", "food_analytics")
        user = os.getenv("DB_USER", "postgres")
        
        if not pwd:
            raise ValueError("A variável DB_PASSWORD não foi encontrada no arquivo .env")
        
        conecta = pg.connect(
            user=user,
            password=pwd,
            host=host,
            port=port,
            database=database
        )
        
        print("Conectado com sucesso")
        return conecta

    except Error as e:
        print(f"Erro ao se conectar ao banco de dados: {e}")
        raise

def encerra_conn(conecta):
    if conecta:
        conecta.close()
        print("Conexão encerrada com sucesso.")