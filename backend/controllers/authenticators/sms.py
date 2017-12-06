import sanic
import sanic.response
import apiclients.twilio
import controllers
import model.accounts
import model.tokens


Sms = sanic.Blueprint("sms", url_prefix="/api/sms")


@Sms.listener('after_server_start')
async def ensure_http_client(app, loop):
    global twilio_client
    twilio_client = apiclients.twilio.AsyncTwilioClient()


@Sms.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()
    global tokens_model
    tokens_model = model.tokens.Tokens()
    await tokens_model.before_start()


@Sms.route("/enable", methods=["POST"])
@controllers.require_full_authentication
async def handle_enable_sms_2fa(request, session_claims=None, **kwargs):
    unvalidated_phone_number = request.json.get("phone_number")

    try:
        if unvalidated_phone_number is None:
            raise apiclients.twilio.InvalidPhoneNumberError()

        response = await twilio_client.lookup_phone_number(unvalidated_phone_number)
        validated_phone_number = response["phone_number"]

        # Add the phone number to the account.
        await accounts_model.register_2fa_method(session_claims['username'], 'sms', {
            'phoneNumber': validated_phone_number,
        })

        return await handle_begin_verify_sms_2fa(request, session_claims=session_claims, **kwargs)

    except apiclients.twilio.InvalidPhoneNumberError:
        return sanic.response.json({
            "error": "Unable to parse and validate phone number."
        }, status=400)


@Sms.route("/beginverify", methods=["POST"])
@controllers.require_password
async def handle_begin_verify_sms_2fa(request, session_claims=None, **kwargs):
    username = session_claims['username']

    # await accounts_model.
    metadata = await accounts_model.get_2fa_metadata(username)
    if metadata is None:
        raise RuntimeError("Cannot locate the phone number for this individual.")

    phone_number = metadata["phoneNumber"]
    await SmsVerification.begin_verification(username, phone_number)
    hidden_digits = phone_number[-2:]

    return sanic.response.json({"last_phone_number_digits": hidden_digits}, status=200)


@Sms.route("/completeverify", methods=["POST"])
@controllers.require_password
async def handle_verify_sms_2fa(request, session_claims=None, **kwargs):
    username = session_claims['username']
    unverified_code = request.json.get("code")

    result = await SmsVerification.complete_verification(username, unverified_code)
    if result:
        response = sanic.response.json({"success": True})
        session = controller.Session.from_claims(session_claims)
        session.insert_claims({
            "fully_authenticated": True,
        }).attach_to_response(response)

        return response
    else:
        return sanic.response.json({"success": False, "error": "Unable to validate code"}, status=401)


import secrets

class SmsVerification(object):

    @staticmethod
    async def begin_verification(username, phone_number):
        # Return value must be stored by client
        code = SmsVerification.generate_code()
        message = SmsVerification.generate_message(code)
        await tokens_model.store_token_for(username, code, expiring=True)
        await twilio_client.push_sms_message(phone_number, message)

    @staticmethod
    async def complete_verification(username, unverified_code):
        actual_code = await tokens_model.get_token_for(username)
        if actual_code is None:
            return False
        print(f"Comparing {unverified_code} to {actual_code}")
        return secrets.compare_digest(unverified_code, actual_code)

    @staticmethod
    def generate_message(code):
        return f"Your verification code is {code} (Bank of Brigham)"

    @staticmethod
    def generate_code(digits=6):
        code = []
        for i in range(digits):
            code.append(str(secrets.randbelow(10)))
        return "".join(code)
