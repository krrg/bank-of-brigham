import sanic
import sanic.response
import apiclients.twilio
import controllers
import model.accounts
import model.tokens


Push = sanic.Blueprint("push", url_prefix="/api/push")


@Push.listener('after_server_start')
async def ensure_http_client(app, loop):
    global authy_client
    authy_client = apiclients.twilio.AsyncTwilioClient()


@Push.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.Tokens()
    await tokens_model.before_start()


@Push.route("/beginenable", methods=["POST"])
@controllers.require_full_authentication
async def handle_enable_push(request, session_claims=None):
    print("Beginning the enablement of push notificatoin.")
    email_username = session_claims["username"]
    phone_number = request.json.get("phone_number")

    response = await authy_client.register_onetouch_user(email_username, phone_number)
    user_id = response["user"]["id"]

    response = await authy_client.send_onetouch_auth_request(response["user"]["id"])
    approval_uuid = response['approval_request']['uuid']
    await tokens_model.store_token_for(email_username, approval_uuid, expiring=False)
    await accounts_model.register_2fa_method(email_username, 'push', user_id)

    return sanic.response.json({"authy": "pending"})


@Push.route("/verify", methods=["POST"])
@controllers.require_password
async def handle_verify_push(request, session_claims=None):
    print("Verifying via push notification")
    username = session_claims["username"]
    authy_user_id = await accounts_model.get_2fa_metadata(username)

    response = await authy_client.send_onetouch_auth_request(authy_user_id)
    approval_uuid = response['approval_request']['uuid']
    await tokens_model.store_token_for(username, approval_uuid, expiring=False)

    return sanic.response.json({"authy": "pending"})


@Push.route("/checkstatus", methods=["POST"])
@controllers.require_password
async def handle_checkstatus_push(request, session_claims=None):
    username = session_claims["username"]
    authy_uuid = await tokens_model.get_token_for(username)

    authy_response = await authy_client.get_onetouch_auth_request_status(authy_uuid)
    status = authy_response["approval_request"]["status"]

    response = sanic.response.json({
        "authy_status": status
    })
    session = controller.Session.from_claims(session_claims)
    session.insert_claims({
        "fully_authenticated": status == "approved",
    }).attach_to_response(response)

    return response

