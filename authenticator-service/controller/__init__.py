import functools
import sanic.response
from controller.session import Session


#"username": username,
#"password_good": True,
#"2fa_good": False,
#"fully_authenticated": second_factor is None

def require_password(f):
    @functools.wraps(f)
    def decorated_function(request, *args, **kwargs):
        session = Session.from_request(request)
        claims = session.read_claims()

        if "password_good" in claims and claims["password_good"]:
            kwargs["session"] = claims
            return await route(request, *args, **kwargs)
        else:
            return sanic.response.text("(Partial) Requires password to proceed", status=401)
    return decorated_function


def require_full_authentication(route):

    @functools.wraps(route)
    async def decorated_function(request, *args, **kwargs):
        session = Session.from_request(request)
        claims = session.read_claims()

        if "fully_authenticated" in claims and claims["fully_authenticated"]:
            kwargs["session"] = claims
            return await route(request, *args, **kwargs)
        else:
            return sanic.response.text("(Full) Requires password and (if applicable) 2FA to proceed.", status=401)
    return decorated_function


