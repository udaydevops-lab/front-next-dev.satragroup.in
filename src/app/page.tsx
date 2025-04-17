"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import {
  DOCTOR_DASHBOARD_ROUTE,
  FRONT_DESK_DASHBOARD_ROUTE,
  LOGIN_ROUTE,
  NURSE_DASHBOARD_ROUTE,
} from "./utilities/constants";

import { useState } from "react";
import { logOut } from "./utilities/logout";
import Timer from "./_common/timer";
import { getLocalItem } from "./utilities/local";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(true);
  useEffect(() => {
    setLoggedIn(true);
    if (
      getLocalItem("loginResponse") &&
      getLocalItem("loginResponse") !== null
    ) {
      if (pathname == "/") navigateToDashboard();
    } else {
      navigateToLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToDashboard = () => {
    // TODO:: Check Rolename and navigate to respective dashboard

    let loginResp: any = JSON.parse(getLocalItem("loginResponse") ?? "");

    if (loginResp && loginResp["rollDesc"]) {
      switch (loginResp["rollDesc"].toLowerCase()) {
        case "front office":
        case "admin":
          router.replace(FRONT_DESK_DASHBOARD_ROUTE);
          break;
        case "nurse":
          router.replace(NURSE_DASHBOARD_ROUTE);
          break;
        case "doctor":
          router.replace(DOCTOR_DASHBOARD_ROUTE);
          break;
        default:
          break;
      }
    }
  };

  const navigateToLogin = () => {
    router.replace(LOGIN_ROUTE);
  };

  const handleLogout = () => {
    logOut();
    setTimeout(() => {
      router.push(LOGIN_ROUTE);
    }, 1000);
    setLoggedIn(false);
  };

  return (
    <>
      {loggedIn ? (
        <div>
          <Timer timeout={8000 * 60 * 10} onTimeout={handleLogout} />
        </div>
      ) : null}
    </>
  );
}
