"use client";
import Printlayout from "@/app/_common/PrintLayout/printlayout";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import DateTime from "@/app/_common/date-time-picker";

import {
  getDepartmentPrac,
  getResultEntry,
  getServiceType,
  resultVerify,
  saveResultEntry,
} from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { Input, Textarea } from "@material-tailwind/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import OrderHeader from "./OrderHeader";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import convertToBase64 from "@/app/_commonfeatures/ConvertTobase64";
import removeBase64Prefix from "@/app/_commonfeatures/RemoveContenBase64";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

function RadiologyEntry(props: any) {
  // if (!props.screenData) {
  //   toast.error("In this Screen not assign this role. can you please contact Admin...")
  // }
  const [rowData, setRowData] = useState<any>({});
  const [feilds, setFeilds] = useState<any>({
    examinDate: "",
    patientArrivalDate: "",
    specimenType: "",
    resulEnteredDateTime: "",
    resultVerifedDateTime: "",
    performedByDoctor: {
      label: "Verified By",
      value: "Verified By",
    },
  });

  //values set to select box new code
  const [terminalogyCode, setTerminalogyCode] = useState<any>();
  const [verifyedBy, setVerifyedBy] = useState<any>([]);
  const [listSel, setListSel] = useState<any>({});
  const [resultsfeilds, setResultsFeilds] = useState<any>([]);
  const [secondgetfeilds, setSecondgetfeilds] = useState<any>({
    resulEnteredDateTime: null,
  });

  const getRowData = async () => {
    setRowData(props.modaloc.rowData);
  };
  const headers: any = {
    serviceEntityId: JSON.parse(getLocalItem("loginResponse")!).serviceEntityId,
    locationId: JSON.parse(getLocalItem("loginResponse")!).locationId,
    "Access-Control-Allow-Origin": "*",
  };
  // save functionality
  const handelSaveRadiology = () => {
    let code: any;
    resultsfeilds.map((list: any) => {
      if (
        list.terminologyCode === "" ||
        list.terminologyCode === null ||
        list.terminologyDesc === "" ||
        list.terminologyDesc === null
      ) {
        code = "no";
      } else {
        code = "yes";
      }
    });

    if (!feilds.patientArrivalDate) {
      toast.error("Please Add Patient Arrival Date & Time");
    } else if (!feilds.examinDate) {
      toast.error("Please Add examin Date & Time");
    } else {
      const resultsfeildsdecode = resultsfeilds.map((list: any) => {
        return {
          parameter: list.parameter,
          units: list.units,
          referenceRange: list.referenceRange,
          result: list.result,
          resultEntryType: "Radiology",
          statusFlag: 1,
          resultType: list.resultType,
          valueList: list.listValue,
          resultEntryItemId: list.resultEntryItemId,
          terminologyCode: list.terminologyCode,
          terminologyDesc: list.terminologyDesc,
        };
      });

      const postObj = {

        //serviceName: terminalogyDes,
        patientId: rowData.patientId,
        opdEncouterId: rowData.opdEncounterId,
        smapleCollectionDate: moment(feilds.smapleCollectionDateTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        smapleAcknowldegedDate: moment(
          feilds.smapleAcknowldegedDateTime
        ).format("YYYY-MM-DD HH:mm:ss"),
        specimenType: rowData.specimenType,
        speciality: rowData.specialty,
        department: rowData.cpoeType,
        serviceName: rowData.serviceDesc,
        snomedCode: terminalogyCode,
        //snomedCode: rowData.snomedCode,
        orderId: rowData.orderId,
        statusFlag: 1,
        opdEncounterSerId: rowData.opdEncounterSerId,
        resultEntryType: rowData.cpoeType,
        testPriority: feilds.testPriority && feilds?.testPriority?.label,
        resultEntryItemDto: resultsfeildsdecode,
        labResultEnryHeaderId: feilds.labResultEnryHeaderId
          ? feilds.labResultEnryHeaderId
          : null,
      };
      services
        .create(saveResultEntry, postObj, headers)
        .then((response) => {
          toast.success("Success");
          props.getOrders();
          props.setModaloc({ ...props.modaloc, popup: false });
        })
        .catch((e) => {
          toast.error("Getting error, Please try again!");
        });
    }
  };
  // Verify functionality
  const handelVerify = () => {
    if (feilds.performedByDoctor.label === "Verified By") {
      toast.error("Please Select Verified By.");
    } else {
      const postObj = {
        patientId: rowData.patientId,
        labResultEnryHeaderId: feilds.labResultEnryHeaderId,
        opdEncouterId: rowData.opdEncounterId,
        serviceName: rowData.serviceDesc,
        snomedCode: terminalogyCode,
        orderId: rowData.orderId,
        statusFlag: 1,
        opdEncounterSerId: rowData.opdEncounterSerId,
        resultEntryType: "Radiology",
        verifiedBy: feilds.performedByDoctor.label,
      };
      services
        .create(resultVerify, postObj, headers)
        .then((response) => {
          toast.success("Success");
          props.getOrders();
          props.setModaloc({ ...props.modaloc, popup: false });
        })
        .catch((e) => {
          toast.error("Gettingerror, Please try agin!");
        });
    }
  };
  const getServiceTypeFun = async () => {
    try {
      if (
        props.modaloc.rowData.status === "New Order" ||
        props.modaloc.rowData.status === ""
      ) {
        const response = await services.get(
          getServiceType +
          `?serviceCode=${props.modaloc.rowData.serviceCode}&assignPrameterType=Radiology`
        );
        const resultEntries = response.data.assignParameterItemSet.map(
          (list: any) => ({
            parameter: list.parameter,
            units: list.units,
            referenceRange: list.normalRange,
            result: "",
            resultEntryType: "Radiology",
            statusFlag: 1,
            resultType: list.resultType,
            listValue: list.valueList,
            valueList: list.valueList,
          })
        );
        //values set to select box new code
        let result = resultEntries.map((mainList: any, index: any) => {
          if (resultEntries[index].resultType === "list") {
            let getData = mainList.valueList.map((innerList: any) => {
              return {
                label: innerList,
                value: innerList,
              };
            });
            setListSel((prev: any) => {
              return {
                ...prev,
                [`options${index}`]: getData,
              };
            });

            return {
              ...mainList,
              valueList: getData,
            };
          }
          return mainList;
        });
        setTerminalogyCode(response.data.terminalogyCode)
        setResultsFeilds(result);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };
  const getServiceData = async () => {
    try {
      const response = await services.get(
        getResultEntry +
        `patientId=${props.modaloc.rowData.patientId}&opdEncouterId=${props.modaloc.rowData.opdEncounterId}&resultEntryType=Radiology&opdEncounterSerId=${props.modaloc.rowData.opdEncounterSerId}`
      );
      setSecondgetfeilds({
        ...secondgetfeilds,
        resulEnteredDateTime: response.data.resulEnteredDateTime,
      });
      //values set to select box new code
      let resultEntries = response.data.resultEntryItemDto;
      let result = resultEntries.map((mainList: any, index: any) => {
        if (resultEntries[index].resultType === "list") {
          let getData = mainList.valueList.map((innerList: any) => {
            return {
              label: innerList,
              value: innerList,
            };
          });
          setListSel((prev: any) => {
            return {
              ...prev,
              [`options${index}`]: getData,
              [`sel${index}`]: {
                label: mainList.result,
              },
            };
          });

          return {
            ...mainList,
            valueList: getData,
          };
        }
        return mainList;
      });

      setResultsFeilds(result);
      setTerminalogyCode(response.data.snomedCode)
      setFeilds({
        ...feilds,
        examinDate: response.data.examinationStartDate,
        patientArrivalDate: response.data.patientArrivalDateTime,
        smapleCollectionDateTime: response.data.smapleCollectionDateTime,
        smapleAcknowldegedDateTime: response.data.smapleAcknowldegedDateTime,
        resulEnteredDateTime: response.data.resulEnteredDateTime,
        resultVerifedDateTime: response.data.resultVerifedDateTime,
        labResultEnryHeaderId: response.data.labResultEnryHeaderId,
        performedByDoctor: {
          label: response.data.verifiedBy
            ? response.data.verifiedBy
            : "Verified By",
          value: response.data.verifiedBy,
        },
      });
      //  }
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
  const handledepartmentDropdown = () => {
    let getDeportment = "D030";
    services
      .get(getDepartmentPrac + getDeportment + "/1", headers)
      .then((response) => {
        const result = response.data.map((item: any) => ({
          value: item.employeeId,
          label: item.lastName,
          employeeId: item.employeeId,
          isDoctor: item.isDoctor,
          lastName: item.lastName,
        }));
        setVerifyedBy(result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // date and time function
  const nextDate = feilds.patientArrivalDate
    ? moment(feilds.patientArrivalDate).add(10, "minutes").toDate()
    : null;
  const handleDateChange = (date: any) => {
    if (feilds.patientArrivalDate) {
      setFeilds({ ...feilds, examinDate: date });
    } else {
      setFeilds({ ...feilds, patientArrivalDate: date });
    }
  };


  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: any
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrldata: string = URL.createObjectURL(file);
      const base64 = await convertToBase64(file);
      const removeBase64 = removeBase64Prefix(base64)
      setResultsFeilds(
        resultsfeilds.map((list: any, innerIndex: any) => {
          if (index === innerIndex) {
            return {
              ...list,
              result: removeBase64,
            };
          }
          return list;
        })
      );
    }
  };
  useEffect(() => {
    getRowData();
    getServiceTypeFun();
    getServiceData();
    handledepartmentDropdown();
  }, [props.modaloc.popup]);

  return (
    <>
      <div id="divToPrint" className="hidden w-full">
        <Printlayout
          patientid={props.modaloc.rowData.patientId}
          opdEncounterId={props.modaloc.rowData.opdEncounterId}
          orderId={props.modaloc.rowData.orderId}
          billNumber={props.modaloc.rowData.billNumber}
          content={
            <>
              <table style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                  {resultsfeilds.length > 0 ? (
                    resultsfeilds.map((item: any, index: number) => (
                      <tr key={index}>
                        <td
                          style={{ borderCollapse: "collapse", padding: "5px" }}
                        >
                          <h4 style={{ margin: "0px 15px" }}>
                            {item.parameter}
                          </h4>
                          <p style={{ margin: "0px 15px" }}>
                            {" "}
                            {item.resultType === "file" ? (
                              <img
                                src={item.result}
                                alt="Selected"
                                style={{ width: "100px" }}
                              />
                            ) : (
                              item.result
                            )}
                          </p>
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
      <div className="w-full">
        <OrderHeader rowData={rowData} />
        <div className="w-full flex flex-wrap justify-end mb-4">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="w-1/4 relative p-2">
              <DateTimePicker
                value={moment(feilds.patientArrivalDate)}
                onChange={handleDateChange}
                label="Patient Arrival Date & Time"
                format="DD/MM/YYYY hh:mm a"
                minDateTime={moment(feilds.patientArrivalDate)}
                className="w-full "
                disabled={
                  feilds.resultVerifedDateTime !== "" &&
                    feilds.resultVerifedDateTime !== null
                    ? true
                    : false
                }
              />
            </div>
            <div className="w-1/4 relative p-2">
              <DateTimePicker
                value={moment(feilds.examinDate)}
                onChange={handleDateChange}
                label="Examin Date & Time"
                format="DD/MM/YYYY hh:mm a"
                className="w-full h-[20px]"
                disabled={
                  feilds.resultVerifedDateTime !== "" &&
                    feilds.resultVerifedDateTime !== null
                    ? true
                    : false
                }
                minDateTime={moment(nextDate)}
              />
            </div>
          </LocalizationProvider>

          <div className="w-1/4 p-2 ">
            <div className="relative">
              <Select
                isDisabled={
                  feilds.resultVerifedDateTime !== "" &&
                    feilds.resultVerifedDateTime !== null
                    ? true
                    : false
                }
                primaryColor="blue"
                value={feilds.performedByDoctor}
                options={verifyedBy}
                onChange={(e: any) => {
                  setFeilds({ ...feilds, performedByDoctor: e });
                }}
                classNames={{
                  menuButton: ({ isDisabled }: any) =>
                    `${feilds.resultVerifedDateTime !== "" &&
                      feilds.resultVerifedDateTime !== null
                      ? "pointer-events-none"
                      : ""
                    } bg-white flex capitalize py-0.5 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none ${isDisabled
                      ? "bg-blue-gray-200"
                      : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                    }`,
                  menu: "absolute z-10 w-full bg-white  shadow-lg border rounded-[7px] mb-3 mt-1.5 text-sm text-gray-700",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 capitalize px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                      ? `text-white bg-blue-500`
                      : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                    }`,
                }}
              />
              <label
                style={{ fontSize: "11px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${feilds.performedByDoctor?.label !== "Verified By"
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                  : "text-sm opacity-0 top-10"
                  } 
                                                        truncate 
                                                        cursor-default 
                                                        select-none  
                                                        absolute transition-all
                                                       `}
              >
                Verified By
              </label>
            </div>
          </div>
        </div>
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
            <div className="w-1/3 mb-2">Parameter</div>
            <div className="w-2/3 mb-2">Result</div>
          </div>
          {resultsfeilds &&
            resultsfeilds.map((list: any, mainIndex: any) => (
              <>
                <div className="w-full flex gap-4">
                  <div className="w-1/3 mb-2">{list.parameter}</div>
                  <div className="w-2/3 mb-2">
                    {resultsfeilds[mainIndex].resultType === "list" ? (
                      <>
                        <Select
                          isDisabled={
                            feilds.resultVerifedDateTime !== "" &&
                              feilds.resultVerifedDateTime !== null
                              ? true
                              : false
                          }
                          primaryColor="blue"
                          value={listSel[`sel${mainIndex}`]}
                          options={listSel[`options${mainIndex}`]}
                          onChange={(e: any) => {
                            setResultsFeilds(
                              resultsfeilds.map(
                                (list: any, innerIndex: any) => {
                                  if (mainIndex === innerIndex) {
                                    return {
                                      ...list,
                                      result: e.label,
                                    };
                                  }
                                  return list;
                                }
                              )
                            );

                            setListSel({
                              ...listSel,
                              [`sel${mainIndex}`]: e,
                            });
                          }}
                          placeholder="Results"
                        />
                      </>
                    ) : (
                      <>
                        {resultsfeilds[mainIndex].resultType === "textbox" ? (
                          <>
                            <textarea
                              placeholder="Result"
                              disabled={
                                feilds.resultVerifedDateTime !== "" &&
                                  feilds.resultVerifedDateTime !== null
                                  ? true
                                  : false
                              }
                              value={resultsfeilds[mainIndex].result}
                              className="flex text-sm w-full py-2 px-3 text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                        duration-300 focus:outline-none"
                              onChange={(e: any) => {
                                setResultsFeilds(
                                  resultsfeilds.map(
                                    (list: any, innerIndex: any) => {
                                      if (mainIndex === innerIndex) {
                                        return {
                                          ...list,
                                          result: sanitizeInput(e.target.value),
                                        };
                                      }
                                      return list;
                                    }
                                  )
                                );
                              }}
                            ></textarea>
                          </>
                        ) : (
                          <>
                            {resultsfeilds[mainIndex].resultType === "file" ? (
                              <>
                                <input
                                  disabled={
                                    feilds.resultVerifedDateTime !== "" &&
                                      feilds.resultVerifedDateTime !== null
                                      ? true
                                      : false
                                  }
                                  type="file"
                                  className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                                  placeholder="Enter the Category Name"
                                  accept="image/png, image/jpeg, image/jpg"
                                  onChange={(e: any) =>
                                    handleImageChange(e, mainIndex)
                                  }
                                />
                                {resultsfeilds[mainIndex].result &&
                                  resultsfeilds[mainIndex].result ? (
                                  <img
                                    src={resultsfeilds[mainIndex].result}
                                    alt="Selected"
                                    style={{ width: "100px" }}
                                  />
                                ) : (
                                  ""
                                )}
                              </>
                            ) : (
                              <input
                                placeholder="Result"
                                disabled={
                                  feilds.resultVerifedDateTime !== "" &&
                                    feilds.resultVerifedDateTime !== null
                                    ? true
                                    : false
                                }
                                value={resultsfeilds[mainIndex].result}
                                type={resultsfeilds[mainIndex].resultType}
                                className="flex py-2 px-3 w-full text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                    duration-300 focus:outline-none"
                                onChange={(e: any) => {
                                  setResultsFeilds(
                                    resultsfeilds.map(
                                      (list: any, innerIndex: any) => {
                                        if (mainIndex === innerIndex) {
                                          return {
                                            ...list,
                                            result: e.target.value,
                                          };
                                        }
                                        return list;
                                      }
                                    )
                                  );
                                }}
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </>
            ))}
        </div>
        <div className="w-full flex mt-2">
          <div className="w-full flex justify-end gap-4">
            {/* <ActionButton
              buttonText={
                feilds.resulEnteredDateTime === "" ? "SAVE" : "UPDATE"
              }
              handleSubmit={handelSaveRadiology}
              width="w-[120px] py-3"
              disabled={
                feilds.resultVerifedDateTime !== "" &&
                  feilds.resultVerifedDateTime !== null
                  ? true
                  : false
              }
            /> */}
            {props?.screenData.Save === 1 && (
              <>
                {feilds.resulEnteredDateTime === "" ? (
                  <ActionButton
                    buttonText="SAVE"
                    handleSubmit={handelSaveRadiology}
                    width="w-[120px] py-3"
                    disabled={feilds.resultVerifedDateTime !== "" && feilds.resultVerifedDateTime !== null}
                  />
                ) : (
                  props?.screenData.Update !== 1 && (
                    <ActionButton
                      buttonText="SAVE"
                      width="w-[120px] py-3"
                      disabled={true}
                    />
                  )
                )}
              </>
            )}

            {props?.screenData.Update === 1 && (
              <>
                {feilds.resulEnteredDateTime !== "" ? (
                  <ActionButton
                    buttonText="UPDATE"
                    handleSubmit={handelSaveRadiology}
                    width="w-[120px] py-3"
                    disabled={feilds.resultVerifedDateTime !== "" && feilds.resultVerifedDateTime !== null}
                  />
                ) : (
                  feilds.resulEnteredDateTime !== "" && (
                    <ActionButton
                      buttonText="UPDATE"
                      width="w-[120px] py-3"
                      disabled={true}
                    />
                  )
                )}
              </>
            )}
            <ActionButton
              buttonText="VERIFY"
              handleSubmit={handelVerify}
              width="w-[120px] py-3"
              disabled={
                (!feilds.resulEnteredDateTime &&
                  feilds.resultVerifedDateTime !== "") ||
                  feilds.resultVerifedDateTime !== null
                  ? true
                  : false
              }
            />
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

export default roleInfoScreenData(RadiologyEntry, "Re");