import ActionButton from "@/app/_common/button";
import React, { Dispatch, FC, SetStateAction, useState } from "react";
import { TabPageTitle } from "@/app/lab/_component";
import { Input } from "@material-tailwind/react";

interface Dataparam {
  fields: any;
  setFields: Dispatch<SetStateAction<any>>;
  radserviceSearchlist: [];
  handleChange: any;
  handleSearch: any;
  setRadParameter: any;
  radparameter: any;
  openPopup: any;
  setRadserviceSearchlist: Dispatch<SetStateAction<any>>;
}

const RadiologyEquipmentform: FC<Dataparam> = ({
  handleSearch,
  fields,
  openPopup,
  setFields,
  radserviceSearchlist,
  setRadserviceSearchlist,
}) => {

  const handleChange = (e: any) => {
    if (e.target.value.length == 0) {
      handleSearch(e)
    }
    setFields({
      ...fields,
      RadServiceSearchname: e.target.value
    })
  }


  return (
    <div>
     
      <div className="flex w-full gap-4 mt-3">
        {/* <div className="w-1/2 newSelect">
        <Input
            label="Radiology Equipment Description*"
            name="radservicename"
            color="blue"
            onChange={handleChange}
            crossOrigin={undefined}
            value={fields?.RadServiceSearchname}
          />
        </div> */}
         <div className='flex w-full gap-4 mt-3 justify-between items-center'>
        <TabPageTitle
                    title={"Radiology Equipment Master"}
                />
          <ActionButton
            handleSubmit={openPopup}
            buttonText="New"
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
        </div>
      </div>
    </div>
  );
};

export default RadiologyEquipmentform;
