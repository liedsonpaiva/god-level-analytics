import asyncpg
from app.core.config import settings

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        if not self.pool:
            self.pool = await asyncpg.create_pool(settings.DATABASE_URL)
            print("✅ Conectado ao banco de dados PostgreSQL")

    async def disconnect(self):
        if self.pool:
            await self.pool.close()
            print("❌ Desconectado do banco de dados")

    async def fetch_all(self, query: str, *args):
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetch_one(self, query: str, *args):
        async with self.pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

database = Database()

async def get_db_pool():
    await database.connect()
    return database.pool

async def get_db():
    return await get_db_pool()