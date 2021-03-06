# from db.cxpool import mongoclient
import settings
import db.cxpool
import pymongo
import datetime

"""
The `Accounts` referred to here is a login account, not a bank account.  Do not be deceived.
"""

class Accounts(object):

    def __init__(self):
        self.accounts = db.cxpool.mongoclient["isrlauth"]["accounts"]

    async def before_start(self):
        self.accounts.create_index("username", unique=True, background=True)

    async def create_new_account(self, username, password):
        if await self.accounts.find_one({"username": username}) is not None:
            raise AccountAlreadyExistsException()

        if len(password) < 8 or password == "password":
            raise PasswordTooWeakException()

        hashed_pw = PasswordHashingHelpers.hash_and_salt_password(password)

        document = {
            "username": username,
            "hashed_pw": hashed_pw,
            "2fa": None,
            "created_at": datetime.datetime.utcnow()
        }

        await self.accounts.insert_one(document)
        return True

    async def verify_password(self, username, password):
        account = await self.accounts.find_one({"username": username}, projection=["hashed_pw"])
        if account is None:
            return False

        stored_entry = account["hashed_pw"]
        to_verify = password

        return PasswordHashingHelpers.verify_password(stored_entry, to_verify)

    async def get_2fa_method(self, username):
        account = await self.accounts.find_one({"username": username}, projection=["2fa"])
        if account is None:
            return None

        return account["2fa"]

    async def get_2fa_metadata(self, username):
        account = await self.accounts.find_one({"username": username}, projection=["2fa_metadata"])
        if account is None:
            return None
        return account["2fa_metadata"]

    async def register_2fa_method(self, username, _2fa, _2fa_metadata):
        return await self.accounts.update_one({
            "username": username,
        }, {
            "$set": {
                "2fa": str(_2fa),
                "2fa_metadata": _2fa_metadata,
            }
        })


class AccountsReader(object):

    def __init__(self):
        self.accounts = db.cxpool.mongoclient["isrlauth"]["accounts"]

    def before_start(self):
        pass

    def list_all_users(self):
        cursor = self.accounts.aggregate([
            {
                "$sort": {
                    "created_at": pymongo.DESCENDING
                }
            }, {
                "$project": {
                    "username": 1,
                    "2fa": 1,
                    "_id": 0,
                }
            }, {
                "$lookup": {
                    "from": "bank",
                    "localField": "username",
                    "foreignField": "username",
                    "as": "bank"
                }
            }, {
                "$lookup": {
                    "from": "events",
                    "localField": "username",
                    "foreignField": "username",
                    "as": "events"
                },
            }
        ])

        return cursor


import nacl
import nacl.pwhash

class PasswordHashingHelpers(object):

    @staticmethod
    def hash_and_salt_password(password):
        return nacl.pwhash.str(password.encode())

    @staticmethod
    def verify_password(stored_entry, to_verify):
        try:
            nacl.pwhash.verify(stored_entry, to_verify.encode())
            return True
        except nacl.exceptions.InvalidkeyError as e:
            return False


class AccountAlreadyExistsException(Exception):
    pass

class PasswordTooWeakException(Exception):
    pass


