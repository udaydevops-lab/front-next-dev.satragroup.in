"use client";
import Cross_Icon from "@/app/_common/common_icons/Cross_Icon";
import { LabPagetitle } from "@/app/lab/_component";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import React, { ChangeEvent, useState } from "react";
import ActionButton from "@/app/_common/button";
import { toast } from "react-toastify";
import { LabMasterFormPopUpProps } from "./interfaces/lab-interfaces";
import services from "@/app/utilities/services";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { jsonParse } from "@/app/utilities/local";
function FormPopUp({
  data,
  handleOpen,
  open,
  type,
  api,
  title,
  setData,
  handleClear,
  inputDetails,
  getAll,
}: LabMasterFormPopUpProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: sanitizeInput(e.target.value),
    });
  };
  const [isSaveDisabled, setIsSaveDisabled] = useState(false);
  const onSubmit = () => {
    const headers = getHeaderResponse();
    setIsSaveDisabled(true);
    data.updatedBy= jsonParse("loginResponse").employeename  
    services
      .create(
        api,
        { ...data, statusFlag: `${type == "New" ? "1" : data.statusFlag}` },
        headers
      )
      .then((response) => {
        toast.success(`${type == "New" ? "Saved" : "Updated"} Successfully`);
        handleOpen();
        getAll();
        setIsSaveDisabled(false);
      })
      .catch((error) => {
        toast.error("Technical Error");
        setIsSaveDisabled(false);
      });
  };
  return (
    <div>
      <Dialog size="md" 
       handler={()=>{}}
       open={open}>
          <div
            onClick={() => handleOpen()}
            className="w-[25px] h-[30px] absolute  -top-4 -right-2 cursor-pointer"
          >
            <Cross_Icon />
          </div>
          <DialogHeader className="flex items-center shrink-0 p-4 !bg-[#006AC9] text-white antialiased font-sans text-2xl font-semibold leading-snug mb-0 ">
          <h3>{`${type} ${title}`}</h3>
        </DialogHeader>
        <DialogBody className="text-black text-[15px] pt-0">
          <div className=" mt-8 grid grid-cols-2 gap-6">
            <Input
              color="blue"
              label={inputDetails.inputCodeLabel}
              name={inputDetails.inputCodeName}
              disabled={
                inputDetails.inputCodeValue && type !== "New" ? true : false
              }
              required={
                inputDetails.inputCodeValue && type !== "New" ? false : true
              }
              onChange={handleChange}
              value={inputDetails.inputCodeValue}
              crossOrigin={undefined}
            ></Input>
            <Input
              color="blue"
              label={inputDetails.inputDescLabel}
              required={true}
              name={inputDetails.inputDescName}
              onChange={handleChange}
              value={inputDetails.inputDescValue}
              crossOrigin={undefined}
            ></Input>
          </div>
          <div className="flex gap-4 mt-4 justify-end newBtn-theme">
            {isSaveDisabled ? (
              <ActionButton
                buttonText={`${type === "New" ? "Save" : "Update"}`}
                disabled={true}
                width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            ) : (
              <ActionButton
                buttonText={`${type === "New" ? "Save" : "Update"}`}
                handleSubmit={onSubmit}
                width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                disabled={
                  Object.values(data).every((x) => x !== null && x !== "")
                    ? false
                    : true
                }
              />
            )}
            {type==="New" &&
            <ActionButton
              buttonText={"Clear"}
              handleSubmit={handleClear}
              width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={isSaveDisabled}
            />}
            
          </div>
        </DialogBody>
      </Dialog>
    </div>
  );
}

export default FormPopUp;
