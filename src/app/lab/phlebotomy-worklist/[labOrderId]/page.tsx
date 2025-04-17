"use client";
import React, { useEffect, useReducer, useState } from "react";
import { LabPagetitle } from "../../_component";
import { useParams } from "next/navigation";
import MainGridBox from "../../_component/mainGridBox";
import PatientDetails from "./components/PatientDetails";
import OrderDetails from "./components/OrderDetails";
import Link from "next/link";
import services from "@/app/utilities/services";
import { getPatientDetailsById, getSampleById } from "@/app/utilities/api-urls";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

const PhlebotomySampleScreen = (props: any) => {
  const { labOrderId } = useParams();
  // const [state, dispatch] = useReducer(sampleScreenReducer, initialState);
  const [patDetails, setPatDetails] = useState<any>({});
  const [formData, setFormData] = useState<any>({
    route: "",
    site: ""
  });
  const [gridData, setGridData] = useState<any>([]);
  const [labOrderDetails, setLabOrderDetails] = useState<any>({})
  //   const orderDetailsData: any = phlebotomyOrderDetailsData;
  //   const phlebotomySite: any = phlebotomyDataSampleSite;
  //   const phlebotomyRoute: any = phlebotomyDataSampleRoute;
  const getPatientDetails = (patientId: any) => {
    services
      .get(getPatientDetailsById + patientId)
      .then((response) => {
        setPatDetails({ ...response.data.patData, mrn: response.data.mrn });
      })
      .catch((error) => { });
  };
  const getOrderDetails = () => {
    services
      .get(getSampleById + labOrderId)
      .then((response) => {
        setGridData(response.data);
        setLabOrderDetails(response.data[0])
        getPatientDetails(response.data[0].patientId);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getOrderDetails();
  }, [labOrderId]);

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <div className="w-full flex justify-between items-center">
          <div className="">
            <LabPagetitle title={`Sample Collection ${labOrderId}`} />
          </div>
          <Link
            href={"/lab/phlebotomy-worklist"}
            className="cursor-pointer text-white me-2  text-[14px] py-2 px-6 rounded-lg  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          >
            Back
          </Link>
        </div>

        <MainGridBox>
          {/* <div className="w-full p-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029]"> */}
          <div className="w-full p-3 bg-white rounded-[12px]">
            <PatientDetails orderDetails={labOrderDetails} patDetails={patDetails} />
            <OrderDetails
              gridData={gridData}
              getOrderDetails={getOrderDetails}
              formData={formData}
              setFormData={setFormData}
              patDetails={patDetails}
            />
          </div>
        </MainGridBox>
      </div>
    </>
  );
};


export default roleInfoScreenData(PhlebotomySampleScreen, "SC")