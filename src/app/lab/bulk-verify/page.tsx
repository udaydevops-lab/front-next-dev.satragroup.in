"use client"
import React, { useEffect, useState } from 'react'
import { LabPagetitle } from '../_component'
import BulkVerifyForm from './_components/BulkVerifyForm'
import BulkVerifyGrid from './_components/BulkVerifyGrid'
import services from '@/app/utilities/services'
import { getAllresultVerifyGrid, getDepartmentPrac } from '@/app/utilities/api-urls'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import moment from 'moment'
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc'
import NoScreenData from '@/app/_common/NoScreenData'

const BulkVerifyMaster = (props: any) => {
    let headers = getHeaderResponse()
    const [fields, setFields] = useState<any>({
        specialty: ""
    })
    const [gridData, setGridData] = useState<any>([])
    const [verifyedBy, setVerifyedBy] = useState<any>([])
    const [verifyedByVal, setVerifyedByVal] = useState<any>("")
    const [fromDate, setFromDate] = useState<any>(moment())
    const [toDate, setToDate] = useState<any>(moment())

    // getting the doctor list function
    const handledepartmentDropdown = () => {
        let getDeportment = "D030";
        services
            .get(getDepartmentPrac + getDeportment + "/1", headers)
            .then((response) => {
                const result = response.data.map((item: any) => ({
                    value: item.employeeId,
                    label: item.lastName,
                    employeeId: item.employeeId,
                    isDoctor: item.isDoctor,
                    lastName: item.lastName,
                }));
                setVerifyedBy(result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const getAllresultVerifyGridData = async () => {
        //getAllresultVerifyGrid
        const url =
            fields.specialty !== "" ?
                `${getAllresultVerifyGrid}fromDate=${moment(fromDate).format("YYYY-MM-DD")}&toDate=${moment(toDate).format("YYYY-MM-DD")}&specialityCode=${fields.specialty.value}`
                :
                `${getAllresultVerifyGrid}fromDate=${moment(fromDate).format("YYYY-MM-DD")}&toDate=${moment(toDate).format("YYYY-MM-DD")}`

        services
            .get(url, headers)
            .then((res) => {
                console.log(res.data)
                setGridData(res.data)
            })
            .catch((err) => {
                setGridData([])
                console.log(err.message);
            });
    }
    useEffect(() => {
        handledepartmentDropdown()
        getAllresultVerifyGridData()
    }, [])
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    console.log(props?.screenData)
    return (
        <>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>

                <div className='w-full bg-white px-3 py-6 rounded-md'>
                    <LabPagetitle
                        title='Bulk Verify'
                    />
                    <div className='w-full mb-8 mt-5'>
                        <BulkVerifyForm
                            fields={fields}
                            setFields={setFields}
                            fromDate={fromDate}
                            setFromDate={setFromDate}
                            toDate={toDate}
                            setToDate={setToDate}
                            getAllresultVerifyGridData={getAllresultVerifyGridData}
                        />
                    </div>
                    <div className='w-full mb-10'>
                        <BulkVerifyGrid
                            gridData={gridData}
                            verifyedBy={verifyedBy}
                            verifyedByVal={verifyedByVal}
                            setVerifyedByVal={setVerifyedByVal}
                            getAllresultVerifyGridData={getAllresultVerifyGridData}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default roleInfoScreenData(BulkVerifyMaster, "BV")