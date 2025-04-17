"use client";

import React, { useState, useEffect } from "react";
import services from "../../../../../utilities/services";
import { getOPEmrData } from "../../../../../utilities/api-urls";
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";
import { useRouter, useParams } from "next/navigation";
import ComplintIcon from "../../../../../../../public/icons/opAssessment/complint";
import PfshIcon from "../../../../../../../public/icons/opAssessment/pfsh";
import DiagnosisIcon from "../../../../../../../public/icons/opAssessment/diagnosisicon";
import ExaminationIcon from "../../../../../../../public/icons/opAssessment/examination";
import MedicationrxIcon from "../../../../../../../public/icons/opAssessment/medicationrx";
import StethIcon from "../../../../../../../public/icons/opAssessment/doctornotes1";
import PainScreening1 from "../../../../../../../public/icons/opAssessment/painscreening1";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { getLocalItem } from "@/app/utilities/local";
import PatientHeader from "../../_components/patient-header";

import dynamic from 'next/dynamic';

const Complaint = dynamic(() => import('../complaint/page'), { ssr: false });
const Pfsh = dynamic(() => import('../pfsh/page'), { ssr: false });
const Diagnosis = dynamic(() => import('../diagnosis/page'), { ssr: false });
const PainScreening = dynamic(() => import('../painscreening/page'), { ssr: false });
const DoctorNotes = dynamic(() => import('../doctornotes/page'), { ssr: false });
const CpoeNew = dynamic(() => import('@/app/Cpoe_new/page'), { ssr: false });
const MedicationRxpage = dynamic(() => import('../medicationRx/page'), { ssr: false });
const Examination = dynamic(() => import('../examination/page'), { ssr: false });
const WellnessRecord = dynamic(() => import('../wellness-record/page'), { ssr: false });


export default function Wholepages() {
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  // language data passing here by contextapi
  const { encounterpatientData, getLanData } = PatientDatadataAuth();
  const [disable, setDisable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [tabVal, setTabVal] = useState<any>("complaint")

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
              allergeis: [
                {
                  allergyTypeCode: "",
                  allergies: [
                    {
                      allergyCode: "",
                      allergyDesc: "",
                      allergySeverity: "",
                    },
                  ],
                },
              ],
              diagnosis: [],
              serviceOrders: [],
              cheifComaplaints: [],
              vitals: [
                {
                  bloodPressure: "",
                  bmi: "",
                  dateAndTime: "",
                  dialosticBp: "",
                  feet: 0,
                  hcInCms: "",
                  heightInCms: "",
                  inches: 0,
                  position: "",
                  pulse: "",
                  recordedBy: "",
                  remarks: "",
                  respiratoryRate: "",
                  site: "",
                  siteLocation: "",
                  spo2: "",
                  tempInCelsius: "",
                  tempInFahrenheit: "",
                  weight: "",
                  weightInPounds: "",
                },
              ],
              pfsh: [],
              clinicalConditions: [],
              treatmentPlan: [],
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    setLoading(true);
    let emrID = getLocalItem("emrID");
    if (emrID !== null) {
      services
        .get(getOPEmrData + emrID)
        .then((response) => {
          setRespEmrData(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  const data = [
    {
      label: getLanData?.opAssementLeftbar?.complaint,
      value: "complaint",
      icon: ComplintIcon,
      desc: <Complaint />,
    },
    {
      label: getLanData?.opAssementLeftbar?.pfsh,
      value: "pfsh",
      icon: PfshIcon,
      desc: <Pfsh />,
    },
    {
      label: getLanData?.opAssementLeftbar?.diagnosis,
      value: "diagnosis",
      icon: DiagnosisIcon,
      desc: <Diagnosis />,
    },
    {
      label: getLanData?.opAssementLeftbar?.examination,
      value: "examination",
      icon: ExaminationIcon,
      desc: <Examination />,
    },
    {
      label: getLanData?.opAssementLeftbar?.painscreening,
      value: "painscreening",
      icon: PainScreening1,
      desc: <PainScreening />,
    },
    {
      label: getLanData?.opAssementLeftbar?.medicationrx,
      value: "medicationrx",
      icon: MedicationrxIcon,
      desc: <MedicationRxpage />,
    },
    {
      label: getLanData?.opAssementLeftbar?.doctornotes,
      value: "doctornotes",
      icon: StethIcon,
      desc: <DoctorNotes />,
    },
    {
      label: "Wellness Record",
      value: "wellnessRecord",
      icon: PainScreening1,
      desc: <WellnessRecord />,
    },
    {
      label: "CPOE",
      value: "Cpoe_new",
      icon: PainScreening1,
      desc: <CpoeNew />,
    }
  ];

  const backToEMR = () => {
    router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
  }

  return (
    <div>
      <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
        <h1 className="w-full"><span className="w-3/4 float-left"></span>
          OP Assessment
          <span className=" w-1/4 float-right text-right cursor-pointer text-blue-600	" onClick={backToEMR}>Back</span></h1>
      </div>
      <PatientHeader setDisable={setDisable} />

      <div className="px-4 bg-white rounded-curve md:pt-4 pb-4 rounded-curve mx-auto w-full border border-stroke">
        <Tabs value="complaint" orientation="vertical" className="gap-4 !overflow-visible">
          <div className="md:w-1/5 h-full">
            <TabsHeader className="text-left cust-tabs">
              {data.map(({ label, value, icon }) => (
                <Tab
                  key={value}
                  value={value}
                  onClick={() => setTabVal(value)}
                  className="place-items-start items-start justify-start text-start py-2"
                >
                  <div className="flex text-left items-start gap-2 menuiconn capitalize">
                    {React.createElement(icon, { className: "w-5 h-5" })}
                    {label}
                  </div>
                </Tab>
              ))}
            </TabsHeader>
          </div>
          <div className="md:w-4/5">
            <TabsBody className="!overflow-visible">
              {data.map(({ desc, value }) => (
                <TabPanel
                  key={value}
                  value={value}
                  className={`${value === tabVal ? " !block" : "!hidden"} py-0 px-0 !overflow-visible`}
                >
                  {desc}
                </TabPanel>
              ))}
            </TabsBody>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
