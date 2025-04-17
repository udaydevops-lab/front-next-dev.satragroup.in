import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import OtpField from "@/app/_common/otp-field";
import {
  profileLoginByAadharOtp,
  profileLoginByAadharOtpVerify,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Button, Input } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AadharNologin = () => {
  const [aadharNo, setAadharNo] = useState("");
  const [aadharOtp, setAadharOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [key, setKey] = useState(44);
  const otpStatus = () => {};
  const [aadhaarSeconds, setAadhaarSeconds] = useState(0);
  const [aadhaarResend, setAadhaarResend] = useState(true);
  const [aadhaarsendBtn, setAadhaarsendBtn] = useState(true);
  const router = useRouter();

  // resend the OTP function
  const handleResend = () => {
    onGenerateOTP();
  };

  // aadhar submit function
  const onSubmitOTP = () => {
    const postObj = {
      otp: aadharOtp,
      txId: getLocalItem("txnId"),
    };
    services
      .create(profileLoginByAadharOtpVerify, postObj)
      .then((response) => {
        console.log(response);
        if (response.data.authResult === "failed") {
          toast.error(response.data.message);
        } else {
          if (response.data) {
            toast.success(response.data.message);
            setLocalItem("abhaLoginToken", response.data.token);
            setLocalItem("patientId", response.data.patientId);
            setTimeout(() => {
              router.push("/1/new-abha-profile");
            }, 1000);
          } else {
            toast.error(JSON.parse(response.data).details[0].message);
          }
        }
      })
      .catch((err) => {
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };

  // clear function
  const clearForm = () => {
    setAadharOtp("");
    setKey(Math.random());
    setAadharNo("");
    setAadhaarResend(true);
    setAadhaarSeconds(0);
    setAadhaarsendBtn(true);
    setShowOTPField(false);
  };

  // Generate OTP Function
  const onGenerateOTP = () => {
    const postObj = {
      loginHint: "aadhaar",
      loginId: aadharNo,
    };

    services
      .create(profileLoginByAadharOtp, postObj)
      .then((response) => {
        if (response.data.txnId) {
          if (response.data.message.includes("OTP sent")) {
            let number = response.data.message.substring(
              response.data.message.length - 10,
              response.data.message.length
            );
            toast.success(
              `OTP sent to Aadhaar linked mobile number ending with ${number}`
            );
          } else {
            toast.success(response.data.message);
          }
        }
        setLocalItem("txnId", response.data.txnId);
        //OTP is not clearing so using key to rerender after resetting
        setKey((k)=>k+1)
        setAadharOtp("")
        setShowOTPField(true);
        setAadhaarSeconds(59);
        setAadhaarResend(true);
        setAadhaarsendBtn(false);
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
          if (isObj) {
            if (strObj.loginId == "Invalid LoginId") {
              toast.error("Aadhaar number is not valid");
            } else {
              toast.error(strObj.error.message);
            }
          } else {
            if (err.response.data.loginId) {
              if (err.response.data.loginId == "Invalid LoginId") {
                toast.error("Aadhaar number is not valid");
              } else {
                toast.error(err.response.data.loginId);
              }
            } else {
              toast.error(err.response.data.statusMessage);
            }
          }
        } else {
          toast.error("Something went wrong please try again");
        }
        // if (err.response.data.statusMessage) {
        //   if (JSON.parse(err.response.data.statusMessage).loginId) {
        //     if (
        //       JSON.parse(err.response.data.statusMessage).loginId ==
        //       "Invalid LoginId"
        //     ) {
        //       toast.error("Aadhaar number is not valid");
        //     } else {
        //       toast.error(JSON.parse(err.response.data.statusMessage).loginId);
        //     }
        //   } else {
        //     toast.error(
        //       JSON.parse(err.response.data.statusMessage).error.message
        //     );
        //   }
        // } else {
        //   toast.error("Something went wrong please try again");
        // }
      });
  };

  // set the aadhar no
  const handelAadhar = (e: any) => {
    const inputVal = e.target.value;
    setAadharNo(inputVal);
  };

  return (
    <>
      <div className="w-[90%] mx-auto">
        <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div className="w-full card mx-auto bg-white dark:bg-slate-850 py-3 rounded-2xl">
            <div className="relative input-width mb-6">
              <Input
                crossOrigin={undefined}
                type="number"
                value={aadharNo}
                onChange={(e: any) => handelAadhar(e)}
                color="blue"
                label="Aadhaar Number"
                onKeyPress={(e: any) => {
                  if (e.key === "Backspace" || e.key === "Delete") return;
                  if (
                    e.target.value.length > 11 ||
                    e.key == "e" ||
                    e.key == "E"
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="mx-auto grid ">
              {aadhaarsendBtn ? (
                <Button
                  onClick={onGenerateOTP}
                  type="submit"
                  disabled={aadharNo.length === 12 ? false : true}
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
                  onResendOTP={handleResend}
                  setOtpFromChild={setAadharOtp}
                  otpStatus={otpStatus}
                  resendotp={aadhaarResend}
                  seconds={aadhaarSeconds}
                  setSeconds={setAadhaarSeconds}
                  setResendOtp={(flag: any) => setAadhaarResend(flag)}
                />
              </div>
            ) : null}

            {aadharOtp ? (
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AadharNologin;
