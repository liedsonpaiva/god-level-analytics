from sqlmodel import create_engine, Session
from psycopg2 import connect, Error
from .config import settings
import os

# ✅ Engine do SQLModel para ORM
engine = create_engine(settings.database_url, echo=False)

# ✅ Sessão para dependências FastAPI
def get_session():
    """Fornece sessão para injeção de dependência no FastAPI"""
    with Session(engine) as session:
        yield session

# ✅ Funções de compatibilidade (para scripts antigos)
def get_db_connection_string():
    """Retorna a string de conexão - mantida para compatibilidade"""
    return settings.database_url

def conn():
    """Função original para compatibilidade - usa psycopg2 diretamente"""
    try:
        # Extrai credenciais da URL do settings
        from urllib.parse import urlparse
        parsed_url = urlparse(settings.database_url)
        
        conecta = connect(
            user=parsed_url.username,
            password=parsed_url.password,
            host=parsed_url.hostname,
            port=parsed_url.port or 5432,
            database=parsed_url.path[1:]  # Remove a barra inicial
        )
        
        print("✅ Conectado ao PostgreSQL com sucesso")
        return conecta

    except Error as e:
        print(f"❌ Erro ao conectar ao banco de dados: {e}")
        raise

def encerra_conn(conecta):
    """Fecha conexão psycopg2 - mantida para compatibilidade"""
    if conecta:
        conecta.close()
        print("✅ Conexão encerrada com sucesso.")