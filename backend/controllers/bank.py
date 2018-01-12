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

@Bank.route("/bank/transfer", methods=["POST"])
@controllers.require_full_authentication
async def transfer_within_owner(request, session_claims=None):
    username = session_claims["username"]
    amount_cents = request.json.get("amountCents")
    from_account_id = request.json.get("from")
    to_account_id = request.json.get("to")

    result = await bank_model.transfer_within_owner(username, amount_cents, from_account_id, to_account_id)
    if result:
        await events.log_event({
            "username": username,
            "type": "transfer",
            "value": "success",
            "details": {
                "amount_cents": amount_cents,
                "from_account_id": from_account_id,
                "to_account_id": to_account_id,
            }
        })
        return sanic.response.json({"success": True})
    else:
        await events.log_event({
            "username": username,
            "type": "transfer",
            "value": "failed",
            "details": {
                "amount_cents": amount_cents,
                "from_account_id": from_account_id,
                "to_account_id": to_account_id,
            }
        })
        return sanic.response.text("Error", 400)

