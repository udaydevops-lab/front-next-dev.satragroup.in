import React from 'react'

import dynamic from 'next/dynamic';
const ReactTabs = dynamic(() => import('@/app/_commonfeatures/ReactTabs'), { ssr: false });
const RadiologyParameterMaster = dynamic(() => import('./radiology-parameter-master/page'), { ssr: false });
const RadiologyAssignTestParameter = dynamic(() => import('./assign-test-parameter/page'), { ssr: false });
const RadiologySpecialityDoctorMappingPage = dynamic(() => import('./radiology-speciality-doctor-mapping/page'), { ssr: false });
const RadiologyTechnicianMappingPage = dynamic(() => import('./radiology-technician-mapping/page'), { ssr: false });
const RadiologyEquipmentMasterPage = dynamic(() => import('./radiology-equipment-master/page'), { ssr: false });
const RadiologyResultTemplateMaster = dynamic(() => import('./result-template-master/page'), { ssr: false });


// Static import (typically for icons or other assets that don't need dynamic loading)
import SamplecollectionIcon from '../../../../public/icons/lab/samplecollectionicon';

// import ReactTabs from '@/app/_commonfeatures/ReactTabs';
// import RadiologyParameterMaster from './radiology-parameter-master/page';
// import RadiologyAssignTestParameter from './assign-test-parameter/page';
// import RadiologySpecialityDoctorMappingPage from './radiology-speciality-doctor-mapping/page';
// import RadiologyTechnicianMappingPage from './radiology-technician-mapping/page';
// import RadiologyEquipmentMasterPage from './radiology-equipment-master/page';
//import RadiologyTechnicianMappingMainPage from './radiology-technician-mapping/page';
//import RadiologyResultTemplateMaster from './result-template-master/page';



const RadiologyMasterPage = () => {
    const data: any = [
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Result Template Master",
            value: "rrm",
            desc: <RadiologyResultTemplateMaster />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Parameter Master",
            value: "rpm",
            desc: <RadiologyParameterMaster />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Assign Test Parameter",
            value: "atp",
            desc: <RadiologyAssignTestParameter />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Specialty Doctor Mapping",
            value: "rsdm",
            desc: <RadiologySpecialityDoctorMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Technician Mapping",
            value: "radiotm",
            desc: <RadiologyTechnicianMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Radiology Equipment Master",
            value: "radioem",
            desc: <RadiologyEquipmentMasterPage />,
        }
    ];


    return (
        <>
            <ReactTabs
                tabTitle={"Radiology Master"}
                reactData={data} />
        </>
    )
}

export default RadiologyMasterPage
