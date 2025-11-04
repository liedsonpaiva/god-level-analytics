from sqlmodel import create_engine, Session
from psycopg2 import connect, Error
from .config import settings
import os

engine = create_engine(settings.database_url, echo=False)

def get_session():
    with Session(engine) as session:
        yield session

def get_db_connection_string():
    return settings.database_url

def conn():
    try:
        from urllib.parse import urlparse
        parsed_url = urlparse(settings.database_url)
        
        conecta = connect(
            user=parsed_url.username,
            password=parsed_url.password,
            host=parsed_url.hostname,
            port=parsed_url.port or 5432,
            database=parsed_url.path[1:]
        )
        
        print("✅ Conectado ao PostgreSQL com sucesso")
        return conecta

    except Error as e:
        print(f"❌ Erro ao conectar ao banco de dados: {e}")
        raise

def encerra_conn(conecta):
    if conecta:
        conecta.close()
        print("✅ Conexão encerrada com sucesso.")