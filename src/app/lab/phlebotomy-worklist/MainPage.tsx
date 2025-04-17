"use client";
import React, { useEffect, useReducer, useState } from "react";
import PhlebotomyWorklistGrid from "./PhlebotomyWorklistGrid";
import MainGridBox from "../_component/mainGridBox";
import { initialState } from "./PhlebotomyReducerfun";
import { LabOrderId } from "../_component/labJsonData";
import PhlebotomyWorklistForm from "./phlebotomy-worklistform";
import services from "@/app/utilities/services";
import { getPhleboWorklist, labWorkListSearch } from "@/app/utilities/api-urls";
import moment from "moment";
import { capitalize } from "@mui/material";
import { toast } from "react-toastify";

const PhlebotomyMainPage = () => {
  // const [state, dispatch] = useReducer(Phlebotomyreducer, initialState)
  const [formData, setFormData] = useState(initialState);
  const [gridData, setGridData] = useState<any>([]);
  const onSubmit = () => {
    let str = "";
    formData.speciality?.map((item: any) => {
      str += item.value.toString() + "$";
    });
    let str1 = str.substring(0, str.length - 1);
    let url = `${getPhleboWorklist}labOrderId=${formData.labOrderId}&speciality=${str1}&fromDate=${moment(formData.fromDate).format("YYYY-MM-DD")}&toDate=${moment(formData.toDate).format("YYYY-MM-DD")}${formData.patientMrn.label !== 'Patient MRN' ? `&PatienMrn=${formData.patientMrn.label}` : '&PatienMrn='}${formData.filter !== 'All' ? `&status=${formData.filter}` : `&status=${' '}`}`
    services
      .get(url)
      .then((response) => {
       const filteredData= response.data.filter((item:any)=>item.department=="D014")
        setGridData(filteredData);
      })
      .catch((error) => {
        setGridData([]);
        // toast.error(capitalize(error?.response?.data) || "No data found");
      });
  };
  useEffect(() => {
    onSubmit()
  }, []);
  return (
    <>
      <PhlebotomyWorklistForm
        formData={formData}
        setFormData={setFormData}
        onSearch={onSubmit}
      />
      <MainGridBox>
        <PhlebotomyWorklistGrid gridData={gridData} />
      </MainGridBox>
    </>
  );
};

export default PhlebotomyMainPage;
