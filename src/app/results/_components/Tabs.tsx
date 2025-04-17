"use client";
import {
  ArrowPathRoundedSquareIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

import React, { useEffect, useState } from "react";
import LaboratoryEntry from "./laboratoryEntrty";
import ProcedureEntry from "./procedureEntrty";
import RadiologyEntry from "./radiologyEntrty";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Input,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import services from "@/app/utilities/services";
import { getCPOE } from "@/app/utilities/api-urls";
import Laboratory from "./laboratory";
import Radiology from "./radiology";
import Procedures from "./procedure";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PatientSearch from "./patientSearch";
import { useParams, useRouter } from "next/navigation";

function TabPage() {
  const [dataa, setDataa] = useState<any>("");
  const [tabVal, setTabVal] = useState<any>("laboratory");
  const [laboratoryData, setLaboratoryData] = useState<any>("");
  const [radiologyData, setRadiologyData] = useState<any>("");
  const [proceduresData, setProceduresData] = useState<any>("");
  const [modaloc, setModaloc] = useState<any>({
    popup: false,
  });
  const router = useRouter();
  const { patientid } = useParams();
  const data = [
    {
      label: "laboratory",
      value: "laboratory1",
      icon: BeakerIcon,
      desc: <LaboratoryEntry />,
    },
    {
      label: "radiology",
      value: "radiology2",
      icon: ComputerDesktopIcon,
      desc: <RadiologyEntry />,
    },
    {
      label: "procedure",
      value: "procedure3",
      icon: ArrowPathRoundedSquareIcon,
      desc: <ProcedureEntry />,
    },
  ];

  const columns: GridColDef[] = [
    { field: "mrn", headerName: "Patient Number", width: 100 },
    {
      field: "fullName",
      headerName: "Patient Name",
      width: 100,
    },
    { field: "lastName", headerName: "", width: 100 },
    { field: "aadharNo", headerName: "Aadhar Number", width: 120 },
    { field: "ageOfPatient", headerName: "Age", width: 230 },
    { field: "genderDesc", headerName: "Gender", width: 100 },
    { field: "primaryContactNum", headerName: "Phone ", width: 100 },
    { field: "healthId", headerName: "ABHA Number", width: 120 },
  ];
  const getRowId = (row: any) => row.id;
  const getOrders = (type: any) => {
    const patientid = "1242";
    const opdEncounterId = "815";
    services
      .get(
        getCPOE +
          `patientId=${patientid}&opdEncounterId=${opdEncounterId}&cpoeType=${tabVal}`
      )
      .then((response) => {
        if (type == "Laboratory") setLaboratoryData(response.data);
        else if (type == "Radiology") setRadiologyData(response.data);
        else if (type == "Procedures") setProceduresData(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  const handleLaboClick = () => {
    getOrders("Laboratory");
    setTabVal("Laboratory");
  };
  const handleRadioClick = () => {
    getOrders("Radiology");
    setTabVal("Radiology");
  };
  const handleProClick = () => {
    getOrders("Procedures");
    setTabVal("Procedures");
  };
  useEffect(() => {
    getOrders("Laboratory");
  }, []);
  return (
    <>
      <div className="font-bold px-4 md:pt-3 pb-6 mx-auto w-full ">
        <h1 className="w-full">
          <span className="w-3/4 float-left"></span>
          Result Entry
          <span className=" w-1/4 float-right text-right cursor-pointer text-blue-600	">
            <Button
              className="bg-blue-500 "
              onClick={(e: any) => setModaloc({ ...modaloc, popup: true })}
            >
              Advance Search
            </Button>
          </span>
        </h1>
      </div>
      <div className="px-4 bg-white rounded-curve md:pt-4 pb-4 rounded-curve mx-auto w-full border border-stroke">
        <Tabs
          value="Labratory"
          orientation="vertical"
          className="gap-4 !overflow-visible"
        >
          <div className="md:w-1/6 h-full text-left">
            <TabsHeader className="">
              <Tab
                className="!text-start "
                value={"Labratory"}
                onClick={handleLaboClick}
              >
                <div className="flex gap-2">
                  <BeakerIcon className="w-5 h-5 text-blue-500 me-2" />{" "}
                  <span>Laboratory</span>
                </div>
              </Tab>
              <Tab
                className="!text-start "
                value={"Radiology"}
                onClick={handleRadioClick}
              >
                <div className="flex gap-2">
                  <ComputerDesktopIcon className="w-5 h-5 text-blue-500 me-2" />
                  <span>Radiology</span>
                </div>
              </Tab>
              <Tab
                className="!text-start "
                value={"Procedures"}
                onClick={handleProClick}
              >
                <div className="flex gap-2">
                  <ArrowPathRoundedSquareIcon className="w-5 h-5 text-blue-500 me-2" />
                  <span>Procedures</span>
                </div>
              </Tab>
            </TabsHeader>
          </div>
          <div className="md:w-5/6 !p-0">
            <TabsBody className="!overflow-visible !p-0">
              <TabPanel value={"Labratory"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Laboratory laboratoryData={laboratoryData} />
                </div>
              </TabPanel>
              <TabPanel value={"Radiology"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Radiology radiologyData={radiologyData} />
                </div>
              </TabPanel>
              <TabPanel value={"Procedures"} className="!overflow-visible !p-0">
                <div className="ms-3">
                  <Procedures proceduresData={proceduresData} />
                </div>
              </TabPanel>
            </TabsBody>
          </div>
        </Tabs>
      </div>
      <Dialog
        open={modaloc.popup}
        handler={() => setModaloc({ ...modaloc, popup: false })}
        size={"xl"}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="pb-4"
      >
        <DialogBody className=" text-left text-black text-[15px] justify-left !p-0">
          <div className="w-full flex justify-between bg-gray-400 p-2 mb-4">
            <h2>Patient Search</h2>
            <span>
              <XMarkIcon
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900"
                onClick={() => setModaloc({ ...modaloc, popup: false })}
              />
            </span>
          </div>
          <PatientSearch />
        </DialogBody>
      </Dialog>
    </>
  );
}

export default TabPage;
