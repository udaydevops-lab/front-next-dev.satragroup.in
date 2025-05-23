"use client";
import React, { useEffect, useState, useContext } from "react";
import UserContext from "../utilities/user-context";
import { getLocalItem } from "../utilities/local";

interface LoginData {
  token: string;
}

function Footer() {
  const loginData = useContext(UserContext) as LoginData;
  const [tokenVal, setTokenVal] = useState("");

  useEffect(() => {
    let val = getLocalItem("loginResponse");
    if (val) {
      setTokenVal(val);
    }
  }, [loginData]);

  return (
    <div className="min-h-full">
      {tokenVal !== "" ? (
        <footer className="bg-black d-none">
          <div className="w-full mx-auto max-w-screen-xl p-2 md:flex md:items-center md:justify-between">
            <span className="text-sm text-white sm:text-center dark:text-gray-400">
              © 2023{" "}
              <a href="#" className="hover:underline">
                Satragroup
              </a>
              . All Rights Reserved.
            </span>
            <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-white dark:text-gray-400 sm:mt-0">
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6 ">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="mr-4 hover:underline md:mr-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </footer>
      ) : (
        ""
      )}
    </div>
  );
}

export default Footer;
