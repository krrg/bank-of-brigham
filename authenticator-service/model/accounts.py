# from db.cxpool import mongoclient
import settings
import db.cxpool
import pymongo
import datetime

class Accounts(object):

    def __init__(self):
        self.accounts = db.cxpool.mongoclient["isrlauth"]["accounts"]

    async def create_new_account(self, username, password):
        if await self.accounts.find_one({"username": username}) is not None:
            raise AccountAlreadyExistsException()

        hashed_pw = PasswordHashingHelpers.hash_and_salt_password(password)

        document = {
            "username": username,
            "hashed_pw": hashed_pw,
            "created_at": datetime.datetime.utcnow()
        }

        await self.accounts.insert_one(document)

        return True
        # Hash the password

import nacl
import nacl.pwhash

class PasswordHashingHelpers(object):



    @staticmethod
    def hash_and_salt_password(password):
        return nacl.pwhash.str(password.encode())

    @staticmethod
    def verify_password(stored_entry, to_verify):
        try:
            nacl.pwhash.verify(stored_entry.encode(), to_verify.encode())
        except nacl.exceptions.InvalidkeyError as e:
            # Want to avoid dependency leaking the nacl layer to the controller.
            #  Therefore, we rebrand the exception as one of ours.
            raise PasswordNotMatchException()


class AccountAlreadyExistsException(Exception):
    pass

class PasswordNotMatchException(Exception):
    pass
