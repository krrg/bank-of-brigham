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
            "createdAt": datetime.datetime.utcnow(),
            "username": username,
            "token": token,
        }

        if expiring:
            await self.temp_tokens.insert_one(document)
        else:
            await self.perm_tokens.insert_one(document)

    async def get_token_for(self, username):
        # We have to check both the temporary and permanent storage.
        for token_store in [self.temp_tokens, self.perm_tokens]:

            match = await token_store.find_one({"username": username})
            if match is not None:
                return match["token"]
        return None;
