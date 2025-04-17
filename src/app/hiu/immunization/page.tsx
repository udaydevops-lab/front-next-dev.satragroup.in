"use client";
import { Divider, Table } from "@mui/material";
import React from "react";
import { immunizationApi, immunizationBinary } from "./immunizationApi";
import { DialogueBox } from "@/app/_common/graph";

export default function Immunization() {
  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
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

  if ("binary" in immunizationBinary) {
    return (
      <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="items-center">
          <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
            {immunizationApi.title}
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="mt-5">
            <b>Practitioner:</b>
            <span className="ml-3">{immunizationBinary.practioner}</span>
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
            <div className="mt-5">
              <b>Patient Name:</b>
              <span className="ml-3">{immunizationBinary.patient.name}</span>
            </div>
            <div className="mt-5">
              <b>Gender:</b>
              <span className="ml-3">{immunizationBinary.patient.gender}</span>
            </div>
            <div className="mt-5">
              <b>Date of Birth:</b>
              <span className="ml-3">
                {immunizationBinary.patient.birthDate}
              </span>
            </div>
          </div>
          <div className="mt-5">
          <div className="overlay" >
                     <div style={containerStyle}>
                      <div className="sample">   
                      <span className="text-rignt mb-2" >X</span>       
                      <object
                        data={`data:application/pdf;base64,${immunizationBinary.binary.data}`}
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
          <div className="text-2xl mb-4 bg-blue-gray-100 p-5 text-center">
            {immunizationApi.title}
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="mt-5">
            <b>Practitioner:</b>
            <span className="ml-3">{immunizationApi.practioner}</span>
          </div>
          <Divider className="mt-5 mb-5" />
          <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 col-span-3">
            <div className="mt-5">
              <b>Patient Name:</b>
              <span className="ml-3">{immunizationApi.patient.name}</span>
            </div>
            <div className="mt-5">
              <b>Gender:</b>
              <span className="ml-3">{immunizationApi.patient.gender}</span>
            </div>
            <div className="mt-5">
              <b>Date of Birth:</b>
              <span className="ml-3">{immunizationApi.patient.birthDate}</span>
            </div>
          </div>
          <Divider className="mt-5 mb-5" />
          {}
          {immunizationApi.report.map((item: any, index: number) => (
            <div key={index}>
              <b>{item.name}</b>
              {item.data.map((data: any, index: number) => (
                <div className="mt-5 ms-6" key={index}>
                  {Object.entries(data).map(([key, val]) => {
                    return (
                      <div className="w-full flex" key={index}>
                        {key == "resourceType" ? (
                          <b className="w-10/12 mb-3 underline">
                            {(val as any).replace(/([A-Z])/g, " $1").trim()}
                          </b>
                        ) : (
                          <>
                            <div className="w-2/12 font-semibold">
                              {capitalize(
                                key.replace(/([A-Z])/g, " $1").trim()
                              )}
                            </div>
                            <div className="w-10/12">
                              {typeof val == "boolean"
                                ? val == true
                                  ? "true"
                                  : "false"
                                : (val as any)}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                  <Divider className="mt-4" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
