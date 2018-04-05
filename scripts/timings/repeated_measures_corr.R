
if(!require("rmcorr"))###It may take a few minutes to download all of this.
{
  install.packages("rmcorr")
}

if(!require("data.table"))###It may take a few minutes to download all of this.
{
  install.packages("data.table")
}

library(rmcorr)
library(data.table)


systems_under_test <- c("u2f", "codes", "sms", "push", "totp")

correlate_2fa_system_data <- function(tfa_system_name) {

    cat("\n################################\n")
    cat("Repeated measures correlation for", tfa_system_name)

    filename <- paste("./out/", tfa_system_name, ".csv", sep = "")
    tfa <- fread(filename, header = FALSE)

    # #Username, Time_Since_Beginning_Study, Observed_Authentication_Time
    colnames(tfa) <- c("ID", "TSBS", "OAT")
    tfa <- as.data.frame(tfa)

    # print(tfa)

    tfaRMC = rmcorr(participant  = as.factor(ID), measure1 = TSBS, measure2 = OAT, dataset = tfa)
    print(tfaRMC)

    plot(tfaRMC)
    boxplot(tfa$OAT)

    cat("\n")
}

lapply(systems_under_test, correlate_2fa_system_data)
