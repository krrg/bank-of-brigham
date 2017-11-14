import settings
import jose.jwt
import time

class Session(object):

    JWT_ALGORITHM = "HS256"

    def __init__(self, raw_jwt=None):
        self.raw_jwt = raw_jwt
        if raw_jwt is None:
            self.decoded_jwt = dict()
        else:
            try:
                self.decoded_jwt = Session.__decode__(self.raw_jwt)
            except jose.jwt.JWTError as e:
                self.decoded_jwt = dict()

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
            settings.secrets['JWT_SECRET'],
            algorithm=Session.JWT_ALGORITHM,
            headers={
                "exp": time.time() + 60 * 60 * 24
            }
        )

    @staticmethod
    def __decode__(raw_jwt):
        return jose.jwt.decode(
            raw_jwt,
            settings.secrets['JWT_SECRET'],
            algorithms=[Session.JWT_ALGORITHM],
        )

    @staticmethod
    def from_request(request):
        return Session(request.cookies.get('jwt'))

    @staticmethod
    def create_session():
        return Session()
