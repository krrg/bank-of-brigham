import settings
import db.cxpool
import pymongo
import datetime
from enum import Enum
import asyncio
import random
import secrets


class BankAccountTypes(Enum):
    SAVINGS = "savings"
    CHECKING = "checking"
    MONEYMARKET = "moneymarket"
    CERTIFICATE = "certificate"


class Bank(object):

    def __init__(self):
        self.bank = db.cxpool.mongoclient["isrlauth"]["bank"]

    async def before_start(self):
        self.bank.create_index("username", unique=False, background=True)

    async def create_account(self, username, account_type, display_name, balance):
        return await self.bank.insert_one({
            "username": username,
            "number": Bank.random_account_number(),
            "displayName": display_name,
            "type": account_type.value,
            "balance_cents": balance,
            "created_at": datetime.datetime.utcnow(),
        })

    async def create_default_accounts(self, username):
        return await asyncio.wait([
            self.create_account(username, BankAccountTypes.SAVINGS, "Online Savings", 600000 + random.randint(0, 100000)),
            self.create_account(username, BankAccountTypes.CHECKING, "Interest Checking", 160000 + random.randint(0, 50000)),
            self.create_account(username, BankAccountTypes.MONEYMARKET, "Money Market", 200000 + random.randint(0, 50000)),
        ])

    async def get_accounts_owned_by(self, username):
        cursor = self.bank.find({
            "username": username
        })
        return await cursor.to_list(length=100)  # Maximum number of accounts

    async def transfer_within_owner(self, username, )

    @staticmethod
    def random_account_number():
        number = []
        for i in range(12):
            number.append(str(secrets.randbelow(9) + 1))
        return "".join(number)


