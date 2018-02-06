import settings
import db.cxpool
import pymongo
import datetime
import secrets

class Events(object):

    def __init__(self):
        self.events = db.cxpool.mongoclient["isrlauth"]["events"]

    async def before_start(self):
        self.events.create_index("created_at", background=True)
        self.events.create_index("token", background=True)
        self.events.create_index("username", background=True)

    async def log_event(self, document):
        document = {**document, "date": datetime.datetime.utcnow()}
        print("Here is the document we are about to write: ", document)
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
            "token": correlation_token,
            "type": "begin_password",
        })
        return correlation_token

    async def end_password(self, correlation_token, username):
        await self.log_event({
            "username": username,
            "token": correlation_token,
            "type": "complete_password",
        })
        await self.events.update_one({
            "token": correlation_token
        }, {
            "$set": {
                "username": username,
            }
        })

class EventsReader(object):

    def __init__(self):
        self.events = db.cxpool.mongoclient["isrlauth"]["events"]

    async def before_start(self):
        pass

    def get_password_logins(self, username=None):
        query = {
            "$or": [
                { "type": "begin_password" },
                { "type": "complete_password" }
            ]
        }

        if username is not None:
            query["username"] = username

        cursor = self.events.find(query)
        cursor.sort('created_at', pymongo.DESCENDING)

        return cursor


    # async def get_2fa_logins_between(start=None, end=None, second_factor=None):
    #     query = {
    #         "type": "complete"
    #     }
    #     if second_factor is not None:
    #         query["2fa"] = second_factor


    # async def get_accounts_between(start=None, end=None):
    #     pass

