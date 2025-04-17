"use client";
import React, { useEffect, useState } from "react";
import ResultPatientHeader from "./components/ResultPatientHeader";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ResultEnteryForm from "./components/ResultEnteryForm";
import services from "@/app/utilities/services";
import {
  getAllresultentryById,
  getDepartmentPrac,
  getLabParmDetails,
  getLabResultTemplate,
  getLabServiceDetailsByOrderId,
  getLabSpeciality,
  getPatientDetails,
  saveLabResultEntry,
  updateLabResultEntry,
  verifyLabResultEntry,
} from "@/app/utilities/api-urls";
import { useParams, useRouter } from "next/navigation";
import moment from "moment";
import { toast } from "react-toastify";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import Link from "next/link";
import { debug } from "console";
import Label from "@/app/_common/label";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

const ResultEnteryMainPage = (props: any) => {
  const { patientid, opdEncounterId, orderId } = useParams();
  const [cultureSensitivity, setCultureSensitivity] = useState<any>({
    status: false,
    organisumValue: null,
  });
  const [organisumfeilds, setOrganisumfeilds] = useState<any>([]);
  const [resultTemplate, setResultTemplate] = useState<any>("");
  const [feildsData, setFeildsData] = useState<any>([]);
  const [verifyedBy, setVerifyedBy] = useState<any>([]);
  const [isVerifyed, setIsVerifyed] = useState<any>(false);
  const [loader, setLoader] = useState<any>(false);
  const [loader1, setLoader1] = useState<any>(false);
  const [serviceInfo, setServiceInfo] = useState<any>({});
  const [serviceTemplate, setServiceTemplate] = useState<any>([]);
  const [addOrg, setAddOrg] = useState<any>([]);
  const [selectfeilds, setSelectFeilds] = useState<any>({
    equipment: "",
    reagents: "",
    pathologist: "",
  });
  let resultTemplateDetails: any = [
    { label: "test 1", value: "test 1" },
    { label: "test 2", value: "test 2" },
  ];
  const [btnStatues, setBtnStatues] = useState<any>("save");
  const [listSel, setListSel] = useState<any>({});
  const [serviceDetails, setServicedetails] = useState<any>({
    collectionId: null,
    labOrderId: "",
    orderId: "",
    serviceCode: "",
    serviceDesc: "",
    deptCode: "",
    deptDesc: "",
    specialityCode: "",
    specialityDesc: "",
    specimen: "",
    specimenCode: null,
    containerName: "",
    containerCode: "",
    accessionNum: "",
    collectionStatus: "",
    volume: "",
    site: "",
    route: "",
    mrn: "",
    encounterId: null,
    practionerName: "",
    updatedDate: null,
    generatedDate: null,
    statusFlag: 1,
    generatedBy: "",
    updatedBy: "",
    generatedId: null,
    patientName: "",
    orderDateTime: null,
    reasonForSampleRejection: "",
    outSourcedLabName: "",
    comment: "",
    receivedDate: null,
    resulEnteredDateTime: null,
  });
  const [patientData, setPatientData] = useState<any>({});
  let headers = getHeaderResponse()
  const router = useRouter()
  // getting Patient Details function
  const getPatientData = async () => {
    try {
      const data = await services.get(
        `${getPatientDetails}${patientid}/${opdEncounterId}/${orderId}`
      );
      setPatientData(data.data);
    } catch (error: any) {
      console.log(error.message)
    }

  };

  // getting Service Details function
  const getServiceDetails = () => {
    try {
      services.get(getLabServiceDetailsByOrderId + orderId).then((response) => {
        setServicedetails(response.data);
        //console.log(response.data)
        let cultureSensitivitystatus: any = response.data.isCultureSensitive === 1 ? true : false
        setCultureSensitivity({ ...cultureSensitivity, status: cultureSensitivitystatus })
        // getting after saving parmeters data by using service code and service description 
        if (response?.data?.collectionStatus === "Result Entered" || response?.data?.collectionStatus === "Result Verified") {
          services.get(
            `${getAllresultentryById}patientId=${patientid}&opdEncouterId=${opdEncounterId}&orderId=${orderId}`
          )
            .then((response: any) => {
              //let result = response.data.resultEntryItemDto
              //values set to select box new code
              let result = response.data.resultEntryItemDto.map((mainList: any, index: any) => {
                if (mainList.resultType === "list") {

                  setListSel((prev: any) => {
                    return {
                      ...prev,
                      [`sel${index}`]: {
                        label: mainList.result,
                      },
                    };
                  });
                  // If valueList is null, return the object with an empty array for valueList
                  if (mainList.listValue === null || mainList.listValue === "") {
                    return {
                      ...mainList,
                      options: []
                    };
                  } else {
                    // Otherwise, map over the valueList to create the desired structure
                    let getData = mainList?.listValue?.split(",").map((innerList: any) => {
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
                      options: getData,
                    };
                  }
                }
                // If resultType is not "list", return the object as is
                return mainList;
              });


              setFeildsData(result);
              setServiceInfo(response.data);
              setBtnStatues("update")
              setSelectFeilds(
                {
                  ...selectfeilds,
                  pathologist: response.data.verifiedBy !== null ? { label: response.data.verifiedBy } : "",
                  reagents: { label: response.data.reagentsUsed ? response.data.reagentsUsed : "Reagents Used" },
                  equipment: { label: response.data.equipment ? response.data.equipment : "Equipment" }
                });
              if (response.data.verifiedBy !== null) {
                setIsVerifyed(true)
              }
              const labCulData = changelabCulDataFun(response.data.labCultureSensitivityEntrySet)
              setAddOrg(labCulData)
              //labCultureSensitivityEntrySet

            })
            .catch((err: any) => {
              console.log(err)
            })

        }
        else {
          // getting wiout saving parmeters data by using service code and service description
          services
            .get(
              `${getLabParmDetails}serviceCode=${response.data.serviceCode}&serviceDesc=${response.data.serviceDesc}&gender=${patientData?.genderDesc}&age=${patientData?.ageOfPatient}`
            )
            .then((response) => {
              //let result = response.data.assignParameterItemSet
              //values set to select box new code
              let result = response.data.assignParameterItemSet.map((mainList: any, index: any) => {
                if (mainList.resultType === "list") {
                  // If valueList is null, return the object with an empty array for valueList
                  if (mainList.listValue === null || mainList.listValue === "") {
                    return {
                      ...mainList,
                      options: []
                    };
                  } else {
                    // Otherwise, map over the valueList to create the desired structure
                    let getData = mainList?.listValue?.split(",").map((innerList: any) => {
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
                      options: getData,
                    };
                  }
                }
                // If resultType is not "list", return the object as is
                return mainList;
              });


              setFeildsData(result);

              // setFeildsData(response.data.assignParameterItemSet ? response.data.assignParameterItemSet : []);
              setServiceInfo(response.data);
              setBtnStatues("save")
            })
            .catch((err: any) => {
              console.log(err)
            })
        }

        const changelabCulDataFun = (data: any) => {
          const transformedData = data.reduce((acc: any, item: any) => {
            let organism = acc.find((o: any) => o.organismDesc === item.organisms);
            if (!organism) {
              organism = {
                organismDesc: item.organisms,
                oraganismList: [],
                label: item.organisms,
                value: item.organisms
              };
              acc.push(organism);
            }
            organism.oraganismList.push({
              suspectibility: {
                label: item.susceptibility
              },
              id: item.id,
              organisms: item.organisms,
              micVal: item.mcValue,
              antibioticDesc: item.antiboitic,
              generatedDate: item.generatedDate,
              updatedDate: item.updatedDate,
              generatedId: item.generatedId,
              generatedBy: item.generatedBy,
              statusFlag: item.statusFlag,
              updatedBy: item.updatedBy,
              serviceEntityId: item.serviceEntityId,
              locationId: item.locationId
            });
            return acc;
          }, []);
          return transformedData;
        }

        // geeting result template function
        services
          .get(
            `${getLabResultTemplate}serviceName=${response.data.serviceDesc}&serviceCode=${response.data.serviceCode}&gender=${patientData?.genderDesc}&age=${patientData?.ageOfPatient}`
          )
          .then((response) => {
            const resultServiceTemplate = response.data.map((item: any) => ({
              ...item,
              label: item.resultTemplateName,
              value: item.resultTemplateName,
            }))
            setServiceTemplate(resultServiceTemplate)
            //resultTemplateName
          });
      });

    } catch (error: any) {
      console.log(error.message)
    }
  };


  // save function
  const onSave = () => {
    setLoader(true)
    const url = btnStatues === "save" ? saveLabResultEntry : updateLabResultEntry;
    const message = btnStatues === "save" ? "Successfully saved the record" : "Successfully updated the record";

    let combinedList = addOrg.reduce((acc: any[], list: any) => {
      return acc.concat(list.oraganismList);
    }, []);


    const addOrgData = combinedList.map((list: any) => ({
      id: list.id ? list.id : null,
      organisms: list.organismDesc,
      mcValue: list.micVal,
      antiboitic: list.antibioticDesc,
      statusFlag: 1,
      susceptibility: list.suspectibility.label,

    }))
    const resultEntryItemInfo = feildsData.map((list: any) => ({
      ...list,
      resultEntryItemId: btnStatues === "save" ? null : list.resultEntryItemId,
      parameter: list.parameter,
      result: list.result,
      units: list.units,
      refrenceRange: list.refrenceRange,
      statusFlag: 1,
      resultType: list.resultType,
      labResulEntryHeaderTbl: list.labResulEntryHeaderTbl,
      generatedDate: list.generatedDate,
      updatedDate: list.updatedDate,
      referenceRangeDto: list.referenceRangeDto,
    }))


    let postObj = {
      orderDateTime: moment(patientData.orderDate).format("yyyy-MM-DD HH:mm:ss"),
      patientName: patientData.patientName,
      labResultEnryHeaderId: btnStatues === "save" ? null : serviceInfo.labResultEnryHeaderId,
      patientId: patientid,
      opdEncouterId: opdEncounterId,
      smapleCollectionDateTime: serviceInfo.smapleCollectionDateTime,
      smapleReceviedDateTime: serviceInfo.smapleReceviedDateTime,
      specimenType: serviceInfo.specimenType,
      resulEnteredDateTime: serviceInfo.resulEnteredDateTime,
      resultVerifedDateTime: null,
      speciality: serviceInfo.speciality,
      resultEntryType: serviceInfo.resultEntryType,
      department: serviceInfo.department,
      serviceName: serviceInfo.serviceDesc,
      snomedCode: serviceInfo.snomedCode,
      orderId: patientData.orderId,
      labOrderId: patientData.labOrderId,
      departmentCode: serviceInfo.departmentCode,
      specialityCode: serviceInfo.specialityCode,
      serviceCode: serviceInfo.serviceCode,
      statusFlag: 1,
      verifiedBy: null,
      resultEntryItemDto: resultEntryItemInfo,
      labCultureSensitivityEntrySet: addOrgData,
      isCultureSensitive: addOrgData.length > 0 ? 1 : 0,
      equipment: selectfeilds.equipment.label,
      reagentsUsed: selectfeilds.reagents.label,
    };

    services.create(url, postObj, headers)
      .then((res) => {
        setTimeout(() => {
          setLoader(false)
          toast.success(message)
          setBtnStatues("update")
          getServiceDetails()
        }, 1000);

      })
      .catch((error) => {
        setLoader(false)
        console.log(error)
        toast.error("something went wrong please try again")
      })
      .finally(() => {
        setLoader(false)
      })
  };

  // getting the result template function
  const handelResultTemplate = (inputVal: any) => {
    setResultTemplate(inputVal)
    setServiceInfo(inputVal);
    let result = inputVal.labResultTemplateItemDto.map((list: any) => ({
      ...list,
      parameter: list.parameterDesc,
    }))
    setFeildsData(result);

  }

  // getting the doctor list function
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
  // on verify function
  const onVerify = () => {

    const postObj = [{
      patientName: patientData.patientName,
      patientId: patientid,
      opdEncouterId: opdEncounterId,
      orderId: patientData.orderId,
      // labOrderId: patientData.labOrderId,
      statusFlag: 1,
      labResultEnryHeaderId: serviceInfo.labResultEnryHeaderId,
      resultEntryType: "Laboratory",
      verifiedBy: selectfeilds.pathologist.label,
    }]
    if (!selectfeilds.pathologist.label) {
      toast.error("Please select the verify By")
    }
    // else if (serviceInfo?.collectionStatus !== "Result Entered") {
    //   toast.error("please save the above fields.")
    // }
    else {
      setLoader1(true)
      //verifyLabResultEntry
      services.create(verifyLabResultEntry, postObj, headers)
        .then((res) => {
          setTimeout(() => {
            setLoader1(false)
            toast.success("successfully verifyed the record")
            getServiceDetails()
          }, 1000);
        })
        .catch((error) => {
          setLoader1(false)
          console.log(error)
          toast.error("something went wrong please try again")
        })
        .finally(() => {
          setLoader1(false)
        })
    }
  }

  useEffect(() => {
    getPatientData();
    // getServiceDetails();
    handledepartmentDropdown();
  }, []);

  useEffect(() => {
    getServiceDetails();
  }, [patientData?.genderDesc, patientData?.ageOfPatient])

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>

      <div className="w-full flex justify-between">
        <div className="w-auto text-[#707070] font-bold text-[18px]">
          {cultureSensitivity.status === true
            ? "Culture & Sensitivity Result Entry"
            : "Laboratory Result Entry"}
        </div>
        <div onClick={() => router.back()}>{/* <Link href={"/lab/laboratory-worklist"}> */}
          <span className="cursor-pointer text-white  text-[14px] py-2 px-6 rounded-lg  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]" >
            Back
          </span>
        </div>
      </div>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        {/* Result Patient Header */}
        <div className="w-full mt-4">
          <ResultPatientHeader patientData={patientData} />
        </div>
        {/* Result Service Info */}
        <div className="w-full mt-4 flex gap-4">
          <div className="w-3/4">
            <strong>Service Name:</strong>
            {serviceDetails.serviceDesc}| <strong>Department:</strong>{" "}
            {serviceDetails.deptDesc} | <strong>Speciality:</strong>{" "}
            {serviceDetails.specialityDesc} | <strong>Snomed Code:</strong>
            | <strong>Collected Date & Time:</strong>{" "}
            {serviceDetails.generatedDate
              ? moment(serviceDetails.generatedDate).format("YYYY-MM-DD HH:mm")
              : ""}{" "}
            | <strong>Received Date & Time:</strong>{" "}
            {serviceDetails.receivedDate
              ? moment(serviceDetails.receivedDate).format("YYYY-MM-DD HH:mm")
              : ""}{" "}
            | <strong>Result Entered Date & Time:</strong>{" "}
            {serviceDetails.resulEnteredDateTime
              ? moment(serviceDetails.resulEnteredDateTime).format(
                "YYYY-MM-DD HH:mm"
              )
              : ""}{" "}
            | <strong>Result Verified Date & Time:</strong>
          </div>

          <div className="w-1/4">
            <ReactSelectBox
              value={resultTemplate}
              options={serviceTemplate}
              onChange={(e) => handelResultTemplate(e)}
              label="Select Result Template"
              isDisabled={isVerifyed}
            />
          </div>
        </div>

        {/* Result Form */}
        <div className="w-full mt-6 " >
          <ResultEnteryForm
            serviceDetails={serviceDetails}
            feildsData={feildsData}
            setFeildsData={setFeildsData}
            listSel={listSel}
            setListSel={setListSel}
            selectfeilds={selectfeilds}
            setSelectFeilds={setSelectFeilds}
            cultureSensitivity={cultureSensitivity}
            setCultureSensitivity={setCultureSensitivity}
            organisumfeilds={organisumfeilds}
            setOrganisumfeilds={setOrganisumfeilds}
            onSave={onSave}
            onVerify={onVerify}
            verifyedBy={verifyedBy}
            btnStatues={btnStatues}
            isVerifyed={isVerifyed}
            addOrg={addOrg}
            setAddOrg={setAddOrg}
            loader={loader}
            loader1={loader1}
            setLoader={setLoader}
            patientData={patientData}
            screenInfo={props?.screenData}
          />
        </div>
      </div>
    </>
  );
};

export default roleInfoScreenData(ResultEnteryMainPage, "LRE")