"use client"
import React, { useEffect, useReducer, useState } from 'react'
import { radiologyDashboardReducer, radiologyDashboardState } from './components/RadiologyDashboardreducerfun'
import { ReactSelectBox } from '@/app/_commonfeatures'
import HocComp from './components/HocComp'
import OrdersData from './components/OrdersData'
import Barchart from '@/app/frontdesk/dashboard/_components/barchart'
import eventBus from '@/app/utilities/eventbus'
import { DASHBOARD_BAR_CHART, DASHBOARD_PIE_CHART } from '@/app/utilities/constants'
import Piechart from '@/app/frontdesk/dashboard/_components/piechart'

interface propsData {
    dashboardSummary: any,
    dashboardBarData: any,
    appointmentCounts: any,
    turnAroundTimeCount: any
}

const MainRadiologyDashboardpage: React.FC<propsData> = ({
    dashboardSummary,
    dashboardBarData,
    appointmentCounts,
    turnAroundTimeCount
}) => {

    const previousOrders: any = dashboardSummary?.PreviousDateDashboardCount;
    const currentOrders: any = dashboardSummary?.currentDateDashBoardCount;

    const barChartLabels = dashboardBarData.map((item: any) => item?.specialityDesc);
    const barChartCount = dashboardBarData.map((item: any) => item?.count);
    const apptBarChartLabels: any = appointmentCounts?.map((item: any) => item?.appointmentType) || [];
    const apptBarChartCounts: any = appointmentCounts?.map((item: any) => item?.count) || [];
    const TATBarChartLabels: any = turnAroundTimeCount?.map((item: any) => item?.Department) || [];
    const TATBarChartCounts: any = turnAroundTimeCount?.map((item: any) => item?.TotalTurnaroundTime) || [];

    const [state, dispatch] = useReducer(radiologyDashboardReducer, radiologyDashboardState);
    const [selField, setSelField] = useState({});
    const specialityData: any = [
        { value: "Specialty1", label: "Specialty 1" }
    ]
    const data: any = [
        // { labelData: 'Current Day Orders' },
        { type: 'Total Orders', value: currentOrders ? currentOrders.totalRadiologyDashboardCount : 0, color: "#2196f3" },
        { type: 'Arrived', value: currentOrders ? currentOrders.PatientArrivedCount : 0, color: "#2196f3" },
        { type: 'Exam Completed', value: currentOrders ? currentOrders.examCompletedCount : 0, color: "#2196f3" },
        { type: 'Reported', value: currentOrders ? currentOrders.examStartedcount : 0, color: "#2196f3" },
    ]
    const data1: any = [
        // { labelData: 'Previous Pending Orders' },
        { type: 'Total Orders', value: previousOrders ? previousOrders.totalRadiologyDashboardCount : 0, color: "#2196f3" },
        { type: 'Arrived', value: previousOrders ? previousOrders.PatientArrivedCount : 0, color: "#2196f3" },
        { type: 'Exam Completed', value: previousOrders ? previousOrders.examCompletedCount : 0, color: "#2196f3" },
        { type: 'Reported', value: previousOrders ? previousOrders.resultEnteredCount : 0, color: "#2196f3" }
    ]
    const barData = {
        labels: [...barChartLabels],
        datasets: [
            {
                data: [...barChartCount],
                backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
                hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
                borderRadius: 16,
                barThickness: 8,
            },
        ],
    };

    const appointmentsBarData = {
        labels: [...apptBarChartLabels],
        datasets: [
            {
                data: [...apptBarChartCounts],
                backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
                hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
                borderRadius: 16,
                barThickness: 8,
            },
        ]
    }

    const TATBarData = {
        labels: [...TATBarChartLabels],
        datasets: [
            {
                data: [...TATBarChartCounts],
                backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
                hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
                borderRadius: 16,
                barThickness: 8,
            },
        ]
    }

    const pieData = {
        labels: ['Total Performed', 'Total Not Performed', 'Total Received'],
        datasets: [
            {
                data: [currentOrders?.totalRadiologyDashboardCount, currentOrders?.totalRadiologyDashboardCount - currentOrders?.examCompletedCount, currentOrders?.examCompletedCount],
                backgroundColor: ['#ff9f40', '#ffcd56', '#36a2eb']
            }
        ]
    }

    useEffect(() => {
    }, [previousOrders, currentOrders, barChartLabels, barChartCount]);

    return (
        <div className='space-y-6 p-6'>
            <div className='flex gap-4 justify-between -m-4'>
                <div className='text-[#7d7d7d] font-bold subpixel-antialiased ml-6 mt-2'>Radiology Dashboard</div>
                <div>
                    <div className='w-[180px] newSelect'>
                        {/* <ReactSelectBox
                            value={selField}
                            options={specialityData}
                            isSearchable={true}
                            isMultiple={false}
                            onChange={(e: any) => setSelField(e)}
                            label="Specialty"
                            optionListWidtsize={true}
                        /> */}
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-2 gap-6'>
                <HocComp>
                    <div className='w-full flex flex-col justify-between flex-shrink'>
                        <div className='font-sans text-[#808181] text-xl'>Current Day Orders</div>
                        <OrdersData data={data} />
                        <div className='font-sans text-[#808181] text-xl p-2 pb-0'>Previous Pending Orders</div>
                        <OrdersData data={data1} />
                    </div>
                </HocComp>
                <HocComp>
                    <Barchart graphData={barData} />
                </HocComp>
            </div>
            <div>
                <HocComp>
                    <div className='flex items-center justify-between w-full gap-10 -pl-1 pr-6'>
                        <div className='w-[350px] p-6 pb-0 pt-0'>
                            <Piechart graphData={pieData} />
                        </div>
                        <div className='w-2/3 flex gap-10'>
                            <Barchart graphData={appointmentsBarData} />
                            <Barchart graphData={TATBarData} horizontal={true} />
                        </div>
                    </div>
                </HocComp>
            </div>
        </div>
    )
}

export default MainRadiologyDashboardpage
