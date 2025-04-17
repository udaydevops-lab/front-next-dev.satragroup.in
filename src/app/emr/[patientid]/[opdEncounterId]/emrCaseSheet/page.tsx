"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import services from "../../../../utilities/services";
import {
  getDiagnosis,
  getMedication,
  getOPEmrData,
  getOpfollow,
  getPregnancyTrimester,
  getReferralOrder,
  timer,
  getOpassessmentData,
  getPatientDetails,
  getFindByDiagnosis,
  getopassessmentInfo,
  abdmNotify,
  checkNotifyStatus,
  getNotifedList,
  getHealthDocuments,
  getVitals,
} from "../../../../utilities/api-urls";
import Loader from "../../../../_common/loader";
import { toast } from "react-toastify";
import TimerIcon from "../triage-activity/_components/TimerIcon";
import StopTimerIcon from "../triage-activity/_components/StopTimerIcon";
import moment from "moment";
import {
  getLocalItem,
  removeLocalItem,
  setLocalItem,
} from "@/app/utilities/local";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import PatientHeader from "../_components/patient-header";
import { Allergies, ImmunizationRecordList, ServiceOrderCpoe } from "./Components";
import ReasonforvisitTab from "./Components/ReasonforvisitTab";
import ActionButton from "@/app/_common/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import MobileNumberPopUp from "./Components/MobileNumberPopUp";
import SendToMobileIcon from "@mui/icons-material/SendToMobile";
import { Radio } from "@material-tailwind/react";
// export default function EMRCaseSheet() {

const EMRCaseSheet = (props: any) => {
 
  const { getLanData } = PatientDatadataAuth();
  const storedData: any = JSON.parse(getLocalItem("loginResponse")!);
  const rollDesc: any = storedData?.rollDesc.toLowerCase();

  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();

  const pushTo = (type: string) => {
    switch (type) {
      case "vital-signs":
        router.push(`/emr/${patientid}/${opdEncounterId}/triage-activity`);
        break;
      case "allergies":
        router.push(`/emr/${patientid}/${opdEncounterId}/triage-activity`);
        break;
      case "reason-for-visit":
        router.push(`/emr/${patientid}/${opdEncounterId}/triage-activity`);
        break;
      case "immunization":
        router.push(`/emr/${patientid}/${opdEncounterId}/immunization`);
        break;
      case "opAssessment":
        router.push(`/emr/${patientid}/${opdEncounterId}/opAssessment`);
        break;
      case "PregnancyDetails":
        router.push(
          `/emr/${patientid}/${opdEncounterId}/pregnancy-obstestrics`
        );
        break;
      case "opfollowup-ipadmitorder":
        router.push(
          `/emr/${patientid}/${opdEncounterId}/op_followup-ip_admit_order`
        );
        break;
      case "opfollowup-referrals":
        router.push(`/emr/${patientid}/${opdEncounterId}/referal-order`);
        break;
      case "health-document":
        router.push(`/emr/${patientid}/${opdEncounterId}/health-document`);
        break;
      default:
        break;
    }
  };
  const [vitalsResponse, setVitalsResponse] = useState([
    {
      id: null,
      emrID: null,
      opdEncounterId: null,
      patientId: null,
      statusFlag: null,
      systolicBp: "",
      dialosticBp: "",
      vitalsRecordDateTime: null,
      pulse: null,
      tempInCelsius: "",
      tempInFahrenheit: "",
      snomedVitalsData: null,
      snomedMap: null,
      heightInCms: "",
      weightInKgs: "",
      weightInPounds: "",
      bmi: "",
      hcInCms: "",
      spo2: "",
      position: "",
      site: "",
      siteLocation: "",
      respiratoryRate: "",
      generatedDate: null,
      fromDate: null,
      toDate: null,
      updatedDate: null,
      generatedId: null,
      generatedBy: null,
      updatedBy: null,
      snomedData: null,
      recordedBy: "",
      reviewStatus: null,
      remarks: "",
    },
  ]);
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

  const [emrRespData, setRespEmrData] = useState({
    id: 0,
    emrID: "",
    patientId: 0,
    opdEncounterId: 0,
    emrData: {
      emrData: [
        {
          assessmentForm: [
            {
              hpi: [],
              physicalExamination: [],
              painScreening: [],
              ros: [],
              allergeis: [],
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
    },
  });
  const [disable, setDisable] = useState(true);
  const [showEnvironment, setShowEnvironment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [OpfollowData, setOpfollowData] = useState<any>([]);
  const [medicationData, setMedicationData] = useState([]);
  const [referalOrderData, setReferalOrderData] = useState([]);
  const [opassessmentData, setOpassessmentData] = useState<any>([]);
  const [pregnancyData, setPregnancyData] = useState<any>({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [saveallergy, setSaveAllergy] = useState<any>([]);
  const [isMen, setIsMen] = useState("");
  const [emrId, setEmrId] = useState(null);
  const [savedDocuments, setSavedDocuments] = useState<any>([]);

  const handleToggleEnvironment = () => {
    setShowEnvironment(!showEnvironment);
  };

  // getting all api Data
  const getApiData = async () => {
    removeLocalItem("emrID");
    const referalURL = `${getReferralOrder}/${patientid}/${opdEncounterId}`;
    try {
      const [medicationData, referalOrderData, OPEmrData] = await Promise.all([
        services.get(`${getMedication}?patientId=${patientid}`),
        services.get(`${getReferralOrder}/${patientid}/${opdEncounterId}`),
        services.get(getOPEmrData + patientid + "/" + opdEncounterId),
      ]);
      setRespEmrData(OPEmrData.data);
      setLocalItem("emrID", OPEmrData.data.emrID);
    } catch (error) {
      console.log(error);
    }
  };
  // geting data on EMR
  const RespEmrData = () => {
    services
      .get(getOPEmrData + patientid + "/" + opdEncounterId)
      .then((response) => {
        setRespEmrData(response.data);
        setEmrId(response.data.emrID!);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  //----------------getting data on Allergies --------------------------------

  const getAllergiesData = async () => {
    try {
      const response = await services.get(
        getOPEmrData + patientid + "/" + opdEncounterId
      );
      setEMRData(response.data);
      setSaveAllergy(response.data.emrData[0].assessmentForm[0].allergeis);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching Allergies Data:", error);
      setLoading(false);
    }
  };

  if (saveallergy && Array.isArray(saveallergy)) {
    // Now you can safely use saveallergy.length
    const arrayLength = saveallergy.length;
  } else {
  }

  // geting data on Diagnosis
  const getDiagnosisData = async () => {
    const url = `${getFindByDiagnosis}${patientid}/${opdEncounterId}`;
    try {
      const response = await services.get(url);
      setDiagnosisData(response.data);
    } catch (error) {
      console.error("Error fetching Diagnosis Data:", error);
    }
  };
  // geting data on Opfollow
  const getOpfollowData = async () => {
    const url = `${getOpfollow}${patientid}/${opdEncounterId}`;
    try {
      const response = await services.get(url);
      const result = response.data;
      setOpfollowData(result);
    } catch (error) {
      console.error("Error fetching Opfollow Data:", error);
    }
  };
  // geting data on referralOrder
  const getReferalOrderData = async () => {
    const url = `${getReferralOrder}/${patientid}/${opdEncounterId}`;
    try {
      const response = await services.get(url);
      const referralOrder = response.data;
      setReferalOrderData(referralOrder);
    } catch (error) {
      console.error("Error fetching referral order:", error);
    }
  };
  // geting data on Medication
  const getAllOpassessmentData = async () => {
    const url = `${getopassessmentInfo}${patientid}/${opdEncounterId}`;
    try {
      const response = await services.get(url);
      const OpassessmentData = response.data;
      setOpassessmentData(OpassessmentData);
    } catch (err) {
      console.log(err);
    }
  };
  // geting data on Medication
  const getMedicationData = async () => {
    try {
      const response = await services.get(
        // `${getMedication}?patientId=${patientid}`
        `${getMedication}?patientId=${patientid}&opdEncounterId=${opdEncounterId}`
      );
      const medicationData = response.data;
      setMedicationData(medicationData);
    } catch (err) {
      console.log(err);
    }
  };
  // geting data on Pregnancy
  const getPregnancyData = async () => {
    try {
      const response = await services.get(
        `${getPregnancyTrimester}${patientid}`
      );
      const PregnancyData = response.data;
      setPregnancyData(PregnancyData);
    } catch (err) {
      console.log(err);
    }
  };

  var loginResponseJson = getLocalItem("loginResponse");
  if (loginResponseJson !== null) {
    var loginResponse = JSON.parse(loginResponseJson);
    if (loginResponse && loginResponse.employeename) {
      var employeename = loginResponse.employeename;
      // Now you can use the employeename variable
    }
  }
  const notallowmen = async () => {
    const data = await services.get(
      getPatientDetails + patientid + "/" + opdEncounterId
    );
    const genderValue = data.data.genderDesc.toLowerCase();
    setIsMen(genderValue);
  };

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "sno",
      width: 30,
      renderCell: (params: any) => {
        const rowNumber = savedDocuments.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "fileName",
      headerName: "Document Name",
      width: 250,
    },
    {
      field: "generatedDate",
      headerName: "Uploaded Date & Time",
      width: 180,
      renderCell: (params: any) => {
        const rowNumber = moment(params.row.generatedDate).format("DD-MM-YYYY");
        return rowNumber;
      },
    },
    {
      field: "generatedBy",
      headerName: "Uploaded By",
      width: 100,
    },
  ];

  const getDocumentData = () => {
    services
      .get(getHealthDocuments + patientid + "/" + opdEncounterId)
      .then((response: any) => {
        const updatedDocuments = response.data.map(
          (document: any, index: number) => ({
            id: index + 1,
            ...document,
          })
        );
        setSavedDocuments(updatedDocuments);
      })
      .catch((err: any) => {
        console.log("err", err.message);
      });
  };

  const getVitalsData = () => {
    services
      .get(getVitals + patientid + "/" + opdEncounterId)
      .then((response: any) => {
        response.data.map((item: any, index: number) => {
          response.data[index].sno = index + 1;
        });
        setVitalsResponse(response.data);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    removeLocalItem("emrID");
    window.history.pushState(null, window.location.href);
    window.onpopstate = function () {
      if (timerRunning) {
        // alert('Do you want to go back , so please stop timer.')
        toast.error("Do you want to go back , so please stop timer.");
        return window.history.go(1);
      }
    };
    getVitalsData();
    getPregnancyData();
    getMedicationData();
    getReferalOrderData();
    RespEmrData();
    getAllergiesData();
    getDiagnosisData();
    getOpfollowData();
    getAllOpassessmentData();
    notallowmen();
    // getApiData();
    notifiedList();
    getDocumentData();
  }, []);
  const [buttonStatus, setButtonStatus] = useState({
    WellnessRecord: false,
    Prescription: false,
    DiagnosticReport: false,
    OPConsultation: false,
    DischargeSummary: false,
    ImmunizationRecord: false,
    HealthDocumentRecord: false,
  });
  const notifiedList = () => {
    services
      .get(getNotifedList + opdEncounterId + "/" + patientid)
      .then((response) => {
        response.data.map((item: any) => {
          Object.keys(buttonStatus).map((key: any, value: any) => {
            if (item == key) {
              setButtonStatus({
                ...buttonStatus, [key]: true
              })
            }
          })
        });
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };
  const checkStatus = (requestId: any) => {
    setLoading(true);
    services
      .get(checkNotifyStatus + requestId)
      .then((response) => {
        setLoading(false);
        if (response.data.contextNotifyStatus && response.data.error) {
          toast.error(
            response.data.contextNotifyStatus + ", " + response.data.message!
          );
        } else if (response.data.contextNotifyStatus) {
          toast.success(response.data.contextNotifyStatus);
        }
        notifiedList()
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Technical Error");
      });
  };
  const capitalize = (name: string) => {
    return name.charAt(0).toUpperCase() + name.substring(1, name.length);
  };
  const [typeOfData,setTypeOfData]=useState("Structured")
  const onPush = (hiType: String) => {
    let postObj = {
      patientId: patientid,
      encounterId: opdEncounterId,
      hiTypes: [`${hiType}-${typeOfData}`],
    };
    setLoading(true);
    services
      .create(abdmNotify, postObj)
      .then((response) => {
        setLoading(false)
        if (response.data.error) {
          toast.error(capitalize(response.data.error))
        } else if (response.data.message) {
          toast.success(capitalize(response.data.message))
        }
        // let data = response.data.requestId;
        // setTimeout(() => {
        //   if (data.length > 0) {
        //     checkStatus(data)
        //   }
        // }, 5000)
      })
      .catch((err) => {
        setLoading(false);
        toast.error("Technical error");
      });
  };

  


  const [mobileFormData, setMobileFormData] = useState({
    mobileNumber: "",
  });
  const [mobilePopOpen, setMobilePopOpen] = useState(false);
  const onPhrLink = () => {
    setMobilePopOpen(true);
  };
  if (!props?.screenData || props?.screenData.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className="block">
      {loading ? <Loader /> : ""}
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1>EMR Casesheet</h1>
      </div>
      <PatientHeader
        data={mobileFormData}
        setData={setMobileFormData}
        setDisable={setDisable}
      />

      <div className="cust-card md:flex -mx-3">
        <div className="md:w-1/2  lg:w-1/4 p-2">
          <div className="cust-card-m  mx-auto bg-white  h-full rounded-md overflow-hidden">
            <div
              className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm"
              onClick={() => {
                pushTo("vital-signs");
              }}
            >
              <u style={{ cursor: "pointer" }}>
                {getLanData?.emrCaresheet?.tab1}
              </u>
            </div>

            <div className="emr-cl cust-card-body flex flex-col p-2 text-xs">
              {(vitalsResponse as any) && (vitalsResponse as any).length > 0 ? (
                <>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1  text-sm"></div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1">
                    <p className="text-gray-600">Temperature</p>
                    <p>
                      {(vitalsResponse as any)?.toReversed()[0]?.tempInCelsius}
                    </p>
                  </div>

                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">O2 Saturation</p>
                    <p>{(vitalsResponse as any)?.toReversed()[0]?.spo2}</p>
                  </div>

                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">Pulse</p>
                    <p>{(vitalsResponse as any)?.toReversed()[0]?.pulse}</p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">Weight In Kgs</p>
                    <p>
                      {(vitalsResponse as any)?.toReversed()[0]?.weightInKgs}
                    </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">Height In Kgs</p>
                    <p>
                      {(vitalsResponse as any)?.toReversed()[0]?.heightInCms}
                    </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">Blood Pressure</p>
                    <p>
                      {(vitalsResponse as any)?.toReversed()[0]?.systolicBp
                        ? (vitalsResponse as any)?.toReversed()[0]?.systolicBp
                        : "--"}
                      {" / "}
                      {(vitalsResponse as any)?.toReversed()[0]?.dialosticBp
                        ? (vitalsResponse as any)?.toReversed()[0]?.dialosticBp
                        : "--"}
                    </p>
                  </div>
                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                    <p className="text-gray-600">Respiratory Rate</p>
                    <p>
                      {
                        (vitalsResponse as any)?.toReversed()[0]
                          ?.respiratoryRate
                      }
                    </p>
                  </div>

                  <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-0 ">
                    <p className="text-gray-600"></p>
                    <p>
                      <a
                        href="#"
                        className="p-0 m-0 float-right font-semibold text-blue-900 hover:text-blue-800"
                      >
                        GrowthChart
                      </a>
                    </p>
                  </div>
                </>
              ) : (
                <div>No Record For Now</div>
              )}
            </div>
          </div>
        </div>
        <div className="md:w-1/2  lg:w-1/4 p-2">
          <div className="cust-card-m mx-auto bg-white h-full rounded-md overflow-hidden">
            <div
              className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm"
              onClick={() => {
                pushTo("allergies");
              }}
            >
              <u style={{ cursor: "pointer" }}>
                {getLanData?.emrCaresheet?.tab2}
              </u>
            </div>
            <Allergies saveallergy={saveallergy} />
          </div>
        </div>

        <div className="md:w-1/2  lg:w-1/4 p-2">
          <div className="cust-card-m mx-auto bg-white  h-full rounded-md overflow-hidden">
            <div
              className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm"
              onClick={() => {
                pushTo("reason-for-visit");
              }}
            >
              <u style={{ cursor: "pointer" }}>
                {getLanData?.emrCaresheet?.tab3}
              </u>
            </div>

            <ReasonforvisitTab />
          </div>
        </div>

        <div className="md:w-1/2 lg:w-1/4 p-2">
          <div className="cust-card-m  mx-auto bg-white h-full rounded-md overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("immunization");
                }}
              >
                {getLanData?.emrCaresheet?.tab4}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab4}
              </div>
            )}

            <ImmunizationRecordList />
          </div>
        </div>
      </div>
      {/* Second Row starts */}
      <div className="md:flex -mx-3">
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("opAssessment");
                }}
              >
                {getLanData?.emrCaresheet?.tab5}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab5}
              </div>
            )}
            <div className="cust-card-body flex flex-col">
              <div className="items-center p-2 mb-2 text-sm">
                {opassessmentData && opassessmentData ? (
                  <>
                    <div>
                      <span className="text-gray-600 font-semibold">
                        Op Assessment
                      </span>{" "}
                      |{" "}
                      {moment(opassessmentData.generatedDate).format(
                        "DD-MM-YYYY"
                      )}{" "}
                      | {opassessmentData.recordedBy}
                    </div>
                  </>
                ) : (
                  <p>No Record For Now</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("opAssessment");
                }}
              >
                {getLanData?.emrCaresheet?.tab6}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab6}
              </div>
            )}
            <div className="cust-card-body flex flex-col">
              <div className="item-center p-2 mb-2 text-sm">
                {medicationData && medicationData.length > 0 ? (
                  medicationData.map((item: any, index: number) => (
                    <div className="mb-2 w-full" key={index}>
                      <span className="text-gray-600 font-semibold">
                        {item.drugDesc}
                      </span>{" "}
                      <span className="text-gray-800">
                        | {moment(item.rxStartDate).format("DD-MM-YYYY")}
                      </span>{" "}
                      <span className="text-gray-800">| {item.recordedBy}</span>
                    </div>
                  ))
                ) : (
                  <p>No Record For Now</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Third Row starts */}
      <div className="md:flex -mx-3">
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("opAssessment");
                }}
              >
                {getLanData?.emrCaresheet?.tab7}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab7}
              </div>
            )}
            <>
              <div className="cust-card-body flex flex-col">
                <div className="item-center p-2 mb-2 text-sm">
                  {diagnosisData && diagnosisData.length > 0 ? (
                    diagnosisData.map((item: any, index: number) => (
                      <div className="mb-2 w-full" key={index}>
                        <span className="text-gray-600 font-semibold">
                          {item.diagnosisType}
                        </span>{" "}
                        <span className="text-gray-800">
                          | {item.diagnosisDescriptrion}
                        </span>{" "}
                        <span className="text-gray-800">
                          | {item.diagnosisCode}
                        </span>{" "}
                      </div>
                    ))
                  ) : (
                    <p>No Record For Now</p>
                  )}
                </div>
              </div>
            </>
          </div>
        </div>
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m  mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("opAssessment");
                }}
              >
                {getLanData?.emrCaresheet?.tab8}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab8}
              </div>
            )}


            <div className="cust-card-body flex flex-col p-2 text-sm">
              <ServiceOrderCpoe
                patientid={patientid} opdEncounterId={opdEncounterId}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fourth Row starts */}
      <div className="md:flex  -mx-3">
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => { }}
              >
                {getLanData?.emrCaresheet?.tab9}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab9}
              </div>
            )}
            <div className="cust-card-body flex flex-col">
              <div className="flex items-center p-2 mb-2 text-sm">
                <p>No Record For Now</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                //onClick={showOpdReferrals}
                onClick={() => {
                  pushTo("opfollowup-referrals");
                }}
              >
                {" "}
                {getLanData?.emrCaresheet?.tab10}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab10}
              </div>
            )}
            <div className="cust-card-body flex flex-col">
              <div className="items-center p-2 mb-2 w-full text-sm">
                {referalOrderData && referalOrderData.length > 0 ? (
                  referalOrderData.map((item: any, index: number) => (
                    <div className="mb-2 w-full capitalize flex" key={index}>
                      <span className="text-gray-600 pr-2 font-semibold">
                        {item.reasonForReferral}
                      </span>
                      <span className="text-gray-800 pr-2">
                        | {moment(item.dateOfReferral).format("YYYY-MM-DD")}
                      </span>
                      <span className="text-gray-800">| {item.doctorName}</span>
                    </div>
                  ))
                ) : (
                  <p>No Record For Now</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fifth Row starts */}

      <div className="md:flex  -mx-3">
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("opfollowup-ipadmitorder");
                }}
              >
                {/* {getLanData?.emrCaresheet?.tab12} */}
                OP Follow Up
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {/* {getLanData?.emrCaresheet?.tab12} */}
                OP Follow Up
              </div>
            )}
            <div className="cust-card-body flex flex-col p-2">
              <div className="relative px-2 text-sm">
                {OpfollowData && OpfollowData.length > 0 ? (
                  <div className="mb-2 w-full">
                    <span className="text-gray-600 font-semibold">
                      Follow Up Date
                    </span>{" "}
                    <span className="text-gray-800">
                      |{" "}
                      {moment(OpfollowData[0].dateFollowUp).format(
                        "DD-MM-YYYY"
                      )}
                    </span>
                    <span className="text-gray-800">
                      | {OpfollowData[0].recordedBy}
                    </span>
                  </div>
                ) : (
                  <p>No Record For Now</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m  mx-auto bg-white   rounded-md h-full overflow-hidden">
            {rollDesc === "doctor" ? (
              <div
                className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                onClick={() => {
                  pushTo("health-document");
                }}
              >
                {getLanData?.emrCaresheet?.tab13}
              </div>
            ) : (
              <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                {getLanData?.emrCaresheet?.tab13}
              </div>
            )}
            <div className="cust-card-body flex flex-col p-2 text-sm">
              {savedDocuments.length > 0 ? (
                <div>
                  <div>
                    <DataGrid
                      rows={savedDocuments}
                      columns={columns}
                      getRowId={(row) => row.id}
                      hideFooter
                      checkboxSelection={false}
                    />
                  </div>
                  <div className="mt-3 flex justify-end">
                    <ActionButton
                      buttonText="Push"
                      handleSubmit={() => onPush("HealthDocumentRecord")}
                      width="w-[90px] py-2"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative px-2">
                  <p>No Record For Now</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex  -mx-3">
        {isMen != "male" ? (
          <div className="md:w-1/2  lg:w-1/2 p-2">
            <div className="cust-card-m  mx-auto bg-white rounded-md h-full overflow-hidden">
              {rollDesc === "doctor" ? (
                isMen != "male" ? (
                  <div
                    className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
                    onClick={() => {
                      pushTo("PregnancyDetails");
                    }}
                  >
                    {getLanData?.emrCaresheet?.tab11}
                  </div>
                ) : (
                  <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-not-allowed">
                    {getLanData?.emrCaresheet?.tab11}
                  </div>
                )
              ) : (
                <div className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm">
                  {getLanData?.emrCaresheet?.tab11}
                </div>
              )}

              <div className="cust-card-body flex flex-col">
                <div className="flex items-center p-2 mb-2 text-sm capitalize">
                  {pregnancyData &&
                    pregnancyData.pregnancyRecord &&
                    pregnancyData.pregnancyRecord.pregnancyRecord.currentPregnancy ? (
                    pregnancyData.pregnancyRecord.pregnancyRecord.currentPregnancy.trimester.map(
                      (trimesterItem: any, index: number) => (
                        <p key={index}>
                          {index + 1}.{" "}
                          <span>
                            {trimesterItem.trimester1?.date ||
                              "Date Unavailable"}
                          </span>{" "}
                          |{" "}
                          <span>
                            {`${trimesterItem.trimester1?.thyroid}`  ||
                              "Thyroid Unavailable"}
                          </span>
                        </p>
                      )
                    )
                  ) : (
                    <p>No Record For Now</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="md:w-1/2  lg:w-1/2 p-2">
          <div className="cust-card-m mx-auto bg-white   rounded-md h-full overflow-hidden">
            <div
              className="bg-slate-300 text-blue-600 font-semibold w-full py-1 px-2 text-sm cursor-pointer underline"
            >
              {getLanData?.emrCaresheet?.tab14}
            </div>
            <div className="cust-card-body flex flex-col p-4 -pe-2 text-sm">
            <div className=" -ms-2 flex gap-8 ">
                <Radio
                  crossOrigin={undefined}
                  color="blue"
                  defaultChecked
                  onChange={(e) => setTypeOfData(e.target.value)}
                  name="type"
                  value={"Structured"}
                  label={"Structured"}
                />
                <Radio
                  crossOrigin={undefined}
                  color="blue"
                  onChange={(e) => setTypeOfData(e.target.value)}
                  name="type"
                  value={"Unstructured"}
                  label={"Un-Structured"}
                />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <ActionButton
                    buttonText="OP Consultation"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("OPConsultation")}
                  />
                </div>
                <div>
                  <ActionButton
                    buttonText="Wellness Record"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("WellnessRecord")}
                  />
                </div>
                <div >
                  <ActionButton
                    buttonText="Prescription"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("Prescription")}
                  />
                </div>
                <div>
                  <ActionButton
                    buttonText="Diagnostic Report"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("DiagnosticReport")}
                    disabled={buttonStatus.DiagnosticReport}
                  />
                </div>
                <div>
                  <ActionButton
                    buttonText="Immunization Record"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("ImmunizationRecord")}
                  />
                </div>
                <div>
                  <ActionButton
                    buttonText="Discharge Summary"
                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("DischargeSummary")}
                  />
                </div>
                <div>
                  <ActionButton
                    buttonText="Health Document Record"
                    width="w-full text-white  text-[14px] h-[47px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => onPush("HealthDocumentRecord")}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <div
                    onClick={() => onPhrLink()}
                    className={`w-[200px] bg-white !text-blue-500 cursor-pointer h-[40px] border-blue-800 border-b-2 border-s-[2px] border-e-[1px] border-t-[1px] rounded-lg shadow-lg hover:shadow-xl active:shadow-none active:translate-x-1 flex justify-center items-center text-sm `}
                  >
                    Deep link SMS
                    <SendToMobileIcon
                      fontSize="small"
                      className="cursor-pointer"
                      titleAccess="Deep link SMS"
                      onClick={() => onPhrLink()}
                    />
                  </div>
                </div>
                <div>
                  <ReactCommonDialog
                    handler={() => setMobilePopOpen(true)}
                    Content={<MobileNumberPopUp data={mobileFormData} />}
                    popupClose={() => setMobilePopOpen(false)}
                    open={mobilePopOpen}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default roleInfoScreenData(EMRCaseSheet, "Ecsn")