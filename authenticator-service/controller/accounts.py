import sanic
import sanic.response
import settings

Accounts = sanic.Blueprint("accounts", url_prefix="/api")

import model.accounts

@Accounts.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global accounts_model
    accounts_model = model.accounts.Accounts()
    await accounts_model.before_start()  # Ensure db indexes will be created.


@Accounts.route("/accounts", ["POST"])
async def handle_create_account(request):
    username = request.json.get("username")
    password = request.json.get("password")

    try:
        await accounts_model.create_new_account(username, password)
        return sanic.response.text("success")
    except model.accounts.AccountAlreadyExistsException as e:
        return sanic.response.text("conflict", status=409)


@Accounts.route("/accounts/verify_password", ["POST"])
async def handle_verify_password(request):
    username = request.json.get("username")
    password = request.json.get("password")

    if not await accounts_model.verify_password(username, password):
        return sanic.response.json({
            "error": "could not verify password"
        }, status=401)

    response = sanic.response.text("Verified")

    Session\
        .from_request(request)\
        .insert_claims({
            "username": username
        })\
        .attach_to_response(response)

    return response


import jose.jwt
import time

class Session(object):

    JWT_ALGORITHM = "HS256"

    def __init__(self, raw_jwt):
        self.raw_jwt = raw_jwt
        if raw_jwt is None:
            self.decoded_jwt = {}
        else:
            try:
                self.decoded_jwt = Session.__decode__(self.raw_jwt)
            except jose.jwt.JWTError as e:
                self.decoded_jwt = {}

    def is_valid(self):
        return len(self.decoded_jwt) > 0

    def read_claims(self):
        return dict(self.decoded_jwt)

    def overwrite_claims(self, claims):
        self.raw_jwt = Session.__encode__(claims)
        self.decoded_jwt = Session.__decode__(self.raw_jwt)
        return self

    def insert_claims(self, claims):
        return self.overwrite_claims({
            **self.read_claims(), **claims
        })

    def attach_to_response(self, response):
        response.cookies['jwt'] = self.raw_jwt

    @staticmethod
    def __encode__(claims):
        return jose.jwt.encode(
            claims,
            settings.JWT_SECRET,
            algorithm=Session.JWT_ALGORITHM,
            headers={
                "exp": time.time() + 60 * 60 * 24
            }
        )

    @staticmethod
    def __decode__(raw_jwt):
        return jose.jwt.decode(
            raw_jwt,
            settings.JWT_SECRET,
            algorithms=[Session.JWT_ALGORITHM],
        )

    @staticmethod
    def from_request(request):
        return Session(request.cookies.get('jwt'))

    @staticmethod
    def create_session(claims):
        return Session()








