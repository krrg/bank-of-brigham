import os

PG_USER = os.environ.get('PG_USER', 'isrl')
PG_PASSWORD = os.environ.get('PG_PASSWORD', 'password')
PG_DATABASE = os.environ.get('PG_DATABASE', 'password_auth_service')
PG_HOST = os.environ.get('PG_HOST', '127.0.0.1')
PG_PORT = int(os.environ.get('PG_PORT', 5432))

