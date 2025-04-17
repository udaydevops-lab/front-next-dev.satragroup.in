"use client";
import { useParams } from "next/navigation";
import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import QuillRichEditer from "@/app/_commonfeatures/QuillRichEditer";
import React, {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Select from "react-tailwindcss-select";
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import services from "@/app/utilities/services";
import { getAllEquipmentData, getLabEquipment, organismAntibioticMapingAllgridapi } from "@/app/utilities/api-urls";
import { addLabelAndValue } from "./utils";
import Printlayout from "@/app/_common/PrintLayout/printlayout";
import LabPrintlayout from "@/app/_common/PrintLayout/LabPrintLayout";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

interface ResultEnteryFormProps {
  feildsData: any;
  setFeildsData: Dispatch<SetStateAction<any>>;
  listSel: any;
  setListSel: Dispatch<SetStateAction<any>>;
  selectfeilds: any;
  setSelectFeilds: Dispatch<SetStateAction<any>>;
  setCultureSensitivity: Dispatch<SetStateAction<any>>;
  cultureSensitivity: any;
  setOrganisumfeilds: Dispatch<SetStateAction<any>>;
  organisumfeilds: any;
  onSave: any;
  onVerify: any;
  verifyedBy: any;
  btnStatues: any;
  isVerifyed: any;
  addOrg: any,
  setAddOrg: any,
  serviceDetails: any,
  loader: any,
  loader1: any,
  setLoader: any,
  patientData: any
  screenInfo: any
  [key: string]: any;
}
const ResultEnteryForm: FC<ResultEnteryFormProps> = ({
  feildsData,
  setFeildsData,
  listSel,
  setListSel,
  selectfeilds,
  setSelectFeilds,
  cultureSensitivity,
  setCultureSensitivity,
  organisumfeilds,
  setOrganisumfeilds,
  onSave,
  onVerify,
  verifyedBy,
  btnStatues,
  isVerifyed,
  addOrg,
  setAddOrg,
  serviceDetails,
  loader,
  setLoader,
  loader1,
  patientData,
  screenInfo,
  ...props
}) => {
  const { patientid, opdEncounterId, orderId } = useParams();
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        reader.result
          ? resolve(reader.result.toString())
          : reject(new Error("Failed to convert image to base64."));
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setFeildsData((prevData: any) =>
        prevData.map((item: any, i: number) =>
          i === index ? { ...item, result: base64 } : item
        )
      );
    }
  };

  const handleChange = (index: number, value: any, key = "result") => {
    setFeildsData((prevData: any) =>
      prevData.map((item: any, i: number) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };
  const [equipmentList, setEquipmentList] = useState<any>([]);

  const [multSel, setMultSel] = useState<any>(null);
  const [prdVal, setPrdVal] = useState<any>([]);

  // const [addOrg, setAddOrg] = useState<any>([]);
  const [suspect, setSuspect] = useState<any>({});
  const suspectibilityData: any = [
    { label: "Sensitive", value: "Sensitive" },
    { label: "Resistance", value: "Resistance" },
  ];

  const handleSelectChange = (data: any) => {
    setMultSel(data);
    setAddOrg(data);
    // let combinedList = data.reduce((acc: any[], list: any) => {
    //   return acc.concat(list.oraganismList);
    // }, []);
    // let finalValue: any = combinedList.map((list: any) => ({
    //   ...list,
    //   micVal: "",
    //   suspectibility: ""
    // }))
    // setAddOrg(finalValue)
    // console.log(combinedList);
  };

  const reagentsList: any = [
    {
      label: "Lab Freezers",
      value: "Lab Freezers",
    },
    {
      label: "TRUEchemie LYSE REAGENT-1 500 ML",
      value: "TRUEchemie LYSE REAGENT-1 500 ML",
    },
    {
      label: "Ferric Potassium Pdta Cas No: 1399.36-2",
      value: "Ferric Potassium Pdta Cas No: 1399.36-2",
    },
    {
      label: "Reagecon Conductivity Standards for laboratory Uses",
      value: "Reagecon Conductivity Standards for laboratory Uses",
    },
    {
      label: "1-Amino-2-Naphthol-4-Sulfonic Acid Hydrate Application: Industrial",
      value: "1-Amino-2-Naphthol-4-Sulfonic Acid Hydrate Application: Industrial",
    },
  ]

  const getEquipment = () => {
    const url: any = `${getAllEquipmentData}specialityCode=${serviceDetails?.specialityCode}&departMentCode=&type=${serviceDetails?.deptCode}`
    services.get(url).then((response) => {
      // const res: any = filterByDepartmentCode(response.data, serviceDetails?.specialityCode)
      let result: any = response.data.map((list: any) => ({
        ...list,
        label: list.equipmentDesc,
        value: list.equipmentCode,
      }))
      setEquipmentList(result);
    });
  };
  // const filterByDepartmentCode = (data: any, code: any) => {
  //   if (!Array.isArray(data)) {
  //     console.error("Expected data to be an array, but got:", data);
  //     return [];
  //   }
  //   const res: any = data
  //     .map((group: any) => Array.isArray(group.equipmentList) ? group.equipmentList : [])
  //     .reduce((acc: any[], curr: any[]) => acc.concat(curr), []) // Flatten the arrays
  //     .filter((equipment: any) => equipment.laboratorySpeciality === code);
  //   return res
  // };

  const getOrganismAntibiotic = () => {
    services.get(organismAntibioticMapingAllgridapi).then((res) => {

      const result = res?.data.map((list: any) => ({
        ...list,
        label: list?.organismDesc,
        value: list?.organismDesc,
      }))
      const filteredData = result.filter((item: any) => item.label !== null || item.value !== null);
      setPrdVal(filteredData)
    });
  };

  const handleSuspectibilityChange = (selectedOption: any, index: number, innerIndex: number) => {
    const newAddOrg = [...addOrg];
    newAddOrg[index].oraganismList[innerIndex].suspectibility = selectedOption;
    setAddOrg(newAddOrg);
  };

  const handleMicValChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, innerIndex: number) => {
    const newAddOrg = [...addOrg];
    newAddOrg[index].oraganismList[innerIndex].micVal = e.target.value;
    setAddOrg(newAddOrg);
  };

  // print data function
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
    getOrganismAntibiotic();
  }, []);

  useEffect(() => {
    getEquipment()
  }, [serviceDetails?.specialityCode]);
  return (
    <>

      <div id="divToPrint" className="hidden w-full">
        <LabPrintlayout
          patientid={patientid}
          doctor={patientData.orderBy}
          opdEncounterId={opdEncounterId}
          orderId={orderId}
          billNumber={patientData.billNumber}
          serviceName={serviceDetails.serviceDesc}
          verifiedBy={verifyedBy?.label !== "Verified By" ? verifyedBy?.label : ''}
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
                        width: "20%",
                      }}
                    >
                      Parameter
                    </th>
                    <th
                      style={{
                        borderCollapse: "collapse",
                        padding: "5px 15px",
                        textAlign: "left",
                        width: "25%",
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
                  {feildsData.length > 0 ? (
                    feildsData.map((item: any, index: number) => (
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
                          ) : item.resultType === "textbox" ? (
                            <>
                              <div dangerouslySetInnerHTML={{ __html: item.result }} />

                            </>
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
      <div className="w-full border mt-6 p-2">
        <div className="w-full flex gap-4">
          <div className="w-1/6 mb-2">
            <strong>Parameter</strong>
          </div>
          <div className="w-3/6 mb-2">
            <strong>Result</strong>
          </div>
          <div className="w-1/6 mb-2 text-center">
            <strong>Units</strong>
          </div>
          <div className="w-1/6 mb-2 text-center">
            <strong>Reference Range</strong>
          </div>
        </div>
        {feildsData.map((field: any, index: number) => (
          <div className="w-full flex gap-4 mt-4" key={index}>
            <div className="w-1/6 flex items-center mb-2">
              {field.parameter}
            </div>
            <div className="w-3/6 mb-2">
              {field.resultType === "list" ? (
                <Select
                  primaryColor="blue"
                  value={listSel[`sel${index}`]}
                  options={field.options}
                  onChange={(e: any) => {
                    handleChange(index, e.label);
                    setListSel((prevListSel: any) => ({
                      ...prevListSel,
                      [`sel${index}`]: e,
                    }));
                  }}
                  // onChange={(e: any) => {
                  //   setFeildsData(
                  //     feildsData.map(
                  //       (list: any, innerIndex: any) => {
                  //         if (index === innerIndex) {
                  //           return {
                  //             ...list,
                  //             result: e.label,
                  //           };
                  //         }
                  //         return list;
                  //       }
                  //     )
                  //   );

                  //   setListSel({
                  //     ...listSel,
                  //     [`sel${index}`]: e,
                  //   });
                  // }}
                  placeholder="Results"
                  isDisabled={isVerifyed}
                />
              ) : field.resultType === "textbox" ? (
                <>
                  {/* <QuillRichEditer
                    statValue={field.contentText ? field.contentText : ""}
                    onChange={(data: any) => handleChange(index, data)}
                  /> */}
                  <QuillRichEditer
                    statValue={field.result ? field.result : field.contentText}
                    onChange={(data: any) => handleChange(index, data)}
                  />

                </>
              ) : field.resultType === "file" ? (
                <>
                  <input
                    disabled={isVerifyed}
                    placeholder={`Result ${field.resultType}`}
                    type="file"
                    className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {field.result && (
                    <img
                      src={field.result}
                      alt="Selected"
                      style={{ width: "100px" }}
                    />
                  )}
                </>
              ) : field.resultType === "link" ? (
                <>
                  <input
                    disabled={isVerifyed}
                    placeholder={`Result ${field.resultType}`}
                    type="file"
                    className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                </>
              ) : (
                <input
                  disabled={isVerifyed}
                  placeholder={`Result ${field.resultType}`}
                  value={field.result}
                  type={field.resultType}
                  className="flex py-2 px-3 w-full text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none"
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              )}
            </div>
            <div className="w-1/6 mb-2 flex items-center justify-center">
              {field.units}
            </div>
            <div className="w-1/6 mb-2 flex items-center justify-center ">
              {field?.normalRange}
            </div>
          </div>
        ))}

        {/* organisum section  start*/}

        <Divider className="my-8" />
        <>
          <div className="w-full mt-4">
            {serviceDetails?.isCultureSensitive === 1 &&
              <div className="w-[300px]">
                <ReactSelectBox
                  value={multSel}
                  options={prdVal}
                  onChange={handleSelectChange}
                  label="Select Organism"
                  isDisabled={isVerifyed}
                  isMultiple={true}
                />
              </div>
            }

            {addOrg && addOrg.length > 0 ? (
              <>
                <div>
                  {addOrg.map((orgData: any, index: any) => (
                    <div key={orgData.label} className="w-full mt-4 mb-6">
                      <h2 className="font-semibold mb-2">{orgData.organismDesc}</h2>
                      <table className="text-left w-full table-fixed border border-slate-300">
                        <thead>
                          <tr>
                            <th className="border border-slate-300 w-[100px] p-2">SNo</th>
                            <th className="border border-slate-300 p-2">Antibiotic Description</th>
                            <th className="border border-slate-300 p-2">Suspectibility</th>
                            <th className="border border-slate-300 p-2">MIC Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orgData.oraganismList.map((item: any, innerIndex: any) => (
                            <tr key={item.organismAssignId}>
                              <td className="border border-slate-300 px-2">{innerIndex + 1}</td>
                              <td className="border border-slate-300 px-2">{item.antibioticDesc}</td>
                              <td className="border border-slate-300 px-2">
                                <Select
                                  primaryColor={"blue"}
                                  value={item.suspectibility || null}
                                  options={suspectibilityData}
                                  onChange={(selectedOption) => handleSuspectibilityChange(selectedOption, index, innerIndex)}
                                />
                              </td>

                              <td className="border border-slate-300 px-2">
                                <input
                                  type="text"
                                  name="micVal"
                                  placeholder="Enter Mic Value"
                                  className="w-full py-2 px-4 border border-slate-400 rounded-md"
                                  value={item.micVal || ''}
                                  onChange={(e) => handleMicValChange(e, index, innerIndex)}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>

              </>
            ) : ""}
          </div>
        </>

        {/* organisum section  end*/}
      </div >
      <div className="w-full mt-4 flex gap-3">
        <div className="w-1/2">
          <div className="flex gap-4">
            <div className="w-1/3">
              <ReactSelectBox
                value={selectfeilds.pathologist}
                options={verifyedBy}
                onChange={(e: any) => {
                  setSelectFeilds({ ...selectfeilds, pathologist: e });
                }}
                label="Verified By"
                isDisabled={isVerifyed}
                height="100"
              />
            </div>
            <div className="w-1/3">
              <ReactSelectBox
                optionListWidtsize={true}
                value={selectfeilds.reagents}
                options={reagentsList}
                onChange={(e: any) => {
                  setSelectFeilds({ ...selectfeilds, reagents: e });
                }}
                label="Reagents Used"
                isDisabled={isVerifyed}
                height="100"
              />
            </div>
            <div className="w-1/3 my-select ">
              <ReactSelectBox
                optionListWidtsize={true}
                value={selectfeilds.equipment}
                options={equipmentList}
                onChange={(e: any) => {
                  setSelectFeilds({ ...selectfeilds, equipment: e });
                }}
                label="Equipment"
                isDisabled={isVerifyed}
                height="100"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-8 pb-4 flex justify-end gap-3">
        <div className="flex gap-4">
          {/* <ActionButton
              buttonText={
                loader ?
                  <div className='w-full flex justify-center items-center'>
                    <div className='innerBtnloader'></div>
                  </div> :
                  btnStatues !== "save" ? "Update" : "Save"
              }
              width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={onSave}
              disabled={isVerifyed}
            /> */}
          {screenInfo?.Save === 1 && btnStatues === "save" &&
            <ActionButton
              buttonText={
                loader ?
                  <div className='w-full flex justify-center items-center'>
                    <div className='innerBtnloader'></div>
                  </div> : "Save"
              }
              width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={onSave}
              disabled={isVerifyed}
            />
          }

          {screenInfo?.Update === 1 && btnStatues !== "save" &&
            <ActionButton
              buttonText={
                loader ?
                  <div className='w-full flex justify-center items-center'>
                    <div className='innerBtnloader'></div>
                  </div> : "Update"
              }
              width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={onSave}
              disabled={isVerifyed}
            />
          }

          {screenInfo?.Update !== 1 && screenInfo?.Save !== 0 && btnStatues !== "save" &&
            <ActionButton
              buttonText={loader ?
                <div className='w-full flex justify-center items-center'>
                  <div className='innerBtnloader'></div>
                </div>
                : "Save"
              }
              width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={true}
            />
          }


          <ActionButton
            buttonText={
              loader1 ?
                <div className='w-full flex justify-center items-center'>
                  <div className='innerBtnloader'></div>
                </div> :
                "Verify"
            }
            //  buttonText="Verify"
            width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={onVerify}
            disabled={isVerifyed}
          />
          {screenInfo?.Print === 1 &&
            <ActionButton
              buttonText="Print"
              width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={PrintRecord}
            />
          }
          {/* <ActionButton
              buttonText="Cancel Result"
              width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            /> */}
        </div>
      </div>
    </>
  );
};

export default ResultEnteryForm