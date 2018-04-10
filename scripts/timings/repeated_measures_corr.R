
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

tfa_data <- lapply(c("u2f", "codes", "sms", "push", "totp"), function(tfa_system_name) {

    cat("\n################################\n")
    cat("rmcorr for", tfa_system_name)

    filename <- paste("./out/", tfa_system_name, ".csv", sep = "")
    tfa <- fread(filename, header = FALSE)
    colnames(tfa) <- c("ID", "TSBS", "OAT")
    tfa <- as.data.frame(tfa)

})

lapply(tfa_data, function(tfa) {
    # #Username, Time_Since_Beginning_Study, Observed_Authentication_Time
    tfaRMC = rmcorr(participant  = as.factor(ID), measure1 = TSBS, measure2 = OAT, dataset = tfa)
    print(tfaRMC)

    plot(tfaRMC)
    boxplot(tfa$OAT)

    cat("\n")
})

timings <- lapply(tfa_data, function(tfa) {
  tfa$OAT
})

# print(">>>>>>>>>>>>> TIMINGS <<<<<<<<<<<<<<<")
# print(timings)

kruskal.test(timings)



