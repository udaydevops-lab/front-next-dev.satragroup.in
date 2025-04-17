"use client";
import { Divider } from "@mui/material";
import React, { useState } from "react";
import { opConsultNote } from "./opConsData";
import { opConsultNoteBinary } from "./opConsDataBinary";

export default function OPConsultNote() {
  const [showPopup, setShowpopup] = useState(false);
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#fff",
    padding: "20px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    zIndex: 999,
    width: "90%",
    borderRadius: "20px",
    marginTop: "20px",
  };
  const popupStyle: React.CSSProperties = {
    height: "80vh",
  };
  const popupContantStyle: React.CSSProperties = {
    height: "77vh",
  };
  const showPDF = () => {
    setShowpopup(!showPopup);
  };
  const hidePopup = () => {
    setShowpopup(!showPopup);
  };
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <>
      {"binary" in opConsultNoteBinary ? (
        <>
          <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <div className="items-center">
              <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
                {opConsultNoteBinary.title}
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="mt-5">
                <b>Practioner:</b>
                <span className="ml-3">{opConsultNoteBinary.practioner}</span>
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
                <div className="mt-5">
                  <b>Patient Name:</b>
                  <span className="ml-3">
                    {opConsultNoteBinary.patient.name}
                  </span>
                </div>
                <div className="mt-5">
                  <b>Gender:</b>
                  <span className="ml-3">
                    {opConsultNoteBinary.patient.gender}
                  </span>
                </div>
                <div className="mt-5">
                  <b>Date of Birth:</b>
                  <span className="ml-3">
                    {opConsultNoteBinary.patient.birthDate}
                  </span>
                </div>
              </div>
              <div className="w-full">
                <div className="mt-5">
                  <div
                    className=" w-min cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    onClick={showPDF}
                  >
                    View
                  </div>
                  {showPopup ? (
                    <div className="overlay">
                      <div style={containerStyle}>
                        <div style={popupStyle}>
                          <span
                            className="float-right mb-2 cursor-pointer"
                            onClick={hidePopup}
                          >
                            X
                          </span>
                          <object
                            style={popupContantStyle}
                            data={`data:application/pdf;base64,${opConsultNoteBinary.binary.data}`}
                            type="application/pdf"
                            width="100%"
                            height="80vh"
                          >
                            <div>Alternative text</div>
                          </object>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="items-center">
            <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
              {opConsultNote.title}
            </div>
            {/* <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">{capitalize(opConsultNote.title.replace(/([A-Z])/g, " $1").trim())}</div> */}
            <Divider className="mt-5 mb-5" />
            <div className="mt-5">
              <b>Practitioner:</b>
              <span className="ml-3">{opConsultNote.practioner}</span>
            </div>
            <Divider className="mt-5 mb-5" />
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3 border-b-2 mb-2 pb-2">
              <div className="mt-5">
                <b>Patient Name:</b>
                <span className="ml-3">{opConsultNote.patient.name}</span>
              </div>
              <div className="mt-5">
                <b>Gender:</b>
                <span className="ml-3">{opConsultNote.patient.gender}</span>
              </div>
              <div className="mt-5">
                <b>Date of Birth:</b>
                <span className="ml-3">{opConsultNote.patient.birthDate}</span>
              </div>
            </div>
            {/* Care Plan  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[0].name}
              </h2>

              {opConsultNote.report[0].data.map((item: any, index: number) => (
                <div key={index}>
                  <div>
                    <p>{item.description}</p>
                    <p>
                      <i>{item.text}</i>{" "}
                    </p>
                    <p>{item.followUp}</p>
                    <p>From : {item.start} </p>
                    <p>To : {item.end}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Care Plan  end*/}
            {/* Allergies  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[1].name}
              </h2>

              {opConsultNote.report[1].data.map((item: any, index: number) => (
                <div key={index}>
                  <p className="ps-2 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Allergies  end*/}
            {/* Medical History  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[2].name}
              </h2>

              {opConsultNote.report[2].data.map((item: any, index: number) => (
                <div key={index}>
                  <p className="ps-2 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Medical History  end*/}
            {/* Investigation Advice  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[3].name}
              </h2>

              {opConsultNote.report[3].data.map((item: any, index: number) => (
                <div key={index}>
                  <p className="ps-2 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Investigation Advice  end*/}
            {/* Medications start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[4].name}
              </h2>

              <table className="w-full border-collapse border border-slate-400 mt-3">
                <thead>
                  <tr>
                    <th className="border border-slate-300 text-left">
                      Tablet Name
                    </th>
                    <th className="border border-slate-300 text-left">
                      Date Asserted
                    </th>
                    <th className="border border-slate-300 text-left">Route</th>
                    <th className="border border-slate-300 text-left">
                      Additional Instruction
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {opConsultNote.report[4].data.map(
                    (medication: any, index: number) => (
                      <tr key={index}>
                        <td className="border border-slate-300 ">
                          {medication.tabletName}
                        </td>
                        <td className="border border-slate-300 ">
                          {medication.dateAsserted}
                        </td>
                        <td className="border border-slate-300 ">
                          {medication.dosageInstruction &&
                            medication.dosageInstruction.map(
                              (instruction: any, index: number) => (
                                <div key={index}>
                                  {instruction.route.coding[0].display}
                                </div>
                              )
                            )}
                        </td>
                        <td className="border border-slate-300 ">
                          {medication.dosageInstruction &&
                            medication.dosageInstruction.map(
                              (instruction: any, index: number) => (
                                <div key={index}>
                                  {
                                    instruction.additionalInstruction[0]
                                      .coding[0].display
                                  }
                                </div>
                              )
                            )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
            {/* Medications end*/}
            {/* Procedure  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[5].name}
              </h2>

              {opConsultNote.report[5].data.map((item: any, index: number) => (
                <div key={index}>
                  <p className="ps-2 text-sm">{item.text}</p>
                </div>
              ))}
            </div>
            {/* Procedure  end*/}
            {/* Follow Up  start*/}
            <div className="w-full pb-2 mb-2 border-b-2">
              <h2 className="font-semibold text-xl">
                {opConsultNote.report[6].name}
              </h2>

              {opConsultNote.report[6].data.map((item: any, index: number) => (
                <div key={index}>
                  <p className="ps-2 text-sm">{item.text}</p>
                  <p className="ps-2 text-sm">From:{item.start}</p>
                  <p className="ps-2 text-sm">To:{item.end}</p>
                </div>
              ))}
            </div>
            {/* Follow Up  end*/}
          </div>
        </div>
      )}
    </>
  );
}
