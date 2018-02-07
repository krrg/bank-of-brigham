import sanic
import sanic.response
import controllers
from controllers.session import Session

import model.bank
import model.events
import model.accounts

import json
import bson.json_util
import functools


Admin = sanic.Blueprint("adminbp", url_prefix="/api")

@Admin.listener('after_server_start')
async def ensure_mongo_connection(app, loop):
    global events
    events = model.events.EventsReader()

    global accounts
    accounts = model.accounts.AccountsReader()


async def stream_list(list_cursor, title, response):
    # A little ghetto, but it works and won't load the entire result set into memory.
    response.write('{"' + title + '":[\n  ')
    first = True
    async for event in list_cursor:
        if not first:
            response.write(",\n  ")
        else:
            first = False
        response.write(bson.json_util.dumps(event))
    response.write('\n]}')


@Admin.route("/events/logins/<type>")
@controllers.localhost_only
async def handle_login_events(request, type):
    if type == "password":
        f = functools.partial(stream_list, events.get_password_logins(), "events")
    elif type == "2fa":
        f = functools.partial(stream_list, events.get_2fa_logins(), "events")
    else:
        return sanic.response.text("", status=404)

    return sanic.response.stream(f, content_type="application/json")


@Admin.route("/admin/accounts")
@controllers.localhost_only
async def list_users(request):
    f = functools.partial(stream_list, accounts.list_all_users(), "users")
    return sanic.response.stream(f, content_type="application/json")



