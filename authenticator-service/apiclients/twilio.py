import settings
import aiohttp
import apiclients.aiohttpclient

TWILIO_ACCOUNT_SID = settings.secrets["TWILIO_ACCOUNT_SID"]
TWILIO_AUTH_TOKEN = settings.secrets["TWILIO_AUTH_TOKEN"]
TWILIO_PHONE_NUMBER = settings.secrets["TWILIO_PHONE_NUMBER"]
AUTHY_API_KEY = settings.secrets["AUTHY_API_KEY"]

baseurl = f"https://{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}@api.twilio.com/2010-04-01"
lookupurl = f"https://{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}@lookups.twilio.com/v1"
authyurl = f"https://{TWILIO_ACCOUNT_SID}:{TWILIO_AUTH_TOKEN}@api.authy.com"

class AsyncTwilioClient(object):

    def __init__(self):
        self.http_client = apiclients.aiohttpclient.http_client

    async def push_sms_message(self, to, message):
        if message is None or to is None:
            raise RuntimeError("Cannot send empty message or empty sender")

        resp = await self.http_client.post(f"{baseurl}/Accounts/{TWILIO_ACCOUNT_SID}/Messages.json", data={
            "To": to,
            "From": TWILIO_PHONE_NUMBER,
            "Body": message
        })

        return True

    async def lookup_phone_number(self, phone_number):
        resp = await self.http_client.get(f"{lookupurl}/PhoneNumbers/{phone_number}")
        if resp.status != 200:
            print("Phone number invalid!!!", phone_number)
            raise InvalidPhoneNumberError()

        return await resp.json()

    async def register_onetouch_user(self, email_address, phone_number):
        print(f"Trying to register {email_address} with {phone_number}")

        resp = await self.http_client.post(f"{authyurl}/protected/json/users/new?api_key={AUTHY_API_KEY}", data={
            "user[email]": email_address,
            "user[cellphone]": phone_number,
            "user[country_code]": "1" # Just assume USA for purposes of this research.
        })

        if resp.status != 200:
            print("Could not push approval request", resp)
        else:
            return await resp.json()

    async def send_onetouch_auth_request(self, authy_user_id):
        resp = await self.http_client.post(f"{authyurl}/onetouch/json/users/{authy_user_id}/approval_requests?api_key={AUTHY_API_KEY}", data={
            "message": "Bank of Brigham Login Request",
        })

        if resp.status != 200:
            print("Could not push approval request", resp)
        else:
            return await resp.json()

    async def get_onetouch_auth_request_status(self, authy_uuid):
        resp = await self.http_client.get(f"{authyurl}/onetouch/json/approval_requests/{authy_uuid}?api_key={AUTHY_API_KEY}")

        if resp.status != 200:
            print("Could not get approval request", resp)
        else:
            return await resp.json()


class InvalidPhoneNumberError(RuntimeError):
    pass
