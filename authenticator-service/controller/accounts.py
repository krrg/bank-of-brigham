from sanic.response import json
from sanic import Blueprint

Accounts = Blueprint("accounts", url_prefix="/api")

@Accounts.route("/accounts", ["POST"])
async def handle_create_account(request):
    username = request.json.get("username")
    password = request.json.get("password")

    await does_user_exist(username)
