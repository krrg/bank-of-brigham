import sanic
import sanic.response
import model.accounts
import model.tokens
import controller
import u2flib_server.u2f as u2f
import settings


U2F = sanic.Blueprint("u2f", url_prefix="/api/u2f")
U2F_APP_ID = "http://localhost:4000"


@U2F.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.MultiTokens()
    await tokens_model.before_start()


@U2F.route("/beginenable", methods=["POST"])
@controller.require_full_authentication
async def handle_beginenable_u2f(request, session_claims=None):
    username = session_claims["username"]
    previously_stored_devices = []  # You can only register one device at a time in our system!
    enrollment_result = u2f.begin_registration(U2F_APP_ID, previously_stored_devices)

    await tokens_model.store_token_for(username, enrollment_result.json, expiring=True)
    return sanic.response.json(enrollment_result.data_for_client)


@U2F.route("/completeenable", methods=["POST"])
@controller.require_full_authentication
async def handle_completeenable_u2f(request, session_claims=None):
    username = session_claims["username"]
    enrollment_result = await tokens_model.get_token_for(username)

    device, cert = u2f.complete_registration(enrollment_result, request.json, U2F_APP_ID)

    await accounts_model.register_2fa_method(username, 'u2f', device.json)
    return sanic.response.json({"success": True})







