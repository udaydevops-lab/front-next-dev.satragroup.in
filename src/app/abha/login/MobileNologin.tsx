"use client";
import ActionButton from "@/app/_common/button";
import OtpField from "@/app/_common/otp-field";
import {
  getCaptcha,
  getMobileCaptcha,
  profileLoginByMobileOtp,
  profileLoginByMobileOtpVerify,
  profileLoginByMobileVerifyUser,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Button, Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { EyeIcon } from "@heroicons/react/24/solid";
import AbhaMobileLoginCaptcha from "@/app/_common/AbhaMobileLoginCaptcha";

const MobileNologin = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [userData, setUserData] = useState<any>({});
  const [userTable, setUserTable] = useState<any>([]);
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileSeconds, setMobileSeconds] = useState(0);
  const [mobileResend, setMobileResend] = useState(true);
  const [mobilesendBtn, setMobilesendBtn] = useState(true);
  const [showOTPField, setShowOTPField] = useState(false);
  const [key, setKey] = useState(44);
  const otpStatus = () => {};
  const router = useRouter();

  // OTP Resend function
  const handleResend = () => {
    onGenerateOTP();
  };

  // on Submit function
  const onSubmitOTP = () => {
    const postObj = {
      otp: mobileOtp,
      txId: getLocalItem("txnId"),
      captchvalue: window.btoa(captchaValue),
      captchTxid: txId,
    };
    console.log("Post Object", postObj);
    services
      .create(profileLoginByMobileOtpVerify, postObj)
      .then(
        (response) => {

          if (response.data.authResult) {
            if (response.data.authResult == "failed") {
              toast.error(response.data.message);
            }
          } else if(response.data&&response.data.length>0) {
            toast.success("OTP Verified Successfully");
            // let userTable = response.data.accounts.map(
            //   (list: any, index: number) => ({
            //     ...list,
            //     id: index + 1,
            //     token: "",
            //   })
            // );

            // setUserTable(userTable);
            setUserData(response.data);
            let userArr: any = [];
            response.data.map((item: any, index: number) => {
              let newObj = {
                // txId: response.data.txnId,
                id: index + 1,
                ABHANumber: item?.ABHANumber,
                token: item.response?.token,
                preferredAbhaAddress: item?.preferredAbhaAddress,
                name: item?.name,
              };
              // UserFun(newObj);
              userArr.push(newObj);
            });
            setUserTable(userArr);
          }
        }
        // if (response.data.authResult == "failed") {
      )
      .catch((err) => {
        if (err.response.data.statusMessage) {
          toast.error(err.response.data.statusMessage);
          generateCaptcha()
        } else {
          toast.error("Something went wrong. Please try again!");
        }
      });
  };

  const UserFun = (newObj: any) => {
    services
      .create(profileLoginByMobileVerifyUser, newObj)
      .then((response: any) => {
        // Update token for the correct user in the userTable
        setUserTable((prevUserTable: any) =>
          prevUserTable.map((item: any) =>
            item.ABHANumber === newObj.abhaNumber
              ? { ...item, token: response.data.token }
              : item
          )
        );
      })
      .catch((e) => {
        console.log("Something went wrong. Please try again!");
      });
  };

  // clear function
  const clearForm = () => {
    setMobileOtp("");
    setMobileNo("");
    setKey(Math.random());
    setMobilesendBtn(true);
    setMobileSeconds(0);
  };

  //OTP Generate Function
  const onGenerateOTP = () => {
    const postObj = {
      loginHint: "mobile",
      loginId: mobileNo,
    };

    services
      .create(profileLoginByMobileOtp, postObj)
      .then((response) => {
        if (response.data.txnId) {
          if (response.data.message.includes("OTP sent")) {
            let number = response.data.message.substring(
              response.data.message.length - 10,
              response.data.message.length
            );
            toast.success(
              `OTP sent to ABHA linked mobile number ending with ${number}`
            );
          } else {
            toast.success(response.data.message);
          }
        }
        setKey((k) => k + 1);
        setMobileOtp("");
        setShowOTPField(true);
        setLocalItem("txnId", response.data.txnId);
        setMobileSeconds(59);
        setMobileResend(true);
        setMobilesendBtn(false);
        generateCaptcha();
      })
      .catch((err) => {
        if (err.response.data) {
          if (err.response.data.error) {
            if (err.response.data?.error.code == "ABDM-1115") {
              toast.error(
                "ABHA Number not found We did not find any ABHA number linked to this mobile number. Please use ABHA linked mobile number"
              );
            } else {
              toast.error(err.response.data.error.message);
            }
          } else if (err.response.data.statusMessage) {
            toast.error(err.response.data.statusMessage);
          } else if (err.response.data?.loginId == "Invalid LoginId") {
            toast.error("Please enter a valid mobile number");
          } else if (err.response.data?.error.code == "ABDM-1115") {
            toast.error("Please enter a valid mobile number");
          } else {
            toast.error("Something went wrong Please try again!");
          }
        } else {
          toast.error("Something went wrong Please try again!");
        }
      });
  };

  const getRowId = (row: any) => row.id;

  //input onchange function
  const handelAadhar = (e: any) => {
    const inputVal = e.target.value;
    setMobileNo(inputVal);
  };

  // relocation user function
  const handelUser = (row: any) => {
    setLocalItem("abhaLoginToken", row.token);
    router.push("/1/new-abha-profile");
  };

  // user list columns data
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S No",
      width: 60,
    },

    {
      field: "ABHANumber",
      headerName: "ABHA Number",
      width: 200,
    },
    {
      field: "preferredAbhaAddress",
      headerName: "preferred ABHA Address",
      width: 150,
    },
    {
      field: "name",
      headerName: "Beneficiary Name",
      width: 250,
    },
    // {
    //     field: "dob",
    //     headerName: "Date OF Birth",
    //     width: 120,
    // },
    // {
    //     field: "status",
    //     headerName: "Status",
    //     width: 100,
    // },
    {
      field: "view",
      headerName: "View",
      width: 100,
      renderCell: (params: any) => (
        <>
          <EyeIcon
            className="text-blue-500 w-5 h-5 cursor-pointer"
            onClick={() => {
              handelUser(params.row);
            }}
          />
        </>
      ),
    },
  ];
  //Abha profile with captcha
  const [loading, setLoading] = useState(false);
  const [captcha, setCaptcha] = useState("");
  const [captchaValue, setCaptchaValue] = useState("");
  const [txId, setTxId] = useState("");
  const generateCaptcha = () => {
    setLoading(true);
    services
      .get(getMobileCaptcha, {}, false)
      .then((response: any) => {
        setLoading(false);
        let captchaCode = window.atob(response.data.captchBytes);
        setCaptcha(captchaCode);
        setCaptchaValue("")
        setTxId(response.data.txId);
      })
      .catch((err: any) => {
        toast.error("Error Getting Captcha");
        setLoading(false);
      });
  };
  const handleCapthaChange = (value: any) => {
    // if (value == captcha) {
    // }
    setCaptchaValue(value);
  };
  useEffect(() => {
    generateCaptcha();
  }, []);
  const onCaptchaVerify = () => {};
  return (
    <div className="w-[90%] mx-auto">
      <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
        <div className="w-full card mx-auto bg-white dark:bg-slate-850 py-3 rounded-2xl">
          <div className="relative input-width mb-6">
            <Input
              crossOrigin={undefined}
              type="number"
              value={mobileNo}
              onChange={(e: any) => handelAadhar(e)}
              color="blue"
              label="Mobile Number"
              onKeyPress={(e: any) => {
                if (e.key === "Backspace" || e.key === "Delete") return;
                if (e.target.value.length > 9 || e.key == "e" || e.key == "E") {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <div className="mx-auto grid ">
            {mobilesendBtn ? (
              <Button
                onClick={() => onGenerateOTP()}
                type="submit"
                disabled={mobileNo.length === 10 ? false : true}
                className="full lg cursor-pointer  px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              >
                Send OTP
              </Button>
            ) : (
              <Button
                disabled={true}
                type="submit"
                className="full lg cursor-not-allowed  px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              >
                Send OTP
              </Button>
            )}
          </div>

          {showOTPField ? (
            <>
              <div className="mt-4 w-[80%] mx-auto">
                <AbhaMobileLoginCaptcha
                  captchaCode={captcha}
                  generateCaptcha={generateCaptcha}
                  handleCapthaChange={handleCapthaChange}
                  onSubmit={onCaptchaVerify}
                  capthaValue={captchaValue}
                />
              </div>
              <div className="w-[80%] mx-auto mt-10" key={key}>
                <OtpField
                  onResendOTP={handleResend}
                  setOtpFromChild={setMobileOtp}
                  otpStatus={otpStatus}
                  resendotp={mobileResend}
                  seconds={mobileSeconds}
                  setSeconds={setMobileSeconds}
                  setResendOtp={(flag: any) => setMobileResend(flag)}
                />
              </div>
            </>
          ) : null}

          {mobileOtp ? (
            <div className="mt-4">
              <div className="flex gap-4 w-full">
                <ActionButton
                  buttonText="Submit"
                  handleSubmit={onSubmitOTP}
                  width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
                <ActionButton
                  buttonText="Reset"
                  handleSubmit={clearForm}
                  width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              </div>
            </div>
          ) : null}
          <div className="w-full mt-4">
            {userTable?.length > 0 && (
              <DataGrid
                rows={userTable}
                columns={columns}
                getRowId={getRowId}
                pageSizeOptions={[10, 20]}
                className="px-0"
                density="compact"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNologin;
