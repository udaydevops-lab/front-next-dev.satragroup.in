"use client";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-tailwindcss-select";
import ActionButton from "../_common/button";
import services from "../utilities/services";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  getConfigData,
  getOPEmrData,
  saveOPEmr,
  snowmedChiefcomplaint,
  snowmedData,
} from "../utilities/api-urls";
import { getLocalItem } from "../utilities/local";
import Loader from "../_common/loader";
import AlertCustomAnimation from "../_common/new-alert";
import axios from "axios";
import { DialogueBox } from "../_common/graph";
import AllergyUpdate from "../../../public/pop-up/allergy-update-popup";
import { useParams } from "next/navigation";
import moment from "moment";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import { getHeaderResponse } from "../_commonfeatures/header";
import NoScreenData from "../_common/NoScreenData";
import roleInfoScreenData from "../_commonfeatures/ScreenDataHoc";
import ReactCommonDialog from "../_commonfeatures/ReactCommonDialog";
import { ReactSelectBox } from "../_commonfeatures";
import TransitionAlerts from "../_common/alert-message";
import { Alert } from "@mui/material";
// export default function Allergies(props: any) {
const Allergies = (props: any) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [alertMsg, setAlertMsg] = useState(false);
  const [allergyPopup, setAllergyPopup] = useState<any>({
    popup: false
  });
  const [pathParams, setPathParams] = useState(props.data);
  const [substancedata, setSubstancedata] = useState<any>([]);
  const [message, setMessage] = useState("");
  const [alertColor, setAlertColor] = useState("");
  const [loading, setLoading] = useState(false); // after work should be true
  const [allergyTypeVal, setAllergyTypeVal] = useState<any>("");
  const [allergyTypeValid, setAllergyTypeValid] = useState(true);
  const [allergyCategoryVal, setAllergyCategoryVal] = useState<any>("");
  const [allergySeverityVal, setAllergySeverityVal] = useState<any>("");
  const [allergyCriticalityVal, setAllergyCriticalityVal] = useState<any>("");
  const [allergyClinicalStatusVal, setAllergyClinicalStatusVal] = useState<any>("");
  const [allergyVerificationStatusVal, setAllergyVerificationStatusVal] =
    useState<any>("");
  const [allergySearchData, setAllergySearchData] = useState<any>([]);
  const [allergySearchVal, setAllergySearchVal] = useState<any>("");
  const [allergySubstanceVal, setAllergySubstanceVal] = useState<any>(""
   
  );
  const [allergySubstanceMain, setAllergySubstanceMain] = useState<any>([]);
  const [allergyReactionVal, setAllergyReactionVal] = useState<any>(""
  );
  const [reactionData, setReactionData] = useState<any>([]);
  const [reactionDataMain, setReactionDataMain] = useState<any>([]);
  const [saveallergy, setSaveAllergy] = useState<any>([]);

  const [allergiesData2, setAllergiesData2] = useState<any>([
    {
      id: "",
      allergyType: "",
      recordedBy: "",
      date: "",
      allergy: "",
      allergyCode: "",
      allergyDesc: "",
      substance: "",
      reactionSeverity: "",
    },
  ]);

  const fetchAllergies = () => {
    setLoading(true);
    services.get(getOPEmrData + getLocalItem("emrID")).then((response) => {
      setLoading(false);
    });
    setLoading(false);
  };

  const [allergyTypeList, setAllergyTypeList] = useState<any>([]);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [reactionSeverityList, setReactionSeverityList] = useState<any>([]);
  const [criticalityList, setCriticalityList] = useState<any>([]);
  const [clinicalStatusList, setClinicalStatusList] = useState<any>([]);
  const [verificationstatusList, setVerificationstatusList] = useState<any>([]);
  const getAllergiesData = () => {
    services
      .get(getOPEmrData + patientid + "/" + opdEncounterId)
      .then((response: any) => {
        setEMRData(response.data);
        // // setRfvData(response.data.vitals);
        let getAllergiesData: any[] =
          response.data.emrData[0].assessmentForm[0] &&
            response.data.emrData[0].assessmentForm[0].allergeis
            ? response.data?.emrData[0]?.assessmentForm[0]?.allergeis
            : [];
        setSaveAllergy(getAllergiesData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  // const handleAllergySearch = async (e: any) => {
  //   const semantic = "finding";
  //   const searchData = e.target.value;
  //   if (searchData.length >= 2) {
  //     const response = await axios.get(
  //       snowmedChiefcomplaint +
  //       `term=${searchData}&state=active&semantictag=${semantic}&acceptability=synonyms&returnlimit=100&refsetid=null&parentid=null&fullconcept=false`
  //     );
  //     const result = response.data.map((item: any) => ({
  //       value: item.id,
  //       label: item.conceptFsn,
  //       conceptFsn: item.conceptFsn,
  //       conceptId: item.conceptId,
  //       term: item.term,
  //       id: item.id,
  //     }));
  //     setAllergySearchData(result);
  //   }
  // };

  const getAllergySubstanceSnomedData = async () => {
    try {
      const [
        apiName1,
        apiName2,
        apiName3,
        apiName4,
        apiName5,
        apiName6,
        apiName7,
        apiName8,
        apiName9,
      ]: any = await Promise.all([
        services.get(snowmedData + "373873005"),
        services.get(snowmedData + "29736007"),
        services.get(snowmedData + "716186003"),
        services.get(snowmedData + "418038007"),
        services.get(snowmedData + "267425008"),
        services.get(snowmedData + "340519003"),
        services.get(snowmedData + "190753003"),
        services.get(snowmedData + "413427002"),
      ]);

      let result = [
        ...apiName1.data,
        ...apiName2.data,
        ...apiName3.data,
        ...apiName4.data,
        ...apiName5.data,
        ...apiName6.data,
        ...apiName7.data,
        ...apiName8.data,
        ...apiName9.data,
      ];
      const finalResult = result.map((item: any) => ({
        value: item.id,
        label: item.fullySpecifiedName,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setSubstancedata(finalResult);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns1: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      renderCell: (params) => {
        const rowNumber = saveallergy && saveallergy.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "date", headerName: "Date Time", width: 240 },
    { field: "recordedBy", headerName: "Recorded By", width: 120 },
    { field: "type", headerName: "Type", width: 110 },
    { field: "category", headerName: "Category", width: 100 },
    { field: "substance", headerName: "Substance ", width: 130 },
    { field: "reaction", headerName: "Reaction", width: 80 },
    { field: "criticality", headerName: "Criticality", width: 80 },
    { field: "reactionSeverity", headerName: "Severity", width: 80 },
    { field: "clinicalStatus", headerName: "Clinical Status", width: 120 },
    {
      field: "verificationStatus",
      headerName: "Verification Status ",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <>
          {props?.screenData?.Update === 1 && props?.screenData?.Update === 1 ?
            <button
              style={{ marginRight: 10 }}
              onClick={() => onEdit1(params.row)}
            >
              <DialogueBox
                icon={<PencilIcon className="text-blue-500 w-5 h-5" />}
                content={
                  <AllergyUpdate
                    setAllergiesField={setAllergiesField}
                    allergyTypeList={allergyTypeList}
                    categoryList={categoryList}
                    reactionSeverityList={reactionSeverityList}
                    criticalityList={criticalityList}
                    clinicalStatusList={clinicalStatusList}
                    verificationstatusList={verificationstatusList}
                    allergiesField={allergiesField}
                    data={params.row}
                    fetchAllergies={fetchAllergies}
                    getAllergiesData={getAllergiesData}
                  />
                }
                size="xl"
              />
            </button>
            :
            <PencilIcon className="text-blue-500 w-5 h-5" onClick={() => toast.error("You don't have permission. Please contact the admin.")} />
          }
        </>
      ),
    },
  ];

  const onDelete = (params: any) => {
    let deleteData = allergiesData2.filter(
      (item: any) => item.id !== params.id
    );
    setAllergiesData2(deleteData);
  };

  const columns2: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 80,
      renderCell: (params) => {
        const rowNumber = allergiesData2.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "type", headerName: "Type", width: 80 },
    { field: "category", headerName: "Category", width: 110 },
    { field: "substance", headerName: "Substance", width: 180 },
    { field: "reaction", headerName: "Reaction", width: 180 },
    { field: "reactionSeverity", headerName: "Severity ", width: 80 },
    { field: "criticality", headerName: "Criticality", width: 80 },
    { field: "clinicalStatus", headerName: "Clinical Status", width: 120 },
    {
      field: "verificationStatus",
      headerName: "Verification Status",
      width: 130,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params: any) => (
        <>
          <button onClick={() => onDelete(params.row)}>
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </>
      ),
    },
  ];

  const headers = getHeaderResponse()

  const getEmpLoginName: any = JSON.parse(getLocalItem("loginResponse")!);

  const handleAdd = () => {
    if (!allergyTypeVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }
     else if (!allergyCategoryVal) {
      toast.error("Please Enter All the Dropdown Fields");
    } else if (!allergyReactionVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }else if (!allergySearchVal && !allergySubstanceVal) {
      toast.error(
        " Please Enter All the Dropdown Fields"
      );
    }else if (!allergySeverityVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }else if (!allergyCriticalityVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }
    else if (!allergyClinicalStatusVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }
    else if (!allergyVerificationStatusVal) {
      toast.error("Please Enter All the Dropdown Fields");
    }
    else {
      const selectedAllergy = allergySearchVal;
      setAllergiesData2([
        ...allergiesData2,
        {
          ...allergiesField,
          id: Math.random(),
          recordedBy: getEmpLoginName.employeename,
          // allergysearch: selectedAllergy.label,
          // allergysnomedcode: selectedAllergy.id,
          substance: allergySubstanceVal.label,
          allergysubsnomedcode: allergySubstanceVal.id,
          reaction: allergyReactionVal.label,
          allergyreactionsnomedcode: allergyReactionVal.id,
          date: moment(new Date().toLocaleString()).format("YYYY-MM-DD"),
        },
      ]);

      setAllergyTypeVal("");
      setAllergyCategoryVal("");
      setAllergySearchVal("");
      setAllergySubstanceVal("");
      setAllergyReactionVal("");
      setAllergySeverityVal("");
      setAllergyCriticalityVal("");
      setAllergyClinicalStatusVal("");
      setAllergyVerificationStatusVal("");
    }
  };

  const { patientid, opdEncounterId } = useParams(); // will change to emrid to opdEncounterid
  // const dataParam = useParams(); // will change to emrid to opdEncounterid

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
    // id: 10211,
  });

  const onEdit1 = (data: any) => {
    setAllergiesField(data);
  };

  const onSubmit = (data: any, index: any) => {
    if (!allergyTypeVal) {
      setAllergyTypeValid(false);
      // Optionally, you can display an error message or take other actions
    } else {
      // Proceed with your form submission logic
    }
    setLoading(true);
    var postObj: { [k: string]: any } = {};
    let emrDataSub = EMRData.emrData[0].assessmentForm[0];
    let getNewData = [...saveallergy, ...allergiesData2];
    if (EMRData.emrID != null) {
      postObj = {
        id: EMRData.id,
        sno: index + 1,
        emrID: EMRData.emrID,
        patientId: EMRData.patientId,
        opdEncounterId: EMRData.opdEncounterId,
        emrData: [
          {
            assessmentForm: [
              {
                cheifComaplaints: emrDataSub.cheifComaplaints,
                hpi: emrDataSub.hpi,
                ros: emrDataSub.ros,
                pfsh: emrDataSub.pfsh,
                vitals: emrDataSub.vitals,
                reasonForVisit: emrDataSub.reasonForVisit,
                allergeis: getNewData && getNewData,
                physicalExamination: emrDataSub.physicalExamination,
                diagnosis: emrDataSub.diagnosis,
                clinicalConditions: emrDataSub.clinicalConditions,
                painScreening: emrDataSub.painScreening,
                treatmentPlan: emrDataSub.treatmentPlan,
                serviceOrders: emrDataSub.serviceOrders,
              },
            ],
          },
        ],
      };
    } else {
      postObj = {
        id: null, // "10017",
        emrID: null,
        patientId: patientid, // "174",
        opdEncounterId: opdEncounterId, // getLocalItem("opdEncounterId")!, // "184"

        emrData: [
          {
            assessmentForm: [
              {
                hpi: [],
                painScreening: [],
                allergeis: allergiesData2 && allergiesData2,
                diagnosis: [],
                cheifComaplaints: [],
                physicalExamination: [],
                ros: [],
                serviceOrders: [],
                reasonForVisit: [],
                vitals: [],
                pfsh: [],
                clinicalConditions: [],
                treatmentPlan: [],
              },
            ],
          },
        ],
      };
    }
    setLoading(true);

    services
      .create(saveOPEmr, postObj, headers)
      .then((response) => {
        setLoading(false);
        toast.success("Saved Successfully!");
        getAllergiesData();
        setAllergiesData2([]);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

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

  const handleInputChange = useMemo(() => (e: React.ChangeEvent<HTMLInputElement>) => {
    var result: any;
    const inputValue = e.target.value.toLowerCase();
    if (inputValue.length >= 3) {
      result = reactionData.filter((item: any) =>
        item.label.toLowerCase().includes(inputValue)
      );
    }

    setReactionDataMain(result);
  }, [reactionData, reactionDataMain])

  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   var result: any;
  //   const inputValue = e.target.value.toLowerCase();
  //   if (inputValue.length >= 3) {
  //     result = reactionData.filter((item: any) =>
  //       item.label.toLowerCase().includes(inputValue)
  //     );
  //   }

  //   setReactionDataMain(result);
  // };

  const expectedResponse = "ExpectedResponse";


  const handleSubstanceInputChange = useMemo(() => async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value)
    let conceptid: any = `conceptid1=716186003&conceptid2=418038007&conceptid3=267425008&conceptid4=29736007&conceptid5=340519003&conceptid6=190753003&conceptid7=413427002`;
    let symenticVal = `finding++situation++disorder`;
    if (e.target.value.length >= 2) {
      await services
        .get(
          snowmedChiefcomplaint +
          `term=${e.target.value}&state=active&semantictag=${symenticVal}&acceptability=synonyms&returnlimit=200&refsetid=null&parentid=null&fullconcept=false&${conceptid}`
        )
        .then((res: any) => {
          let finalData: any = res.data.map((list: any) => {
            return {
              ...list,
              value: list.conceptId,
              label: list.conceptFsn,
            };
          });

          setAllergySubstanceMain(finalData);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [allergySubstanceMain])

  // const handleSubstanceInputChange = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   let conceptid: any = `conceptid1=716186003&conceptid2=418038007&conceptid3=267425008&conceptid4=29736007&conceptid5=340519003&conceptid6=190753003&conceptid7=413427002`;
  //   let symenticVal = `finding++situation++disorder`;
  //   if (e.target.value.length >= 3) {
  //     await services
  //       .get(
  //         snowmedChiefcomplaint +
  //         `term=${e.target.value}&state=active&semantictag=${symenticVal}&acceptability=synonyms&returnlimit=1000&refsetid=null&parentid=null&fullconcept=false&${conceptid}`
  //       )
  //       .then((res: any) => {
  //         let finalData: any = res.data.map((list: any) => {
  //           return {
  //             ...list,
  //             value: list.conceptId,
  //             label: list.conceptFsn,
  //           };
  //         });

  //         setAllergySubstanceMain(finalData);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  useEffect(() => {
    setLoading(true);
    getAllergySubstanceSnomedData();
    setAllergiesData2([]);
    fetchAllergies();
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
        setReactionSeverityList(result);
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

    services
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

    services
      .get(snowmedData + "716186003")
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

    services
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    getAllergiesData();
  }, [props.tabVal]);

  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }


  return (
    <div className="block">
      <div className={props?.screenData.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
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

        <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
          <h1 className="font-bold">Allergies</h1>
        </div>

        <div className="px-4 bg-white rounded-curve md:pt-3 mb-4 rounded-curve mx-auto w-full border border-stroke">
          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Type"
                  primaryColor="blue"
                  value={allergyTypeVal}
                  options={allergyTypeList}
                  onChange={(e: any) => {
                    setAllergiesField({ ...allergiesField, type: e.label });
                    setAllergyTypeVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyTypeVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Type
                </label>
              </div>
            </div>
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Category"
                  primaryColor="blue"
                  value={allergyCategoryVal}
                  options={categoryList}
                  onChange={(e: any) => {
                    setAllergiesField({ ...allergiesField, category: e.label });
                    setAllergyCategoryVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyCategoryVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Category
                </label>
              </div>
            </div>

            <div className="md:w-1/4 px-3 my-2 my-select">
              <div className="relative">
                <Select
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-400 border border-blue-gray-100 rounded-[7px] shadow-sm transition-all 
                  duration-300 focus:outline-none 
                 
                  ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700 ",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                  isDisabled={props.disable}
                  placeholder="Allergy"
                  primaryColor="blue"
                  value={allergySubstanceVal}
                  options={allergySubstanceMain}
                  isSearchable={true}
                  onSearchInputChange={(e: any) => handleSubstanceInputChange(e)}
                  onChange={(e: any) => {
                    if (e.label.length >= 3) {
                      setAllergiesField({
                        ...allergiesField,
                        substance: e.label,
                      });
                      setAllergySubstanceVal(e);
                    } else {
                    }
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergySubstanceVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Allergy
                </label>
              </div>
            </div>

            <div className="md:w-1/4 px-3 my-2 my-select ">
              <div className="relative">
                <Select
                  classNames={{
                    menuButton: ({ isDisabled }: any) =>
                      `flex text-sm text-blue-gray-400 border border-blue-gray-100 rounded-[7px] shadow-sm transition-all 
                  duration-300 focus:outline-none 
                 
                  ${isDisabled
                        ? "bg-blue-gray-200"
                        : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                      }`,
                    menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700 !right-0 !left-auto",
                    listItem: ({ isSelected }: any) =>
                      `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                        ? `text-white bg-blue-500`
                        : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                      }`,
                  }}
                  isDisabled={props.disable}
                  placeholder="Reaction"
                  primaryColor="blue"
                  value={allergyReactionVal}
                  options={reactionDataMain}
                  isSearchable={true}
                  onSearchInputChange={(e: any) => handleInputChange(e)}
                  onChange={(e: any) => {
                    if (e.label.length >= 3) {
                      setAllergiesField({
                        ...allergiesField,
                        reaction: e.label,
                      });
                      setAllergyReactionVal(e);
                    } else {
                    }
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyReactionVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Reaction
                </label>
              </div>
            </div>
          </div>

          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Severity"
                  primaryColor="blue"
                  value={allergySeverityVal}
                  options={reactionSeverityList}
                  onChange={(e: any) => {
                    setAllergiesField({
                      ...allergiesField,
                      reactionSeverity: e.label,
                    });
                    setAllergySeverityVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergySeverityVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Severity
                </label>
              </div>
            </div>
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Criticality"
                  primaryColor="blue"
                  value={allergyCriticalityVal}
                  options={criticalityList}
                  onChange={(e: any) => {
                    setAllergiesField({
                      ...allergiesField,
                      criticality: e.label,
                    });
                    setAllergyCriticalityVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyCriticalityVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Criticality
                </label>
              </div>
            </div>
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Clinical Status"
                  primaryColor="blue"
                  value={allergyClinicalStatusVal}
                  options={clinicalStatusList}
                  onChange={(e: any) => {
                    setAllergiesField({
                      ...allergiesField,
                      clinicalStatus: e.label,
                    });
                    setAllergyClinicalStatusVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyClinicalStatusVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Clinical Status
                </label>
              </div>
            </div>
            <div className="md:w-1/4 px-3 my-2 ">
              <div className="relative">
                <Select
                  isDisabled={props.disable}
                  placeholder="Verification Status"
                  primaryColor="blue"
                  value={allergyVerificationStatusVal}
                  options={verificationstatusList}
                  onChange={(e: any) => {
                    setAllergiesField({
                      ...allergiesField,
                      verificationStatus: e.label,
                    });
                    setAllergyVerificationStatusVal(e);
                  }}
                />
                <label
                  style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                  className={`${allergyVerificationStatusVal?.label !== undefined
                    ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                    : "text-sm opacity-0 top-10"
                    } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                >
                  Verification Status
                </label>
              </div>
            </div>
          </div>

          <div className="-mx-3 md:flex py-2">
            <div className="md:w-1/4 px-3 my-2"></div>
            <div className="md:w-1/4 px-3 my-2"></div>
            <div className="md:w-1/4 px-3 my-2"></div>

            <div className="md:w-1/4 px-3 my-2">
              <div className="-mx-3 md:flex float-right">
                <ActionButton
                  buttonText="ADD"
                  handleSubmit={handleSubmit(handleAdd)}
                  width="w-[120px] py-3"

                />
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 bg-white rounded-curve md:pt-3 mb-4 rounded-curve mx-auto w-full border border-stroke">
          <div className="-mx-3 md:flex py-2">
            <DataGrid
              autoHeight
              rows={allergiesData2}
              columns={columns2}
              // getRowId={(row) => row.id}
              getRowId={() => uuidv4()}
              pageSizeOptions={[10, 30, 50, 100]}
            />
          </div>
        </div>
        <div className="-mx-3 md:flex py-2 justify-end">
          <div className="flex justify-end items-center gap-x-3 m-3">
            {props?.screenData?.Save === 1 &&
              <ActionButton
                buttonText="Save"
                handleSubmit={handleSubmit(onSubmit)}
                width="w-[120px] py-3"
                disabled={allergiesData2.length > 0 ? false : true}
              />
            }
          </div>
        </div>

        <div className="px-4 bg-white rounded-curve md:pt-3 mb-4 rounded-curve mx-auto w-full border border-stroke">
          <div className="-mx-3 md:flex py-2">
            <DataGrid
              autoHeight
              rows={saveallergy && saveallergy}
              columns={columns1}
              getRowId={() => uuidv4()}
              pageSizeOptions={[10]}
            />
          </div>
        </div>
      </div>


      {/* update popup */}
      <ReactCommonDialog
        open={allergyPopup.popup}
        handler={() => setAllergyPopup({ ...allergyPopup, popup: false })}
        popupClose={() => setAllergyPopup({ ...allergyPopup, popup: false })}
        Content={
          <AllergyUpdate
            setAllergiesField={setAllergiesField}
            allergyTypeList={allergyTypeList}
            categoryList={categoryList}
            reactionSeverityList={reactionSeverityList}
            criticalityList={criticalityList}
            clinicalStatusList={clinicalStatusList}
            verificationstatusList={verificationstatusList}
            allergiesField={allergiesField}
            data={allergyPopup.data}
            fetchAllergies={fetchAllergies}
            getAllergiesData={getAllergiesData}
          />
        }
        size="xl" dialogtitle="Allergy Update"
      />
      {/* <DialogueBox
              icon={<PencilIcon className="text-blue-500 w-5 h-5" />}
              content={
                <AllergyUpdate
                  setAllergiesField={setAllergiesField}
                  allergyTypeList={allergyTypeList}
                  categoryList={categoryList}
                  reactionSeverityList={reactionSeverityList}
                  criticalityList={criticalityList}
                  clinicalStatusList={clinicalStatusList}
                  verificationstatusList={verificationstatusList}
                  allergiesField={allergiesField}
                  data={params.row}
                  fetchAllergies={fetchAllergies}
                  getAllergiesData={getAllergiesData}
                />
              }
              size="xl"
            /> */}
    </div>
  );
}

export default roleInfoScreenData(Allergies, "Alr")
