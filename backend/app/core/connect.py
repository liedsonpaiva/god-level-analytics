import psycopg2 as pg
from psycopg2 import Error
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

def conn():
    try:
        # Pega a senha do banco de dados a partir da variável de ambiente
        pwd = os.getenv("DB_PASSWORD")
        
        # Verifica se a variável foi carregada corretamente
        if not pwd:
            raise ValueError("A variável DB_PASSWORD não foi encontrada no arquivo .env")
        
        # Conectar ao banco de dados
        conecta = pg.connect(
            user="postgres",
            password=pwd,
            host="127.0.0.1",  # endereço do banco de dados
            port=5432,  # Correção do 'post' para 'port'
            database="food_analytics"
        )
        
        print("Conectado com sucesso")
        return conecta  # Retorna a conexão

    except Error as e:
        # Captura e exibe qualquer erro na conexão
        print(f"Erro ao se conectar ao banco de dados: {e}")
        raise  # Levanta o erro para que a aplicação possa tratar

def encerra_conn(conecta):
    # Função para fechar a conexão com o banco
    if conecta:
        conecta.close()
        print("Conexão encerrada com sucesso.")
