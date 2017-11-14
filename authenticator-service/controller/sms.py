import sanic
import sanic.response
import apiclients.twilio
import controller
import model

Sms = sanic.Blueprint("sms", url_prefix="/api/sms")

@Sms.listener('after_server_start')
async def ensure_http_client(app, loop):
    global twilio_client
    twilio_client = apiclients.twilio.AsyncTwilioClient()

@Sms.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()

@Sms.route("/enable", methods=["POST"])
@controller.require_full_authentication
async def handle_enable_sms_2fa(request, session=None, **kwargs):
    unvalidated_phone_number = request.json.get("phone_number")

    try:
        response = await twilio_client.lookup_phone_number(unvalidated_phone_number)
        validated_phone_number = response["phone_number"]

        # Add the phone number to the account.
        # accounts_model.register_2fa_method(username, sms)
        return sanic.response.json({"success": True, "username": session['username']})

    except apiclients.twilio.InvalidPhoneNumberError:
        return sanic.response.json({"success": False, "error": "Unable to parse and validate phone number."})

@Sms.route("/test")
async def handle_test(request):
    result =  await twilio_client.push_message("+13852043606", "Hello this is a test")
    if result:
        return sanic.response.json({ "success": "possibly true" })
    else:
        return sanic.response.text("Not success")
