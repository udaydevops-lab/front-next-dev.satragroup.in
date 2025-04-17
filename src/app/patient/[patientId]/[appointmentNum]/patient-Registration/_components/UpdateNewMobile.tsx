"use client";
import ActionButton from "@/app/_common/button";
import Loader from "@/app/_common/loader";
import OtpField from "@/app/_common/otp-field";
import CheckboxMui from "@/app/check-box";
import {
  enrollmentAadharVerifyOtp,
  enrollmentByAadharOtp,
  enrollMobileVerifyOtp,
  enrollUpdateMobileRequestOtp,
  mailVerifyOtp,
  updateMailRequestOtp,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { Input, Radio } from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function UpdateNewMobile({
  getAbhaData,
  setValue,
  getValues,
  setTitle,
  handleMobileEdit,
  setPopSize,
}: any) {
  const [adharOtp, setAdharOtp] = useState("");
  const [formData, setFormData] = useState<any>({
    aadhaarNo: "",
    mobileNumber: getValues("primaryContactNum")
      ? getValues("primaryContactNum")
      : "",
    email: getValues("emailId") ? getValues("emailId") : "",
  });
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [enableMobVerification, setEnableMobVerification] = useState(false);
  const [mobileOtp, setMobileOtp] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(20);
  const [isSendAdharOtpDisabled, setIsSendAdharOtpDisabled] = useState(false);
  const [isSendMobileOtpDisabled, setIsSendMobileOtpDisabled] = useState(false);
  const [isSendEmailOtpDisabled, setIsSendEmailOtpDisabled] = useState(false);
  const [isSubmitDisabled,setIsSubmitDisabled]=useState(false);
  const [adharResend, setAdharResend] = useState(true);
  const [adharSeconds, setAdharSeconds] = useState(0);
  const [mobileResend, setMobileResend] = useState(true);
  const [mobileSeconds, setMobileSeconds] = useState(0);
  const [emailResend, setEmailResend] = useState(true);
  const [emailSeconds, setEmailSeconds] = useState(0);
  const [showPassword,setShowPassword] =useState(false)
  const handleClear = (email:string) => {
    setEmailOtp("");
    setFormData({
      aadhaarNo: "",
      mobileNumber: "",
      email: email,
    });
    setMobileOtp("");
    setAdharOtp("");
    setEnableMobVerification(false);
    setKey1((k) => k + 1);
    setAdharResend(false);
    setMobileResend(false);
    setIsSendAdharOtpDisabled(false);
    setIsSendMobileOtpDisabled(false);
    setIsSendEmailOtpDisabled(false);
    setIsSubmitDisabled(false)
    setEmailResend(false);
    setKey2((k) => k + 1);
  };
  const handleRadio = (e: any) => {
    setConfirm(e.target.value == "yes");
    if (e.target.value == "no") {
      handleMobileEdit("close");
    } else {
      setTitle("Update Mobile / Email");
      setPopSize("xl");
    }
  };
  const onAadharSubmit = () => {
    if(formData.aadhaarNo !== "") {
    let postObj = {
      loginId: formData.aadhaarNo,
    };
    setLoading(true);
    services
      .create(enrollmentByAadharOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          toast.success(response.data.message);
          setLocalItem("txnId", response.data.txnId);
        } else {
          toast.error("Something went wrong please try again");
        }
        setAdharSeconds(59);
        setAdharResend(true);
        setIsSendAdharOtpDisabled(true);
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          if (JSON.parse(err.response.data.statusMessage).loginId) {
            toast.error(JSON.parse(err.response.data.statusMessage).loginId);
          } else {
            toast.error(
              JSON.parse(err.response.data.statusMessage).error.message
            );
          }
        } else {
          toast.error("Something went wrong please try again");
        }
      });
    }else{
      toast.error("Please enter Aadhaar number");
    }
  };
  const onSendMobileOtp = () => {
    let postObj = {
      txId: getLocalItem("txnId"),
      mobile: formData.mobileNumber,
    };
    setLoading(true);
    services
      .create(enrollUpdateMobileRequestOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.txnId) {
          setIsSendMobileOtpDisabled(true);
          setMobileSeconds(59);
          setMobileResend(true);
          toast.success(response.data.message);
          setLocalItem("txnId", response.data.txnId);
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  const verifyAadhaarOtp = () => {
    if (adharOtp.length === 6) {
      let postObj = {
        txId: getLocalItem("txnId"),
        mobile: formData.mobileNumber,
        otp: adharOtp,
      };
      setLoading(true);
      services
        .create(enrollmentAadharVerifyOtp, postObj)
        .then((response) => {
          setLoading(false);
          setLocalItem("txnId", response.data.txnId);
          setValue("primaryContactNum", formData.mobileNumber);
          if (response.data.ABHAProfile.mobile == formData.mobileNumber) {
            setIsSubmitDisabled(true);
            toast.success(
              "Mobile number for communication is same as Aadhaar number"
            );
          } else if (
            response.data.ABHAProfile.mobile != formData.mobileNumber
          ) {
            toast.success("Aadhaar verified successfully");
            setEnableMobVerification(true);
            setIsSubmitDisabled(false);
          }
          setAdharResend(false);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.statusMessage) {
            toast.error(
              JSON.parse(err.response.data.statusMessage).error.message
            );
          } else {
            toast.error("Something went wrong please try again");
          }
        });
    } else {
      toast.error("Please enter 6 digit otp");
    }
  };
  const verifyMobileOTP = () => {
    let postObj = {
      otp: mobileOtp,
      txId: getLocalItem("txnId"),
    };
    setLoading(true);
    services
      .create(enrollMobileVerifyOtp, postObj)
      .then((response) => {
        setLoading(false);
        if (response.data.authResult == "Failed") {
          toast.error(response.data.message);
        } else if (response.data.txnId) {
          toast.success(response.data.message);
          handleClear(formData.email);
          getAbhaData();
        }
      })
      .catch((err) => {
        setLoading(false);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  const onSendEmailCode = () => {
    let postObj = {
      email: formData.email,
      txId: getLocalItem("txnId"),
    };
    setLoading(true);
    services
      .create(updateMailRequestOtp, postObj)
      .then((response) => {
        setLoading(false);
        setValue("emailId", formData.email);
        if (response.data.txnId) {
          setIsSendEmailOtpDisabled(true);
          setEmailSeconds(59);
          setEmailResend(true);
          toast.success(response.data.message);
          setLocalItem("txnId", response.data.txnId);
        }
      })
      .catch((err) => {
        setLoading(false);
        setValue("emailId", formData.email);
        if (err.response.data.statusMessage) {
          toast.error(
            JSON.parse(err.response.data.statusMessage).error.message
          );
        } else {
          toast.error("Something went wrong please try again");
        }
      });
  };
  const onVerifyEmailOtp = () => {
    if (emailOtp.length === 6) {
      let postObj = {
        otp: emailOtp,
        txId: getLocalItem("txnId"),
      };
      setLoading(true);
      services
        .create(mailVerifyOtp, postObj)
        .then((response) => {
          setLoading(false);
          if (response.data.authResult == "Failed") {
            toast.error(response.data.message);
          } else if (response.data.txnId) {
            toast.success(response.data.message);
            getAbhaData();
          }
        })
        .catch((err) => {
          setLoading(false);
          if (err.response.data.statusMessage) {
            toast.error(
              JSON.parse(err.response.data.statusMessage).error.message
            );
          } else {
            toast.error("Something went wrong please try again");
          }
        });
    } else {
      toast.error("Please enter 6 digit otp");
    }
  };
  const otpStatus = () => {};
  return (
    <div className="">
      {loading ? <Loader /> : ""}
      {!confirm ? (
        <div className="flex justify-center">
          <div>
            <div className="font-bold">
              Are you sure you want to update your mobile / email ?
            </div>
            <div className=" ms-20 mt-5 flex gap-10">
              <div>
                <Radio
                  label="Yes"
                  value={"yes"}
                  onChange={handleRadio}
                  color="blue"
                  name="confirm"
                  crossOrigin={undefined}
                />
              </div>
              <div>
                <Radio
                  label="No"
                  value={"no"}
                  onChange={handleRadio}
                  color="blue"
                  name="confirm"
                  crossOrigin={undefined}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {loading ? <Loader /> : ""}
          <div className="flex gap-6">
            <div className="flex w-2/5 gap-4">
              <div className="w-full relative">
                <Input
                  color="blue"
                  type={showPassword ? "number" : "password"}
                  crossOrigin={undefined}
                  label="Aadhaar Number"
                  required
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
                  maxLength={12}
                  value={formData.aadhaarNo}
                  onChange={(e: any) =>
                    setFormData({ ...formData, aadhaarNo: e.target.value })
                  }
                />
                 <div className=" cursor-pointer absolute right-2 top-[12px]"
                                                onClick={() => setShowPassword(!showPassword)}
                                                >
                                                {showPassword ? (
                                                    <EyeIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                ) : (
                                                    <EyeSlashIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                )}
                                                </div>
              </div>
              <div>
                <ActionButton
                  width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                  buttonText={"Send OTP"}
                  handleSubmit={onAadharSubmit}
                  disabled={formData.aadhaarNo.length !== 12||isSendAdharOtpDisabled}
                />
              </div>
            </div>
            <div className=" flex ps-6 mt-1 gap-4" key={key1}>
              <OtpField
                id="abha"
                onResendOTP={() => onAadharSubmit()}
                setOtpFromChild={setAdharOtp}
                otpStatus={otpStatus}
                resendotp={adharResend}
                seconds={adharSeconds}
                setSeconds={setAdharSeconds}
                setResendOtp={(flag: any) => setAdharResend(flag)}
                key={2}
              />
            </div>
          </div>
          <div className="flex mt-9 gap-6">
            <div className="flex w-2/5 gap-4">
              <div
                className={`${!enableMobVerification ? `w-[150px]` : "w-full"}`}
              >
                <Input
                  color="blue"
                  type="number"
                  crossOrigin={undefined}
                  label="New mobile number"
                  required
                  onKeyPress={(e: any) => {
                    if (e.key === "Backspace" || e.key === "Delete") return;
                    if (
                      e.target.value.length > 9 ||
                      e.key == "e" ||
                      e.key == "E"
                    ) {
                      e.preventDefault();
                    }
                  }}
                  value={formData.mobileNumber}
                  onChange={(e: any) =>
                    setFormData({ ...formData, mobileNumber: e.target.value })
                  }
                />
              </div>
              {enableMobVerification ? (
                <div>
                  <ActionButton
                    width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                    buttonText={"Send OTP"}
                    handleSubmit={onSendMobileOtp}
                    disabled={formData.mobileNumber.length !== 10||isSendMobileOtpDisabled}
                  />
                </div>
              ) : null}
            </div>
            {enableMobVerification ? (
              <div className="ps-6 mt-1 flex" key={key1}>
                <OtpField
                  id="mobile"
                  onResendOTP={() => onSendMobileOtp()}
                  setOtpFromChild={setMobileOtp}
                  otpStatus={otpStatus}
                  resendotp={mobileResend}
                  seconds={mobileSeconds}
                  setSeconds={setMobileSeconds}
                  setResendOtp={(flag: any) => setMobileResend(flag)}
                  key={2}
                />
              </div>
            ) : null}
          </div>
          {!enableMobVerification ? (
            <div className="mt-6 flex justify-end gap-4">
              <ActionButton
                buttonText={"Next"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={verifyAadhaarOtp}
                disabled={
                  formData.mobileNumber.length !== 10 ||
                  formData.aadhaarNo.length !== 12 ||
                  adharOtp.length !== 6|| isSubmitDisabled
                }
              />
            </div>
          ) : (
            <div className="mt-6 flex justify-end gap-4">
              <ActionButton
                buttonText={"Update"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={verifyMobileOTP}
                disabled={
                  formData.mobileNumber.length !== 10 || mobileOtp.length !== 6||isSubmitDisabled
                }
              />
            </div>
          )}
          <div>
            <div className="flex  mt-9 gap-6">
              <div className="flex w-2/5 gap-4">
                <div className={`w-full`}>
                  <Input
                    color="blue"
                    type="text"
                    crossOrigin={undefined}
                    label="Email Address"
                    required
                    value={formData.email}
                    onChange={(e: any) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="">
                  <ActionButton
                    width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                    buttonText={"Send Code"}
                    handleSubmit={onSendEmailCode}
                    disabled={!formData.email||isSendEmailOtpDisabled}
                  />
                </div>
              </div>
              <div className="ps-4 mt-1 flex" key={key2}>
                <OtpField
                  id="email"
                  onResendOTP={() => onSendEmailCode()}
                  setOtpFromChild={setEmailOtp}
                  otpStatus={otpStatus}
                  resendotp={emailResend}
                  seconds={emailSeconds}
                  setSeconds={setEmailSeconds}
                  setResendOtp={(flag: any) => setEmailResend(flag)}
                  key={3}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <ActionButton
                buttonText={"Update"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={onVerifyEmailOtp}
                disabled={formData.email.length === 0 || emailOtp.length !== 6}
              />
              <ActionButton
                buttonText={"Clear"}
                width="w-[150px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={() => handleClear("")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
