import settings
import aiohttp
import apiclients.aiohttpclient

TWILIO_ACCOUNT_SID = settings.secrets["TWILIO_ACCOUNT_SID"]
TWILIO_AUTH_TOKEN = settings.secrets["TWILIO_AUTH_TOKEN"]
TWILIO_PHONE_NUMBER = settings.secrets["TWILIO_PHONE_NUMBER"]

baseurl = f"https://{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}@api.twilio.com/2010-04-01"

class AsyncTwilioClient(object):

    def __init__(self):
        self.http_client = apiclients.aiohttpclient.http_client

    async def push_message(self, to, message):
        if message is None or to is None:
            raise RuntimeError("Cannot send empty message or empty sender")

        resp = await self.http_client.post(f"{baseurl}/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json", data={
            "To": to,
            "From": TWILIO_PHONE_NUMBER,
            "Body": message
        })

        print("Back from Twilio")
        print(await resp.json())

        return True
