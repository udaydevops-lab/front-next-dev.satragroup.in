"use client";
import React from "react";
import { presData } from "./prescription-data2";
import { presBinaryData } from "./prescription-binary";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { Divider } from "@mui/material";
import { DialogueBox } from "@/app/_common/graph";

export default function Prescription() {
  const columns: GridColDef[] = [
    { field: "id", headerName: "S No", width: 50 },

    { field: "drugDesc", headerName: "Drug Details", width: 400 },
  ];
  const dataa = [{ id: 1, drugDesc: "One tablet at once | " }];
  const period = (data: any) => {
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
  {
    if ("binary" in presBinaryData) {
      return (
        <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="items-center">
            <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
              {presBinaryData.title}
            </div>
            <Divider className="mt-5 mb-5" />
            <div className="mt-5">
              <b>Practioner:</b>
              <span className="ml-3">{presBinaryData.practioner}</span>
            </div>
            <Divider className="mt-5 mb-5" />
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
              <div className="mt-5">
                <b>Patient Name:</b>
                <span className="ml-3">{presBinaryData.patient.name}</span>
              </div>
              <div className="mt-5">
                <b>Gender:</b>
                <span className="ml-3">{presBinaryData.patient.gender}</span>
              </div>
              <div className="mt-5">
                <b>Date of Birth:</b>
                <span className="ml-3">{presBinaryData.patient.birthDate}</span>
              </div>
            </div>
            <div className="w-full">
              <div className="mt-5">
                <DialogueBox
                  buttonText="Hello"
                  size="xl"
                  label="View"
                  content={
                    <object
                      data={`data:application/pdf;base64,${presBinaryData.binary.data}`}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    >
                      <div>Alternative text</div>
                    </object>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
          <div className="items-center">
            <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
              {presData.title}
            </div>
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
              <div className="mt-5">
                <b>Patient Name:</b>
                <span className="ml-3">{presData.patient.name}</span>
              </div>
              <div className="mt-5">
                <b>Gender:</b>
                <span className="ml-3">{presData.patient.gender}</span>
              </div>
              <div className="mt-5">
                <b>Birthdate:</b>
                <span className="ml-3">{presData.patient.birthDate}</span>
              </div>
            </div>

            <Divider className="mt-5 mb-5" />
            <div className="mt-5">
              <b>practioner:</b>
              <span className="ml-3">{presData.practioner}</span>
            </div>

            <Divider className="mt-5 mb-5" />

            <table className="w-full border-collapse border border-slate-400 mt-3">
              <tr>
                <th className="border border-slate-300 text-left">
                  Tablet Name
                </th>
                <th className="border border-slate-300 text-left">
                  Dosage Instruction
                </th>
                <th className="border border-slate-300 text-left">Frequency</th>
                <th className="border border-slate-300 text-left">Period</th>
                <th className="border border-slate-300 text-left">Route</th>
                <th className="border border-slate-300 text-left">Method</th>
                <th className="border border-slate-300 text-left">
                  Additional Instruction
                </th>
              </tr>

              {presData.report[0].data.map(
                (medicationRequest: any, index: any) => (
                  <tr key={index}>
                    <td className="border border-slate-300">
                      {medicationRequest.tabletName}
                    </td>
                    <td className="border border-slate-300 ">
                      {medicationRequest.dosageInstruction[0].text}
                    </td>

                    <td className="border border-slate-300 ">
                      {
                        medicationRequest.dosageInstruction[0].timing.repeat
                          .frequency
                      }
                    </td>
                    <td className="border border-slate-300 ">
                      {
                        medicationRequest.dosageInstruction[0].timing.repeat
                          .period
                      }
                      -
                      {period(
                        medicationRequest.dosageInstruction[0].timing.repeat
                          .periodUnit
                      )}
                    </td>
                    <td className="border border-slate-300 ">
                      {
                        medicationRequest.dosageInstruction[0].route.coding[0]
                          .display
                      }
                    </td>
                    <td className="border border-slate-300 ">
                      {
                        medicationRequest.dosageInstruction[0].method.coding[0]
                          .display
                      }
                    </td>
                    <td className="border border-slate-300 ">
                      {
                        medicationRequest.dosageInstruction[0]
                          .additionalInstruction[0].coding[0].display
                      }
                    </td>
                  </tr>
                )
              )}
            </table>
          </div>
        </div>
      );
    }
  }
}
