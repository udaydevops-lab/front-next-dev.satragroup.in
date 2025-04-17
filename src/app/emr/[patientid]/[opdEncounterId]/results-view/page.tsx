"use client";
import {
  Dialog,
  Radio,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import services from "@/app/utilities/services";
import { getResultsView } from "@/app/utilities/api-urls";
import moment from "moment";
import Procedures from "./_components/procedure";
import Radiology from "./_components/radiology";
import Laboratory from "./_components/laboratory";
import PatientHeader from "../_components/patient-header";
import { ArrowPathRoundedSquareIcon, BeakerIcon, ComputerDesktopIcon } from "@heroicons/react/24/solid";

export default function ResultsView() {
  const [fromDate, setFromDate] = useState(moment(new Date()));
  const [toDate, setToDate] = useState(moment(new Date()));
  const [orders, setOrders] = useState("");
  const [type, setType] = useState("Laboratory");
  const { patientid, opdEncounterId } = useParams()
  const [laboratoryData, setLaboratoryData] = useState<any[]>([])
  const [radiologyData, setRadiologyData] = useState<any[]>([])
  const [proceduresData, setProceduresData] = useState<any[]>([])
  const handleFromDateChange = (e: any) => {
    setFromDate(e);
  };
  const handleToDateChange = (e: any) => {
    setToDate(e);
  };
  const handleOrdersChange = (e: any) => {
    setOrders(e.target.value);
  };
  const handleLaboClick = () => {
    setType("Laboratory");
    getOrders(
      moment(fromDate).format("YYYY-MM-DD"),
      moment(toDate).format("YYYY-MM-DD"),
      "Laboratory"
    );
  };
  const handleRadioClick = () => {
    setType("Radiology");
    getOrders(
      moment(fromDate).format("YYYY-MM-DD"),
      moment(toDate).format("YYYY-MM-DD"),
      "Radiology"
    );
  };
  const handleProClick = () => {
    setType("Procedures");
    getOrders(
      moment(fromDate).format("YYYY-MM-DD"),
      moment(toDate).format("YYYY-MM-DD"),
      "Procedures"
    );
  };
  const handleSubmit = () => {
    getOrders(
      moment(fromDate).format("YYYY-MM-DD"),
      moment(toDate).format("YYYY-MM-DD"),
      type
    );
  };
  const getOrders = (fromDate: any, toDate: any, type: any) => {
    services.get(getResultsView + `patientId=${patientid}&opdEncounterId=${opdEncounterId}&cpoeType=${type}&fromDate=${fromDate}&toDate=${toDate}`)
      .then((response) => {
        if (type == "Laboratory")
          setLaboratoryData(response.data)
        else if (type == "Radiology")
          setRadiologyData(response.data)
        else if (type == "Procedures")
          setProceduresData(response.data)
      }).catch((err) => {
        console.log(err.message)
      })
  };
  const router = useRouter();
  const backToEMR = () => {
    router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
  };
  return (

    <>
      {/* <TabPage /> */}
      <div className="font-bold px-4 md:pt-3 pb-4 mx-auto w-full ">
        <h1 className="w-full">
                    <span className="w-3/4 float-left"></span>Results View
                    <span
                        className=" w-1/4 float-right text-right cursor-pointer text-blue-600"
                        onClick={backToEMR}
                    >
                        Back
                    </span>
                </h1>
      </div>
      <div className="px-4 bg-white rounded-curve md:pt-4 pb-4 rounded-curve mx-auto w-full border border-stroke">
        <Tabs value="Labratory" orientation="vertical" className="gap-4 !overflow-visible">
          <div className="md:w-1/6 h-full text-left" >
            <TabsHeader className=''>
              <Tab className='!text-start ' value={"Labratory"} >
                <div className='flex gap-2'>
                  <BeakerIcon className='w-5 h-5 text-blue-500 me-2' /> <span>Laboratory</span>
                </div>
              </Tab>
              <Tab className='!text-start ' value={"Radiology"} >
                <div className='flex gap-2'>
                  <ComputerDesktopIcon className='w-5 h-5 text-blue-500 me-2' />
                  <span>Radiology</span>
                </div>

              </Tab>
              <Tab className='!text-start ' value={"Procedures"}
              >
                <div className='flex gap-2'>
                  <ArrowPathRoundedSquareIcon className='w-5 h-5 text-blue-500 me-2' />
                  <span>Procedures</span>
                </div>

              </Tab>
            </TabsHeader>
          </div>
          <div className="md:w-5/6 !p-0">
            <TabsBody className="!overflow-visible !p-0">
              <TabPanel value={"Labratory"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Laboratory />
                </div>
              </TabPanel>
              <TabPanel value={"Radiology"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Radiology />
                </div>
              </TabPanel>
              <TabPanel value={"Procedures"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Procedures />
                </div>
              </TabPanel>
            </TabsBody>
          </div>
        </Tabs>
      </div>
    </>
  );
}
