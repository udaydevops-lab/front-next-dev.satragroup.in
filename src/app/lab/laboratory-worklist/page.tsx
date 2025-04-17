"use client";
import React, { useEffect, useState } from "react";
import { LabPagetitle } from "../_component";
import FormField from "./_components/FormField";
import GridField from "./_components/GridField";
import { initialStateWorkList } from "./_components/utils";
import services from "@/app/utilities/services";
import { labWorkListSearch } from "@/app/utilities/api-urls";
import { speciallity } from "../_component/labJsonData";
import moment from "moment";
import { toast } from "react-toastify";
import { capitalize } from "@mui/material";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function LabWorkList(props: any) {

  const [formData, setFormData] = useState(initialStateWorkList);
  const [gridData, setGridData] = useState<any>([]);
  const onSearch = () => {
    let str = "";
    formData.speciality?.map((item: any) => {
      str += item.value.toString() + "$";
    });
    let str1 = str.substring(0, str.length - 1);
    //Dollor separated multiple specialities
    //when laborderId or patientMrn value is there dont pass dates
    services
      .get(
        `${labWorkListSearch}labOderId=${formData.labOrderId
        }&speciality=${str1}&fromDate=${!formData.labOrderId && !formData.patientMrn
          ? moment(formData.fromDate).format("YYYY-MM-DD HH:mm:ss")
          : ""
        }&toDate=${!formData.labOrderId && !formData.patientMrn
          ? moment(formData.toDate).endOf("day").format("YYYY-MM-DD HH:mm:ss")
          : ""
        }&mrn=${formData.patientMrn}&status=${formData.filter}`
      )
      .then((response) => {
        setGridData(response.data);
      })
      .catch((error) => {
        setGridData([]);
      });
  };
  useEffect(() => {
    onSearch()
  }, []);

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }


  return (
    <div>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>

        <LabPagetitle title="Laboratory Worklist" />
        <FormField
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSearch}
        />
        <GridField getGridData={onSearch} data={gridData} />
      </div>
    </div>
  );
}

export default roleInfoScreenData(LabWorkList, "LW")
