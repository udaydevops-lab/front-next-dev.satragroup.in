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

const Testparameterform: FC<Dataparam> = ({
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
      <TabPageTitle title="Test Parameter Mapping" />
      <div className="flex w-full gap-4 mt-3">
        <div className="w-1/2 newSelect">
        <Input
            label="Radiology Service Name*"
            name="radservicename"
            color="blue"
            onChange={handleChange}
            crossOrigin={undefined}
            value={fields?.RadServiceSearchname}
          />
        </div>
        <div className="w-1/2 flex gap-4 justify-center mt-1">
          <ActionButton
            handleSubmit={handleSearch}
            buttonText="Search"
            width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
          <ActionButton
            handleSubmit={openPopup}
            buttonText="New"
            width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        </div>
      </div>
    </div>
  );
};

export default Testparameterform;
