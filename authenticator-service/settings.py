import os
import base64

MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
JWT_SECRET = os.environ.get("JWT_SECRET", None)

if JWT_SECRET is None:
    print("Warning, generating own secret key on the fly.")
    JWT_SECRET = base64.b64encode(os.urandom(128)).decode()
