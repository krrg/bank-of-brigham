import csv

def read_csv(filename):
    with open(filename) as tsv:
        tsv.readline()
        for line in csv.reader(tsv, dialect='excel-tab'):
            yield line

score_translations = {
    "Strongly Agree": 5,
    "Agree": 4,
    "Neutral": 3,
    "Disagree": 2,
    "Strongly Disagree": 1,
    "": 3,
}

system_translations = {
    "1 (SMS)": "sms",
    "2 (TOTP)": "totp",
    "3 (Printed Codes)": "printed",
    "4 (U2F)": "u2f",
    "5 (Push)": "push",
    "6 (Password)": "password",
}

def compute_sus(row, col_start):
    sus = 0
    for offset in range(10):
        value = score_translations[row[col_start + offset]]
        # print(f"offset {offset} and value is {row[col_start + offset]}")
        if offset % 2 == 1:  # This is actually an even numbered question then...off by one.
            sus += (5 - value)
        else:
            sus += (value - 1)
    sus *= 2.5

    return sus

def main():

    print("TFA,SUS_OVERALL,SUS_TFA")

    for row in read_csv("data/ExitSurveyResults.tsv"):
        tfa = system_translations[row[3]]
        overall_website_sus = compute_sus(row, 8)
        tfa_sus = compute_sus(row, 18)

        print(",".join([str(s) for s in
            (tfa, overall_website_sus, tfa_sus)
        ]))


if __name__ == "__main__":
    main()


