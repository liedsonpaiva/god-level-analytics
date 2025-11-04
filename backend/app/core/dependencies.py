from typing import AsyncGenerator
import asyncpg
from app.core.database import get_db_pool
from app.services.query_builder import QueryBuilder

async def get_db() -> AsyncGenerator[asyncpg.Pool, None]:
    """Dependency to get database pool"""
    pool = await get_db_pool()
    try:
        yield pool
    finally:
        # Não fechar o pool aqui - ele é gerenciado pela aplicação
        pass

async def get_query_builder(db_pool: asyncpg.Pool = None) -> QueryBuilder:
    """Dependency to get QueryBuilder instance"""
    return QueryBuilder(db_pool)