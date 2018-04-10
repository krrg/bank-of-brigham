import pymongo
from authentication_time import *
from collections import deque
import hashlib
import base64
import statistics
import subprocess
import matplotlib.pyplot as plt
import numpy as np

client = pymongo.MongoClient()
db = client.isrlauth

def extract_authentication_times(second_factor):
    return list(AuthenticationTimeExtractor(db).extract_2fa_times(second_factor))

def anonymize_emails(rows, col_index):
    for row in rows:
        m = hashlib.new('sha1')
        m.update(b"this is our very awesome salt")
        m.update(row[col_index].encode("UTF-8"))
        row = list(row)
        row[col_index] = base64.b32encode(m.digest()).decode("utf-8")
        yield row

def compute_repeated_measures_corr():
    for second_factor in [ "totp", "push", "sms", "codes", "u2f" ]:
        rows = extract_authentication_times(second_factor)
        with open(f"./out/{second_factor}.csv", 'w') as f:
            for row in anonymize_emails(rows, 0):
                f.write(",".join(map(str, row)))
                f.write("\n")
    subprocess.run(["Rscript", "repeated_measures_corr.R"])


def compute_anova():
    for second_factor in [ "totp", "push", "sms", "codes", "u2f"]:
        rows = extract_authentication_times(second_factor)
        auth_times = [ row[2] for row in rows ]
        print("Mean auth time for ", second_factor, statistics.mean(auth_times))
        print("Median auth time for ", second_factor, statistics.median(auth_times))


def generate_boxwhisker_plot():

    fig = plt.figure()
    data = []

    for second_factor in [ "totp", "push", "sms", "codes", "u2f"]:
        rows = extract_authentication_times(second_factor)
        auth_times = [ row[2] / 1000 for row in rows if row[2] < 160000]
        data.append(auth_times)

    subplot = fig.add_subplot(111)
    subplot.boxplot(data, )
    subplot.set_xticklabels([ "TOTP", "Push (Authy)", "SMS", "Printed Codes", "U2F"])
    subplot.tick_params(axis='both', which='major', labelsize=24)

    plt.xlabel("2FA System", fontsize=36)
    plt.ylabel("Authentication time (seconds)", fontsize=36)
    plt.show()



def main():

    # generate_boxwhisker_plot()
    compute_repeated_measures_corr()
    # compute_anova()

        # plt.scatter(*zip(*pairs), c=colors[0])
        # colors.popleft()
        # plt.legend([ second_factor ], loc="upper left")
        # plt.savefig(second_factor + ".png")
        # plt.close()

        # print("Done with ", num_datapoints, "datapoints", "average of ", num_datapoints / 12)











if __name__ == "__main__":
    main()
