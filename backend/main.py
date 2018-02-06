import sanic

from db.cxpool import ConnectionPoolInitializer as DbCxPoolInit
from apiclients.aiohttpclient import ConnectionPoolInitializer as  HttpCxPoolInit

app = sanic.Sanic()
app.blueprint(DbCxPoolInit)
app.blueprint(HttpCxPoolInit)

from controllers.authenticators.accounts import Accounts
from controllers.authenticators.sms import Sms
from controllers.authenticators.codes import Codes
from controllers.authenticators.totp import TOTP
from controllers.authenticators.u2f import U2F
from controllers.authenticators.push import Push
from controllers.bank import Bank
from controllers.admin import Admin

app.blueprint(Accounts)
app.blueprint(Sms)
app.blueprint(Codes)
app.blueprint(TOTP)
app.blueprint(U2F)
app.blueprint(Push)
app.blueprint(Bank)
app.blueprint(Admin)

import apiclients.twilio

@app.route("/")
async def handle_root(request):
    return sanic.response.json({
        "Hello": "world"
    })

@app.route("/favicon.ico")
async def handle_favicon(request):
    return sanic.response.text("", 404)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5002)
