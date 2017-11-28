import sanic
import sanic.response
import model.accounts
import model.tokens
import controller


Codes = sanic.Blueprint("codes", url_prefix="/api/codes")

@Codes.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.MultiTokens()
    await tokens_model.before_start()


@Codes.route("/enable", methods=["POST"])
@controller.require_full_authentication
async def handle_enable_backup_codes(request, session_claims=None, **kwargs):
    username = session_claims["username"]
    backup_codes = await BackupCodeVerification.enable_backup_codes(username)
    await accounts_model.register_2fa_method(username, 'codes', None)

    return sanic.response.json({
        "codes": backup_codes,
    })


@Codes.route("/verify", methods=["POST"])
@controller.require_password
async def handle_verify_backup_code(request, session_claims=None, **kwargs):
    username = session_claims["username"]
    code = request.json.get("code")

    if not await BackupCodeVerification.verify_backup_code(username, code):
        return sanic.response.json({"error": "Could not validate backup code."}, status=401)

    response = sanic.response.json({"success": True})
    session = controller.Session.from_claims(session_claims)
    session.insert_claims({
        "fully_authenticated": True,
    }).attach_to_response(response)
    return response


import secrets

class BackupCodeVerification(object):

    @staticmethod
    async def enable_backup_codes(username):
        code_list = BackupCodeVerification.generate_code_list()
        await tokens_model.store_token_for(username, code_list, expiring=False)
        return code_list

    @staticmethod
    async def verify_backup_code(username, code):
        return await tokens_model.verify_and_remove_token_for(username, code)

    @staticmethod
    def generate_code(digits=8):
        return "".join([
            str(secrets.randbelow(10)) for i in range(digits)
        ])

    @staticmethod
    def generate_code_list(length=12):
        return [BackupCodeVerification.generate_code() for i in range(length)]

