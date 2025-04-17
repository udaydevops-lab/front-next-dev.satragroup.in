"use client";
import ActionButton from "@/app/_common/button";
import { Input } from "@material-tailwind/react";
import React from "react";
import FormPopUp from "./FormPopUp";
import { LabMasterForm } from "./interfaces/lab-interfaces";
import { TabPageTitle } from "../../_component";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";

function MasterForm({
  handleOpen,
  state,
  setState,
  onSubmit,
  handleClear,
  formData,
  setFormData,
  open,
  api,
  title,
  inputDetails,
  inputLabel,
  getAll,
}: LabMasterForm) {
  return (
    <div>
      <div className="w-full flex justify-between">
        <TabPageTitle title={title} />
        <ActionButton
          handleSubmit={handleOpen}
          buttonText={"New"}
          width="w-[120px] text-white  text-[14px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
      </div>
      <div className="flex w-full justify-between gap-4 ">        
        <FormPopUp
          handleClear={handleClear}
          setData={setFormData}
          data={formData}
          getAll={getAll}
          type="New"
          handleOpen={handleOpen}
          open={open}
          api={api}
          title={title}
          inputDetails={inputDetails}
        />
      </div>

    </div>
  );
}

export default MasterForm;
