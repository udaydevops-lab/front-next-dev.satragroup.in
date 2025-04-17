"use client"
import React, { useEffect, useState } from 'react'
import MainRadiologyDashboardpage from './MainRadiologyDashboardpage'
import eventBus from '@/app/utilities/eventbus';
import { RADIOLOGY_DASHBOARD_SPECIALTY, RADIOLOGY_DASHBOARD_SUMMARY } from '@/app/utilities/constants';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import NoScreenData from '@/app/_common/NoScreenData';
import services from '@/app/utilities/services';
import { radiologyDashboard } from '@/app/utilities/api-urls';

const RadiologyDashboardpage = (props: any) => {
    const [dashboardSummary, setDashboardSummary] = useState<any>({});
    const [dashboardBarData, setDashboardBarData] = useState<any>([]);
    const [event,setEvent]=useState(false)
    useEffect(() => {
        eventBus.on(RADIOLOGY_DASHBOARD_SUMMARY, (data) => {
            setDashboardSummary(data?.radDashBoardCount);
        });
        eventBus.on(RADIOLOGY_DASHBOARD_SPECIALTY, (data) => {
            setDashboardBarData(data);
        });
        return () => {
            // Anything in here is fired on component unmount.
            eventBus.remove(RADIOLOGY_DASHBOARD_SUMMARY, () => { });
            eventBus.remove(RADIOLOGY_DASHBOARD_SPECIALTY, () => { });
        };
    }, [event]);
    
    useEffect(()=>{
            services.get(radiologyDashboard).then((response)=>{
                eventBus.dispatch(RADIOLOGY_DASHBOARD_SUMMARY, response.data);
                eventBus.dispatch(RADIOLOGY_DASHBOARD_SPECIALTY, response.data.RadSpecialityCountMap);
            })
    },[])
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }


    return (
        <>
            <div className='min-h-full'>
                <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                    <div className='w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative'>
                        <div className='min-h-full rounded-curve border border-stroke bg-white p-2 mb-3'>
                            <MainRadiologyDashboardpage
                                dashboardSummary={dashboardSummary}
                                dashboardBarData={dashboardBarData}
                                appointmentCounts={dashboardSummary?.AppointmentCounts}
                                turnAroundTimeCount={dashboardSummary?.totalTurnAroundTimes}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default roleInfoScreenData(RadiologyDashboardpage, "Rdd")
