import os
import os.path
import base64
import yaml

def get_config_value(config_obj, key):
    if key in config_obj:
        return config_obj[key]
    else:
        return input("" + key + ": ")

def generate_b64_secret(config_obj, key):
    if key in config_obj:
        return config_obj[key]
    else:
        return base64.b64encode(os.urandom(128)).decode()


def read_stored_secrets(input_keys=None, generated_keys=None):
    if input_keys is None:
        input_keys = []
    if generated_keys is None:
        generated_keys = []

    config_path = os.path.expanduser("~/.isrl/authenticator-service.yaml")
    config_obj = {}
    try:
        with open(config_path, 'r') as f:
            config_obj = yaml.safe_load(f)
    except IOError:
        pass

    result_config = {}
    for key in input_keys:
        result_config[key] = get_config_value(config_obj, key)
    for key in generated_keys:
        result_config[key] = generate_b64_secret(config_obj, key)

    os.makedirs(os.path.expanduser("~/.isrl/"), exist_ok=True)
    with open(config_path, 'w') as f:
        f.write(yaml.dump(result_config))

    return result_config


MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)

secrets = read_stored_secrets(input_keys=[
    "TWILIO_ACCOUNT_SID",
    "TWILIO_AUTH_TOKEN",
    "TWILIO_PHONE_NUMBER",
], generated_keys=[
    "JWT_SECRET"
])




