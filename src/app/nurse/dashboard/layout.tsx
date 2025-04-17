"use client";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/app/_components/header";
import Footer from "@/app/_components/footer";
import UserContext from "../../utilities/user-context";
import MenuBarNurse from "../_components/menu-bar-nurse";
import WithNurseAuth from "@/app/_commonfeatures/protectedRoute/WithNurseAuth";
import { getLocalItem } from "@/app/utilities/local";

interface LoginData {
  token: string;
}

function NurseDashboardLayout({ children }: { children: React.ReactNode }) {
  const loginData = useContext(UserContext) as LoginData;
  const [tokenVal, setTokenVal] = useState("");

  useEffect(() => {
    let val = JSON.parse(getLocalItem("loginResponse")!).token;
    if (val) {
      setTokenVal(val);
    }
  }, [loginData]);

  // const getRload = () => {
  //     window.location.reload()
  // }
  // useEffect(() => {
  //     return () => getRload()
  // }, [])

  return (
    <section>
      <div className="min-h-full">
        <div>
          <Header heading={"Triage Nurse Dashboard"} />
          <MenuBarNurse />
          {children}
        </div>
      </div>
    </section>
  );
}

export default WithNurseAuth(NurseDashboardLayout);
