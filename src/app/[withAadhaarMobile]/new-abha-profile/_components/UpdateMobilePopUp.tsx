"use client";
import ActionButton from "@/app/_common/button";
import Loader from "@/app/_common/loader";
import OtpField from "@/app/_common/otp-field";
import {
  enrollMobileVerifyOtp,
  enrollUpdateMobileRequestOtp,
  sendNewOtp,
  sendOldOtp,
  updateNewNumber,
  verifyNewOtp,
} from "@/app/utilities/api-urls";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Input, Radio } from "@material-tailwind/react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function UpdateMobilePopUp({
  handleMobileEdit,
  setTitle,
  setPopSize,
  getAbhaData
}: any) {
  const [confirm, setConfirm] = useState(false);
  const [newNumber, setNewNumber] = useState("");
  const [newOtpFromChild, setNewFromChild] = useState("");
  const [oldOtpFromChild, setOldFromChild] = useState("");
  const [newOtpState, setNewOtpState] = useState(true);
  const [oldOtpState, setOldOtpState] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleRadio = (e: any) => {
    setConfirm(e.target.value == "yes");
    if (e.target.value == "no") {
      handleMobileEdit("close");
    } else {
      setTitle("Update Mobile Number");
      setPopSize("md")
    }
  };
  const handleNumberSubmit = () => {
    let postObj = {
      txId: getLocalItem("txnId"),
      mobile: newNumber,
    };
    setLoading(true);
    services
      .create(sendNewOtp , postObj)
      .then((response) => {
        setLoading(false);
        setNewOtpState(true);
        setLocalItem("txnId", response.data.txnId);
        toast.success("OTP Sent successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical error");
      });
  };
  const handleNewSubmit = () => {
    if (newOtpFromChild.length === 6) {
      let postObj = {
        "X-Token": getLocalItem("abhaLoginToken"),
        otp: newOtpFromChild,
        txId: getLocalItem("txnId"),
      };
      setOldOtpState(true);
      setLoading(true);
      services
        .create(verifyNewOtp, postObj)
        .then((response) => {
          setLoading(false);
          toast.success("Mobile number updated successfully");
          handleMobileEdit("close");
          generateOldOtp();
          setOldOtpState(true);
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Technical error");
        });
    } else {
      toast.error("Please enter 6 digit OTP");
    }
  };
  const generateOldOtp = () => {
    let postObj = {
      "X-Token": getLocalItem("abhaLoginToken"),
      txnId: getLocalItem("txnId"),
    };
    setLoading(true);
    services
      .create(sendOldOtp, postObj)
      .then((response) => {
        setLoading(false);
        setLocalItem("txnId", response.data.txnId);
        setOldOtpState(true);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Technical error");
      });
  };
  const handleOldSubmit = () => {
    if (oldOtpFromChild.length === 6) {
      let postObj = {
        authMethod: "MOBILE_OTP",
        otp: oldOtpFromChild,
        txnId:  getLocalItem("txnId"),
        "X-Token": getLocalItem("abhaLoginToken"),
      };
      setLoading(true);
      services
        .create(updateNewNumber, postObj)
        .then((response) => {
          setLoading(false);
          toast.success(response.data.status);
          getAbhaData()
          handleMobileEdit("close");
        })
        .catch((error) => {
          setLoading(false);
          toast.error("Technical error");
        });
    } else {
      toast.error("Please enter 6 digit OTP");
    }
    
  };
  const otpStatus = () => {};
  const authorize = () => {};
  return (
    <div className="">
      {loading ? <Loader /> : ""}
      {!confirm ? (
        <div className="flex justify-center">
          <div>
            <div className="font-bold">
              Are you sure you want to update your mobile number?
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
        <div className="m-6 h-[200px]">
          <div className=" flex gap-4 justify-center">
            <Input
              color="blue"
              crossOrigin={undefined}
              label="New mobile number"
              type="number"
              onChange={(e) => setNewNumber(e.target.value)}
              value={newNumber}
            ></Input>
            <div>
              <ActionButton
                width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                buttonText="Send OTP"
                handleSubmit={handleNumberSubmit}
              />
            </div>
          </div>
          {newOtpState ? (
            <div className="mt-6 flex justify-between">
              <OtpField
                id="newOtp"
                onResendOTP={authorize}
                setOtpFromChild={setNewFromChild}
                otpStatus={otpStatus}
                isResendEnabled={"0"}
              />
              <ActionButton
                width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                buttonText="Submit OTP"
                disabled={oldOtpState}
                handleSubmit={handleNewSubmit}
              />
            </div>
          ) : (
            ""
          )}
          {oldOtpState ? (
            <div className="mt-4">
              <h1 className="ms-2 font-bold">
                Please Enter OTP sent to your old mobile number
              </h1>
              <div className="mt-4 flex justify-between">
                <OtpField
                  id="oldOtp"
                  onResendOTP={authorize}
                  setOtpFromChild={setOldFromChild}
                  otpStatus={otpStatus}
                  isResendEnabled={"0"}
                />
                <ActionButton
                  width="w-[180px] text-white !bg-[#006AC9] text-[14px] h-[40px] hover:bg-[#006AC9] border-[#006AC9]"
                  buttonText="Submit OTP"
                  handleSubmit={handleOldSubmit}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
}
