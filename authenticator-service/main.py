from sanic import Sanic
from sanic.response import json

from db.cxpool import ConnectionPoolInitializer as DbCxPoolInit
from apiclients.aiohttpclient import ConnectionPoolInitializer as  HttpCxPoolInit

app = Sanic()
app.blueprint(DbCxPoolInit)
app.blueprint(HttpCxPoolInit)

from controller.accounts import Accounts
from controller.sms import Sms

app.blueprint(Accounts)
app.blueprint(Sms)

import apiclients.twilio

@app.route("/")
async def handle_root(request):
    return json({
        "Hello": "world"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
