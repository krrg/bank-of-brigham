import sanic
import sanic.response
import model.accounts
import model.tokens
import controllers
import u2flib_server.u2f as u2f
import settings


U2F = sanic.Blueprint("u2f", url_prefix="/api/u2f")
U2F_APP_ID = "https://localhost:4000"


@U2F.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.MultiTokens()
    await tokens_model.before_start()
    global events
    events = model.events.Events()
    await events.before_start()


@U2F.route("/beginenable", methods=["POST"])
@controllers.require_full_authentication
async def handle_beginenable_u2f(request, session_claims=None):
    username = session_claims["username"]
    previously_stored_devices = []  # You can only register one device at a time in our system!
    enrollment_result = u2f.begin_registration(U2F_APP_ID, previously_stored_devices)

    await tokens_model.store_token_for(username, enrollment_result.json, expiring=True)
    return sanic.response.json(enrollment_result.data_for_client)


@U2F.route("/completeenable", methods=["POST"])
@controllers.require_full_authentication
async def handle_completeenable_u2f(request, session_claims=None):
    username = session_claims["username"]
    enrollment_result = await tokens_model.get_token_for(username)

    device, cert = u2f.complete_registration(enrollment_result, request.json, U2F_APP_ID)

    await accounts_model.register_2fa_method(username, 'u2f', device.json)
    await events.log_event({
        "username": username,
        "type": "enable_2fa",
        "2fa": "u2f",
    })
    return sanic.response.json({"success": True})


@U2F.route("/beginverify", methods=["POST"])
@controllers.require_password
async def handle_beginverify_2fa(request, session_claims=None):
    username = session_claims["username"]
    device = await accounts_model.get_2fa_metadata(username)

    challenge = u2f.begin_authentication(U2F_APP_ID, [device])
    await tokens_model.store_token_for(username, challenge.json, expiring=True)
    await events.begin_2fa(username, "u2f")
    return sanic.response.json(challenge.data_for_client)


@U2F.route("/completeverify", methods=["POST"])
@controllers.require_password
async def handle_completeverify_2fa(request, session_claims=None):
    username = session_claims["username"]
    challenge = await tokens_model.get_token_for(username)
    device, c, t = u2f.complete_authentication(challenge, request.json, [U2F_APP_ID])
    await events.complete_2fa(username, "u2f")

    response = sanic.response.json({
        "keyHandle": device["keyHandle"],
        "touch": t,
        "counter": c,
    })

    session = controllers.Session.from_claims(session_claims)
    session.insert_claims({
        "fully_authenticated": True,
    }).attach_to_response(response)

    return response











