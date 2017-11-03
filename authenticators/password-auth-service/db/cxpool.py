import asyncpg
import settings
import sanic.blueprints

globalPool = None  # Initialized later

ConnectionPoolInitializer = sanic.blueprints.Blueprint('cxpool')

@ConnectionPoolInitializer.listener('before_server_start')
async def setup_cxpool(app, loop):
    globalPool = await asyncpg.create_pool(
        host=settings.PG_HOST,
        port=settings.PG_PORT,
        user=settings.PG_USER,
        database=settings.PG_DATABASE,
        password=settings.PG_PASSWORD,
    )

@ConnectionPoolInitializer.listener('after_server_stop')
async def teardown_cxpool(app, loop):
    print("Gracefully closing cxpool to postgres...", )
    await globalPool.close()
    print("Done")
