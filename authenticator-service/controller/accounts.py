import sanic
import sanic.response
import controller
from controller.session import Session


Accounts = sanic.Blueprint("accounts", url_prefix="/api")

import model.accounts

@Accounts.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()  # Ensure db indexes will be created.


async def login_user(username, password):
    if not await accounts_model.verify_password(username, password):
        return sanic.response.json({
            "error": "could not verify password"
        }, status=401)

    second_factor = await accounts_model.get_2fa_method(username)

    print("the second factor is: ", second_factor)

    response = sanic.response.json({
        "username": username,
        "secondFactor": second_factor,
    })

    Session\
        .create_session()\
        .insert_claims({
            "username": username,
            "password_good": True,
            "2fa_good": False,
            "fully_authenticated": second_factor is None
        })\
        .attach_to_response(response)

    return response


@Accounts.route("/accounts", ["POST"])
async def handle_create_account(request):
    username = request.json.get("username")
    password = request.json.get("password")

    try:
        await accounts_model.create_new_account(username, password)
        return await login_user(username, password)
    except model.accounts.AccountAlreadyExistsException as e:
        return sanic.response.text("conflict", status=409)


@Accounts.route("/accounts/verify_password", ["POST"])
async def handle_verify_password(request):
    username = request.json.get("username")
    password = request.json.get("password")

    return await login_user(username, password)

@Accounts.route("/accounts/session", ["DELETE"])
async def handle_logout(request):
    response = sanic.response.text("")
    Session\
        .create_session()\
        .attach_to_response(response)
    return response
