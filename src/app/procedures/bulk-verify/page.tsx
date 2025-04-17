"use client"
import React, { useEffect, useState } from 'react'

import BulkVerifyForm from './_components/BulkVerifyForm'
import BulkVerifyGrid from './_components/BulkVerifyGrid'
import services from '@/app/utilities/services'
import { getAllProcedureDoctors, getAllresultVerifyGrid, getDepartmentPrac, verifyprocedureGrid, verifyradiologyGrid } from '@/app/utilities/api-urls'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import moment from 'moment'
import { LabPagetitle } from '@/app/lab/_component'
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc'
import NoScreenData from '@/app/_common/NoScreenData'

const BulkVerifyMaster = (props: any) => {
    let headers = getHeaderResponse()
    const [fields, setFields] = useState<any>({
        department: ""
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
            // .get(getDepartmentPrac + getDeportment + "/1", headers)
            .get(getAllProcedureDoctors)
            .then((response) => {
                const result = response.data.map((item: any) => ({
                    value: item.employeeId,
                    label: item.firstName,
                    employeeId: item.employeeId,
                }));
                setVerifyedBy(result);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    // console.log(fields.department.value)
    //get All Radiology resultVerify Grid function
    const getAllresultVerifyGridData = async () => {
        const url = `${verifyprocedureGrid}fromDate=${moment(fromDate).format("YYYY-MM-DD 00:00:00")}&toDate=${moment(toDate).format("YYYY-MM-DD 23:59:00")}&deptCode=${fields.department.value ? fields.department.value : ""}`
        services
            .get(url, headers)
            .then((res) => {
                console.log(res.data)
                setGridData(res.data)
            })
            .catch((err) => {
                console.log(err.message);
                setGridData([])
            });
    }

    useEffect(() => {
        handledepartmentDropdown()
        getAllresultVerifyGridData()
    }, [])
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
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
                            screenData={props?.screenData}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}


export default roleInfoScreenData(BulkVerifyMaster, "Bv")