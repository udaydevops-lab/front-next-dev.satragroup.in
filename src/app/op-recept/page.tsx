"use client"
import React, { useEffect, useState } from 'react'
import ReactDatagrid from '../_commonfeatures/ReactDatagrid';
import { GridColDef } from '@mui/x-data-grid';
import { ReactSelectBox } from '../_commonfeatures';
import DateInput from '../_common/date-input';
import moment from 'moment';
import ActionButton from '../_common/button';
import { LabPagetitle } from '../lab/_component';
import { getBillData, getOpReceiptDetails, getReceptData } from '../utilities/api-urls';
import services from '../utilities/services';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { Tooltip } from '@mui/material';

const OPRecept = () => {
    const router = useRouter();
    const [oPReceptData, setOPReceptData] = useState<any>([])
    const [billNoList, setBillNoList] = useState<any>([])
    const [receptNoList, setReceptNoList] = useState<any>([])
    const [fields, setFields] = useState<any>({
        billNo: "",
        receptNo: "",
        fromDate: moment(),
        toDate: moment(),
    })

    const columns: GridColDef[] = [
        { field: "id", headerName: "S No", width: 70, },
        { field: "patientName", headerName: "Patient Name", width: 170 },
        { field: "billNumber", headerName: "Bill Number", width: 150 },
        {
            field: "receiptNum", headerName: "Receipt Number", width: 150,
            renderCell: (params: any) => (
                <>
                    <div onClick={() =>
                        router.push(`/op-recept/${params.row.receiptNum}/`)
                    } className='text-blue-500 underline cursor-pointer text-[15px]'>{params.row.receiptNum}</div>

                </>
            ),
        },
        { field: "mrn", headerName: "MRN", width: 150 },
        { field: "revenueAmount", headerName: "Bill Amount", width: 130 },
        { field: "discountAmount", headerName: "Discount Amount", width: 130 },
        { field: "netAmout", headerName: "Net Amout", width: 130 },
        { field: "receiptAmount", headerName: "Receipt Amount", width: 130 },
        { field: "generatedBy", headerName: "Generated", width: 150 },
        {
            field: "generatedDate", headerName: "Generated Data", width: 150,
            renderCell: (params: any) => (
                <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
            ),
        },

    ];

    // serch button function
    const handelSearchRecept = async () => {
        const receptNo = fields.receptNo.label ? fields.receptNo.label : "";
        const billNo = fields.billNo.label ? fields.billNo.label : "";
        const url = `${getOpReceiptDetails}billNumber=${billNo}&receiptNum=${receptNo}&fromDate=${moment(fields.fromDate).format('YYYY-MM-DD 00:00:00')}&toDate=${moment(fields.toDate).format('YYYY-MM-DD 23:59:59')}`
        try {
            const res = await services.get(url)
            // console.log(res.data)
            setOPReceptData(res.data)

        } catch (error: any) {
            toast.error(error?.response?.data ? error?.response?.data : "No Data")
            setOPReceptData([])
        }
    }

    // Reset button function
    const handelReset = () => {
        setBillNoList([])
        setReceptNoList([])
        setFields({
            billNo: "",
            receptNo: "",
            fromDate: moment(),
            toDate: moment(),
        })
    }

    // getting bill number function
    const getBillList = async (billNo: any) => {
        try {
            if (billNo.length > 2) {
                const url = `${getBillData}${billNo}`
                const res = await services.get(url)
                const result = res.data.map((b: any) => ({
                    ...b,
                    label: b.billNumber, value: b.billNumber,
                }))
                setBillNoList(result)
            }

        } catch (error) {
            toast.error("No Data")
        }
    }

    // getting Recept number function
    const getReceptList = async (receptNo: any) => {
        try {
            if (receptNo.length > 2) {
                const url = `${getReceptData}${receptNo}`
                const res = await services.get(url)
                const result = res.data.map((r: any) => ({
                    ...r,
                    label: r.receiptNum, value: r.receiptNum,
                }))
                setReceptNoList(result)
            }

        } catch (error) {
            toast.error("No Data")
        }
    }


    useEffect(() => {
        handelSearchRecept()
    }, [])
    return (

        <>
            <div className="top-0 w-full ">
                <div className="mx-auto mt-4  max-w-7xl pb-0 ">
                    <div className='bg-white p-2 px-4 rounded-md'>
                        <LabPagetitle title='OP Receipt' />
                        <div className='w-full mt-4 grid grid-cols-5 gap-4'>
                            <ReactSelectBox
                                isSearchable={true}
                                value={fields.billNo}
                                options={billNoList}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    billNo: e,
                                }))}
                                label="Bill Number"
                                onSearchInputChange={(e) => getBillList(e.target.value)}

                            />
                            <ReactSelectBox
                                isSearchable={true}
                                value={fields.receptNo}
                                options={receptNoList}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    receptNo: e,
                                }))}
                                label="Receipt Number"
                                onSearchInputChange={(e) => getReceptList(e.target.value)}
                            />
                            <DateInput
                                disableFuture={true}
                                value={fields.fromDate}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    fromDate: e,
                                }))}
                                label="From Date"
                            />
                            <DateInput
                                disableFuture={true}
                                value={fields.toDate}
                                onChange={(e: any) => setFields((prevState: any) => ({
                                    ...prevState,
                                    toDate: e,
                                }))}
                                label="To Date"
                            />
                            <div className='w-full flex gap-3'>
                                <ActionButton
                                    buttonText="Search"
                                    width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handelSearchRecept}
                                />
                                <ActionButton
                                    buttonText="Reset"
                                    width="w-[100px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={handelReset}
                                />
                            </div>
                        </div>
                        <div className='w-full mt-4'>
                            <div className="data-grid-newThem">
                                <ReactDatagrid rows={oPReceptData} columns={columns} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OPRecept