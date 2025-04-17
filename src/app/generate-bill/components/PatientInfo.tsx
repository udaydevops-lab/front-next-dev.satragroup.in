import { getAllDepartments, getPatientDetails } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { debug } from 'console';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react'

interface PatientInfoProps {
    patientid: any,
    opdEncounterId: any,
}

const PatientInfo: FC<PatientInfoProps> = ({ patientid, opdEncounterId }) => {

    const [patientData, setPatientData] = useState<any>(null)

    const getPatientData = async () => {
        const data = await services.get(
            getPatientDetails + patientid + "/" + opdEncounterId
        );
        setPatientData(data.data);
    };

    useEffect(() => {
        getPatientData();
    }, []);
    return (
        <>
            {/* Patient info */}
            <div className="flex">
                <div className="cust-t-g1 w-full py-1 px-3 text-sm text-blue-600 rounded-lg ">
                    <span className="capitalize">
                        {patientData?.middleName} | {patientData?.mrn} |{" "}
                        {patientData?.genderDesc} | {patientData?.ageOfPatient}{" "}
                        {patientData?.healthId ? "|" : ""} {patientData?.healthId}{" "}
                        {patientData?.abhaAddress ? "|" : ""} {patientData?.abhaAddress}
                    </span>

                </div>
            </div>
            {/* doctor info */}
            <div className="flex">
                <div className="cust-t-g2 w-full py-1 px-3 text-sm text-blue-600 rounded-lg my-2">
                    <span className="capitalize">
                        {patientData?.opdEncounterNo} |{" "}
                        {moment(patientData?.opdEncounterTime).format("DD-MM-YYYY HH:mm")}{" "}
                        {patientData?.doctor ? "|" : ""} {patientData?.doctor}
                    </span>
                </div>
            </div>
        </>
    )
}

export default PatientInfo