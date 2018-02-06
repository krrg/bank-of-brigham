import sanic
import sanic.response
import controllers
from controllers.session import Session

import model.bank
import model.events

import json
import bson.json_util
import functools


Admin = sanic.Blueprint("adminbp", url_prefix="/api")

@Admin.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global bank_model
    bank_model = model.bank.Bank()
    await bank_model.before_start()  # Ensure db indexes will be created.

    global events
    events = model.events.EventsReader()
    await events.before_start()

    global accounts
    accounts = model.accounts.Accounts()
    await accounts.before_start()


async def stream_events(events_cursor, response):
    # A little ghetto, but it works and won't load the entire result set into memory.
    response.write('{"events":[')
    first = True
    async for event in events_cursor:
        if not first:
            response.write(",\n  ")
        else:
            first = False
        response.write(bson.json_util.dumps(event))
    response.write('\n]}')

@Admin.route("/admin/summary")
@controllers.localhost_only
async def summary_statistics(request):
    f = functools.partial(stream_events, events.get_password_logins())
    return sanic.response.stream(f, content_type="application/json")





