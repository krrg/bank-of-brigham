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

