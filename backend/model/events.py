import settings
import db.cxpool
import pymongo
import datetime

class Events(object):

    def __init__(self):
        self.events = db.cxpool.mongoclient["isrlauth"]["events"]

    async def before_start(self):
        self.events.create_index("created_at", unique=False, background=True)

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
