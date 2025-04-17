"use client";
import { Button } from "@material-tailwind/react";
import { capitalize } from "@mui/material";
import moment from "moment";
import React, { useEffect } from "react";
import { getContent } from "./_components/utils";

export default function NewReportData({ data }: any) {
  useEffect(() => {
    // console.log("Data", data);
  }, []);
  const handleDownload = (data: any, title: string) => {
    let id = Math.random() * 100;
    const newDiv = document.createElement("div");
    newDiv.id = `id-${id}`;
    newDiv.className = "hidden";
    // Create the object element to embed the PDF
    const pdfObject = document.createElement("object");
    pdfObject.setAttribute(
      "data",
      `data:application/pdf;base64,${data}#toolbar=0`
    );
    pdfObject.setAttribute("type", "application/pdf");
    pdfObject.setAttribute("width", "100%");
    pdfObject.setAttribute("height", "100%");
    pdfObject.id = "myObject";

    // Append the object element to the new div
    newDiv.appendChild(pdfObject);

    // Append the new div to the body (it will be hidden)
    document.body.appendChild(newDiv);
    const printContent: any = document.getElementById(`id-${id}`);
    if (printContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(printContent?.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
      }
    }
    printContent.remove();
  };
  if (data && data.length == 0) {
    return <div>No data found</div>;
  } else {
    return (
      <div className="mb-28">
        {/* {data &&data[0]?.practioner?.practionerName !== "" ? (
          <div className="flex justify-end pe-10">
            <Button
              variant="gradient"
              color="blue"
              className="mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={() => toPDF()}
            >
              <span>Download</span>
            </Button>
          </div>
        ) : (
          ""
        )} */}
        <div>
          {data?.map((data: any, index: number) => {
            let patDetails: any = {};
            if (data.patient) {
              patDetails.patientName = data.patient?.name
                ? data.patient?.name == " "
                  ? "-"
                  : data.patient?.name
                : "-";
              patDetails.dateOfBirth = data.patient?.birthDate
                ? data.patient?.birthDate
                : "-";
              patDetails.gender = data?.patient?.gender
                ? data?.patient?.gender
                : "-";
              if (data?.practioner?.practionerName) {
                patDetails.practitionerName = data?.practioner?.practionerName;
              }
              if (data?.encounter) {
                if (data?.encounter?.encouterId) {
                  patDetails.encounterId = data?.encounter?.encouterId
                    ? data?.encounter?.encouterId
                    : "";
                }
                if (data?.encounter?.encouterDate) {
                  patDetails.encounterDate = data?.encounter?.encouterDate
                    ? moment(
                        data?.encounter?.encouterDate.split(" ")[0]
                      ).format("YYYY-MM-DD HH:mm")
                    : "";
                }
              }
              if (data.organizationMap) {
                patDetails.organizationName =
                  (data?.organizationMap?.organization).toLowerCase();
                if (data.organizationMap.organizationPhone) {
                  patDetails.phone = data?.organizationMap?.organizationPhone;
                }
                if (data.organizationMap.organizationemail) {
                  patDetails.email = data?.organizationMap?.organizationemail;
                }
              }
            }
            return (
              <div
                key={index}
                className="rounded-lg bg-white m-4 p-4 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5"
              >
                <div className="items-center consent-request">
                  <div className="text-2xl text-center">
                    <div>
                      {data?.title &&
                        capitalize(
                          data?.title.replace(/([A-Z])/g, " $1").trim()
                        )}
                    </div>
                    <div></div>
                  </div>
                  <div className="mt-4">{getContent(patDetails)}</div>
                  <>
                    {data?.report?.map((item: any, index0: number) => {
                      return item.data?.map((item1: any, index1: number) => {
                        if (item.name == "Family History" && !item1.system) {
                          return (
                            <>
                              {item1.code?.coding?.map(
                                (item2: any, index2: number) => {
                                  return (
                                    <div key={index2}>
                                      <table>
                                        <tr>
                                          <th>System</th>
                                          <th>Code</th>
                                          <th>Display</th>
                                        </tr>
                                        <tr>
                                          <td>{item2?.display}</td>
                                          <td>{item2?.code}</td>
                                          <td>{item2?.system}</td>
                                        </tr>
                                      </table>
                                    </div>
                                  );
                                }
                              )}
                            </>
                          );
                        }
                        if (
                          item1?.resourceType == "Condition" ||
                          item1.resourceType == "Observation"
                        ) {
                          return (
                            <>
                              <h4 className="font-semibold mt-4">
                                {item?.name}
                              </h4>
                              <div key={index1}>
                                <table>
                                  <tr>
                                    <th>System</th>
                                    <th>Code</th>
                                    <th>Display</th>
                                  </tr>
                                  <tr>
                                    <td>{item1?.system}</td>
                                    <td>{item1?.code}</td>
                                    <td>{item1?.display}</td>
                                  </tr>
                                </table>
                              </div>
                            </>
                          );
                        }
                        if (item1?.code || item1?.system) {
                          return (
                            <>
                              <h4 className="font-semibold mt-4">
                                {item?.name}
                              </h4>
                              <div key={index1}>
                                <table>
                                  <tr>
                                    <th>System</th>
                                    {item1?.code ? <th>Code</th> : null}

                                    <th>Display</th>
                                    {item1?.conclusion ? (
                                      <th>Conclusion</th>
                                    ) : null}
                                    {/* <th>Conclusion</th> */}
                                  </tr>
                                  <tr>
                                    <td>{item1?.system}</td>
                                    {item1?.code ? (
                                      <td>{item1?.code}</td>
                                    ) : null}
                                    <td>{item1?.display}</td>
                                    {item1?.conclusion ? (
                                      <td>{item1?.conclusion}</td>
                                    ) : null}
                                  </tr>
                                </table>
                              </div>
                            </>
                          );
                        } else if (
                          item1?.resourceType == "DiagnosticReport" &&
                          item1?.valueQuantity
                        ) {
                          return (
                            <>
                              <h4 className="font-semibold mt-4">
                                {item1?.resourceType}
                              </h4>
                              <div key={index1}>
                                <table>
                                  <tr>
                                    <th>System</th>
                                    <th>Unit</th>
                                    <th>Value</th>
                                  </tr>
                                  <tr>
                                    <td>{item1?.valueQuantity?.system}</td>
                                    <td>{item1?.valueQuantity?.code}</td>
                                    <td>{`${item1?.valueQuantity?.value}${item1?.valueQuantity?.unit}`}</td>
                                  </tr>
                                </table>
                              </div>
                            </>
                          );
                        } else if (
                          item1.resourceType == "DocumentReference" ||
                          item1.resourceType == "Binary"
                        ) {
                          return (
                            <>
                              <div className="flex gap-4 items-center w-1/3 justify-between mt-4">
                                <div className="font-semibold underline">
                                  {`${capitalize(
                                    item1?.title
                                      .replace(/([A-Z])/g, " $1")
                                      .trim()
                                  )} Document`}
                                </div>
                                <Button
                                  variant="gradient"
                                  color="blue"
                                  className="mr-2 h-[35px] no-underline text-[12px] items-center flex justify-center bg-blue-500 hover:bg-blue-600"
                                  onClick={() => {
                                    handleDownload(
                                      item1?.display,
                                      item1?.title
                                    );
                                  }}
                                >
                                  <span>View</span>
                                </Button>
                              </div>
                              {/* <div
                                id={`id-${item1.display}`}
                                className="hidden"
                              >
                                <object
                                  data={`data:application/pdf;base64,${item1?.display}#toolbar=0`}
                                  type="application/pdf"
                                  width="100%"
                                  height="100%"
                                  id="myObject"
                                ></object>
                              </div> */}
                            </>
                          );
                        }
                      });
                    })}
                  </>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
