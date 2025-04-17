"use client"
import { LabPagetitle } from '@/app/lab/_component'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PatientHeader from './components/PatientHeader'
import Payment from './components/Payment'
import { getOpReceiptDetails, getPatientDetailsforPrint, getReceptDataByBillNum } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import { toast } from 'react-toastify'
import { getHeaderResponse } from '@/app/_commonfeatures/header'

const BillNumberInfo = () => {
    const [showBalanceStatus, setShowBalanceStatus] = useState<any>(false)
    const [billNoInfo, setBillNoInfo] = useState<any>()
    const [patientData, setPatientData] = useState<any>()
    const [paymentInfo, setPaymentInfo] = useState<any>([]);
    const [receiptNumInfo, setReceiptNumInfo] = useState<any>();
    const { receiptNum } = useParams()
    const header = getHeaderResponse()

    const getBillNoInfo = async () => {
        const url = `${getOpReceiptDetails}billNumber=&receiptNum=${receiptNum}&fromDate=&toDate=`
        try {
            const res = await services.get(url)
            let status = res.data[0].balanceStatus === 1 ? true : false
            setBillNoInfo(res.data[0])
            setShowBalanceStatus(status)
            await getPatientData(res.data[0].patientId, res.data[0].encounterId)
        } catch (error) {
            toast.error("something went wrong, please try again")
        }
    }

    // get pationt data gunction
    const getReceptDataByBillnoData = async () => {
        try {
            const { data } = await services.get(`${getReceptDataByBillNum}${receiptNum}`);
            setReceiptNumInfo(data)
            if (data.opBillingReceiptDto.length > 0) {
                const paymentDetails = data.opBillingReceiptDto[0].paymentDetails;
                const formattedPayments = Object.keys(paymentDetails).map
                    ((paymentType: any) => ({
                        paymentId: Math.random(),
                        paymentType: paymentType,
                        amount: paymentDetails[paymentType].amount.toString(),
                    }));
                setPaymentInfo(formattedPayments)
            }
        } catch (error: any) {
            console.error("Error fetching receipt data:", error.message);
        }
    };


    // get pationt data gunction
    const getPatientData = async (patientid: any, opdEncounterId: any) => {
        try {
            const data = await services.get(
                `${getPatientDetailsforPrint}${patientid}/${opdEncounterId}`
            );
            // console.log(data.data[0]);
            setPatientData(data.data[0]);
        } catch (error: any) {
            console.log(error.message)
        }

    };

    useEffect(() => {
        getBillNoInfo()
        getReceptDataByBillnoData()
    }, [])
    return (

        <>
            <div className="top-0 w-full ">
                <div className="mx-auto mt-4  max-w-7xl pb-0">
                    <div className='bg-white p-2 px-4 rounded-md'>
                        <LabPagetitle title={`OP Receipt: ${receiptNum}`} />
                        <div className='w-full my-4'>
                            <PatientHeader patientData={patientData} billNoInfo={billNoInfo} />
                        </div>
                        <div className='w-full my-4 flex gap-4'>
                            <div>
                                <span className='text-gray-800 font-semibold'>Total Bill Amount : </span>
                                <span>{billNoInfo?.revenueAmount}</span>
                            </div>{"|"}
                            <div>
                                <span className='text-gray-800 font-semibold'>Receipt Amount : </span>
                                <span>{billNoInfo?.receiptAmount}</span>
                            </div>{"|"}
                            <div>
                                <span className='text-gray-800 font-semibold'>Discount Amount : </span>
                                <span>{billNoInfo?.discountAmount}</span>
                            </div>{"|"}
                            <div>
                                <span className='text-gray-800 font-semibold'>Cancelled Amount : </span>
                                <span>{billNoInfo?.cancelAmount}</span>
                            </div>{"|"}
                            <div>
                                <span className='text-gray-800 font-semibold'>OutStanding Amount : </span>
                                <span>{billNoInfo?.outStandingAmount}</span>
                            </div>
                        </div>
                        <div className='w-full'>
                            <Payment
                                paymentInfo={paymentInfo}
                                setPaymentInfo={setPaymentInfo}
                                billNoInfo={billNoInfo}
                                payable={billNoInfo?.outStandingAmount}
                                showBalanceStatus={showBalanceStatus}
                                receiptNumInfo={receiptNumInfo}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BillNumberInfo