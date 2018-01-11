import sanic
import sanic.response
import controllers
from controllers.session import Session

import model.bank
import model.events

import json
import bson.json_util


Bank = sanic.Blueprint("bank", url_prefix="/api")

@Bank.listener('after_server_start')
async def ensure_mongo_connection(app, loop):

    global bank_model
    bank_model = model.bank.Bank()
    await bank_model.before_start()  # Ensure db indexes will be created.

    global events
    events = model.events.Events()
    await events.before_start()


@Bank.route("/bank", methods=["GET"])
@controllers.require_full_authentication
async def get_accounts_for_logged_in(request, session_claims=None):
    username = session_claims["username"]
    accounts = await bank_model.get_accounts_owned_by(username)

    return sanic.response.json({
        "accounts": json.loads(bson.json_util.dumps(accounts))
    })

