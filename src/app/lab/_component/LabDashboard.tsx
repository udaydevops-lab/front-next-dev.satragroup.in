"use client"
import React, { useEffect, useState } from 'react'
import OrdersData from './OrdersData'
import Barchart from '@/app/frontdesk/dashboard/_components/barchart'
import HocComp from './hocComp'
import Charts from './Charts'
import { ReactSelectBox } from '@/app/_commonfeatures'
interface propsData {
    dashboardSummary: any,
    dashboardBarData: any
}

const LabDashboard: React.FC<propsData> = ({
    dashboardSummary,
    dashboardBarData
}) => {

    const previousOrders: any = dashboardSummary?.PreviousDateDashboardCount;
    const currentOrders: any = dashboardSummary?.currentDateDashBoardCount;
    const labBarDataLabels: any = dashboardBarData.map((item: any) => item.specialityDesc)
    const labBarDataCount: any = dashboardBarData.map((item: any) => item.count)

    const data: any = [
        { type: 'Received', value: currentOrders ? currentOrders.receivedCount : 0, color: "#2196f3" },
        { type: 'Perfomed', value: currentOrders ? currentOrders.resultEnterCount : 0, color: "#2196f3" },
        { type: 'Verified', value: currentOrders ? currentOrders.verifiedCount : 0, color: "#2196f3" },
        { type: 'Total Orders', value: currentOrders ? currentOrders.totalCount : 0, color: "#213c50" },
        { type: 'Collected', value: currentOrders ? currentOrders.collectedCount : 0, color: "#213c50" },
        { type: 'Not Collected', value: currentOrders ? currentOrders.resultEnterCount : 0, color: "#ed8080" }
    ]

    const data1: any = [
        { type: 'Received', value: previousOrders ? previousOrders.receivedCount : 0, color: "#2196f3" },
        { type: 'Perfomed', value: previousOrders ? previousOrders.resultEnterCount : 0, color: "#2196f3" },
        { type: 'Verified', value: previousOrders ? previousOrders.verifiedCount : 0, color: "#2196f3" },
        { type: 'Sample in Transit', value: previousOrders ? previousOrders.collectedCount : 0, color: "#ff9f40" },
    ]

    const barData = {
        labels: [...labBarDataLabels],
        datasets: [
            {
                data: [...labBarDataCount],
                backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
                hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
                borderRadius: 16,
                barThickness: 8,
            },
        ],
    };

    const [selField, setSelField] = useState({})
    useEffect(() => {
    }, [barData, currentOrders])

    const specialityData: any = [
        { value: "Specialty1", label: "Specialty 1" }
    ]

    return (
        <div className='space-y-6 p-6'>
            <div className='flex gap-4 justify-between -m-4'>
                <div className='text-[#7d7d7d] font-bold subpixel-antialiased ml-6 mt-2'>Laboratory Dashboard</div>
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
                    <OrdersData label='Current Days Sample Received Orders' data={data} />
                </HocComp>
                <HocComp>
                    <Barchart graphData={barData} />
                </HocComp>
            </div>
            <div className='grid grid-cols-2 gap-6'>
                <HocComp>
                    <OrdersData label='Previous Days Sample Received Orders' data={data1} />
                </HocComp>
                <HocComp>
                    <Charts currentOrders={currentOrders} />
                </HocComp>
            </div>
        </div>
    )
}

export default LabDashboard