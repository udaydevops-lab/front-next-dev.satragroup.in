import React, { useState, useEffect, memo } from "react";

export default function OtpField(props: any) {
  const [otp, setOtp] = useState(Array(6).fill(""));

  const handleOtpChange = (index: any, value: any) => {
    if (!/^\d*$/.test(value)) {
      // Only allow numeric

      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 5 && value !== "") {
      // Move focus to the next input field
      document.getElementById(props.id + `otp-input-${index + 1}`)!.focus();
    } else if (index > 0 && value === "") {
      // Move focus to the previous input field when Backspace is pressed
      document.getElementById(props.id + `otp-input-${index - 1}`)!.focus();
    }

    const newConcatenatedOtp = newOtp.join("");
    if (newConcatenatedOtp.length === 6) {
      props.setOtpFromChild(newConcatenatedOtp);
      props.otpStatus(true);
    } else {
      props.setOtpFromChild("");
      props.otpStatus(false);
    }
  };

  const handleBackspace = (index: any, e: any) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      // Move focus to the previous input field when Backspace is pressed
      document.getElementById(props.id + `otp-input-${index - 1}`)!.focus();
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain");
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      props.setOtpFromChild(pastedData);
      props.otpStatus(true);
    }
  };

  const seconds = props.seconds;
  // useEffect(() => {
  //   // Focus on the first input field when the component mounts
  //   document.getElementById(props.id + "otp-input-0")!.focus();
  // }, [props.id]);
  useEffect(() => {
    let myInterval = setInterval(() => {
      if (seconds > 0) {
        props.setSeconds(seconds - 1);
      }
    }, 1000);
    return () => {
      if (seconds !== 0) clearInterval(myInterval);
    };
  },[seconds]);

  const handleResend = () => {
      props.onResendOTP();
      props.setResendOtp(true);
  };
  useEffect(() => {
    if (props.resendotp) {
      setTimeout(() => {
        props.setResendOtp(false);
      }, seconds*1000);
    }
  }, [props.resendotp]);
  return (
    <div className="">
      <div
        className="flex flex-auto items-center justify-between mx-auto w-full"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <div key={index} className="w-9 h-9 mx-1">
            <input
              id={props.id + `otp-input-${index}`}
              className="w-9 h-9 flex flex-col items-center focus:outline-blue-200 justify-center text-center px-1 rounded border border-blue-200 text-lg bg-white focus:bg-gray-100 focus:ring-1 ring-blue-700"
              type="text"
              autoComplete="off"
              value={digit}
              maxLength={1}
              disabled={props.disabled}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleBackspace(index, e)}
            />
          </div>
        ))}
      </div>
      {props.isResendEnabled !== "0" ? (
        <div className="mx-auto bg-zinc-50 pl-1 mt-2 mr-2">
          <div className="flex justify-end col-span-12">
            {props.resendotp ? (
              <div className="text-left font-arial text-[11px] text-gray-500 cursor-not-allowed">
                Resend OTP{" "}
                <span className="font-bold">
                  {seconds !== 0 ? (
                    <>{`in 00:${seconds < 10 ? `0${seconds}` : seconds}`}</>
                  ) : null}
                </span>
              </div>
            ) : (
              <div
                className="text-left font-arial text-[11px] text-blue-500  cursor-pointer"
                onClick={() => handleResend()}
              >
                Resend OTP
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
