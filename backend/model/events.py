import settings
import db.cxpool
import pymongo
import datetime
import secrets

class Events(object):

    def __init__(self):
        self.events = db.cxpool.mongoclient["isrlauth"]["events"]

    async def before_start(self):
        self.events.create_index("created_at", unique=False, background=True)
        self.events.create_index("token", unique=True, background=True)
        self.events.create_index("username", unique=False, background=True)

    async def log_event(self, document):
        document = {**document, "date": datetime.datetime.utcnow()}
        await self.events.insert_one(document)

    async def __log_2fa__(self, username, second_factor, begin_or_complete):
        return await self.log_event({
            "username": username,
            "2fa": second_factor,
            "type": begin_or_complete,
        })

    async def begin_2fa(self, username, second_factor):
        return await self.__log_2fa__(username, second_factor, "begin_2fa")

    async def complete_2fa(self, username, second_factor):
        return await self.__log_2fa__(username, second_factor, "complete_2fa")

    async def begin_password(self):
        correlation_token = secrets.token_hex(16)
        await self.log_event({
            "username": None,
            "token": correlation_token,
            "type": "begin_password",
        })
        return correlation_token

    async def end_password(self, correlation_token, username):
        await self.log_event({
            "username": username,
            "token": correlation_token,
            "type": "end_password",
        })
        await self.events.update_one({
            "token": correlation_token
        }, {
            "$set": {
                "username": username,
            }
        })

