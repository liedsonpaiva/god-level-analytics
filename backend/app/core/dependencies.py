from typing import AsyncGenerator
import asyncpg
from app.core.database import get_db_pool
from app.services.query_builder import QueryBuilder

async def get_db() -> AsyncGenerator[asyncpg.Pool, None]:
    pool = await get_db_pool()
    try:
        yield pool
    finally:
        pass

async def get_query_builder(db_pool: asyncpg.Pool = None) -> QueryBuilder:
    return QueryBuilder(db_pool)