import settings
import sanic.blueprints
import motor.motor_asyncio

ConnectionPoolInitializer = sanic.blueprints.Blueprint('cxpool')

async def manually_setup_cxpool():
    global mongoclient
    mongoclient = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_HOST, settings.MONGO_PORT)

async def manually_teardown_cxpool():
    print("Tearing down connection pool.")

@ConnectionPoolInitializer.listener('before_server_start')
async def setup_cxpool(app, loop):
    await manually_setup_cxpool()

@ConnectionPoolInitializer.listener('after_server_stop')
async def teardown_cxpool(app, loop):
    await manually_teardown_cxpool()

