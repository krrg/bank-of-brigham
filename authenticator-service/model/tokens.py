import datetime
import db.cxpool
class Tokens(object):

    def __init__(self):
        self.temp_tokens = db.cxpool.mongoclient["isrlauth"]["temp_tokens"]  # Tokens that expire
        self.perm_tokens = db.cxpool.mongoclient["isrlauth"]["perm_tokens"]

    async def before_start(self):
        await self.temp_tokens.create_index("username", unique=True, background=True)
        await self.temp_tokens.create_index("createdAt", expireAfterSeconds=1800)
        await self.perm_tokens.create_index("username", unique=True, background=True)

    async def store_token_for(self, username, token, expiring=False):
        document = {
            "createdAt": datetime.datetime.now(),
            "username": username,
            "token": token,
        }

        if expiring:
            print("Inserting expiring token")
            await self.temp_tokens.insert_one(document)
        else:
            await self.perm_tokens.insert_one(document)

    async def get_token_for(self, username):
        match = await self.temp_tokens.find_one({ "username": username}) or await self.perm_tokens.find_one({ "username": username})
        if match is None:
            return None
        return match["token"]

