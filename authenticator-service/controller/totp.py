import sanic
import sanic.response
import model.accounts
import model.tokens
import controller


TOTP = sanic.Blueprint("totp", url_prefix="/api/totp")

@TOTP.listener("after_server_start")
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.Tokens()
    await tokens_model.before_start()


@TOTP.route("/enable", methods=["POST"])
@controller.require_full_authentication
async def handle_enable_totp(request, session_claims=None):
    username = session_claims["username"]
    secret, uri = await TotpVerification.enable_totp(username)
    return sanic.response.json({
        "totp_secret": secret,
        "totp_uri": uri,
    })

@TOTP.route("/verify", methods=["POST"])
@controller.require_password
async def handle_verify_totp(request, session_claims=None):
    username = session_claims["username"]
    code = request.json.get("code")
    if not await TotpVerification.verify_totp(username, code):
        return sanic.response.json({"error", "Could not validate TOTP code"}, status=401)

    response = sanic.response.json({"success": True})
    session = controller.Session.from_claims(session_claims)
    session.insert_claims({
        "fully_authenticated": True,
    }).attach_to_response(response)
    return response


import pyotp

class TotpVerification(object):

    @staticmethod
    async def enable_totp(username):
        secret_key = pyotp.random_base32()
        totp = pyotp.TOTP(secret_key)
        await tokens_model.store_token_for(username, secret_key, expiring=False)
        return secret_key, totp.provisioning_uri(username, issuer_name="Bank of Brigham")

    @staticmethod
    async def verify_totp(username, code):
        secret_key = await tokens_model.get_token_for(username)
        return pyotp.TOTP(secret_key).verify(code)
