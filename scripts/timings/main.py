import pymongo
from authentication_time_scatterplots import *
from collections import deque
import hashlib
import base64

import matplotlib.pyplot as plt
import numpy as np
client = pymongo.MongoClient()
db = client.isrlauth

def generate_scatter_plot_for(second_factor):
    return list(AuthenticationTimeExtractor(db).extract_2fa_times(second_factor))

    # outlier_cutoff = np.percentile([ p[1] for p in pairs ], 99)
    # pairs = [ pair for pair in pairs if pair[1] <= outlier_cutoff ]

    # plt.scatter(*zip(*pairs))
    # plt.ylim(ymin=0)
    # plt.savefig(f"{second_factor}.png")
    # plt.close()

    # return len(pairs)
def anonymize_emails(rows, col_index):
    for row in rows:
        m = hashlib.new('sha1')
        m.update(b"this is our very awesome salt")
        m.update(row[col_index].encode("UTF-8"))
        row = list(row)
        row[col_index] = base64.b32encode(m.digest()).decode("utf-8")
        yield row



def main():
    colors = deque(['r', 'g', 'b', 'c', 'm'])

    for second_factor in [ "totp", "push", "sms", "codes", "u2f" ]:
        rows = generate_scatter_plot_for(second_factor)
        with open(f"./out/{second_factor}.csv", 'w') as f:
            for row in anonymize_emails(rows, 0):
                f.write(",".join(map(str, row)))
                f.write("\n")

        # plt.scatter(*zip(*pairs), c=colors[0])
        # colors.popleft()
        # plt.legend([ second_factor ], loc="upper left")
        # plt.savefig(second_factor + ".png")
        # plt.close()

        # print("Done with ", num_datapoints, "datapoints", "average of ", num_datapoints / 12)











if __name__ == "__main__":
    main()
