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
        # request = kwargs["request"]
        session = Session.from_request(request)
        claims = session.read_claims()
        if "password_good" in claims and claims["password_good"]:
            return f(request, *args, **kwargs)
        else:
            return sanic.response.text("Must authenticate with password!", status=401)
    return decorated_function


def require_2fa(f):
    @functools.wraps(f)
    def decorated_function(request, *args, **kwargs):
        # request = kwargs["request"]
        session = Session.from_request(request)
        claims = session.read_claims()
        if "2fa_good" in claims and claims["2fa_good"]:
            return f(request, *args, **kwargs)
        else:
            return sanic.response.text("Requires 2FA beyond this point.", status=401)
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
            return sanic.response.text("(Full) Requires password and 2FA to proceed.", status=401)
    return decorated_function


