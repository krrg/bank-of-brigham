gunicorn \
 --bind 127.0.0.1:5002 \
 --worker-class sanic.worker.GunicornWorker \
 --workers=2 \
 main:app
