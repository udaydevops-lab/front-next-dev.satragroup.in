import services from "./services";
import { logOutUser, login } from "./api-urls";
import { useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "./constants";
import { getLocalItem } from "./local";

export function logOut() {
  let loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  if (loginResponse) {
    let postObj = {
      username: loginResponse.username,
      userId: loginResponse.userId,
    };
    services
      .create(logOutUser, postObj)
      .then((response) => {
        localStorage.removeItem("loginResponse");
        localStorage.clear();

        //window.localStorage.clear();

        // localStorage.removeItem("CURRENT_USER");

        //localStorage.removeItem("ally-supports-cache");
        // localStorage.removeItem("path");
      })
      .catch((err) => {
        console.log(err.message);
        if (err.message && err.message.includes("401")) {
          // Token Expired
          localStorage.removeItem("loginResponse");
        }
      });
  }
}
