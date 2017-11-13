import sanic
import sanic.response
import apiclients.twilio

Sms = sanic.Blueprint("sms", url_prefix="/api/sms")


@Sms.listener('after_server_start')
async def ensure_http_client(app, loop):
    global twilio_client
    twilio_client = apiclients.twilio.AsyncTwilioClient()

@Sms.route("/test")
async def handle_test(request):
    result =  await twilio_client.push_message("+13852043606", "Hello this is a test")
    if result:
        return sanic.response.json({ "success": "possibly true" })
    else:
        return sanic.response.text("Not success")
