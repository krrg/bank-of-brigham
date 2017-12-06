import settings
import sanic.blueprints
import aiohttp

ConnectionPoolInitializer = sanic.blueprints.Blueprint('aiohttpclient')

async def manually_setup_httpclient():
    global http_client
    http_client = aiohttp.ClientSession()
    print(http_client)

async def manually_teardown_httpclient():
    print("Shutting down http client pool")
    http_client.close()

@ConnectionPoolInitializer.listener('before_server_start')
async def setup_cxpool(app, loop):
    await manually_setup_httpclient()

@ConnectionPoolInitializer.listener('after_server_stop')
async def teardown_cxpool(app, loop):
    await manually_teardown_httpclient()
