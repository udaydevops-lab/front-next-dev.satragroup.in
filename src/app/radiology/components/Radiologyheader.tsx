"use client"
import React, { useState } from 'react'
import LabHomeIcon from '../../../../public/icons/lab/labhome'
import { usePathname, useRouter } from 'next/navigation';
import { PatientDatadataAuth } from '@/app/_common/context/DataStore';
import MennuactiveLinks from '@/app/_commonfeatures/mennuactiveLinks';
import PhlebotomyWorklistIcon from '../../../../public/icons/lab/phlebotomy-worklist';
import Labcontainericon from '../../../../public/icons/lab/labcontainericon';
import LaboratoryworklistIcon from '../../../../public/icons/lab/laboratoryworklisticon';
import moment from 'moment';
import { CalendarIcon } from '@heroicons/react/24/solid';

const Radiologyheader = () => {
    const router = useRouter()
    const pathname = usePathname();
    const { getLanData } = PatientDatadataAuth();
    const [currDate, setCurrDate] = useState<any>(moment().format("DD-MM-YYYY"))
    const NavLinks = [
        {
            icon: <LabHomeIcon />,
            pageName: 'Radiology Dashboard',
            pagePath: '/radiology/dashboard',
            switchTab: 'radiology-dashboard'
        },
        {
            icon: <PhlebotomyWorklistIcon />,
            pageName: 'Radiology Op Worklist',
            pagePath: '/radiology/radiology-opworklist',
            switchTab: 'radiology-radiology-opworklist'
        },
        {
            icon: <LaboratoryworklistIcon />,
            pageName: 'Radiology Bulk Result Verify',
            pagePath: '/radiology/bulk-verify',
            switchTab: 'radiology-bulk-result-verify'
        },
        {
            icon: <Labcontainericon />,
            pageName: 'Radiology Master',
            pagePath: '/radiology/radiology-master',
            switchTab: 'radiology-master'
        },
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
                                {NavLinks.map((linkList: any, index: any) => (
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

export default Radiologyheader
