"use client";

import React, { useState, useEffect } from "react";
import services from "../../../../utilities/services";
import { getOPEmrData } from "../../../../utilities/api-urls";
import { useRouter } from "next/navigation";
import Wholepages from "./_components/wholepages";

export default function OpAssessment() {
    const [loading, setLoading] = useState(true);

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
        let emrID = "EMR23062110026"; //getLocalItem("emrID");
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

    const router = useRouter();
    const pushTo = (type: string) => {
        switch (type) {
            case "sample1":
                router.push("/opAssessment/complaint");
                break;
            default:
                break;
        }
    };
    return (
        <>
            <Wholepages />
        </>
    );
}
