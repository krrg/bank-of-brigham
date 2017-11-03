import asyncpg
import settings
import sanic.blueprints

ConnectionPoolInitializer = sanic.blueprints.Blueprint('cxpool')

async def manually_setup_cxpool():
    global cxpool
    cxpool = await asyncpg.create_pool(
        host=settings.PG_HOST,
        port=settings.PG_PORT,
        user=settings.PG_USER,
        database=settings.PG_DATABASE,
        password=settings.PG_PASSWORD,
    )

async def manually_teardown_cxpool():
    await cxpool.close()

@ConnectionPoolInitializer.listener('before_server_start')
async def setup_cxpool(app, loop):
    await manually_setup_cxpool()

@ConnectionPoolInitializer.listener('after_server_stop')
async def teardown_cxpool(app, loop):
    await manually_teardown_cxpool()

