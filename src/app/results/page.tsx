"use client";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogBody,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import {
  BeakerIcon,
  ComputerDesktopIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import Laboratory from "./_components/laboratory";
import Radiology from "./_components/radiology";
import Procedures from "./_components/procedure";
import PatientSearch from "./_components/patientSearch";

function ResultEntry() {
  const [modaloc, setModaloc] = useState<any>({
    popup: false,
  });
  return (
    <>
      {/* <TabPage /> */}
      <div className="font-bold px-4 md:pt-3 pb-4 mx-auto w-full ">
        <h1 className="w-full">
          <span className="w-3/4 float-left"></span>
          Result Entry
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
              <Tab className="!text-start " value={"Labratory"}>
                <div className="flex gap-2">
                  <BeakerIcon className="w-5 h-5 text-blue-500 me-2" />{" "}
                  <span>Laboratory</span>
                </div>
              </Tab>
              <Tab className="!text-start " value={"Radiology"}>
                <div className="flex gap-2">
                  <ComputerDesktopIcon className="w-5 h-5 text-blue-500 me-2" />
                  <span>Radiology</span>
                </div>
              </Tab>
              <Tab className="!text-start " value={"Procedures"}>
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

export default ResultEntry;
