import asyncpg
from app.core.config import settings

class Database:
    def __init__(self):
        self.pool = None

    async def connect(self):
        """Connect to the database"""
        if not self.pool:
            self.pool = await asyncpg.create_pool(settings.DATABASE_URL)
            print("✅ Conectado ao banco de dados PostgreSQL")

    async def disconnect(self):
        """Disconnect from the database"""
        if self.pool:
            await self.pool.close()
            print("❌ Desconectado do banco de dados")

    async def fetch_all(self, query: str, *args):
        """Execute query and return all results"""
        async with self.pool.acquire() as conn:
            return await conn.fetch(query, *args)

    async def fetch_one(self, query: str, *args):
        """Execute query and return one result"""
        async with self.pool.acquire() as conn:
            return await conn.fetchrow(query, *args)

    async def execute(self, query: str, *args):
        """Execute query (insert, update, delete)"""
        async with self.pool.acquire() as conn:
            return await conn.execute(query, *args)

# Global database instance
database = Database()

# Dependency for FastAPI
async def get_db_pool():
    """Get database pool for dependencies"""
    await database.connect()
    return database.pool

# ✅ ADICIONAR: Função get_db que está sendo importada
async def get_db():
    """Alternative name for get_db_pool - for compatibility"""
    return await get_db_pool()