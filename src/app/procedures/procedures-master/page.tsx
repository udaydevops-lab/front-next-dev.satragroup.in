import React from 'react'
import dynamic from 'next/dynamic';
const ReactTabs = dynamic(() => import('@/app/_commonfeatures/ReactTabs'), { ssr: false });

// Static import (typically for icons or other assets that don't need dynamic loading)
const ProceduresResultTemplate = dynamic(() => import('./result-template/page'), { ssr: false });
const ProceduresParameterMaster = dynamic(() => import('./parameter-master/page'), { ssr: false });
const ProceduresEquipmentMaster = dynamic(() => import('./equipment-master/page'), { ssr: false });
const ProceduresTechnicianMapping = dynamic(() => import('./technician-mapping/page'), { ssr: false });
const ProceduresAssignTestParameter = dynamic(() => import('./assign-test-parameter/page'), { ssr: false });
const SamplecollectionIcon = dynamic(() => import('../../../../public/icons/lab/samplecollectionicon'), { ssr: false });
const ProceduresSpecialtyDoctorMapping = dynamic(() => import('./specialty – doctor-mapping/page'), { ssr: false });
const ProceduresMasterPage = () => {
    const data: any = [
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Result Template Master",
            value: "rrm",
            desc: <ProceduresResultTemplate />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Parameter Master",
            value: "rpm",
            desc: <ProceduresParameterMaster />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Assign Test Parameter",
            value: "atp",
            desc: <ProceduresAssignTestParameter />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Specialty Doctor Mapping",
            value: "rsdm",
            desc: <ProceduresSpecialtyDoctorMapping />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Technician Mapping",
            value: "radiotm",
            desc: <ProceduresTechnicianMapping />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Procedures Equipment Master",
            value: "radioem",
            desc: <ProceduresEquipmentMaster />,
        }
    ];


    return (
        <>
            <ReactTabs
                tabTitle={"Procedures Master"}
                reactData={data} />
        </>
    )
}

export default ProceduresMasterPage
