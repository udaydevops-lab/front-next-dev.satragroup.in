"use client";
import React, { use, useEffect, useState } from "react";
import { DisSummData } from "./dischargeSummaryData1";
import { DisSummDataBinary } from "./dischargeSummaryDataBinary";
import { Divider } from "@mui/material";
import { DialogueBox } from "@/app/_common/graph";

function DischargeSummaryPage() {
  const [showPopup,setShowpopup] =useState(false)
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
    zIndex: 999,
    width: '90%',
    borderRadius: '20px',
    marginTop: '20px',
  };
  const showPDF = ()=>{
    setShowpopup(!showPopup)
  }
  const hidePopup =()=>{
    setShowpopup(!showPopup)
  }
  const periad = (data: any) => {
    let label = "";
    switch (data) {
      case "d":
        label = "Days";
        break;
      case "w":
        label = "Weeks";
        break;
      case "m":
        label = "Months";
        break;
      case "y":
        label = "Years";
        break;
      default:
        break;
    }
    return label;
  };
  return (
    <>
      {"binary" in DisSummDataBinary ? (
        <>
          <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <div className="items-center">
              <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
                {DisSummDataBinary.title}
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="mt-5">
                <b>Practioner:</b>
                <span className="ml-3">{DisSummDataBinary.practioner}</span>
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
                <div className="mt-5">
                  <b>Patient Name:</b>
                  <span className="ml-3">{DisSummDataBinary.patient.name}</span>
                </div>
                <div className="mt-5">
                  <b>Gender:</b>
                  <span className="ml-3">{DisSummDataBinary.patient.gender}</span>
                </div>
                <div className="mt-5">
                  <b>Date of Birth:</b>
                  <span className="ml-3">{DisSummDataBinary.patient.birthDate}</span>
                </div>
              </div>
              <div className="w-full">
                <div className="mt-5">
                  <div className=" w-min cursor-pointer text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={showPDF}>View</div>
                     <div className="overlay" >
                     <div style={containerStyle}>
                      <div className="">   
                      <span className="text-rignt mb-2" onClick={hidePopup}>X</span>       
                      <object
                        data={`data:application/pdf;base64,${DisSummDataBinary.binary.data}`}
                        type="application/pdf"
                        width="100%"
                        height="80vh"
                      >
                        <div>Alternative text</div>
                      </object>
                    </div>
                      </div>
                      </div>
                  </div>
                  </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
            <div className="items-center">
              <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
                {DisSummData.title}
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="mt-5">
                <b>Practioner:</b>
                <span className="ml-3">{DisSummData.practioner}</span>
              </div>
              <Divider className="mt-5 mb-5" />
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
                <div className="mt-5">
                  <b>Patient Name:</b>
                  <span className="ml-3">{DisSummData.patient.name}</span>
                </div>
                <div className="mt-5">
                  <b>Gender:</b>
                  <span className="ml-3">{DisSummData.patient.gender}</span>
                </div>
                <div className="mt-5">
                  <b>Date of Birth:</b>
                  <span className="ml-3">{DisSummData.patient.birthDate}</span>
                </div>
                {/* <div className="mt-5">
            <b>Phone Number:</b>
            <span className="ml-3">{DisSummData.patient.value}</span>
          </div> */}
              </div>
              <Divider className="mt-5 mb-5" />

              {/* reports section  start*/}

              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[0].name}
                </h2>
                {DisSummData.report[0].data.map((item: any) => {
                  return (
                    <>
                      <div className="w-full mb-2">{item.text}</div>
                    </>
                  );
                })}
              </div>
              {/* reports section  end*/}
              {/* Medical History  start*/}
              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[1].name}
                </h2>
                {DisSummData.report[1].data.map((item: any, index: any) => {
                  return (
                    <>
                      <div className="w-full mb-2" key={index}>
                        <p className="font-medium">{item.resourceType}</p>
                        <p className="ps-2 text-sm">{item.text}</p>
                        <p className="ps-2 text-sm">{item.performedDateTime}</p>
                      </div>
                    </>
                  );
                })}
              </div>
              {/* Medical History  end*/}

              {/* Investigations  start*/}
              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[2].name}
                </h2>
                {DisSummData.report[2].data.map((item: any) => {
                  return (
                    <>
                      <div className="w-full mb-3 border-b-1">
                        <p className="font-medium text-sm">
                          {item.resourceType}
                        </p>
                        <p className="font-medium text-sm">{item.text}</p>
                        <p className="font-medium text-sm">{item.issued}</p>
                        {item.performer && (
                          <div>
                            <p className="font-medium text-sm">
                              <b>{item.performer.name}</b> |{" "}
                              {item.performer.telecom[0].value} |{" "}
                              {item.performer.telecom[1].value}
                            </p>
                          </div>
                        )}
                        {item.report && (
                          <>
                            <table className="w-1/2 border-collapse border border-slate-400 mt-3">
                              <tr>
                                <th className="border border-slate-300 text-left">
                                  Test
                                </th>
                                <th className="border border-slate-300 text-left">
                                  Results
                                </th>
                                <th className="border border-slate-300 text-left">
                                  Unit
                                </th>

                                <th className="border border-slate-300 text-left">
                                  code
                                </th>
                              </tr>
                              {item.report.data.map(
                                (observation: any, i: any) => {
                                  return (
                                    <tr key={i}>
                                      <td className="border border-slate-300 ">
                                        {observation.observation}
                                      </td>
                                      <td className="border border-slate-300 ">
                                        {observation.valueQuantity.value}
                                      </td>
                                      <td className="border border-slate-300 ">
                                        {observation.valueQuantity.unit}
                                      </td>

                                      <td className="border border-slate-300 ">
                                        {observation.valueQuantity.code}
                                      </td>
                                    </tr>
                                  );
                                }
                              )}
                            </table>
                          </>
                        )}
                      </div>
                    </>
                  );
                })}
              </div>
              {/* Medical History  end*/}
              {/* Procedures  start*/}
              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[3].name}
                </h2>
                {DisSummData.report[3].data.map((item: any) => {
                  return (
                    <>
                      <div className="w-full mb-2">
                        <p className="font-medium">{item.resourceType}</p>
                        <p className="ps-2 text-sm">{item.text}</p>
                        <p className="ps-2 text-sm">{item.performedDateTime}</p>
                      </div>
                    </>
                  );
                })}
              </div>
              {/* Procedures  end*/}
              {/* Medications  start*/}
              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[4].name}
                </h2>
                <p>
                  {DisSummData.report[4].data[0] &&
                  DisSummData.report[4].data[0]
                    ? (
                        DisSummData.report[4].data[0] as {
                          resourceType: string;
                        }
                      ).resourceType
                    : ""}
                </p>
                <p>{DisSummData.report[4].data[0].text}</p>
                <p>
                  {DisSummData.report[4].data[0] &&
                  DisSummData.report[4].data[0]
                    ? (
                        DisSummData.report[4].data[0] as {
                          performedDateTime: string;
                        }
                      ).performedDateTime
                    : ""}
                </p>
                <table className="w-full border-collapse border border-slate-400 mt-3">
                  <thead>
                    <tr>
                      <th className="border border-slate-300 text-left">
                        Tablet Name
                      </th>
                      <th className="border border-slate-300 text-left">
                        Dosage Form
                      </th>

                      <th className="border border-slate-300 text-left">
                        Frequency
                      </th>
                      <th className="border border-slate-300 text-left">
                        Period
                      </th>
                      <th className="border border-slate-300 text-left">
                        Route
                      </th>
                      <th className="border border-slate-300 text-left">
                        Method
                      </th>
                      <th className="border border-slate-300 text-left">
                        Additional Instructions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {DisSummData.report[4].data.map(
                      (item: any, index: number) => (
                        <tr key={index}>
                          {item.resourceType === "MedicationRequest" && (
                            <>
                              {item.dosageInstruction && (
                                <>
                                  <td className="border border-slate-300 ">
                                    {item.dosageInstruction.tabletName}
                                  </td>
                                  <td className="border border-slate-300 ">
                                    {item.dosageInstruction.text}
                                  </td>

                                  <td className="border border-slate-300 ">
                                    {
                                      item.dosageInstruction.timing.repeat
                                        .frequency
                                    }
                                  </td>
                                  <td className="border border-slate-300 ">
                                    {
                                      item.dosageInstruction.timing.repeat
                                        .period
                                    }
                                    -
                                    {periad(
                                      item.dosageInstruction.timing.repeat
                                        .periodUnit
                                    )}
                                    {/* {item.dosageInstruction.timing.repeat.periodUnit} */}
                                  </td>
                                  <td className="border border-slate-300 ">
                                    {
                                      item.dosageInstruction.route.coding[0]
                                        .display
                                    }
                                  </td>
                                  <td className="border border-slate-300 ">
                                    {
                                      item.dosageInstruction.method.coding[0]
                                        .display
                                    }
                                  </td>
                                  {item.dosageInstruction
                                    .additionalInstruction ? (
                                    <td className="border border-slate-300 ">
                                      {item.dosageInstruction.additionalInstruction.map(
                                        (instruction: any, i: number) => (
                                          <p key={i}>
                                            - {instruction.coding[0].display}
                                          </p>
                                        )
                                      )}
                                    </td>
                                  ) : (
                                    <td></td>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              {/* Medications  end*/}
              {/* Care Plan  start*/}
              <div className="w-full pb-2 mb-2 border-b-2">
                <h2 className="font-semibold text-xl">
                  {DisSummData.report[5].name}
                </h2>

                {DisSummData.report[5].data.map((item: any, index: number) => (
                  <div key={index}>
                    {item.resourceType === "CarePlan" && (
                      <div>
                        <p>{item.description}</p>
                        <p>
                          <i>{item.text}</i>{" "}
                        </p>
                        <p>{item.followUp}</p>
                        <p>From : {item.start} </p>
                        <p>To : {item.end}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Care Plan  end*/}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default DischargeSummaryPage;
