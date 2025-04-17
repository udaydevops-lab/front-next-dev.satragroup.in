"use client";
import ActionButton from "@/app/_common/button";
import { phrAppLink } from "@/app/utilities/api-urls";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import { Input } from "@material-tailwind/react";
import { capitalize } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";

function MobileNumberPopUp({data}:any) {
  const [mobileNumber, setMobileNumber] = useState(data.mobileNumber?data.mobileNumber:"");
  const onSendSms = () => {
    let postObj = {
      phoneNmuber: mobileNumber,
    };
    services
      .create(phrAppLink, postObj)
      .then((response) => {
        if(response.data.statusMessage){
          toast.success(response.data.statusMessage);
        }        
      })
      .catch((err) => {
        toast.error("Technical Error, Please try again");
      });
  };
  return (
    <div className="flex gap-4 justify-center">
      <Input
        label="Enter Mobile Number"
        type="number"
        maxLength={10}
        value={mobileNumber}
        onChange={(e) => {
          setMobileNumber(sanitizeInput(e.target.value));
        }}
        onKeyPress={(e: any) => {
          if (e.key === "Backspace" || e.key === "Delete") return;
          if (e.target.value.length > 9 || e.key == "e") {
            e.preventDefault();
          }
        }}
        crossOrigin={undefined}
      ></Input>
      <ActionButton
        buttonText={"Send Records"}
        disabled={mobileNumber.length!==10}
        width="w-[200px] text-white !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        handleSubmit={onSendSms}
      />
    </div>
  );
}

export default MobileNumberPopUp;
