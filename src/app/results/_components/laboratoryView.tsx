import Printlayout from "@/app/_common/PrintLayout/printlayout";
import ActionButton from "@/app/_common/button";
import { getResultEntry } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import moment from "moment";
import React, { useEffect, useState } from "react";
import OrderHeader from "./OrderHeader";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import { toast } from "react-toastify";

function LaboratoryView(props: any) {
  // if (!props.screenData) {
  //   toast.error("In this Screen not assign this role. can you please contact Admin...")
  // }
  const [rowData, setRowData] = useState<any>({});
  const [feilds, setFeilds] = useState<any>({});
  const [resultsFeilds, setResultsFeilds] = useState<any>({});
  const [printBtn, setPrintBtn] = useState<any>(true);

  const handelOk = () => { };
  const handelCancel = () => {
    props.setModaloc({ ...props.modaloc, view: false });
  };
  const handelPrint = () => { };
  const getRowData = async () => {
    setRowData(props.modaloc.rowData);
  };

  const getServiceData = async () => {
    try {
      const response = await services.get(
        getResultEntry +
        `patientId=${props.modaloc.rowData.patientId}&opdEncouterId=${props.modaloc.rowData.opdEncounterId}&resultEntryType=Laboratory&opdEncounterSerId=${props.modaloc.rowData.opdEncounterSerId}`
      );

      setPrintBtn(response.data.resultEntryItemDto.length > 0 ? false : true);
      setResultsFeilds(response.data.resultEntryItemDto);
      setFeilds({
        ...feilds,
        resulEnteredDateTime: response.data.resulEnteredDateTime,
        smapleCollectionDateTime: response.data.smapleCollectionDateTime,
        smapleAcknowldegedDateTime: response.data.smapleAcknowldegedDateTime,
        performedByDoctor: response.data.verifiedBy,
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const PrintRecord = () => {
    const printContent = document.getElementById("divToPrint");

    if (printContent) {
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no"
      );

      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print</title></head><body>"
        );
        printWindow.document.write(printContent.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };
  useEffect(() => {
    getRowData();
    getServiceData();
  }, []);
  return (
    <>
      <div id="divToPrint" className="hidden w-full">
        <Printlayout
          patientid={props.modaloc.rowData.patientId}
          opdEncounterId={props.modaloc.rowData.opdEncounterId}
          orderId={props.modaloc.rowData.orderId}
          billNumber={props.modaloc.rowData.billNumber}
          serviceName={rowData.serviceDesc}
          verifiedBy={feilds.performedByDoctor}
          content={
            <>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead style={{ borderBottom: "1px solid black" }}>
                  <tr>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "10%",
                      }}
                    >
                      S No
                    </th>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "30%",
                      }}
                    >
                      Parameter
                    </th>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "15%",
                      }}
                    >
                      Result
                    </th>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "15%",
                      }}
                    >
                      Units
                    </th>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "15%",
                      }}
                    >
                      Reference Range
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resultsFeilds.length > 0 ? (
                    resultsFeilds.map((item: any, index: number) => (
                      <tr key={index}>
                        <td
                          style={{
                            borderCollapse: "collapse",
                            padding: "5px 15px",
                          }}
                        >
                          {index + 1}
                        </td>
                        <td
                          style={{
                            borderCollapse: "collapse",
                            padding: "5px 15px",
                          }}
                        >
                          {item.parameter}
                        </td>
                        <td
                          style={{
                            borderCollapse: "collapse",
                            padding: "5px 15px",
                          }}
                        >
                          {item.resultType === "file" ? (
                            <img
                              src={item.result}
                              alt="Selected"
                              style={{ width: "100px" }}
                            />
                          ) : (
                            item.result
                          )}
                        </td>
                        <td
                          style={{
                            borderCollapse: "collapse",
                            padding: "5px 15px",
                          }}
                        >
                          {item.units}
                        </td>
                        <td
                          style={{
                            borderCollapse: "collapse",
                            padding: "5px 15px",
                          }}
                        >
                          {item.referenceRange}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td>No results</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </>
          }
        />
      </div>
      <div className="w-full mb-2">
        <OrderHeader rowData={rowData} />
      </div>
      <div className="w-full overflow-auto mt-2">
        <div className="w-full mb-3 flex flex-wrap">
          <div className="w-auto pe-2">
            <span className="font-semibold">Service Name: </span>
            <span>{rowData.serviceDesc}</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">Department: </span>
            <span>{rowData.cpoeType}</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">Speciality: </span>
            <span>{rowData.specialty}</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">SNOMED Code: </span>
            <span>{rowData.snomedCode}</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">Status: </span>
            <span> {rowData.status}</span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">Result Entered Date & Time: </span>
            <span>
              {feilds.resulEnteredDateTime
                ? moment(feilds.resulEnteredDateTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
                : "--"}
            </span>
          </div>
          {" | "}
          <div className="w-auto ps-2 pe-2">
            <span className="font-semibold">Result Verifed Date & Time: </span>
            <span>
              {feilds.resultVerifedDateTime
                ? moment(feilds.resultVerifedDateTime).format(
                  "YYYY-MM-DD HH:mm:ss"
                )
                : "--"}
            </span>
          </div>
        </div>
        <div className="w-full mb-2 p-2 border">
          <div className="w-full flex gap-4">
            <div className="w-2/5 mb-2">Parameter</div>
            <div className="w-1/5 mb-2">Result</div>
            <div className="w-1/5 mb-2">Units</div>
            <div className="w-1/5 mb-2">Reference Range</div>
          </div>

          {resultsFeilds && resultsFeilds.length > 0
            ? resultsFeilds.map((item: any, index: number) => (
              <div className="w-full flex gap-4" key={index}>
                <div className="w-2/5 mb-2">{item.parameter}</div>
                <div className="w-1/5 mb-2">
                  {item.resultType === "file" ? (
                    <img
                      src={item.result}
                      alt="Selected"
                      style={{ width: "100px" }}
                    />
                  ) : (
                    item.result
                  )}
                </div>
                <div className="w-1/5 mb-2">{item.units}</div>
                <div className="w-1/5 mb-2">{item.referenceRange}</div>
              </div>
            ))
            : "No Record For Now"}
        </div>
        <div className="w-full flex mt-2">
          <div className="w-2/6">Verified By: {feilds.performedByDoctor}</div>
          <div className="w-4/6 flex justify-end gap-4">
            {["OK", "CANCEL"].map((text, index) => (
              <ActionButton
                key={index}
                buttonText={text}
                handleSubmit={
                  index === 0
                    ? handelOk
                    : handelCancel
                }
                width="w-[120px] py-3"
              />
            ))}
            {props?.screenData.Print === 1 &&
              <ActionButton
                buttonText="PRINT"
                handleSubmit={PrintRecord}
                width="w-[120px] py-3"
                disabled={!feilds.resulEnteredDateTime ? true : false}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default roleInfoScreenData(LaboratoryView, "Re");
