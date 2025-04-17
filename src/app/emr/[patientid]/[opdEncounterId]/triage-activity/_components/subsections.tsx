"use client";

import React, { useState, useEffect } from "react";
import services from "../../../../../utilities/services";
import { getOPEmrData, timer } from "../../../../../utilities/api-urls";
import { useRouter, useParams } from "next/navigation";
import Allergies from "@/app/allergies/page";
import ReasonForVisit from "@/app/reason-for-visit/page";
import Vitals from "@/app/vitals/page";
import TimerIcon from "./TimerIcon";
import StopTimerIcon from "./StopTimerIcon";
import moment from "moment";
import { getLocalItem } from "@/app/utilities/local";

import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import PatientHeader from "../../_components/patient-header";
import TriagePatientHeader from "./triagePatientHeader";
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import TraigeCategory from "@/app/traige-category/page";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
    disable: boolean;
}
export default function Subsections() {
    const { encounterpatientData } = PatientDatadataAuth();

    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState(true);
    const [value, setValue] = React.useState(0);
    const [startTimer, setStartTimer] = useState(true);
    const [currTime, setCurrTime] = useState("");

    const [tabVal, setTabVal] = useState<any>("vitals");

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

    // Tab panel data
    const data = [
        {
            label: "Vitals",
            value: "vitals",
            desc: <Vitals disable={disable} tabVal={tabVal} />,
        },
        {
            label: "Allergies",
            value: "allergies",
            desc: <Allergies disable={disable} tabVal={tabVal} />,
        },
        {
            label: "Reason For Visit",
            value: "reason_for_visit",
            desc: <ReasonForVisit disable={disable} tabVal={tabVal} />,
        },
        {
            label: "Triage Category",
            value: "traige_category",
            desc: <TraigeCategory disable={disable} tabVal={tabVal} />,
        },
    ];

    const router = useRouter();
    const { patientid, opdEncounterId } = useParams();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    function a11yProps(index: number) {
        return {
            id: `simple-tab-${index}`,
            "aria-controls": `simple-tabpanel-${index}`,
        };
    }
    const storedLoginResponse = getLocalItem("loginResponse");
    let employeename;

    try {
        employeename = storedLoginResponse
            ? JSON.parse(storedLoginResponse).employeename
            : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        employeename = ""; // Set a default value or handle the error accordingly
    }

    const backToEMR = () => {
        router.push(`/emr/${patientid}/${opdEncounterId}/emrCaseSheet`);
    };

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
                    console.log(err.data);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <>
            <div className="w-full mx-auto">
                <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
                    <h1 className="w-full">
                        <span className="w-3/4 float-left"></span>Triage Activity
                        <span
                            className=" w-1/4 float-right text-right cursor-pointer text-blue-600"
                            onClick={backToEMR}
                        >
                            Back
                        </span>
                    </h1>
                </div>
                <TriagePatientHeader rollDesc={"nurse"} setDisable={setDisable} />
            </div>
            <div className="w-full mx-auto">
                <div className="px-4 bg-white rounded-curve md:pt-4 pb-4 rounded-curve mx-auto w-full border border-stroke">
                    <Tabs
                        value="vitals"
                        orientation="vertical"
                        className="gap-4 !overflow-visible"
                    >
                        <div className="md:w-1/5 h-full">
                            <TabsHeader className="text-left cust-tabs  max-w-[400px] ">
                                {data.map(({ label, value }) => (
                                    <Tab
                                        key={Math.random()}
                                        value={value}
                                        onClick={() => setTabVal(value)}
                                        className="place-items-start items-start justify-start text-start py-2 w-full"
                                    >
                                        <div className="flex text-left items-start gap-2 w-full menuiconn capitalize">
                                            {label}
                                        </div>
                                    </Tab>
                                ))}
                            </TabsHeader>
                        </div>
                        <div className="md:w-4/5">
                            <TabsBody className="!overflow-visible">
                                {data.map(({ value, desc }) => (
                                    value === tabVal &&<TabPanel
                                        key={Math.random()}
                                        value={value}
                                        className={`${value === tabVal ? " !block" : "!hidden"
                                            } py-0 px-0 !overflow-visible`}
                                    >
                                        {desc}
                                    </TabPanel> 
                                    
                                ))}
                            </TabsBody>
                        </div>
                    </Tabs>
                </div>
            </div>
        </>
    );
}
