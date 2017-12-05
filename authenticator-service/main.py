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
from controller.u2f import U2F
from controller.push import Push

app.blueprint(Accounts)
app.blueprint(Sms)
app.blueprint(Codes)
app.blueprint(TOTP)
app.blueprint(U2F)
app.blueprint(Push)

import apiclients.twilio

@app.route("/")
async def handle_root(request):
    return json({
        "Hello": "world"
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
