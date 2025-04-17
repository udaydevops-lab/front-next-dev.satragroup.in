"use client";
import { Menu, Transition } from "@headlessui/react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import { BellIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { Badge, Typography } from "@mui/material";
import React, { Fragment, useEffect, useState, useContext } from "react";
import UserContext from "../utilities/user-context";
import { logOut } from "../utilities/logout";
import { useRouter } from "next/navigation";
import { CHANGE_PASSWORD, CHANGE_ROLE, LOGIN_ROUTE } from "../utilities/constants";
import user from "../../../public/images/profile.jpg";

import Select from "react-tailwindcss-select";
// import the langauga json data here
import langugeData from "../language/language.json";

import Image from "next/image";
import { PatientDatadataAuth } from "../_common/context/DataStore";
import dayjs from "dayjs";
import moment from "moment";
import { getLocalItem, setLocalItem } from "../utilities/local";
import services from "../utilities/services";
import { logOutUser, refreshToken } from "../utilities/api-urls";
import axios from "axios";
import Loader from "../_common/loader";
import { getHeaderResponse } from "../_commonfeatures/header";
import ReactCommonDialog from "../_commonfeatures/ReactCommonDialog";
import ChangeRole from "../user/change-role/page";
import AdminChangeRole from "../user/change-role/AdminChangeRole";
interface LoginData {
  token: string;
}

function Header(props: any) {
  const handleOpen = () => setOpen(!open);
  const [open, setOpen] = useState(false);
  const [showChangeRole, setShowChangeRole] = useState(false);
  const [showAdminChangeRole, setAdminShowChangeRole] = useState(false);
  const loginData = useContext(UserContext) as LoginData;
  const [tokenVal, setTokenVal] = useState("");
  const [userName, setUserName] = useState<any>("");
  const [loading, setLoading] = useState(false);
  const { setGetLandData, setSelectHeaderDate, setSelectHeaderCurrDate } =
    PatientDatadataAuth();
  const lang: any[] = [
    { label: "English", value: "en" },
    { label: "Telugu", value: "te" },
    { label: "Hindi", value: "hi" },
    { label: "Tamil", value: "ta" },
  ];
  const [lanval, setLanval] = useState(null);

  let resultArray: any = langugeData;



  const handleChange = (e: any) => {
    let dataLan = e.value;
    setLanval(e);
    getResult(dataLan);
  };

  const getResult = (val: any) => {
    if (resultArray.hasOwnProperty(val)) {
      let data = resultArray[val];
      setGetLandData(data);
    }
  };

  let LastLoginTime = JSON.parse(getLocalItem("loginResponse")!)?.lastLogin;
  const LLT = `Last Login Time ${moment(LastLoginTime).format(
    "DD-MM-YYYY hh:mm"
  )}`;
  const userNavigation = [
    // { name: "Your Profile", href: "#" },
    // { name: "Settings", href: "#" },
    { name: "Sign out" },
    { name: "Change password" },
    // { name: "Change role" },
    { name: LLT },
  ];

  const router = useRouter();
  const handleSignOut = (item: string) => {
    if (item === "Sign out") {
      setLoading(true);
      let loginResponse = JSON.parse(getLocalItem("loginResponse")!);
      if (loginResponse) {
        let postObj = {
          username: loginResponse.username,
          userId: loginResponse.userId,
        };
        services
          .create(logOutUser, postObj)
          .then((response) => {
            setTimeout(() => {
              localStorage.removeItem("loginResponse");
              localStorage.clear();
              router.replace(LOGIN_ROUTE);
              router.refresh()
              return 
            }, 2000);
          })
          .catch((err) => {
            console.log(err.message);
            setLoading(false);
            // Token Expired
            localStorage.removeItem("loginResponse");
          });
      }
    } else if (item === "Change password") {
      return router.replace(CHANGE_PASSWORD);
    } else if (item === "Change role") {
      // setOpen(true);
      return router.replace(CHANGE_ROLE)
    }
  };

  function classNames(...classNamees: any[]) {
    return classNamees.filter(Boolean).join(" ");
  }
  let badge = 9; //took statis data as of now to display

  // refresh token function

  let loginTimeRes: any = JSON.parse(getLocalItem("loginResponse")!);

  let loginTime: any;
  let loginResponse: any;
  if (loginTimeRes) {
    loginTime = loginTimeRes?.loginTime;
    loginResponse = loginTimeRes;
  }

  // Refresh Token function
  const checkAndUpdateToken = async () => {
    const postObj = {
      jwtTxid: loginResponse?.jwtxId,
    };
    let result;
    if (postObj) {
      try {
        const res = await axios.post(refreshToken, postObj);
        result = res.data.refreshToken;
        const newData = {
          ...loginResponse,
          token: result,
          loginTime: Date.now(),
        };
        setLocalItem("loginResponse", JSON.stringify(newData));
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }

  };
  const routerz = useRouter();

  useEffect(() => {
    if (
      getLocalItem("loginResponse") !== null &&
      getLocalItem("loginResponse") !== undefined &&
      getLocalItem("loginResponse") !== ""
    ) {
      let val = JSON.parse(getLocalItem("loginResponse")!);
      if (val) {
        setTokenVal(val);
      }
    } else {
      router.push(LOGIN_ROUTE);
    }

    getResult("en");
    if (JSON.parse(getLocalItem("loginResponse")!)?.username) {
      setUserName(JSON.parse(getLocalItem("loginResponse")!)?.username?.toLowerCase())
    }

    // const fetchPeriodically = async () => {
    //   const currentTime = Date.now();
    //   const timeDifference = currentTime - loginTime;
    //   const oneHourInMilliseconds = 60 * 60 * 1000;

    //   const interval = setInterval(async () => {
    //     if (timeDifference >= oneHourInMilliseconds) {
    //       await checkAndUpdateToken();
    //     }
    //   }, 60000);
    // };

    // fetchPeriodically();

  }, [loginTime]);
  useEffect(() => {
    if (JSON.parse(getLocalItem("loginResponse")!).loginTime) {
      setInterval(() => {
        let refreshCalledTime = JSON.parse(getLocalItem("loginResponse")!).loginTime;
        let expirationTime: any = JSON.parse(getLocalItem("loginResponse")!).expirationTime
        //checking the time difference periodically
        //currently calling refresh token before 1 minutes(now - refreshAPICalledTime) of expiration
        //currently expiration is 1hr
        if (moment(Date.now()).diff(refreshCalledTime) > expirationTime - 60000) {
          checkAndUpdateToken()
        }
      }, 30000);
    }
  }, [])

  const changeRolePopupValue = () => {
    if (userName === "satraadmin") {
      setAdminShowChangeRole(!showAdminChangeRole)
    } else {
      setShowChangeRole(!showChangeRole)
    }
  }
  return (
    <div className="min-h-full tp-layout-header">
      {loading ? <Loader /> : ""}
      {(tokenVal as any).token !== "" && (
        <div className="top-0 w-full ">
          <div className="mx-auto  max-w-7xl px-4 pb-0 sm:px-4">
            <div className="flex h-12 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    className="h-7 mr-4"
                    src={"/images/login/logo.png"}
                    alt="Satra"
                    width="100"
                    height="50"
                  />
                </div>
                <div className="flex-shrink-0 pl-6">
                  <h1 className="md:text-sm text-sm pt-3 font-bold">
                    {props.heading}
                  </h1>
                </div>
              </div>

              <div className="md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <div
                    className="flex justify-end gap-2 text-[md] items-center pl-2 cursor-pointer"
                    style={{ width: "150px" }}
                    onClick={changeRolePopupValue}
                  >
                    <MapPinIcon className="w-5 h-5 " />
                    <h1>{getHeaderResponse().locationDesc}</h1>
                    {/* <Select
                      primaryColor={"indigo"}
                      value={lanval}
                      onChange={handleChange}
                      options={lang}
                      // isSearchable={true}
                    /> */}
                  </div>

                  {/* Profile dropdown */}
                  <Menu as="div" className="userlink relative ml-3">
                    <div className="flex">
                      <Menu.Button className="mr-4 mt-2 relative flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        {/* <Badge badgeContent={badge} color="primary">
                          <BellIcon className="h-6 w-6" aria-hidden="true" />
                        </Badge> */}
                      </Menu.Button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-gray-800">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            <div className="flex-shrink-0 pl-4 pr-4">
                              <h1 className="capitalize">
                                {(tokenVal as any).employeename}
                              </h1>
                            </div>

                            <Image
                              src={user}
                              alt="photo"
                              width={120}
                              height={120}
                              className="h-8 w-8 rounded-full"
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute z-10 right-0  mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <div
                                    // href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    <div className=" cursor-pointer z-10 ">
                                      <Typography
                                        onClick={() => handleSignOut(item.name)}
                                      >
                                        {item.name}
                                      </Typography>
                                    </div>
                                  </div>
                                )}
                              </Menu.Item>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </Menu>
                </div>
              </div>
              {/* module button rooting */}
            </div>
          </div>
        </div>
      )}

      <ReactCommonDialog
        dialogtitle={"Change Role"}
        open={showChangeRole}
        size={'xl'}
        handler={() => {
          // setPopup({
          //     open: false
          // })
        }}
        popupClose={() => {
          setShowChangeRole(false)
        }}
        Content={<ChangeRole changeRolePopupValue={changeRolePopupValue} />}
      />
      <ReactCommonDialog
        dialogtitle={"Change Role"}
        open={showAdminChangeRole}
        size={'md'}
        handler={() => {
          // setPopup({
          //     open: false
          // })
        }}
        popupClose={() => {
          setAdminShowChangeRole(false)
        }}
        Content={<AdminChangeRole />}
      />


    </div>
  );
}

export default Header;