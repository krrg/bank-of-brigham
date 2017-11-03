from sanic import Sanic
from sanic.response import json

from controller.accounts import Accounts
from db.cxpool import ConnectionPoolInitializer

app = Sanic()
app.blueprint(ConnectionPoolInitializer)
app.blueprint(Accounts)

@app.route("/")
async def handle_root(request):
    return json({
        "Hello": "world"
    })

@app.route("/favicon.ico")
async def handle_favicon(request):
    return


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
