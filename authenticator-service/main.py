from sanic import Sanic
from sanic.response import json

from db.cxpool import ConnectionPoolInitializer as DbCxPoolInit
from apiclients.aiohttpclient import ConnectionPoolInitializer as  HttpCxPoolInit

app = Sanic()
app.blueprint(DbCxPoolInit)
app.blueprint(HttpCxPoolInit)

from controller.accounts import Accounts
from controller.sms import Sms
from controller.codes import Codes
from controller.totp import TOTP

app.blueprint(Accounts)
app.blueprint(Sms)
app.blueprint(Codes)
app.blueprint(TOTP)

import apiclients.twilio

@app.route("/")
async def handle_root(request):
    return json({
        "Hello": "world"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
