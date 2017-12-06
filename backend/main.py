from sanic import Sanic
from sanic.response import json

from db.cxpool import ConnectionPoolInitializer as DbCxPoolInit
from apiclients.aiohttpclient import ConnectionPoolInitializer as  HttpCxPoolInit

app = Sanic()
app.blueprint(DbCxPoolInit)
app.blueprint(HttpCxPoolInit)

from controllers.authenticators.accounts import Accounts
from controllers.authenticators.sms import Sms
from controllers.authenticators.codes import Codes
from controllers.authenticators.totp import TOTP
from controllers.authenticators.u2f import U2F
from controllers.authenticators.push import Push

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
