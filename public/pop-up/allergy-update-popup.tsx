import React, { useEffect, useState } from "react";
import { getLocalItem, setLocalItem } from "@/app/utilities/local";
import moment from "moment";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";
import services from "@/app/utilities/services";
import { useParams } from "next/navigation";
import Select from "react-tailwindcss-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getActivityCaptureTime,
  getAllDepartments,
  getPatientDetails,
  timer,
} from "@/app/utilities/api-urls";

import {
  getMasterLinkDataList,
  getOPEmrData,
  saveOPEmr,
  snowmedData,
  getConfigData,
} from "@/app/utilities/api-urls";
import axios from "axios";
import AlertCustomAnimation from "@/app/_common/new-alert";
import Loader from "@/app/_common/loader";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { ReactSelectBox } from "@/app/_commonfeatures";

export default function AllergyUpdate(props: any) {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [startTimer, setStartTimer] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [currTime, setCurrTime] = useState("");
  const [startTime, setStartTime] = useState<any>("");
  const [endTime, setEndTime] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [saveallergy, setSaveAllergy] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [allergySearchVal, setAllergySearchVal] = useState<any>("");
  const [updateallergySearchVal, setUpdateAllergySearchVal] = useState<any>("");
  const [updateallergyTypeVal, setUpdateallergyTypeVal] = useState<any>("");
  const [updateallergyCategoryVal, setUpdateallergyCategoryVal] =
    useState<any>("");
  const [updateallergySeverityVal, setUpdateallergySeverityVal] =
    useState<any>("");
  const [updateallergyCriticalityVal, setUpdateallergyCriticalityVal] =
    useState<any>("");

  const [updateallergyClinicalStatusVal, setUpdateallergyClinicalStatusVal] =
    useState<any>("");
  const [
    updateallergyVerificationStatusVal,
    setUpdateallergyVerificationStatusVal,
  ] = useState<any>("");
  const [substancedata, setSubstancedata] = useState([]);
  const [allergiesData2, setAllergiesData2] = useState<any>([
    {
      id: "",
      allergyType: "",
      allergy: "",
      allergyCode: "",
      allergyDesc: "",
      substance: "",
      reactionSeverity: "",
    },
  ]);


  const [patientData, setPatientData] = useState<any>();

  const [allergiesData1, setAllergiesData1] = useState([
    {
      id: "",
      emrID: "",
      patientId: "",
      opdEncounterId: "",
      emrData: {
        patientId: "",
        opdEncounterId: "",
        emrID: "",
        emrData: [
          {
            assessmentForm: [
              {
                allergeis: [],
              },
            ],
          },
        ],
        id: "",
      },
    },
  ]);
  const [allergySearchData, setAllergySearchData] = useState([]);
  const [allergySubstanceVal, setAllergySubstanceVal] = useState<any>("");
  const [updateAllergySubstanceVal, setUpdateAllergySubstanceVal] =
    useState<any>("");

  const [allergySubstanceMain, setAllergySubstanceMain] = useState<any>([]);
  const [allergyReactionVal, setAllergyReactionVal] = useState<any>("");
  const [updateAllergyReactionVal, setupdateAllergyReactionVal] =
    useState<any>("");

  const [reactionData, setReactionData] = useState([]);
  const [reactionDataMain, setReactionDataMain] = useState<any>([]);
  const headers = getHeaderResponse()

  const [allergyTypeList, setAllergyTypeList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [allergySeverityList, setallergySeverityList] = useState<any>([]);
  const [criticalityList, setCriticalityList] = useState<any>([]);
  const [clinicalStatusList, setClinicalStatusList] = useState<any>([]);
  const [verificationstatusList, setVerificationstatusList] = useState<any>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  // allergiesFields
  const [allergiesField, setAllergiesField] = useState<any>({
    id: "",
    type: "",
    category: "",
    allergysearch: "",
    substance: "",
    reaction: "",
    criticality: "",
    reactionSeverity: "",
    clinicalStatus: "",
    verificationStatus: "",
  });


  const { mrn, encouterId } = useParams();
  const { patientid, opdEncounterId } = useParams();
  const [EMRData, setEMRData] = useState<any>({
    patientId: null,
    opdEncounterId: null,
    emrID: null,
    emrData: [
      {
        assessmentForm: [
          {
            hpi: [],
            physicalExamination: [],
            painScreening: [],
            ros: [],
            allergeis: [
              {
                id: "",
                allergyType: "",
                allergyDesc: "",
                reaction: " ",
                substance: "",
                reactionSeverity: " ",
                criticality: "",
                clinicalStatus: "",
                verificationStatus: "",
              },
            ],
            diagnosis: [],
            serviceOrders: [],
            cheifComaplaints: [],
            vitals: [],
            pfsh: [],
            clinicalConditions: [],
            treatmentPlan: [],
          },
        ],
      },
    ],
  });

  const [field, setField] = useState<any>({
    id: props.data.id,
    type: props.data.type,
    category: props.data.category,
    allergysearch: props.data.allergysearch,
    substance: props.data.substance,
    reaction: props.data.reaction,
    criticality: props.data.criticality,
    reactionSeverity: props.data.reactionSeverity,
    clinicalStatus: props.data.clinicalStatus,
    verificationStatus: props.data.verificationStatus, 
  });

  const inputHandler = (e: any) => {
    setField({
      ...field,
      id: props.data.id,
      date: moment(new Date().toLocaleString()).format(
        "MMMM Do YYYY, h:mm:ss a"
      ),
      recordedBy: props.data.recordedBy,
      [e.target.name]: e.target.value,
    });
  };
  //-----------------------------Update Function-------------------------------------
  
  
  const [updateLoader,setUpdateLoader]=useState<any>(false)
  const onSubmit = () => {
    setUpdateLoader(true)
    const newData = {
      id: props.data.id,
      type: updateallergyTypeVal.label,
      category: updateallergyCategoryVal.label,
      substance: updateAllergySubstanceVal.label,
      allergysubsnomedcode: updateAllergySubstanceVal.id,
      reaction: updateAllergyReactionVal.label,
      allergyreactionsnomedcode: updateAllergyReactionVal.id,
      criticality: updateallergyCriticalityVal.label,
      reactionSeverity: updateallergySeverityVal.label,
      clinicalStatus: updateallergyClinicalStatusVal.label,
      verificationStatus: updateallergyVerificationStatusVal.label,
      recordedBy: props.data.recordedBy,
      date: props.data.date,
    };

    const index = saveallergy.findIndex(
      (idToFind: any) => idToFind.id === props.data.id
    );

    let emrDataSub = EMRData.emrData[0].assessmentForm[0];
    saveallergy.splice(index, 1, newData);
    let postObj = {
      id: EMRData.id,
      emrID: getLocalItem("emrID"),
      patientId: Number(patientid),
      opdEncounterId: Number(opdEncounterId),
      emrData: [
        {
          assessmentForm: [
            {
              cheifComaplaints: emrDataSub.cheifComaplaints,
              hpi: emrDataSub.hpi,
              ros: emrDataSub.ros,
              pfsh: emrDataSub.pfsh,
              vitals: emrDataSub.vitals,
              allergeis: saveallergy,
              physicalExamination: emrDataSub.physicalExamination,
              diagnosis: emrDataSub.diagnosis,
              clinicalConditions: emrDataSub.clinicalConditions,
              painScreening: emrDataSub.painScreening,
              treatmentPlan: emrDataSub.treatmentPlan,
              serviceOrders: emrDataSub.serviceOrders,
              reasonForVisit: emrDataSub.reasonForVisit,
            },
          ],
        },
      ],
    };

    setLoading(true);
    services
      .create(saveOPEmr, postObj, headers)
      .then((response) => {
        setTimeout(() => {
          setLoading(false);
          setUpdateLoader(false)
          toast.success("Updated Successfully");
          props.getAllergiesData();
        }, 2000)
       
      })
      .catch((err) => {
        setTimeout(() => {
            console.log(err);
            setUpdateLoader(false)
        toast.error(`${err.response.data.statusMessage?err.response.data.statusMessage:err.message}`);
        }, 2000);
      });

  };

  useEffect(() => {
    setSelectedRowId(props.selectedRowId);
    services
      .get(getOPEmrData + patientid + "/" + opdEncounterId)
      .then((response: any) => {
        setEMRData(response.data);

        setSaveAllergy(response.data.emrData[0].assessmentForm[0].allergeis);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    setLoading(true);

    services
      .get(getConfigData + "AllergyIntoleranceType" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setAllergyTypeList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    services
      .get(getConfigData + "AllergyIntoleranceCategory" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setCategoryList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    services
      .get(getConfigData + "AllergyIntoleranceSeverity" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setallergySeverityList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    services
      .get(getConfigData + "AllergyIntoleranceCriticality" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setCriticalityList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    services
      .get(getConfigData + "AllergyIntoleranceClinicalStatusCodes" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setClinicalStatusList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    services
      .get(getConfigData + "AllergyIntoleranceVerificationStatusCodes" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          value: item.id,
          label: item.display,
          code: item.code,
          display: item.display,
          id: item.id,
          readOnly: item.readOnly,
          statusFlag: item.statusFlag,
        }));
        setVerificationstatusList(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    axios
      .get(snowmedData + "416098002")
      .then((response) => {
        const result = response.data.map((item: any) => ({
          value: item.id,
          label: item.fullySpecifiedName,
          activeStatus: 1,
          definitionStatusId: item.definitionStatusId,
          effectiveTime: item.effectiveTime,
          fullySpecifiedName: item.fullySpecifiedName,
          id: item.id,
          moduleId: item.moduleId,
        }));
        setLoading(false);
        setAllergySearchData(result);
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err.message);
      });

    axios
      .get(snowmedData + "105590001")
      .then((response) => {
        const result = response.data.map((item: any) => ({
          value: item.id,
          label: item.fullySpecifiedName,
          activeStatus: 1,
          definitionStatusId: item.definitionStatusId,
          effectiveTime: item.effectiveTime,
          fullySpecifiedName: item.fullySpecifiedName,
          id: item.id,
          moduleId: item.moduleId,
        }));
        setSubstancedata(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    axios
      .get(snowmedData + "404684003")
      .then((response) => {
        const result = response.data.map((item: any) => ({
          value: item.id,
          label: item.fullySpecifiedName,
          activeStatus: 1,
          definitionStatusId: item.definitionStatusId,
          effectiveTime: item.effectiveTime,
          fullySpecifiedName: item.fullySpecifiedName,
          id: item.id,
          moduleId: item.moduleId,
        }));
        setReactionData(result);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });

    setAllergiesData2([]);
    // fetchAllergies();

    setUpdateallergyTypeVal({
      label: props.data.type,
      value: props.data.type,
    });

    setUpdateallergyCategoryVal({
      label: props.data.category,
      value: props.data.category,
    });

    setUpdateallergySeverityVal({
      label: props.data.reactionSeverity,
      value: props.data.reactionSeverity,
    });

    setUpdateallergyCriticalityVal({
      label: props.data.criticality,
      value: props.data.criticality,
    });
    setUpdateallergyClinicalStatusVal({
      label: props.data.clinicalStatus,
      value: props.data.clinicalStatus,
    });
    setUpdateallergyVerificationStatusVal({
      label: props.data.verificationStatus,
      value: props.data.verificationStatus,
    });

    setAllergySearchVal({
      label: props.data.allergysearch,
      value: props.data.allergysearch,
    });

    setUpdateAllergySearchVal({
      label: props.data.allergysearch,
      value: props.data.allergysearch,
    });

    setAllergySubstanceVal({
      label: props.data.substance,
      value: props.data.substance,
    });

    setUpdateAllergySubstanceVal({
      label: props.data.substance,
      value: props.data.substance,
    });

    setAllergyReactionVal({
      label: props.data.reaction,
      value: props.data.reaction,
    });

    setupdateAllergyReactionVal({
      label: props.data.reaction,
      value: props.data.reaction,
    });

    if (updateallergyTypeVal) {
      setValue("allergyType", updateallergyTypeVal.value);
    }
  }, [field, props.data, props.selectedRowId]);

  const handleSubstanceInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    var result: any;
    const inputValue = e.target.value;
    if (inputValue.length >= 3) {
      result = substancedata.filter((item: any) =>
        item.label.includes(inputValue)
      );
    }

    setAllergySubstanceMain(result);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    var result: any;
    const inputValue = e.target.value;
    if (inputValue.length >= 3) {
      result = reactionData.filter((item: any) =>
        item.label.includes(inputValue)
      );
    }
    setReactionDataMain(result);
  };


  console.log('update', props.data)
  
  const getPatientData = async () => {
    const patId = patientid !== undefined ? patientid : mrn;
    const encId = opdEncounterId !== undefined ? opdEncounterId : encouterId;
    const data = await services.get(
      getPatientDetails + patId + "/" + encId
    );
    const deportmentData: any = await services.get(getAllDepartments);

    setPatientData(data.data);
    props.setData({mobileNumber:data.data.primaryContactNum})
    setLocalItem("gender",data.data.genderDesc.toLowerCase())
    const department = deportmentData.data.filter(
      (list: any) => list.departmentCode === data.data.department
    );
    setDepartmentName(department[0].departmentDescription);
  };

  const startTimerFun = () => {
    setTimerRunning(true);
    let obj = {
      patientId: patientid,
      activityByRole: "doctor activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 1,
      activityTransaction: "emr",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setStartTimer(false);
        props.setDisable(false);
        setStartTime(moment().format("DD-MM-YYYY HH:mm"));
        toast.success("Start time saved successfully");
        getTime();
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Technical error in saving capture time");
      });
  };
  const stopTimerFun = () => {
    setTimerRunning(false);
    setStartTimer(true);
    let obj = {
      patientId: patientid,
      activityByRole: "doctor activity",
      opdEncounterId: opdEncounterId,
      time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      isTimeStart: 0,
      activityTransaction: "emr",
    };
    services
      .create(timer, obj)
      .then((response) => {
        setEndTime(moment(obj.time).format("DD-MM-YYYY HH:mm"));
        toast.success("End Time Saved Successfully");
        getTime();
      })
      .catch((error) => {
        console.log(error.message);
        toast.error("Technical error in capturing end time");
      });
  };

  const getTime = () => {
    services
      .get(getActivityCaptureTime + patientid + "/" + opdEncounterId)
      .then((response) => {
        if (response.data.length > 0) {
          const filteredData = response.data.filter(
            (item: any) => item.activityByRole === "doctor activity"
          );
          if (filteredData.length > 0) {
            let data = filteredData[0];
            if (data.startTime != null && data.endTime != null) {
              setShowTimer(false);
              setStartTime(moment(data.startTime).format("DD-MM-YYYY HH:mm"));
              setEndTime(moment(data.endTime).format("DD-MM-YYYY HH:mm"));
              props.setDisable(false);
            } else if (data.startTime != null && data.endTime == null) {
              setStartTime(moment(data.startTime).format("DD-MM-YYYY HH:mm"));
              setShowTimer(true);
              setStartTimer(false);
              props.setDisable(false);
            } else {
              setShowTimer(true);
              setStartTimer(true);
              props.setDisable(true);
            }
          } else {
            setStartTimer(true);
            setShowTimer(true);
            props.setDisable(true);
          }
        } else {
          setStartTimer(true);
          setShowTimer(true);
          props.setDisable(true);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getPatientData();
    getTime();
  }, []);
  return (
    <div>
      <div className="flex">
      <div className="bg-gray-200 w-full py-1 px-3 text-sm text-blue-600 rounded-lg ">
       <span className="capitalize">
            {patientData?.middleName} | {patientData?.mrn} |{" "}
            {patientData?.genderDesc} | {patientData?.ageOfPatient}{" "}
            {patientData?.healthId ? "|" : ""} {patientData?.healthId}{" "}
            {patientData?.abhaAddress ? "|" : ""} {patientData?.abhaAddress}
          </span>
        </div>
        </div>

      <div className="flex">
      <div className="bg-gray-200 w-full py-1 px-3 text-sm text-blue-600 rounded-lg my-2">
      <span className="capitalize">
            {patientData?.opdEncounterNo} |{" "}
            {moment(patientData?.opdEncounterTime).format("DD-MM-YYYY HH:mm")} |{" "}
            {patientData?.visitType ? patientData?.visitType : "New Visit"}{" "}
            {departmentName ? "|" : ""} {departmentName}{" "}
            {patientData?.doctor ? "|" : ""} {patientData?.doctor}
        </span>
        </div>
        </div>
      
      <div className="block">
        <ToastContainer />

        {alertMsg ? (
          <div>
            <AlertCustomAnimation
              message={message}
              color={alertColor}
              setAlertMsg={setAlertMsg}
            />
          </div>
        ) : null}
        {loading ? <Loader /> : ""}

        
        <div className="px-4 bg-white rounded-curve md:pt-3 mb-4 rounded-curve mx-auto w-full border border-stroke">
          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2 my-select relative">
              <ReactSelectBox
                value={updateallergyTypeVal}
                options={allergyTypeList}
                onChange={(e: any) => {
                  setAllergiesField({ ...allergiesField, type: e.label });
                  setUpdateallergyTypeVal(e);
                }
                }
                label="Type"
              />
             
              {/* <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateallergyTypeVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Type
              </label> */}
            </div>
            <div className="md:w-1/4 px-3 my-2 relative">
              <ReactSelectBox
               value={updateallergyCategoryVal}
               options={categoryList}
               onChange={(e: any) => {
                 setAllergiesField({ ...allergiesField, category: e.label });
                 setUpdateallergyCategoryVal(e);
                }}
                label="category"
              />
              {/* <Select
                placeholder="category"
                primaryColor="blue"
                value={updateallergyCategoryVal}
                options={categoryList}
                onChange={(e: any) => {
                  setAllergiesField({ ...allergiesField, category: e.label });
                  setUpdateallergyCategoryVal(e);
                }}
              /> */}
              {/* <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateallergyCategoryVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Category
              </label> */}
            </div>
            <div className="md:w-1/4 px-3 my-2 my-select relative">
              <ReactSelectBox
              
              value={updateAllergySubstanceVal}
              options={allergySubstanceMain}
              isSearchable={true}
              onSearchInputChange={(e: any) => handleSubstanceInputChange(e)}
              onChange={(e: any) => {
                setUpdateAllergySubstanceVal(e);
                }}
                label="Allergy"
              />
              {/* <Select
                classNames={{
                  menuButton: ({ isDisabled }: any) =>
                    `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                    duration-300 focus:outline-none 
                   
                    ${isDisabled
                      ? "bg-blue-gray-200"
                      : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                    }`,

                  menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                      ? `text-white bg-blue-500`
                      : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                    }`,
                }}
                placeholder="Allergy"
                primaryColor="blue"
                value={updateAllergySubstanceVal}
                options={allergySubstanceMain}
                isSearchable={true}
                onSearchInputChange={(e: any) => handleSubstanceInputChange(e)}
                onChange={(e: any) => {
                  setUpdateAllergySubstanceVal(e);
                }}
              /> */}
              {/* <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateAllergySubstanceVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Allergy
              </label> */}
            </div>
            <div className="md:w-1/4 px-3 my-2 my-select relative">
              <ReactSelectBox
                value={updateAllergyReactionVal}
                options={reactionDataMain}
                isSearchable={true}
                onSearchInputChange={(e: any) => handleInputChange(e)}
                onChange={(e: any) => {
                  setupdateAllergyReactionVal(e);
                }}
                label="Reaction"
              />
              {/* <Select
                classNames={{
                  menuButton: ({ isDisabled }: any) =>
                    `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                    duration-300 focus:outline-none 
                   
                    ${isDisabled
                      ? "bg-blue-gray-200"
                      : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                    }`,
                  menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                  listItem: ({ isSelected }: any) =>
                    `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                      ? `text-white bg-blue-500`
                      : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                    }`,
                }}
                placeholder="Reaction"
                primaryColor="blue"
                value={updateAllergyReactionVal}
                options={reactionDataMain}
                isSearchable={true}
                onSearchInputChange={(e: any) => handleInputChange(e)}
                onChange={(e: any) => {
                  setupdateAllergyReactionVal(e);
                }}
              /> */}

              {/* <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateAllergyReactionVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Reaction
              </label> */}
            </div>
          </div>

          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2 my-select relative">
              <ReactSelectBox
                label="verificationStatus"
                value={updateallergyVerificationStatusVal}
                options={verificationstatusList}
                onChange={(e: any) => {
                  setAllergiesField({
                    ...allergiesField,
                    verficationStatus: e.label,
                  });
                  setUpdateallergyVerificationStatusVal(e);
                }}
              />
              {/* <Select
                placeholder="verificationStatus"
                primaryColor="blue"
                value={updateallergyVerificationStatusVal}
                options={verificationstatusList}
                onChange={(e: any) => {
                  setAllergiesField({
                    ...allergiesField,
                    verficationStatus: e.label,
                  });
                  setUpdateallergyVerificationStatusVal(e);
                }}
              /> */}
              {/* <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateallergyVerificationStatusVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Verification Status
              </label> */}
            </div>
            <div className="md:w-1/4 px-3 my-2 relative">
              <ReactSelectBox
                  value={updateallergySeverityVal}
                  options={allergySeverityList}
                  onChange={(e: any) => {
                    setAllergiesField({
                      ...allergiesField,
                      reactionSeverity: e.label,
                    });
                    setUpdateallergySeverityVal(e);
                }}
                label="reactionSeverity"
              />
              {/* <Select
                placeholder="reactionSeverity"
                primaryColor="blue"
                value={updateallergySeverityVal}
                options={allergySeverityList}
                onChange={(e: any) => {
                  setAllergiesField({
                    ...allergiesField,
                    reactionSeverity: e.label,
                  });
                  setUpdateallergySeverityVal(e);
                }}
              />
              <label
                style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                className={`${updateallergySeverityVal?.label !== undefined
                  ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[25px]"
                  : "text-sm opacity-0 top-10 "
                  } truncate cursor-default select-none  absolute transition-all`}
              >
                Severity
              </label> */}
            </div>
            <div className="md:w-1/4 px-3 my-2 relative">
              <ReactSelectBox
                value={updateallergyCriticalityVal}
                options={criticalityList}
                onChange={(e: any) => {
                  setAllergiesField({
                    ...allergiesField,
                    criticality: e.label,
                  });
                  setUpdateallergyCriticalityVal(e);
                }}
                label="criticality"
              />
            
            </div>
            <div className="md:w-1/4 px-3 my-2 relative">
              <ReactSelectBox
               value={updateallergyClinicalStatusVal}
               options={clinicalStatusList}
               onChange={(e: any) => {
                 setAllergiesField({
                   ...allergiesField,
                   clinicalStatus: e.label,
                 });
                 setUpdateallergyClinicalStatusVal(e);
                }}
                label="clinicalStatus"
              />
            </div>
          </div>

          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2 relative"></div>
          </div>
          <div className="-mx-3 md:flex py-2 justify-end">
            <div className="flex justify-end items-center gap-x-3 m-3">
              <ActionButton
                 buttonText={
                  updateLoader ?
                      <div className='w-full flex justify-center items-center'>
                          <div className='innerBtnloader'></div>
                      </div> :
                      "UPDATE"
              }
               
                handleSubmit={handleSubmit(onSubmit)}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
