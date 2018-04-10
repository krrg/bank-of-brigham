

class AuthenticationTimeExtractor(object):

    def __init__(self, db):
        self.db = db

    def extract_2fa_times(self, second_factor):
        for delta_start, delta_2fa, username in self.extract_raw_2fa_times(second_factor):
            ms_2fa = int(delta_2fa.total_seconds() * 1000)
            ms_start = int(delta_start.total_seconds() * 1000)
            if ms_2fa > 1600000:
                # Unfortunately this is such a bad outlier that it makes the graphs
                #  quite badly proportioned.  Someone fell asleep for 30 minutes.
                continue
            yield username, ms_start, ms_2fa

    def extract_raw_2fa_times(self, second_factor):
        for user in list(self.db.accounts.find({"2fa": second_factor})):
            username = user["username"]

            events_cursor = self.db.events.find({
                "username": username,
                "2fa": second_factor,
                "$or": [
                    { "type": "begin_2fa" },
                    { "type": "complete_2fa" }
                ],
            }).sort('data', 1)

            for begin, end, first in self.generate_event_pairs_from_cursor(events_cursor):
                yield begin["date"] - first, end["date"] - begin["date"], username


    def generate_event_pairs_from_cursor(self, events_cursor):
        first_login_time = None
        events_cursor = list(events_cursor)
        for event, next_event in zip(events_cursor, events_cursor[1:]):
            if event["type"] == "begin_2fa" and next_event["type"] == "complete_2fa":
                if first_login_time is None:
                    first_login_time = next_event["date"]
                    continue
                yield event, next_event, first_login_time










