"use client";
import ActionButton from "@/app/_common/button";
import OtpField from "@/app/_common/otp-field";
import {
  deactivateAbhaRequestOtp,
  deactivateAbhaVerifyOtp,
  linkAndDeLinkAbhaByXtoken,
  mobileAadhaarOtp,
  MobileAadhaarVerifyOtp,
  reactivateAbhaRequestOtp,
  reactivateAbhaVerifyOtp,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Button, Input, Radio } from "@material-tailwind/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import { LinkIcon } from "@heroicons/react/24/solid";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

const AbhaActiveInactive = (props: any) => {
  const [abhaType, setAbhaType] = useState("mobile-verify");
  const [abhaOtp, setAbhaOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [showAbhaOTPField, setShowAbhaOTPField] = useState(false);
  const [key, setKey] = useState(0);
  const [abhaResend, setAbhaResend] = useState(true);
  const [abhasendBtn, setAbhasendBtn] = useState(true);
  const [abhaSeconds, setAbhaSeconds] = useState(0);
  const [newabhaResend, setNewAbhaResend] = useState(true);
  const [newabhaSeconds, setNewAbhaSeconds] = useState(0);
  const [newabhaOtp, setNewAbhaOtp] = useState("");
  const [abhaTableInfo, setAbhaTableInfo] = useState<any>({ accounts: [] });
  const [isReActive, setIsReActive] = useState<any>(false);
  const [isAbhaActive, setIsAbhaActive] = useState<any>(false);
  const [submitBtnValue, setSubmitBtnValue] = useState<any>("")
  const [type, setType] = useState("mobile-verify");
  const [abhaNumber, setAbhaNumber] = useState("");

  //Generate OTP function
  const onGenerateOTP = () => {
    const postObj = {
      scope: ["abha-login", abhaType],
      loginHint: "abha-number",
      loginId: abhaNumber,
    };
    services
      .create(mobileAadhaarOtp, postObj)
      .then((response) => {
        toast.success(response.data.message);
        console.log(response.data.txnId);
        setLocalItem("txnId", response.data.txnId);
        setKey((k) => k + 1);
        setAbhaOtp("");
        setShowOTPField(true);
        setAbhaSeconds(59);
        setAbhaResend(true);
        setAbhasendBtn(false);
      })
      .catch((err) => {
        if (err.response.data) {
          let isObj: boolean = false;
          let strObj: any = {};
          try {
            strObj = JSON.parse(err.response.data.statusMessage);
            isObj = true;
          } catch (err) {
            strObj = {};
            isObj = false;
          }
          if (!isObj) {
            toast.error(err.response.data.statusMessage);
            return;
          }
          if (JSON.parse(err.response.data.statusMessage)) {
            if (Array.isArray(JSON.parse(err.response.data.statusMessage))) {
              toast.error(
                JSON.parse(err.response.data.statusMessage)[0].message
              );
            } else if (JSON.parse(err.response.data.statusMessage).message) {

              toast.error(JSON.parse(err.response.data.statusMessage).message);
              if (JSON.parse(err.response.data.statusMessage).code === "ABDM-1122") {
                setIsReActive(true);
                const obj = [{
                  loginHint: "abha-number",
                  loginId: abhaNumber,
                  ABHANumber: abhaNumber,
                  otpSystem: abhaType === "mobile-verify" ? "abdm" : "aadhaar",
                }];
                setAbhaTableInfo({ accounts: obj })
                setIsAbhaActive(true)
                setSubmitBtnValue("re-activate")
              }


            } else if (JSON.parse(err.response.data.statusMessage).error) {
              toast.error(
                JSON.parse(err.response.data.statusMessage).error.message
              );
            } else if (JSON.parse(err.response.data.statusMessage).loginId) {
              toast.error(JSON.parse(err.response.data.statusMessage).loginId);
            } else {
              toast.error(err.response.data.statusMessage);
            }
          } else {
            toast.error("Something went wrong,please try again");
          }

        } else {
          toast.error("Something went wrong,please try again");
        }


      });
  };
  //Resend OTP function
  const handleResend = () => {
    onGenerateOTP();
  };
  //Submit OTP function
  const onSubmitOTP = () => {
    const postObj = {
      scope: ["abha-login", abhaType],
      txId: getLocalItem("txnId"),
      otp: abhaOtp,
    };
    services
      .create(MobileAadhaarVerifyOtp, postObj)
      .then((response) => {
        console.log(response.data);
        if (response.data.authResult === "failed") {
          toast.error(response.data.message);
        } else {
          if (response.data) {
            setAbhaTableInfo(response.data);
            setIsAbhaActive(true)
            toast.success(response.data.message);
            if (response.data.tokens) {
              setLocalItem("abhaLoginToken", response.data.tokens.token);
            } else {
              setLocalItem("abhaLoginToken", response.data.token);
            }
          } else {
            toast.error(JSON.parse(response.data).details[0].message);
          }
        }
      })
      .catch((err) => {
        if (err.response.data.statusMessage) {
          if (JSON.parse(err.response.data.statusMessage).error) {
            toast.error(
              JSON.parse(err.response.data.statusMessage).error.message
            );
          } else {
            toast.error(err.response.data.statusMessage);
          }
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };

  //Abha Type Change function
  const handleAbhaTypeChange = (event: any) => {
    setKey(Math.random());
    setAbhaType(event.target.value);
    // console.log("Selected Value:", event.target.value);
  };

  // reset function 
  const ResetFunction = () => {
    setAbhaType("mobile-verify");
    setAbhaOtp("");
    setShowOTPField(false);
    setShowAbhaOTPField(false);
    setKey(0);
    setAbhaResend(true);
    setAbhasendBtn(true);
    setAbhaSeconds(0);
    setNewAbhaResend(true);
    setNewAbhaSeconds(0);
    setNewAbhaOtp("");
    setAbhaTableInfo({ accounts: [] });
    setIsReActive(false);
    setIsAbhaActive(false);
    setSubmitBtnValue("")
    setType("mobile-verify");
    setAbhaNumber("");
  }

  const otpStatus = () => { };
  const clearAbhaForm = () => { };
  const otpAbhaStatus = () => { };

  //Resend deactivate Abha Request Otp function
  const handleAbhaResend = () => {
    onAbhaDeActiveRequestOtp(submitBtnValue);
  };

  //deactivate Abha Request Otp function
  const onAbhaDeActiveRequestOtp = (value: any) => {
    const postObj = {
      loginHint: "abha-number",
      loginId: abhaTableInfo?.accounts[0].ABHANumber,
      xtoken: abhaTableInfo.token,
      otpSystem: abhaType === "mobile-verify" ? "abdm" : "aadhaar",
      scope: ["abha-profile", value]
    };

    services
      .create(deactivateAbhaRequestOtp, postObj)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        setShowAbhaOTPField(true);
        setNewAbhaOtp("");
        setNewAbhaSeconds(59);
        setNewAbhaResend(true);
        setLocalItem("txnId", response.data.txnId);
        setSubmitBtnValue(value)
      })
      .catch((err) => {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "something went wrong please try again"
        );
      });
  };


  const onAbhaReActiveRequestOtp = () => {
    const postObj = {
      loginHint: "abha-number",
      loginId: abhaTableInfo?.accounts[0].ABHANumber,
      otpSystem: abhaType === "mobile-verify" ? "abdm" : "aadhaar",
      scope: ["abha-profile", "re-activate"],
    };

    services
      .create(reactivateAbhaRequestOtp, postObj)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        setShowAbhaOTPField(true);
        setNewAbhaOtp("");
        setNewAbhaSeconds(59);
        setNewAbhaResend(true);
        setLocalItem("txnId", response.data.txnId);
        setSubmitBtnValue("re-activate")
      })
      .catch((err) => {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "something went wrong please try again"
        );
      });
  };

  const onSubmitAbha = () => {
    const deObj = {
      otp: newabhaOtp,
      txId: getLocalItem("txnId"),
      reason: "dont need abha",
      xtoken: abhaTableInfo.token,
      scope: ["abha-profile", submitBtnValue]
    };
    const reObj = {
      otp: newabhaOtp,
      txId: getLocalItem("txnId"),
      reason: "dont need abha",
      otpSystem: abhaType === "mobile-verify" ? "abdm" : "aadhaar",
      scope: ["abha-profile", "re-activate"],
      xtoken: abhaTableInfo.token,
    };
    const postObj = submitBtnValue === "re-activate" ? reObj : deObj
    const url = submitBtnValue === "re-activate" ? reactivateAbhaVerifyOtp : deactivateAbhaVerifyOtp
    services
      .create(url, postObj)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        ResetFunction()
      })
      .catch((err) => {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : err.response.data.statusMessage
              ? err.response.data.statusMessage
              : "Something went wrong. Please try again."
        );

      });
  };
  const getRowId = (row: any) => row.ABHANumber;

  // user list columns data
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S No",
      width: 50,
      renderCell: (params) => {
        const rowNumber = abhaTableInfo?.accounts.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "ABHANumber",
      headerName: "ABHA Number",
      width: 150,
    },
    {
      field: "view",
      headerName: "Active/Inactive",
      width: 150,
      renderCell: (params: any) => {
        return (
          <>
            {isReActive ? (
              <div className="w-full flex gap-4 cursor-pointer" onClick={onAbhaReActiveRequestOtp}>
                <InactiveIcon />
              </div>
            ) : (
              <div className="w-full flex gap-4">
                <span className="cursor-pointer" onClick={() => onAbhaDeActiveRequestOtp("de-activate")}>
                  <ActiveIcon />
                </span>
              </div>
            )}
          </>
        );
      },
    },
    // {
    //   field: "link",
    //   headerName: "Link/Delink",
    //   width: 70,
    //   renderCell: (params: any) => {
    //     return (
    //       <>
    //         {isReActive ? null : (
    //           <div className="w-full flex gap-4">
    //             {/* Link Icon - Blue Color */}
    //             <span
    //               className="cursor-pointer mt-1 text-blue-500"
    //               onClick={() => handleLinkDeLink("link")}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 strokeWidth={1.5}
    //                 stroke="currentColor"
    //                 className="w-5 h-5 cursor-pointer"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    //               </svg>
    //             </span>

    //             {/* De-Link Icon - Gray Color */}
    //             <span
    //               className="cursor-pointer mt-1 text-gray-500"
    //               onClick={() => handleLinkDeLink("de-link")}
    //             >
    //               <svg
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="none"
    //                 viewBox="0 0 24 24"
    //                 strokeWidth={1.5}
    //                 stroke="currentColor"
    //                 className="w-5 h-5 cursor-pointer"
    //               >
    //                 <path
    //                   strokeLinecap="round"
    //                   strokeLinejoin="round"
    //                   d="M13.181 8.68a4.503 4.503 0 0 1 1.903 6.405m-9.768-2.782L3.56 14.06a4.5 4.5 0 0 0 6.364 6.365l3.129-3.129m5.614-5.615 1.757-1.757a4.5 4.5 0 0 0-6.364-6.365l-4.5 4.5c-.258.26-.479.541-.661.84m1.903 6.405a4.495 4.495 0 0 1-1.242-.88 4.483 4.483 0 0 1-1.062-1.683m6.587 2.345 5.907 5.907m-5.907-5.907L8.898 8.898M2.991 2.99 8.898 8.9" />
    //               </svg>
    //             </span>
    //           </div>
    //         )}
    //       </>
    //     );
    //   },
    // },
    {
      field: "delete",
      headerName: "Delete",
      width: 70,
      renderCell: (params: any) => {
        return (
          <>
            {props?.screenData.Delete ?
              <>
                {isReActive ? null : (
                  <div className="w-full flex gap-4">
                    <span className="cursor-pointer mt-1" onClick={() => onAbhaDeActiveRequestOtp("delete")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-5 w-5 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </span>
                  </div>
                )}
              </>
              : null
            }
          </>
        );
      },
    },

  ];

  const handleLinkDeLink = (value: any) => {
    const postObj = {
      scope: [value],
      xtoken: abhaTableInfo.token,
      loginHint: "abha-number",
      loginId: abhaTableInfo?.accounts[0].ABHANumber,
      benefitName: abhaTableInfo?.accounts[0].name,
    }
    services
      .create(linkAndDeLinkAbhaByXtoken, postObj)
      .then((response) => {
        console.log(response.data);
        toast.success(response.data.message);
        // ResetFunction()
      })
      .catch((err) => {
        toast.error(
          err.response.data.message
            ? err.response.data.message
            : "something went wrong please try again"
        );
      });
  }

  useEffect(() => {
    setType("abha-number");
  }, []);
  return (
    <>
      <div className="w-[90%] mx-auto">
        <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div className="w-full card mx-auto bg-white dark:bg-slate-850  rounded-2xl">
            <div className="relative input-width mb-6 ">
              <div className="relative">
                <p className="w-full text-[15px] mb-1 ms-1">ABHA Number</p>
                <Input
                  crossOrigin={undefined}
                  type="text"
                  value={abhaNumber}
                  onChange={(e: any) => setAbhaNumber(e.target.value)}
                  color="blue"
                  label="ABHA Number"
                  onKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;

                    if (/^[0-9-]$/.test(e.key)) {
                      if (
                        e.target.value.length === 2 ||
                        e.target.value.length === 7 ||
                        e.target.value.length === 12
                      ) {
                        e.target.value = e.target.value + "-";
                      }
                      if (e.target.value.length > 16) {
                        e.preventDefault();
                      }
                    } else {
                      // Prevent entry of alphabets and symbols
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="w-full flex gap-4 mt-4">
                <div className="w-[50%] flex items-center">
                  <Radio
                    crossOrigin={undefined}
                    label="Mobile"
                    value={"mobile-verify"}
                    onChange={handleAbhaTypeChange}
                    name="abhatype"
                    defaultChecked={type == "mobile-verify"}
                  />
                </div>
                <div className="w-[50%] flex items-center">
                  <Radio
                    crossOrigin={undefined}
                    label="Aadhaar"
                    value={"aadhaar-verify"}
                    onChange={handleAbhaTypeChange}
                    name="abhatype"
                    defaultChecked={type == "aadhaar-verify"}
                  />
                </div>
              </div>
            </div>
            <div className="mx-auto grid ">
              {abhasendBtn ? (
                <Button
                  onClick={onGenerateOTP}
                  type="submit"
                  disabled={
                    abhaNumber.length >= 15
                      ? false
                      : true
                  }
                  className="full lg cursor-pointer  px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                >
                  Send OTP
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={true}
                  className="full lg cursor-not-allowed px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                >
                  Send OTP
                </Button>
              )}
            </div>
            {showOTPField ? (
              <div className="w-[80%] mx-auto" key={key}>
                <OtpField
                  id="AbhaOtp"
                  onResendOTP={handleResend}
                  setOtpFromChild={setAbhaOtp}
                  otpStatus={otpStatus}
                  resendotp={abhaResend}
                  seconds={abhaSeconds}
                  setSeconds={setAbhaSeconds}
                  setResendOtp={(flag: any) => setAbhaResend(flag)}
                />
              </div>
            ) : null}

            {abhaOtp ? (
              <div className="mt-4 w-full mb-3 flex justify-end">
                <ActionButton
                  buttonText="Submit"
                  handleSubmit={onSubmitOTP}
                  width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              </div>
            ) : null}

            <div className="w-full mt-2">
              {isAbhaActive &&
                <DataGrid
                  rows={abhaTableInfo?.accounts}
                  columns={columns}
                  getRowId={getRowId}
                  pageSizeOptions={[10, 20]}
                  className="px-0"
                  density="compact"
                />
              }
              {showAbhaOTPField ? (
                <div className="w-[80%] mx-auto pt-3" key={key}>
                  <OtpField
                    id="NewAbhaOtp"
                    onResendOTP={handleAbhaResend}
                    setOtpFromChild={setNewAbhaOtp}
                    otpStatus={otpAbhaStatus}
                    resendotp={newabhaResend}
                    seconds={newabhaSeconds}
                    setSeconds={setNewAbhaSeconds}
                    setResendOtp={(flag: any) => setNewAbhaResend(flag)}
                  />
                </div>
              ) : null}
              {newabhaOtp ? (
                <div className="mt-4">
                  <div className="flex gap-4 w-full">
                    <ActionButton
                      buttonText="Submit"
                      handleSubmit={onSubmitAbha}
                      width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                    <ActionButton
                      buttonText="Reset"
                      handleSubmit={clearAbhaForm}
                      width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default roleInfoScreenData(AbhaActiveInactive, "Ap")