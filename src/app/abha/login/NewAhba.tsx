import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import OtpField from "@/app/_common/otp-field";
import {
  mobileAadhaarOtp,
  MobileAadhaarVerifyOtp,
  profileLoginByAadharOtp,
  profileLoginByAadharOtpVerify,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Button, Input, Radio } from "@material-tailwind/react";
import { FormControlLabel, RadioGroup } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const NewAhba = () => {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm();
  const router = useRouter();
  const [abhaval, setAbhaval] = useState("");
  const [abhaType, setAbhaType] = useState("mobile-verify");
  const [abhaOtp, setAbhaOtp] = useState("");
  const [showOTPField, setShowOTPField] = useState(false);
  const [key, setKey] = useState(0);
  const [abhaResend, setAbhaResend] = useState(true);
  const [abhasendBtn, setAbhasendBtn] = useState(true);
  const [abhaSeconds, setAbhaSeconds] = useState(0);
  const [healthId, setHealthId] = useState(false);
  const numericRegex = /^[0-9]+$/;
  const mixedAlphaNumericRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
  const alphabeticRegex = /^[a-zA-Z]+$/;

  const newInputchange = (e: any) => {
    setAbhaval(e.target.value);
    let inputVal = `${e.target.value}`;
    if (numericRegex.test(inputVal)) {
      return setHealthId(false);
    } else if (mixedAlphaNumericRegex.test(inputVal)) {
      return setHealthId(true);
    } else if (alphabeticRegex.test(inputVal)) {
      return setHealthId(true);
    }
  };
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const onGenerateOTP = () => {
    // const AbhaValu = healthId === true ? abhaval + "@sbx" : abhaval;
    // const postObj = {
    //   scope: ["abha-address-login", abhaType],
    //   loginHint: "abha-address",
    //   loginId: AbhaValu,
    // };
    const postObj = {
      scope: [
        type == "abha-address" ? "abha-address-login" : "abha-login",
        abhaType,
      ],
      loginHint: type == "abha-address" ? "abha-address" : "abha-number",
      loginId: type == "abha-address" ? abhaval + `@${loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}` : abhaNumber,
    };
    services
      .create(mobileAadhaarOtp, postObj)
      .then((response) => {
        toast.success(response.data.message);
        console.log(response.data.txnId);
        setLocalItem("txnId", response.data.txnId);
        setKey((k)=>k+1)
        setAbhaOtp("")
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
  const onSubmitOTP = () => {
    // const postObj ={
    //   otp: abhaOtp,
    //   txId: getLocalItem("txnId"),
    //   scope: ["abha-address-login", abhaType],
    // };
    const postObj = {
      scope: [
        type == "abha-address" ? "abha-address-login" : "abha-login",
        abhaType,
      ],
      txId: getLocalItem("txnId"),
      otp: abhaOtp,
    };
    services
      .create(MobileAadhaarVerifyOtp, postObj)
      .then((response) => {
        console.log(response);
        if (response.data.authResult === "failed") {
          toast.error(response.data.message);
        } else {
          if (response.data) {
            toast.success(response.data.message);
            if (response.data.tokens) {
              setLocalItem("abhaLoginToken", response.data.tokens.token);
            } else {
              setLocalItem("abhaLoginToken", response.data.token);
            }

            // setLocalItem("patientId", response.data.patientId);
            setTimeout(() => {
              router.push(`/${type}/new-abha-profile`);
            }, 1000);
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

  const handleAbhaTypeChange = (event: any) => {
    setKey(Math.random());
    setAbhaType(event.target.value);
    console.log("Selected Value:", event.target.value);
  };

  const clearForm = () => {};
  const otpStatus = () => {};
  const handleResend = () => {
    onGenerateOTP();
  };
  const [key1, setKey1] = useState(0);
  const [type, setType] = useState("abha-address");
  const [isAbhaAddress, setIsAbhaAddress] = useState(true);
  const [abhaNumber, setAbhaNumber] = useState("");
  const [nameOf, setNameOf] = useState("");
  const handleInputype = (e: any) => {
    setType(e.target.value);
    setAbhaNumber("");
    setAbhaval("");
    setNameOf("typeOf");
  };
  useEffect(() => {
    setType("abha-address");
    setKey1((k) => k + 1);
  }, []);
  return (
    <>
      <div className="w-[90%] mx-auto">
        <div className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
          <div className="w-full card mx-auto bg-white dark:bg-slate-850  rounded-2xl">
            <div className="w-full flex gap-4">
              <div className="w-[50%] flex items-center">
                <Radio
                  crossOrigin={undefined}
                  label="ABHA Address"
                  value={"abha-address"}
                  onChange={handleInputype}
                  name={nameOf}
                  defaultChecked={type == "abha-address"}
                />
              </div>
              <div className="w-[50%] flex items-center">
                <Radio
                  crossOrigin={undefined}
                  label="ABHA Number"
                  name={nameOf}
                  defaultChecked={type == "abha-number"}
                  value={"abha-number"}
                  onChange={handleInputype}
                />
              </div>
            </div>
            <div className="relative input-width mb-6 mt-4">
              <div className="relative">
                {type == "abha-address" ? (
                  <div>
                    <Input
                      crossOrigin={undefined}
                      type="text"
                      value={abhaval}
                      onChange={(e: any) => newInputchange(e)}
                      color="blue"
                      label="ABHA Address"
                    />
                    {
                      <span className="demo text-blue-gray-700 absolute right-5 inset-y-1/4 flex items-center">
                        @{loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}
                      </span>
                    }
                  </div>
                ) : (
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
                )}
              </div>
              <div className="w-full flex gap-4 mt-4">
                <div className="w-[50%] flex items-center">
                  <Radio
                    crossOrigin={undefined}
                    label="Mobile"
                    value={"mobile-verify"}
                    onChange={handleAbhaTypeChange}
                    name="abhatype"
                  />
                </div>
                <div className="w-[50%] flex items-center">
                  <Radio
                    crossOrigin={undefined}
                    label="Aadhaar"
                    value={"aadhaar-verify"}
                    onChange={handleAbhaTypeChange}
                    name="abhatype"
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
                    abhaval.length >= 3 || abhaNumber.length >= 15
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

export default NewAhba;
