"use client";
import React, { useState, useEffect } from "react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { apiResponse } from "./api-response";
import moment from "moment";
import services from "@/app/utilities/services";
import { decryptData } from "@/app/utilities/api-urls";
const ReportData = ({
  consentId
}: any) => {
  // const [testsData, setTestsData] = useState<any>();
  // useEffect(() => {
  //   setTestsData({
  //     title: "Hematology report",
  //     patient: {
  //       name: "Bhanuchander",
  //       gender: "male",
  //       birthDate: "1987-10-06",
  //     },
  //     practioner: "Dr. DEF",
  //     report: {
  //       name: "DiagnosticReport",
  //       data: [
  //         {
  //           sno: 1,
  //           observation: "cholesterol",
  //           valueQuantity: {
  //             value: 6.3,
  //             unit: "mmol/l",
  //             system: "http://unitsofmeasure.org",
  //             code: "mmol/L",
  //           },
  //           referenceRange: [
  //             {
  //               high: {
  //                 value: 4.5,
  //                 unit: "mmol/l",
  //                 system: "http://unitsofmeasure.org",
  //                 code: "mmol/L",
  //               },
  //             },
  //           ],
  //         },
  //         {
  //           sno: 2,
  //           observation: "triglyceride",
  //           valueQuantity: {
  //             value: 1.3,
  //             unit: "mmol/l",
  //             system: "http://unitsofmeasure.org",
  //             code: "mmol/L",
  //           },
  //           referenceRange: [
  //             {
  //               high: {
  //                 value: 2,
  //                 unit: "mmol/l",
  //                 system: "http://unitsofmeasure.org",
  //                 code: "mmol/L",
  //               },
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   });
  //   services
  //     .get(decryptData + consentId)
  //     .then((response: any) => {
  //       console.log(response)
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });

  // }, []);

  // const columns: GridColDef[] = [
  //   { field: "resourceType", headerName: "Test", width: 120 },
  //   {
  //     field: "unit",
  //     headerName: "Unit",
  //     width: 120,
  //     valueGetter: (params) => {
  //       if (props.data && params.row.valueQuantity) {
  //         return params.row.valueQuantity.unit;
  //       }
  //     },
  //   },
  //   {
  //     field: "value",
  //     headerName: "Value",
  //     width: 120,
  //     valueGetter: (params) => {
  //       if (props.data && props.data.report && params.row.valueQuantity) {
  //         return params.row.valueQuantity.value;
  //       }
  //     },
  //   },
  //   {
  //     field: "refrence",
  //     headerName: "Reference Range",
  //     width: 100,
  //     valueGetter: (params) => {
  //       if (props.data && props.data.report && params.row.valueQuantity) {
  //         return "<" + params.row.refrence[0].high.value;
  //       }
  //     },
  //   },
  // ];

  // if (!props.data || !props.data.report || !props.data.report.data) {
  //   return null;
  // }
  // const isEmptyObject = (obj: object): boolean => {
  //   return Object.keys(obj).length === 0;
  // };
  // console.log(props.data.report[0].data)
  // const { toPDF, targetRef } = usePDF({
  //   filename: props.data && props.data?.title,
  // });
  return (
    <></>
    // <div className="">
    //   {props.data?.practioner?.practionerName !== "" ? (
    //     <div className="flex justify-end pe-10">
    //       <Button
    //         variant="gradient"
    //         color="blue"
    //         className="mr-2 bg-blue-500 hover:bg-blue-600"
    //         onClick={() => toPDF()}
    //       >
    //         <span>Download</span>
    //       </Button>
    //     </div>
    //   ) : (
    //     ""
    //   )}
    //   <div ref={targetRef}>
    //     {props.data?.practioner?.practionerName !== "" &&
    //       props.data?.patient.name !== "" && (
    //         <div className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
    //           <div className="items-center consent-request">
    //             <div className="text-2xl text-center">
    //               {props.data && props.data?.title}
    //             </div>
    //             <div className="mt-5">
    //               Patient Name:
    //               <span className="ml-3">
    //                 {props.data && props.data?.patient?.name}
    //               </span>
    //             </div>
    //             <div>
    //               Date of Birth:
    //               <span className="ml-3">
    //                 {props.data &&
    //                   moment(props.data?.patient?.birthDate).format(
    //                     "DD-MM-YYYY"
    //                   )}
    //               </span>
    //             </div>
    //             <div>
    //               Gender:
    //               <span className="ml-3">
    //                 {props.data && props.data?.patient?.gender}
    //               </span>
    //             </div>
    //             <div>
    //               Referring Doctor:
    //               <span className="ml-3">
    //                 {props.data && props.data?.practioner?.practionerName}
    //               </span>
    //             </div>
    //             {/* <div>
    //         Date of Test:<span className="ml-3">09-07-2020</span>
    //       </div> */}
    //             {/* {props.data && <div className="mt-6">
    //         <ReactDatagrid
    //           rows={props.data && props.data.report[0].data}
    //           columns={columns} 
    //         />
    //       </div>}*/}
    //             {props.data?.binary ? (
    //               <object
    //                 data={`data:application/jpg;base64,${props.data?.binary?.data}`}
    //                 type="application/jpg"
    //                 width="100%"
    //                 height="80vh"
    //               ></object>
    //             ) : (
    //               <>
    //                 {props.data?.report?.map((item: any, index: number) => {
    //                   return item.data.map((item1: any, index1: number) => {
    //                     if (item1.code) {
    //                       return (
    //                         <>
    //                           <h4 className="font-semibold mt-4">
    //                             {item1.resourceType}
    //                           </h4>
    //                           <div>
    //                             <table>
    //                               <tr>
    //                                 <th>System</th>
    //                                 <th>Code</th>
    //                                 <th>Display</th>
    //                               </tr>
    //                               <tr>
    //                                 <td>{item1?.system}</td>
    //                                 <td>{item1?.code}</td>
    //                                 <td>{item1?.display}</td>
    //                               </tr>
    //                             </table>
    //                           </div>
    //                         </>
    //                       );
    //                     } else if (
    //                       item1.resourceType == "DiagnosticReport" &&
    //                       item1.valueQuantity
    //                     ) {
    //                       return (
    //                         <>
    //                           <h4 className="font-semibold mt-4">
    //                             {item1.resourceType}
    //                           </h4>
    //                           <div>
    //                             <table>
    //                               <tr>
    //                                 <th>System</th>
    //                                 <th>Unit</th>
    //                                 <th>Value</th>
    //                               </tr>
    //                               <tr>
    //                                 <td>{item1?.valueQuantity?.system}</td>
    //                                 <td>{item1?.valueQuantity?.code}</td>
    //                                 <td>{`${item1?.valueQuantity?.value}${item1?.valueQuantity?.unit}`}</td>
    //                               </tr>
    //                             </table>
    //                           </div>
    //                         </>
    //                       );
    //                     } else if (
    //                       item1.resourceType == "MedicationRequest" &&
    //                       !item1.code
    //                     ) {
    //                       return (
    //                         <>
    //                           <h4 className="font-semibold mt-4">
    //                             {item1.resourceType}
    //                           </h4>
    //                           <div>
    //                             <table>
    //                               <tr>
    //                                 <th>System</th>
    //                                 <th>Code</th>
    //                                 <th>Display</th>
    //                               </tr>
    //                               {item1.dosageInstruction.map(
    //                                 (item2: any, index2: number) => {
    //                                   return item2.route.coding.map(
    //                                     (item3: any, index3: number) => {
    //                                       return (
    //                                         <>
    //                                           <tr>
    //                                             <td>{item3?.system}</td>
    //                                             <td>{item3?.code}</td>
    //                                             <td>{item3?.display}</td>
    //                                           </tr>
    //                                         </>
    //                                       );
    //                                     }
    //                                   );
    //                                 }
    //                               )}
    //                             </table>
    //                           </div>
    //                         </>
    //                       );
    //                     }
    //                   });
    //                 })}
    //               </>
    //             )}
    //           </div>
    //         </div>
    //       )}
    //     {props.data?.practioner?.practionerName === "" &&
    //       props.data?.patient.name === "" && (
    //         <div className="text-xl flex justify-center items-center text-blue-500 font-bold">
    //           No Records Found...
    //         </div>
    //       )}
    //   </div>
    // </div>
  );
}

export default ReportData;
