"use client";
import React from "react";
import { diagnosisBinaryData, diagnosisData } from "./diagnosticsData";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Divider } from "@mui/material";

export default function Diagnosis() {
  const testsData = diagnosisData;
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
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
  const columns: GridColDef[] = [
    { field: "observation", headerName: "Test", width: 120 },
    {
      field: "unit",
      headerName: "Unit",
      width: 120,
      valueGetter: (params) => {
        if (testsData && testsData?.report && params.row.valueQuantity) {
          return params.row.valueQuantity.unit;
        }
      },
    },
    {
      field: "value",
      headerName: "Value",
      width: 120,
      valueGetter: (params) => {
        if (testsData && testsData?.report && params.row.valueQuantity) {
          return params.row.valueQuantity.value;
        }
      },
    },
    {
      field: "referenceRange",
      headerName: "Reference Range",
      width: 100,
      valueGetter: (params) => {
        if (testsData && testsData?.report && params.row.valueQuantity) {
          return "<" + params.row.referenceRange[0].high.value;
        }
      },
    },
  ];
  if ("binary" in diagnosisBinaryData) {
    return (
      <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="items-center">
          <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
            {diagnosisBinaryData?.title}
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="mt-5">
            <b>Practitioner:</b>
            <span className="ml-3">{diagnosisBinaryData?.practioner}</span>
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
            <div className="mt-5">
              <b>Patient Name:</b>
              <span className="ml-3">{diagnosisBinaryData?.patient.name}</span>
            </div>
            <div className="mt-5">
              <b>Gender:</b>
              <span className="ml-3">
                {diagnosisBinaryData?.patient.gender}
              </span>
            </div>
            <div className="mt-5">
              <b>Date of Birth:</b>
              <span className="ml-3">
                {diagnosisBinaryData?.patient.birthDate}
              </span>
            </div>
          </div>
          <div className="mt-5">
            <div className="overlay">
              <div style={containerStyle}>
                <div className="sample">
                  <span className="text-rignt mb-2">X</span>
                  <object
                    data={`data:application/pdf;base64,${diagnosisBinaryData?.binary.data}`}
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
          <Divider className="mt-5 mb-5" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="items-center">
          <div className="text-2xl text-center">
            {capitalize(
              testsData?.report[0].name.replace(/([A-Z])/g, " $1").trim()
            )}
          </div>
          <div className="mt-5">
            Patient Name:<span className="ml-3">{testsData?.patient.name}</span>
          </div>
          <div>
            Date of Birth:
            <span className="ml-3">{testsData?.patient.birthDate}</span>
          </div>
          <div>
            Gender:<span className="ml-3">{testsData?.patient.gender}</span>
          </div>
          <div>
            Referring Doctor:
            <span className="ml-3">{testsData?.practioner}</span>
          </div>
          <div>
            Date of Test:<span className="ml-3">09-07-2020</span>
          </div>
          <div className="mt-6">
            <h2 className="mb-2 capitalize">{testsData?.title}</h2>
            <DataGrid
              rows={testsData?.report[0].data}
              columns={columns}
              getRowId={(row) => row.sno}
              pagination={undefined}
              hideFooterPagination
              checkboxSelection={false}
            />
          </div>
        </div>
      </div>
    );
  }
}
