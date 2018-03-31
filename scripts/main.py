import pymongo
from authentication_time_scatterplots import *
from collections import deque

import matplotlib.pyplot as plt
import numpy as np
client = pymongo.MongoClient()
db = client.isrlauth

def generate_scatter_plot_for(second_factor):
    pairs = list(AuthenticationTimeExtractor(db).extract_2fa_times(second_factor))

    outlier_cutoff = np.percentile([ p[1] for p in pairs ], 99)
    pairs = [ pair for pair in pairs if pair[1] <= outlier_cutoff ]

    return pairs

    # plt.scatter(*zip(*pairs))
    # plt.ylim(ymin=0)
    # plt.savefig(f"{second_factor}.png")
    # plt.close()

    # return len(pairs)


def main():
    colors = deque(['r', 'g', 'b', 'c', 'm'])

    for second_factor in [ "totp", "push", "sms", "codes", "u2f" ]:
        pairs = generate_scatter_plot_for(second_factor)
        plt.scatter(*zip(*pairs), c=colors[0])
        colors.popleft()
        plt.legend([ second_factor ], loc="upper left")
        plt.savefig(second_factor + ".png")
        plt.close()

        # print("Done with ", num_datapoints, "datapoints", "average of ", num_datapoints / 12)











if __name__ == "__main__":
    main()
