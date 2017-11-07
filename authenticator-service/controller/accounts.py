from sanic.response import json
from sanic import Blueprint

Accounts = Blueprint("accounts", url_prefix="/api")

import model.accounts

@Accounts.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()


@Accounts.route("/accounts", ["POST"])
async def handle_create_account(request):
    username = request.json.get("username")
    password = request.json.get("password")

    result = await accounts_model.create_new_account(username, password)

    print("Just got a result of ", result)

