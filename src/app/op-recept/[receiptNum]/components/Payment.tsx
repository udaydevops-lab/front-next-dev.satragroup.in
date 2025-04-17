"use client"
import ActionButton from '@/app/_common/button';
import OpReceiptPrintLayout from '@/app/_common/PrintLayout/OpReceipt';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react';

// Define types for payment data
interface PaymentProps {
    billNoInfo: any
    paymentInfo: any,
    setPaymentInfo: any,
    payable: any,
    showBalanceStatus: any,
    receiptNumInfo: any,
}
const Payment: FC<PaymentProps> = ({ billNoInfo, paymentInfo, setPaymentInfo, payable, showBalanceStatus, receiptNumInfo }) => {
    const [balanceInfo, setBalanceInfo] = useState<any>({});
    const router = useRouter();

    const backEncounter = () => {
        router.push(`/op-recept`);
    };

    const columns: GridColDef[] = [
        { field: "id", headerName: "S.no", width: 120 },
        { field: "paymentType", headerName: "Payment Mode", width: 200 },
        { field: "amount", headerName: "Amount", width: 120 },
        // {
        //     field: "delete",
        //     headerName: "Delete",
        //     width: 100,
        //     renderCell: (params) => (
        //         <>
        //             <TrashIcon className="text-red-500 w-5 h-5" />
        //         </>
        //     ),
        // },
    ];
    // calculations on Receipt  and outstanding amount function
    const handleReceipt = async () => {

        const receiptAmount = paymentInfo.reduce((acc: any, payment: any) => {
            return acc + parseFloat(payment.amount);
        }, 0);

        const outstandingAmount = payable > receiptAmount ? payable - receiptAmount : 0;

        setBalanceInfo((info: any) => ({
            ...info,
            outstanding: outstandingAmount,
            receipt: receiptAmount,
        }));

    }
    // print data function
    const PrintRecord = () => {
        const printContent = document.getElementById("divToPrint");

        if (printContent) {
            const printWindow = window.open(
                "",
                "_blank",
                "width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no"
            );

            if (printWindow) {
                printWindow.document.write(
                    "<html><head><title>Print</title></head><body>"
                );
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write("</body></html>");
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }
    };

    useEffect(() => {
        handleReceipt()
    }, [paymentInfo, billNoInfo])

    console.log(billNoInfo)
    return (
        <>
            <div id="divToPrint" className="hidden w-full">
                <OpReceiptPrintLayout
                    patientid={receiptNumInfo?.patientId}
                    opdEncounterId={receiptNumInfo?.opdEncounterId}
                    billNumber={billNoInfo?.billNumber}
                    content={
                        <>
                            <table style={{ borderCollapse: "collapse", width: "100%" }}>
                                <thead style={{ borderBottom: "1px solid black" }}>
                                    <tr>
                                        <th
                                            style={{
                                                borderCollapse: "collapse",
                                                padding: "5px 15px",
                                                textAlign: "left",
                                                width: "10%",
                                            }}
                                        >
                                            S No
                                        </th>
                                        <th
                                            style={{
                                                borderCollapse: "collapse",
                                                padding: "5px 15px",
                                                textAlign: "left",
                                                width: "60%",
                                            }}
                                        >
                                            Service Name
                                        </th>
                                        <th
                                            style={{
                                                borderCollapse: "collapse",
                                                padding: "5px 15px",
                                                textAlign: "left",
                                                width: "30%",
                                            }}
                                        >
                                            Charge
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {receiptNumInfo?.opBillingItemSet.length > 0 ? (
                                        receiptNumInfo?.opBillingItemSet?.map((item: any, index: number) => (
                                            <tr key={index}>
                                                <td
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        padding: "5px 15px",
                                                    }}
                                                >
                                                    {index + 1}
                                                </td>
                                                <td
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        padding: "5px 15px",
                                                    }}
                                                >
                                                    {item?.serviceName}
                                                </td>
                                                <td
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        padding: "5px 15px",
                                                    }}
                                                >
                                                    {item?.serviceAmount}
                                                </td>


                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td>No results</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </>
                    }
                />
                {/* Displaying Payment Summary in print */}
                <div style={{ width: "100%", marginTop: "10px" }}>
                    <h2>Payment Summary</h2>
                    <div>
                        <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>Total Amount:</span>
                            <span>{billNoInfo?.revenueAmount}</span>
                        </div>
                        <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>Discount Amount:</span>
                            <span>{billNoInfo?.discountAmount}</span>
                        </div>
                        <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>Outstanding Amount:</span>
                            <span>{billNoInfo?.cancelAmount}</span>
                        </div>
                        <div style={{ width: '100%', padding: '0.5rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                            <span>Receipt Amount:</span>
                            <span> {billNoInfo?.receiptAmount}</span>
                        </div>

                    </div>
                </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-8 pt-2">
                <div className={showBalanceStatus ? "pointer-events-auto" : "pointer-events-none"}>
                    <div className="font-bold mb-1">Payment Mode</div>
                    <div className="w-full data-grid-newThem">
                        <ReactDatagrid rows={paymentInfo} columns={columns} />
                    </div>

                </div>
                <div className="p-2">
                    <div className="font-bold mb-1">Payment Summary</div>
                    <div className='w-full py-3'>
                        <div className='w-full flex gap-4 justify-between pb-2'>
                            <span>Payable Amount</span>
                            <span>{payable}</span>
                        </div>
                        <div className='w-full flex gap-4 justify-between pb-2'>
                            <span>OutStanding Amount</span>
                            <span>{balanceInfo?.outstanding}</span>
                        </div>
                        <div className='w-full flex gap-4 justify-between pb-2 font-bold'>
                            <span>Receipt Amount</span>
                            <span>{balanceInfo?.receipt}</span>
                        </div>
                    </div>
                    <div className='w-full flex gap-4 justify-end'>
                        <ActionButton
                            buttonText={"Back"}
                            width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            handleSubmit={backEncounter}
                        />
                        <ActionButton
                            buttonText="Print"
                            width="w-[120px] py-3 bg-blue-500"
                            handleSubmit={PrintRecord}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Payment;
