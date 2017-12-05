import axios from "axios";
import { apihost as host } from "../constants";

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const AuthyHelper = {
    async check_authy_status() {
        let verified = false;
        let count = 0;
        while (count < 120 && ! verified) {

            await sleep(1000);

            const response = await axios.post(`${host}/push/checkstatus`)
            const authyStatus = response.data["authy_status"];
            if (authyStatus === "denied") {
                throw new Exception("Denied");
            }
            else if (authyStatus === "approved") {
                return true;
            }

            count += 1;
        }

        throw new Exception("Timeout");
    }
}
