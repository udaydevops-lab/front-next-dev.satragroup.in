"use client";
import React, { useEffect, useState } from "react";
import CardLayout from "../../_common/card-layout";
import FormPropsTextFields from "../../_common/input";
import ActionButton from "../../_common/button";
import OtpField from "../../_common/otp-field";
import IconButton from "../../_common/icon-button";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import CheckboxMui from "../../check-box";
import { Checkbox } from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import services from "@/app/utilities/services";
import {
  createHealthId,
  healthIdGenerateAadhaarOtp,
  healthIdGenerateMobileOtp,
  healthIdResendAadhaarOtp,
  healthIdResendMobileOtp,
  healthIdVerifyAadhaarOtp,
  healthIdVerifyMobileOtp,
  isHealthIdAvailable,
  searchByHealthId,
} from "@/app/utilities/api-urls";
import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
} from "@/app/utilities/local";
import { useRouter } from "next/navigation";
import Loader from "@/app/_common/loader";
import AlertCustomAnimation from "@/app/_common/new-alert";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "react-toastify/dist/ReactToastify.css";
import { GridVisibilityOffIcon } from "@mui/x-data-grid";
import { ClassNames } from "@emotion/react";

function AbhaHealthId() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
    getValues: getValues2,
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    formState: { errors: errors3 },
    setValue: setValue3,
    getValues: getValues3,
  } = useForm();

  const [alertMsg, setAlertMsg] = useState(false);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [aadhaarOtp, setAadhaarOtp] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [consent, setConsent] = useState(false);
  const [generateStatus, setGenerateStatus] = useState(true);
  const [key, setKey] = useState(0);
  const [key2, setKey2] = useState(20);
  const [key3, setKey3] = useState(40);
  const [loading, setLoading] = useState(false);
  const [aadhaarInput, setAadhaarInput] = useState(false);
  const [aadhaarBtn, setAadhaarBtn] = useState(true);
  const [aadhaarOtpD, setAadhaarOtpD] = useState(true);
  const [aadhaarOtpResend, setAadhaarOtpResend] = useState(true);
  const [aadhaarSubmit, setAadhaarSubmit] = useState(false);
  const [mobileInput, setMobileInput] = useState(true);
  const [mobileBtn, setMobileBtn] = useState(true);
  const [mobileOtpD, setMobileOtpD] = useState(true);
  const [mobileOtpResend, setMobileOtpResend] = useState(true);
  const [mobileSubmit, setMobileSubmit] = useState(false);
  const [emailInput, setEmailInput] = useState(true);
  const [healthInput, setHealthInput] = useState(true);
  const [consentBtn, setConsentBtn] = useState(true);
  const [healthBtn, setHealthBtn] = useState(true);
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  useEffect(() => { }, []);
  const generateAadhaarOTP = (data: any) => {
    setLoading(true);
    let postObj = {
      aadhaar: data.aadhaarNumber,
      authMethod: "Aadhar_OTP",
    };
    services
      .create(healthIdGenerateAadhaarOtp, postObj)
      .then((response) => {
        setLoading(false);
        setAadhaarOtpD(false);
        setAadhaarOtpResend(false);
        if (response.data.txnId) {
          setLocalItem("txnId", response.data.txnId);
          toast.success("OTP Generated Successfully");
        } else {
          toast.error(response.data.details[0].message);
          setAadhaarOtpD(true);
          setAadhaarOtpResend(true);
        }
      })
      .catch((error) => {
        setLoading(false);
        setAadhaarOtpD(false);
        setAadhaarOtpResend(false);
        console.log(error.message);
      });
  };
  const handleAadharResendOTP = () => {
    setLoading(true);
    let postObj = {
      txnId: getLocalItem("txnId"),
    };
    services
      .create(healthIdResendAadhaarOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          setLocalItem("txnId", response.data.txnId);
          toast.success("OTP Generated Successfully");
        }
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };
  const verifyAadhaarOtp = () => {
    setLoading(true);
    const txnId: string | null = getLocalItem("txnId");
    var obj: { [k: string]: any } = {};
    obj.txnId = txnId;
    if (aadhaarOtp.length === 6) {
      obj.otp = window.btoa(aadhaarOtp);
      services
        .create(healthIdVerifyAadhaarOtp, obj)
        .then((response) => {
          setLoading(false);
          if (response.data.txnId) {
            toast.success("Aadhaar Verified Successfully");
            setAadhaarInput(true);
            setAadhaarBtn(true);
            setAadhaarOtpD(true);
            setAadhaarOtpResend(true);
            setMobileInput(false);
            setAadhaarSubmit(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.message);
          console.log(error.message);
        });
    } else {
      setLoading(false);
      toast.success("Please enter 6 digit OTP ");
    }
  };
  const handleMobileChange = (e: any) => {
    if (e.target.value.length > 0 && e.target.value.length === 10) {
      setValue2("mobileNumber", e.target.value);
      setMobileBtn(false);
    } else {
      e.preventDefault();
      setMobileBtn(true);
    }
  };
  const generateMobileOTP = (data: any) => {
    setLoading(true);
    let postObj = {
      mobile: data.mobileNumber,
      authMethod: "MOBILE_OTP",
      txnId: getLocalItem("txnId"),
    };
    services
      .create(healthIdGenerateMobileOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          setLocalItem("txnId", response.data.txnId);
          setMobileOtpD(false);
          setMobileOtpResend(false);
          toast.success("OTP Generated Successfully");
        } else {
          setMobileOtpD(true);
          setMobileOtpResend(true);
          toast.error(response.data.details[0].message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
      });
  };
  const verifyMobileOtp = () => {
    setLoading(true);
    const txnId: string | null = getLocalItem("txnId");
    var obj: { [k: string]: any } = {};
    obj.txnId = txnId;
    if (mobileOtp.length === 6) {
      obj.otp = window.btoa(mobileOtp);
      services
        .create(healthIdVerifyMobileOtp, obj)
        .then((response) => {
          setLoading(false);
          if (response.data.txnId) {
            setLocalItem("txnId", response.data.txnId);
            toast.success("Mobile Verified Successfully");
            setMobileInput(true);
            setMobileBtn(true);
            setMobileOtpD(true);
            setMobileOtpResend(true);
            setEmailInput(false);
            setHealthInput(false);
            setMobileSubmit(false);
          } else {
            toast.error(response.data.details[0].message);
            setMobileSubmit(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error.response.data.details[0].message);
        });
    } else {
    }
  };
  const handleMobileResendOTP = () => {
    setLoading(true);
    let postObj = {
      txnId: getLocalItem("txnId"),
      authMethod: "MOBILE_OTP",
    };
    services
      .create(healthIdResendMobileOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data === true) {
          toast.success("OTP sent successfully");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error.message);
      });
  };
  const handleEmailchange = (e: any) => {
    setValue3("email", e.target.value);
  };
  const handleHealthIdChange = (e: any) => {
    if (e.target.value.length >= 1) {
      setValue3("healthId", e.target.value);
      setHealthBtn(false);
    } else {
      setHealthBtn(true);
    }
  };
  const handleOnBlur = (e: any) => {
    setLoading(true);
    let postObj = {
      healthId: getValues3("healthId"),
    };
    services
      .create(isHealthIdAvailable, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.status === true) {
          toast.error("ABHA Address is already exist");
          setKey3((k) => k + 1);
          setConsent(false);
          setConsentBtn(true);
        } else if (response.data.status === false) {
          toast.success("This ABHA Address is available you can proceed");
          setConsentBtn(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        toast.error(error.response.data.status);
      });
  };
  const handleCreateHealthId = (data: any) => {
    setLoading(true);
    let postObj = {
      email: data.email,
      abhaAddress: data.healthId,
      healthId: data.healthId,
      txnId: getLocalItem("txnId"),
    };
    services
      .create(createHealthId, postObj)
      .then((response) => {
        setLoading(false);
        setLocalItem("abhaLoginToken", response.data.token);
        if (response.data.token) {
          let patData = {
            healthId: data.healthId,
          };
          services.create(searchByHealthId, patData).then((response) => {
            setLocalItem("HealthIdNumber", response.data.healthIdNumber);
            setLocalItem("Name", response.data.name);
            router.push("/abha-profile");
          });
        } else {
          toast.error(response.data.details[0].message);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.status === 500) {
          toast.error(err.response.message);
        }
        console.log(err.message);
      });
  };
  const handleConsentCheck = () => {
    setConsent(!consent);
    if (!consent) {
      setGenerateStatus(false);
    } else {
      setGenerateStatus(true);
    }
  };
  const clickreset = () => {
    setKey((k) => k + 1);
  };
  const clickreset2 = () => {
    setKey2((k) => k + 1);
    setMobileOtp("");
  };

  const clearFields = () => {
    setKey((k) => k + 1);
    setKey2((k) => k + 1);
    setKey3((k) => k + 1);
    setValue("aadhaarNumber", "");
    setValue2("mobileNumber", "");
    setValue3("email", "");
    setValue3("healthId", "");
    setAadhaarInput(false);
    setEmailInput(true);
    setHealthInput(true);
    setConsentBtn(true);
    setGenerateStatus(true);
  };
  const handleAadharOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue.length === 6) {
      // OTP has been entered, enable the button
      setAadhaarBtn(false);
    } else {
      // OTP is not complete, disable the button
      setAadhaarBtn(true);
    }
  };
  const [showPassword, setShowPassword] = React.useState(true);
  const handlePasswordIcon = (data: boolean) => {
    setShowPassword(data);
  };
  return (
    <div className="block abha-helth-id-page">
      <ToastContainer />
      {alertMsg ? (
        <div>
          <AlertCustomAnimation
            message={message}
            color={alertColor}
            setAlertMsg={setAlertMsg}
          />
        </div>
      ) : null}
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>ABHA Number</h1>
      </div>
      <div
        key={key}
        className=" bg-white rounded-curve mb-4 rounded-curve mx-auto w-full border border-stroke"
      >
        <div className="md:flex py-4 px-4 gap-4 items-center">
          <div className="md:w-[200px]  relative input-width">
            <FormPropsTextFields
              type={showPassword ? "password" : "number"}
              {...register("aadhaarNumber", { required: true })}
              label={"Enter Aadhaar Number"}
              required={true}
              disabled={aadhaarInput}
              containerProps={{
                className: '!min-w-0 '
              }}
              className='!py-4 !h-[43px]'
              watch={watch}
              handleChange={(e: any) => {
                const inputValue = e.currentTarget.value;
                const numericValue = inputValue.replace(/[^0-9]/g, ""); // Remove all non-digit characters

                if (
                  numericValue.length === 12 ||
                  inputValue !== numericValue ||
                  e.key === "e" ||
                  e.key === "-" ||
                  e.key === "+"
                ) {
                  // Input doesn't have exactly 12 digits, contains non-digit characters, or includes 'e' or '-', prevent further input
                  e.preventDefault();
                  setValue("aadhaarNumber", e.target.value);
                  setAadhaarBtn(false);
                } else {
                  // Input has 12 digits and only contains numbers, allow further processing
                  setAadhaarBtn(true);
                }
              }}
            />
            <span className="demo text-blue-gray-700 absolute right-[10px] top-[10px] text-sm ">
              {showPassword ? (
                <VisibilityIcon
                  onClick={() => {
                    handlePasswordIcon(false);
                  }}
                  fontSize="inherit"
                />
              ) : (
                <VisibilityOffIcon
                  onClick={() => {
                    handlePasswordIcon(true);
                  }}
                  fontSize="inherit"
                />
              )}
            </span>
            {errors.aadhaarNumber &&
              errors.aadhaarNumber.type === "required" && (
                <div className="text-xs text-red-700 float-right">required</div>
              )}
          </div>
          <div className="md:w-auto">
            <ActionButton
              buttonText={"Generate OTP"}
              disabled={aadhaarBtn}
              handleSubmit={handleSubmit(generateAadhaarOTP)}
              width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
          <div className="md:w-auto">
            <OtpField
              id="Adhaar"
              onResendOTP={handleAadharResendOTP}
              setOtpFromChild={setAadhaarOtp}
              otpStatus={setAadhaarSubmit}
              resendotp={aadhaarOtpResend}
              disabled={aadhaarOtpD}
              handleOtpChange={handleAadharOtpChange}
              key={2}
            />
          </div>
          <div className="md:w-auto flex gap-4">
            {aadhaarSubmit ? (
              <>
                <div className="md:w-1/2 ">
                  <IconButton
                    onClick={verifyAadhaarOtp}
                    icon={<DoneIcon color="primary" />}
                  />
                </div>
                <div className="md:w-1/2 ">
                  <IconButton
                    onClick={clickreset}
                    icon={<CloseIcon color="primary" />}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="md:w-1/2 pointer-events-none">
                  <IconButton icon={<DoneIcon color="disabled" />} />
                </div>
                <div className="md:w-1/2 pointer-events-none">
                  <IconButton icon={<CloseIcon color="disabled" />} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        key={key2}
        className="bg-white rounded-curve  mb-4 rounded-curve mx-auto w-full border border-stroke"
      >
        <div className=" md:flex p-4 gap-4 items-center">
          <div className="md:w-[200px] ">
            <FormPropsTextFields
              type="number"
              required={true}
              {...register2("mobileNumber", { required: true })}
              handleChange={handleMobileChange}
              label="Enter Mobile Number"
              disabled={mobileInput}
              containerProps={{
                ClassNames: '!min-w-0'
              }}
              watch={watch}
            />
            {errors2.mobileNumber &&
              errors2.mobileNumber.type === "required" && (
                <div className="text-xs text-red-700 float-right">required</div>
              )}
          </div>
          <div className="md:w-auto">
            <ActionButton
              handleSubmit={handleSubmit2(generateMobileOTP)}
              buttonText={"Generate OTP"}
              disabled={mobileBtn}
              width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
          <div className="md:w-auto ">
            <OtpField
              id="mobile"
              onResendOTP={handleMobileResendOTP}
              setOtpFromChild={setMobileOtp}
              otpStatus={setMobileSubmit}
              resendotp={mobileOtpResend}
              disabled={mobileOtpD}
              key={3}
            />
          </div>
          <div className="md:w-auto flex gap-4">
            {mobileSubmit ? (
              <>
                <div className="md:w-1/2">
                  <IconButton
                    icon={<DoneIcon color="primary" />}
                    onClick={verifyMobileOtp}
                  />
                </div>
                <div className="md:w-1/2">
                  <IconButton
                    onClick={clickreset2}
                    icon={<CloseIcon color="primary" />}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="md:w-1/2 pointer-events-none">
                  <IconButton icon={<DoneIcon color="disabled" />} />
                </div>
                <div className="md:w-1/2 pointer-events-none">
                  <IconButton icon={<CloseIcon color="disabled" />} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className=" bg-white rounded-curve mb-4 rounded-curve mx-auto w-full border border-stroke">
        <div className="md:flex p-4 gap-4">
          <div className="md:w-auto ">
            <FormPropsTextFields
              label="Enter Email Address"
              required={true}
              disabled={emailInput}
              {...register3("email", {
                required: true,
                pattern: /^[a-z]+[a-zA-Z0-9._]+@[a-z]+\.[a-z.]{2,3}$/,
              })}
              containerProps={{
                ClassNames: '!min-w-0'
              }}
              handleChange={handleEmailchange}
            />
            {errors3.email && errors3.email.type === "required" && (
              <div className="text-xs text-red-700 float-right">required</div>
            )}
            {errors3.email && errors3.email.type === "pattern" && (
              <div className="text-xs text-red-700 float-right">
                Please Enter Valid Email
              </div>
            )}
          </div>
          <div className="md:w-auto flex justify-center items-center">
            <FormPropsTextFields
              label="Enter ABHA Address"
              required={true}
              disabled={healthInput}
              {...register3("healthId", { required: true })}
              handleChange={handleHealthIdChange}
              containerProps={{
                ClassNames: '!min-w-0'
              }}
            />
            <h1>@{loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}</h1>
            <div className="ms-2">
              <ActionButton
                buttonText="Verify"
                width="w-auto text-white  text-[14px]  !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                border="2px solid black"
                backgroundColor="white"
                handleSubmit={handleSubmit3(handleOnBlur)}
                disabled={healthBtn}
              />
            </div>
          </div>
          <div key={key3} className="md:w-auto flex ">
            <Checkbox
              crossOrigin={undefined}
              label="Consent Provided"
              onChange={handleConsentCheck}
              disabled={consentBtn}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        <ActionButton
          buttonText="Generate ABHA Number"
          disabled={generateStatus}
          handleSubmit={handleSubmit3(handleCreateHealthId)}
          width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
        <ActionButton
          buttonText="Reset"
          border="2px solid black"
          backgroundColor="white"
          handleSubmit={clearFields}
          width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />

      </div>
    </div>
  );
}
export default AbhaHealthId;
