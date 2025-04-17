import React from 'react'
import SamplecollectionIcon from '../../../public/icons/lab/samplecollectionicon'
import ReactTabs from '../_commonfeatures/ReactTabs'
import ListpatientRegistered from './reports/list-patient-registered/page'
import Departmentwise from './reports/department-wise/page'
import OPDCounterWise from './reports/opd-counter-wise/page'
import Doctorwise from './reports/doctor-wise/page'
import OutpatientsVisited from './reports/outpatients-visited/page'
import OPencountersnotbilled from './reports/op-encounters-not-billed/page'
import OPordersbillpending from './reports/op-orders-bill-pending/page'
import Servicepricelist from './reports/servicepricelist/page'
import PatientsregisteredwithoutABHA from './reports/patientsregisteredwithoutabha/page'
import CancelledOPencounters from './reports/cancelledOPencounters/page'
import UserwiseOPencounters from './reports/userwiseOPencounters/page'
import Patientagegroupwise from './reports/Patient-age-group-wise/page'
import OPDwaitingtime from './reports/opd-waiting-time/page'


const frontdeskReports = () => {
    const data: any = [
        {
            icon: <SamplecollectionIcon />,
            label: "List Patient Registered",
            value: "lpr",
            desc: <ListpatientRegistered />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Department Wise",
            value: "dw",
            desc: <Departmentwise />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD Counter Wise",
            value: "OCW",
            desc: <OPDCounterWise />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD Counter Wise",
            value: "opddw",
            desc: <Doctorwise />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD Counter Wise",
            value: "opw",
            desc: <OutpatientsVisited />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD Counter Wise",
            value: "openb",
            desc: <OPencountersnotbilled />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD  Orders Bill Pending",
            value: "opep",
            desc: <OPordersbillpending />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Service Price List",
            value: "spl",
            desc: <Servicepricelist />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Patients Registered Without ABHA",
            value: "prwabha",
            desc: <PatientsregisteredwithoutABHA />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Cancelled OP Encounters",
            value: "cope",
            desc: <CancelledOPencounters />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "User Wise OP Encounters",
            value: "uwope",
            desc: <UserwiseOPencounters />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "Patient Age Group Wise",
            value: "pagw",
            desc: <Patientagegroupwise />,
        },
        {
            icon: <SamplecollectionIcon />,
            label: "OPD waiting time",
            value: "opdwt",
            desc: <OPDwaitingtime />,
        },
    ]
    return (
        <>
            <ReactTabs
                // tabTitle={"frontdesk Reports"}
                reactData={data} />
        </>
    )
}

export default frontdeskReports