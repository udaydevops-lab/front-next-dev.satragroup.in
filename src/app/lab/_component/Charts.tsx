"use client"
import DoughnutChart from '@/app/frontdesk/dashboard/_components/doughnutchart'
import Piechart from '@/app/frontdesk/dashboard/_components/piechart'
import { DASHBOARD_DOUGHNUT_CHART, DASHBOARD_PIE_CHART } from '@/app/utilities/constants';
import eventBus from '@/app/utilities/eventbus';
import React, { useEffect } from 'react';

interface chartsData {
    currentOrders: any
}

const Charts: React.FC<chartsData> = ({
    currentOrders
}) => {

    let DataSetsArr: any = [
        currentOrders?.resultEnterCount || 0,
        (currentOrders?.receivedCount || 0) - (currentOrders?.resultEnterCount || 0),
        currentOrders?.receivedCount || 0
    ];

    const pieData = {
        labels: ['Total Performed', 'Total Not Performed', 'Total Received'],
        datasets: [
            {
                data: [...DataSetsArr],
                backgroundColor: ['#ff9f40', '#ffcd56', '#36a2eb']
            }
        ]
    }

    const doughnutData = {
        labels: ['Sample Received', 'Result Entered', 'Verified', 'Collected'],
        datasets: [{
            label: "Data",
            data: [currentOrders?.receivedCount || 0, currentOrders?.resultEnterCount || 0, currentOrders?.verifiedCount || 0, currentOrders?.collectedCount || 0],
            backgroundColor: ['#36a2eb', '#ff9f40', '#ffcd56', '#4bc0c0'],
            borderColor: ['#36a2eb', '#ff9f40', '#ffcd56', '#4bc0c0']
        }]
    }

    useEffect(() => {
    }, [pieData, doughnutData, currentOrders]);

    return (
        <div className='flex items-center justify-between w-full gap-10 -pl-1 pr-6'>
            <div className='w-1/2 p-6'><Piechart graphData={pieData} /></div>
            {/* <div className='rounded-lg border border-stroke bg-white shadow-md p-2'>
                <div>
                    Sample in Transit
                </div>
                <div className='text-[#ff9f40] text-center font-extrabold text-2xl'>
                    125
                </div>
            </div> */}
            <div className='w-1/2 p-6'><DoughnutChart graphData={doughnutData} /></div>
        </div>
    )
}

export default Charts
