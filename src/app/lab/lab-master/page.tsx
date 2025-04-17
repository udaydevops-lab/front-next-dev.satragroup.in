
import React from 'react'
import dynamic from 'next/dynamic';

const ReactTabs = dynamic(() => import('@/app/_commonfeatures/ReactTabs'), { ssr: false });
const OrganismAntibioticMappingPage = dynamic(() => import('./organism-antibiotic-mapping/page'), { ssr: false });
const SamplecollectionIcon = dynamic(() => import('../../../../public/icons/lab/samplecollectionicon'), { ssr: false });
const ResultTemplateMasterPage = dynamic(() => import('./result-template-master/page'), { ssr: false });
const LabParameteMasterPage = dynamic(() => import('./lab-parameter-master/page'), { ssr: false });
const TestParamterMappingPage = dynamic(() => import('./test-parameter-mapping/page'), { ssr: false });
const LaboratoryTestGroupMasterPage = dynamic(() => import('./laboratory-test-group-master/page'), { ssr: false });
const SampleTypeMasterPage = dynamic(() => import('./sample-type-master/page'), { ssr: false });
const ContainerTypeMasterPage = dynamic(() => import('./container-type-master/page'), { ssr: false });
const LabTestMethodMasterPage = dynamic(() => import('./lab-test-method-master/page'), { ssr: false });
const OrganismMasterPage = dynamic(() => import('./organism-master/page'), { ssr: false });
const AntibioticMasterPage = dynamic(() => import('./antibiotic-master/page'), { ssr: false });
const LaboratoryDoctorMappingPage = dynamic(() => import('./laboratory-doctor-mapping/page'), { ssr: false });
const LaboratoryTechnicianMappingPage = dynamic(() => import('./laboratory-technician-mapping/page'), { ssr: false });
const LaboratoryEquipmentMappingPage = dynamic(() => import('./laboratory-equipment-mapping/page'), { ssr: false });


const LabMasterPage = () => {
    const data: any = [
        {
            icon: <SamplecollectionIcon />,
            label: "Result Template Master",
            value: "rtm",
            desc: <ResultTemplateMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Lab Parameter Master",
            value: "lpm",
            desc: <LabParameteMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Test - Parameter Mapping",
            value: "tpm",
            desc: <TestParamterMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Laboratory Test Group Master",
            value: "ltgm",
            desc: <LaboratoryTestGroupMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Sample Type Master",
            value: "stm",
            desc: <SampleTypeMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Container Type Master",
            value: "conttm",
            desc: <ContainerTypeMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Lab Test Method Master",
            value: "ltmm",
            desc: <LabTestMethodMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Organism Master",
            value: "om",
            desc: <OrganismMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Antibiotic Master",
            value: "antibm",
            desc: <AntibioticMasterPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Organism - Antibiotic Mapping",
            value: "oam",
            desc: <OrganismAntibioticMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Laboratory Doctor mapping",
            value: "lbm",
            desc: <LaboratoryDoctorMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Laboratory Technician mapping",
            value: "labtm",
            desc: <LaboratoryTechnicianMappingPage />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Laboratory Equipment mapping",
            value: "lem",
            desc: <LaboratoryEquipmentMappingPage />,
        }
    ];
    return (
        <>

            <ReactTabs
                tabTitle={"Lab Master"}
                reactData={data} />
        </>
    )
}

export default LabMasterPage
