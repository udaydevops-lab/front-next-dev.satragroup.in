"use client";
import { TabPageTitle } from "@/app/lab/_component";
import React, { useEffect, useState } from "react";
import RadiologyForm from "./_components/RadiologyForm";
import RadiologyGridField from "./_components/RadiologyGrid";
import { initialRadiologyWorkList } from "./_components/RadiologyInterfaces";
import services from "@/app/utilities/services";
import { radiologyWorkListSearch } from "@/app/utilities/api-urls";
import moment from "moment";
import { capitalize } from "@mui/material";
import { toast } from "react-toastify";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

const RadiologyOPworklistpage = (props: any) => {
  const [formData, setFormData] = useState(initialRadiologyWorkList);
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
        `${radiologyWorkListSearch}department=D015&orderId=${formData.orderId}&speciality=${str1}&fromDate=${!formData.orderId && !formData.patientMrn
          ? moment(formData.fromDate).format("YYYY-MM-DD")
          : ""
        }&toDate=${!formData.orderId && !formData.patientMrn
          ? moment(formData.toDate).endOf("day").format("YYYY-MM-DD")
          : ""
        }&PatienMrn=${formData.patientMrn}&status=${formData.filter == "All Status" ? '' : formData.filter}`
      )
      .then((response) => {
        setGridData(response.data);
      })
      .catch((error) => {
        setGridData([]);
        // toast.error(capitalize(error?.response?.data) || "No data found");
      });
  };


  useEffect(() => {
    onSearch()
  }, []);
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }


  return (
    <>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <TabPageTitle title="Radiology OP worklist" />
        <RadiologyForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSearch}
        />
        <RadiologyGridField data={gridData} />
      </div>
    </>
  );
};


export default roleInfoScreenData(RadiologyOPworklistpage, "Row")