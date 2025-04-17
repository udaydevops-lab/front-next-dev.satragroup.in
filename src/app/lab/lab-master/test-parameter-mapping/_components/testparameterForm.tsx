import ActionButton from "@/app/_common/button";
import { TabPageTitle } from "@/app/lab/_component";
import React, { FC } from "react";

interface Dataparam {
  openNewPopup: any;
  handleSearch: any;
}

const TestparameterForm: FC<Dataparam> = ({ openNewPopup,handleSearch
}) => {
  return (
    <div>
      <div className="flex w-full gap-4 mt-3 justify-between items-center">
        <TabPageTitle title={"Test Parameter Mapping"} />
        <ActionButton
          buttonText="New"
          width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={openNewPopup}
        />
      </div>
    </div>
  );
};

export default TestparameterForm;
