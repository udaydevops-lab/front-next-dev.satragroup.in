"use client"

import { PatientDatadataAuth } from '@/app/_common/context/DataStore'
import MennuactiveLinks from '@/app/_commonfeatures/mennuactiveLinks'
import DashboardSummaryComponent from '@/app/frontdesk/dashboard/_components/dashboard-summary'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import LabHomeIcon from '../../../../public/icons/lab/labhome'
import PhlebotomyWorklistIcon from '../../../../public/icons/lab/phlebotomy-worklist'
import LaboratoryworklistIcon from '../../../../public/icons/lab/laboratoryworklisticon'
import SamplecollectionIcon from '../../../../public/icons/lab/samplecollectionicon'
import Labcontainericon from '../../../../public/icons/lab/labcontainericon'
import { CalendarIcon } from '@mui/x-date-pickers'
import moment from 'moment'

const Labheader: React.FC = () => {
    const router = useRouter()
    const pathname = usePathname();
    const { getLanData } = PatientDatadataAuth();
    const [currDate, setCurrDate] = useState<any>(moment().format("DD-MM-YYYY"))
    const labLinks = [
        {
            icon: <LabHomeIcon />,
            pageName: 'Lab Dashboard',
            pagePath: '/lab/dashboard',
            switchTab: 'lab-dashboard'
        },
        {
            icon: <PhlebotomyWorklistIcon />,
            pageName: 'Phlebotomy Worklist',
            pagePath: '/lab/phlebotomy-worklist',
            switchTab: 'phlebotomy-worklist'
        },
        {
            icon: <LaboratoryworklistIcon />,
            pageName: 'Laboratory Worklist',
            pagePath: '/lab/laboratory-worklist',
            switchTab: 'laboratory-worklist'
        },
        {
            icon: <SamplecollectionIcon />,
            pageName: 'Bulk Verify',
            pagePath: '/lab/bulk-verify',
            switchTab: 'bulk-verify'
        },
        {
            icon: <Labcontainericon />,
            pageName: 'Lab Master',
            pagePath: '/lab/lab-master',
            switchTab: 'lab-master'
        }
    ]

    const isActive = (href: any) => {
        return pathname === href ? true : "";
    };

    const pushTo = (type: string, pathName: string) => {
        switch (type) {
            case type:
                router.push(pathName);
                break;
            default:
                break;
        }
    };


    return (
        <>
            <div className="sticky top-0 z-999  min-h-full mt-3 module-elips-wrapper">
                <div className="w-full mx-auto max-w-7xl">
                    <div className="relative">

                        <div className="menu-wrapp svg_icons flex items-center justify-between gap-4 bg-white rounded-lg md:pt-2 py-3 px-2  mx-auto w-full border border-stroke">
                            <div className='w-2/3 flex  gap-6 '>
                                {labLinks.map((linkList: any, index: any) => (
                                    <>
                                        <MennuactiveLinks
                                            menuPageTitle={linkList.pageName}
                                            onButtonClick={() => pushTo(linkList.switchTab, linkList.pagePath)}
                                            menuIcon={linkList.icon}
                                            status={isActive(linkList.pagePath)}
                                            key={index}
                                        />
                                    </>
                                ))}
                            </div>
                            {/* <div className=' flex justify-end flex-2 innermenuset  flex-wrap flex-row'>
                                <DashboardSummaryComponent getLanData={getLanData} />
                            </div> */}
                            <div className=' flex justify-end flex-2 text-[18px]   flex-wrap flex-row gap-2 text-blue-500 items-center'>
                                <CalendarIcon className='w-5 h-5' /> {currDate}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Labheader
