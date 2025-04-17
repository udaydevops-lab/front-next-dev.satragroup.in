"use client"
import React, { useEffect, useState } from 'react'
import LabDashboard from '../_component/LabDashboard'
import eventBus from '@/app/utilities/eventbus';
import { LABORATORY_DASHBOARD_SPECIALTY, LABORATORY_DASHBOARD_SUMMARY } from '@/app/utilities/constants';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import NoScreenData from '@/app/_common/NoScreenData';
import services from '@/app/utilities/services';
import { labDashboard } from '@/app/utilities/api-urls';

const LabDashboardPage = (props: any) => {
    const [dashboardBarData, setDashboardBarData] = useState([]);
    const [dashboardSummary, setDashboardSummary] = useState({});

    useEffect(() => {
        eventBus.on(LABORATORY_DASHBOARD_SUMMARY, (data) => {
            console.log("lab-data", data);
            setDashboardSummary(data);
        });
        eventBus.on(LABORATORY_DASHBOARD_SPECIALTY, (data) => {
            console.log("lab-data-specialty", data);
            setDashboardBarData(data);
        });
        return () => {
            // Anything in here is fired on component unmount.
            eventBus.remove(LABORATORY_DASHBOARD_SUMMARY, () => { });
            eventBus.remove(LABORATORY_DASHBOARD_SPECIALTY, () => { });
        };
    }, []);
        useEffect(()=>{
            services.get(labDashboard).then((response)=>{
                eventBus.dispatch(LABORATORY_DASHBOARD_SUMMARY, response.data.labordersCount);
                eventBus.dispatch(LABORATORY_DASHBOARD_SPECIALTY, response.data.labordersCount.specialityCount);
            }).catch((err)=>{
                console.log(err)
            })                                                       
        },[])
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }

    return (
        <>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <div className='min-h-full'>
                    <div className='w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative'>
                        <div className='min-h-full rounded-curve border border-stroke bg-white p-2 mb-3'>
                            <LabDashboard
                                dashboardSummary={dashboardSummary}
                                dashboardBarData={dashboardBarData}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default roleInfoScreenData(LabDashboardPage, "Ldd")
