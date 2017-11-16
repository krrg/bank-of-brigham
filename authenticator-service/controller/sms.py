import sanic
import sanic.response
import apiclients.twilio
import controller
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
@controller.require_full_authentication
async def handle_enable_sms_2fa(request, session=None, **kwargs):
    unvalidated_phone_number = request.json.get("phone_number")

    try:
        response = await twilio_client.lookup_phone_number(unvalidated_phone_number)
        validated_phone_number = response["phone_number"]

        # Add the phone number to the account.
        await accounts_model.register_2fa_method(session['username'], 'sms', {
            'phoneNumber': validated_phone_number,
        })
        await SmsVerification.begin_verification(session['username'], validated_phone_number)

        hidden_phone = validated_phone_number[-2:]

        return sanic.response.json({"success": True, "hidden_phone": hidden_phone})

    except apiclients.twilio.InvalidPhoneNumberError:
        return sanic.response.json({"success": False, "error": "Unable to parse and validate phone number."})


@Sms.route("/beginverify")
@controller.require_password
async def handle_begin_verify_sms_2fa(request, session=None, **kwargs):
    username = session['username']

    await accounts_model.
    await SmsVerification.begin_verification(username)

@Sms.route("/completeverify", methods=["POST"])
@controller.require_password
async def handle_verify_sms_2fa(request, session=None, **kwargs):
    username = session['username']
    unverified_code = request.json.get("code")

    result = await SmsVerification.complete_verification(username)
    if result:
        response = sanic.response.json({"success": True})

        session.insert_claims({
            "fully_authenticated": True,
        }).attach_to_response(response)

        return response
    else:
        return sanic.response.json({"success": False, "error": "Unauthenticated"}, status=401)


import secrets
import hashlib

class SmsVerification(object):

    @staticmethod
    async def begin_verification(username, phone_number):
        # Return value must be stored by client
        code = SmsVerification.generate_code()
        message = SmsVerification.generate_message(code)
        await tokens_model.store_token_for(username, code, expiring=True)
        await twilio_client.push_message(phone_number, message)

    @staticmethod
    async def complete_verification(username, unverified_code):
        actual_code = await tokens_model.get_token_for(username)
        if actual_code is None:
            return False
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
