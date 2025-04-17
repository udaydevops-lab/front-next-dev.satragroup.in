"use client";
import React, { FC, useState, useEffect } from "react";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Input } from "@material-tailwind/react";
import ActionButton from "@/app/_common/button";
import GenerateBillPrintLayout from "@/app/_common/PrintLayout/GenerateBillPrintLayout";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import { getLoginResponse } from "@/app/_commonfeatures/header";
import services from "@/app/utilities/services";
import { getConfigData } from "@/app/utilities/api-urls";

interface paymentPageProps {
    totalAmount: any,
    setTotalAmount: any,
    setReceptAmount: any,
    receptAmount: any,
    discountDetails: any,
    generateBill: any,
    backEncounter: any,
    totalDiscount: number,
    paymentDetails: any,
    setPaymentDetails: any,
    outStandingAmount: any,
    setOutStandingAmount: any,
    isDisabled: any,
    selectedItems: any,
    patientId: any,
    encounterId: any,
    loder: any,
    screenData: any,
    billNoRes: any,
    summaryAmounts:any
}

const PaymentPage: FC<paymentPageProps> = ({summaryAmounts, totalDiscount, totalAmount, setTotalAmount, receptAmount, setReceptAmount, discountDetails, generateBill, backEncounter, paymentDetails, setPaymentDetails, outStandingAmount, setOutStandingAmount, isDisabled, patientId, encounterId, selectedItems, loder, screenData, billNoRes }) => {
    const [paymentTypes, setPaymentTypes] = useState<any>("");
    const [paymentInputs, setPaymentInputs] = useState<any>({
        cash: { amount: "" },
        cheque: { amount: "", referenceNumber: "" },
        upi: { amount: "", referenceNumber: "" },
        creditCard: {
            cardName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            amount: "",
            transactionNumber: "",
        },
        debitCard: {
            cardName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            amount: "",
            transactionNumber: "",
        },
    });

    const paymentTypeList: any = [
        { label: "cash", value: "cash" },
        { label: "upi", value: "upi" },
        { label: "cheque", value: "cheque" },
        { label: "credit card", value: "creditCard" },
        { label: "debit card", value: "debitCard" },
    ];

    // Function to handle input changes and update paymentDetails in real-time
    const handleInputChange = (paymentType: string, field: string, value: string) => {
        setPaymentInputs((prevData: any) => ({
            ...prevData,
            [paymentType]: {
                ...prevData[paymentType],
                [field]: value,
            },
        }));

    }

    //apply button function
    const applyPayment = () => {
        if (!paymentTypes) return;
        const paymentId = Math.random();

        const newPaymentEntry: any = {
            paymentId,
            paymentType: paymentTypes.label,
        };
        if (paymentTypes.value === 'cash') {
            newPaymentEntry.amount = paymentInputs.cash.amount
        } else if (paymentTypes.value === 'cheque') {
            newPaymentEntry.referenceNumber = paymentInputs.cheque.referenceNumber;
            newPaymentEntry.amount = paymentInputs.cheque.amount;
        } else if (paymentTypes.value === 'upi') {
            newPaymentEntry.referenceNumber = paymentInputs.upi.referenceNumber;
            newPaymentEntry.amount = paymentInputs.upi.amount;
        } else if (paymentTypes.value === 'creditCard') {
            newPaymentEntry.amount = paymentInputs.creditCard.amount;
            newPaymentEntry.cardName = paymentInputs.creditCard.cardName;
            newPaymentEntry.cardNumber = paymentInputs.creditCard.cardNumber;
            newPaymentEntry.expiryDate = paymentInputs.creditCard.expiryDate;
            newPaymentEntry.cvv = paymentInputs.creditCard.cvv;
            newPaymentEntry.transactionNumber = paymentInputs.creditCard.transactionNumber;
        } else if (paymentTypes.value === 'debitCard') {
            newPaymentEntry.amount = paymentInputs.debitCard.amount;
            newPaymentEntry.cardName = paymentInputs.debitCard.cardName;
            newPaymentEntry.cardNumber = paymentInputs.debitCard.cardNumber;
            newPaymentEntry.expiryDate = paymentInputs.debitCard.expiryDate;
            newPaymentEntry.cvv = paymentInputs.debitCard.cvv;
            newPaymentEntry.transactionNumber = paymentInputs.debitCard.transactionNumber;
        }

        // Check if amount exists before adding to paymentInfo
        if (newPaymentEntry.amount) {
            setPaymentDetails((prevPaymentInfo: any) => [...prevPaymentInfo, newPaymentEntry]);

            // Reset selected payment type and data
            setPaymentTypes("");
            setPaymentInputs({
                cash: { amount: '' },
                upi: { amount: '', referenceNumber: '' },
                cheque: { amount: '', referenceNumber: '' },
                creditCard: { cardName: '', cardNumber: '', expiryDate: '', cvv: '', amount: '', transactionNumber: '' },
                debitCard: { cardName: '', cardNumber: '', expiryDate: '', cvv: '', amount: '', transactionNumber: '' },
            });
        } else {
            console.error("Amount is missing for the selected payment type", paymentTypes);
        }

        // console.log('Applied Payment Data:', newPaymentEntry);
    };
    // Function to calculate and update the total amount from paymentDetails array
    const calculateTotalAmount = () => {
        const total = paymentDetails.reduce((sum: any, detail: any) => {
            const amount = parseFloat(detail.amount || 0);
            return sum + (isNaN(amount) ? 0 : amount);
        }, 0);
        setReceptAmount(total); // Update totalAmount state
    };


    const handlePaymentTypes = (selected: any) => {
        setPaymentTypes(selected);
    };

    // Function to remove payment type and recalculate total amount
    const handleRemovePaymentType = (removedType: string) => {
        const updatedPaymentDetails = paymentDetails.filter(
            (detail: any) => detail.paymentType !== removedType
        );
        setPaymentDetails(updatedPaymentDetails);
        setPaymentInputs((prev: any) => ({
            ...prev,
            [removedType]: { amount: "" },
        }));
    };

    const calculateOutstandingAmount = () => {
        const payableAmount = totalAmount - totalDiscount;
        const outstanding = payableAmount - receptAmount;
        setOutStandingAmount(outstanding > 0 ? outstanding : 0);
    };


    const columns: GridColDef[] = [
        { field: "id", headerName: "S.no", width: 120 },
        { field: "paymentType", headerName: "Payment Mode", width: 200 },
        { field: "amount", headerName: "Amount", width: 120 },
        {
            field: "delete",
            headerName: "Delete",
            width: 100,
            renderCell: (params) => (
                <>
                    <button className="text-center" onClick={() => onDelete(params.row)}>
                        <TrashIcon className="text-red-500 w-5 h-5" />
                    </button>
                </>
            ),
        },
    ];
    // delete payment type function
    const onDelete = (row: any) => {
        // setPaymentInfo((prevInfo: any) => prevInfo.filter((entry: any) => entry.paymentId !== row.paymentId));
        setPaymentDetails((prevInfo: any) => prevInfo.filter((entry: any) => entry.paymentId !== row.paymentId));

    };
    console.log(billNoRes)
    useEffect(() => {
        calculateTotalAmount();
        calculateOutstandingAmount();
    }, [paymentDetails, receptAmount, totalAmount, totalDiscount]);

    //console.log(paymentDetails)
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
    const [gstDetails, setGstDetails] = useState({
        cgst: 0,
        sgst: 0,
    });
    useEffect(() => {
        services
        .get(getConfigData + "GST" + "/0")
        .then((response) => {
            const data = response.data.configData;
            setGstDetails({
            ...gstDetails,
            sgst: Number(data[0].value),
            cgst: Number(data[1].value),
            });
        })
        .catch((err) => {
            console.log(err);
        });
    }, []);
    return (
        <>
            <div id="divToPrint" className="hidden w-full">
                <GenerateBillPrintLayout
                    patientid={patientId}
                    opdEncounterId={encounterId}
                    billNoRes={billNoRes}
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
                                    {selectedItems.length > 0 ? (
                                        selectedItems.map((item: any, index: number) => (
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
                                                    {item?.servicename}
                                                </td>
                                                <td
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        padding: "5px 15px",
                                                    }}
                                                >
                                                    {item?.charge}
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
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '20px', }}>
                                {/* Payment Details Section */}
                                <div style={{ width: '65%', }}>
                                    <h2>Payment Details</h2>
                                    <table style={{ width: '100%', border: '1px solid black', borderCollapse: 'collapse' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Sno</th>
                                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Payment Mode</th>
                                                <th style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                paymentDetails.map((list: any, inx: number) => {
                                                    let displayPaymentType = list.paymentType;

                                                    // Check for card payments (credit or debit card) and display the last 4 digits of the card number
                                                    if (list.paymentType === "credit card" || list.paymentType === "debit card") {
                                                        displayPaymentType = `${list.paymentType}-${list.cardNumber.slice(-4)}`;
                                                    }
                                                    // If referenceNumber exists (like in cheque or UPI), check for it
                                                    if (list.referenceNumber && list.referenceNumber !== "") {
                                                        displayPaymentType = `${list.paymentType}-${list.referenceNumber}`;
                                                    }
                                                    return (
                                                        <tr key={inx}>
                                                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{inx + 1}</td>
                                                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{displayPaymentType}</td>
                                                            <td style={{ border: '1px solid black', padding: '8px', textAlign: 'left' }}>{list.amount}</td>
                                                        </tr>
                                                    );
                                                })

                                            }

                                        </tbody>
                                    </table>
                                </div>

                                {/* Payment Summary Section */}
                                <div style={{ width: '35%', padding: '10px' }}>
                                    <h2>Payment Summary</h2>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Payable Amount:</span>
                                        <span style={{ textAlign: 'right' }}>{totalAmount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Discount Amount:</span>
                                        <span style={{ textAlign: 'right' }}>{totalDiscount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Outstanding Amount:</span>
                                        <span style={{ textAlign: 'right' }}>{outStandingAmount}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>Receipt Amount:</span>
                                        <span style={{ textAlign: 'right' }}>{receptAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                />


            </div>
            <div>
                <div className="font-bold mb-1">Payment Mode</div>
                <div className="w-full pt-2">
                    <div className="w-full">
                        <ReactSelectBox
                            // isMultiple={true}
                            value={paymentTypes}
                            options={paymentTypeList}
                            onChange={(selected) => handlePaymentTypes(selected)}
                            label="Payment Type"
                        />
                    </div>

                    {/* Payment Details for Multiple Selected Payment Types */}
                    <div
                        className={`w-full my-3 space-y-3 ${paymentTypes?.length >= 2 ? `max-h-[250px] overflow-auto` : ``}`}
                    >
                        {paymentTypes && (
                            <>
                                {/* Handle Cash Payment */}
                                {paymentTypes.label === "cash" && (
                                    <div key="cash" className="w-full">
                                        <div className="">Cash Payment</div>
                                        <div className="w-full flex gap-4">
                                            <Input crossOrigin
                                                value={paymentInputs.cash.amount}
                                                onChange={(e) => handleInputChange('cash', 'amount', e.target.value)}
                                                label="Amount"
                                                type="number"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Handle upi Payment */}
                                {paymentTypes.label === "upi" && (
                                    <div key="upi" className="w-full">
                                        <div className="">UPI Payment</div>
                                        <div className="w-full flex gap-4">
                                            <Input crossOrigin
                                                value={paymentInputs.upi.amount}
                                                onChange={(e) => handleInputChange('upi', 'amount', e.target.value)}
                                                label="Amount"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.upi.referenceNumber}
                                                onChange={(e) => handleInputChange('upi', 'referenceNumber', e.target.value)}
                                                label="Reference Number"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                )}
                                {/* Handle Cheque Payment */}
                                {paymentTypes.label === "cheque" && (
                                    <div key="cheque" className="w-full">
                                        <div className="">Cheque Payment</div>
                                        <div className="w-full flex gap-4">
                                            <Input crossOrigin
                                                value={paymentInputs.cheque.amount}
                                                onChange={(e) => handleInputChange('cheque', 'amount', e.target.value)}
                                                label="Amount"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.cheque.referenceNumber}
                                                onChange={(e) => handleInputChange('cheque', 'referenceNumber', e.target.value)}
                                                label="Reference Number"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Handle Credit Card Payment */}
                                {paymentTypes.label === "credit card" && (
                                    <div key="creditCard" className="w-full">
                                        <div className="">Credit Card Payment</div>
                                        <div className="w-full grid gap-4 grid-cols-2">
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.cardName}
                                                onChange={(e) => handleInputChange('creditCard', 'cardName', e.target.value)}
                                                label="Card Name"
                                                type="text"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.cardNumber}
                                                onChange={(e) => handleInputChange('creditCard', 'cardNumber', e.target.value)}
                                                label="Card Number"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.expiryDate}
                                                onChange={(e) => handleInputChange('creditCard', 'expiryDate', e.target.value)}
                                                label="Expiry Date"
                                                type="text"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.cvv}
                                                onChange={(e) => handleInputChange('creditCard', 'cvv', e.target.value)}
                                                label="CVV"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.amount}
                                                onChange={(e) => handleInputChange('creditCard', 'amount', e.target.value)}
                                                label="Amount"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.creditCard.transactionNumber}
                                                onChange={(e) => handleInputChange('creditCard', 'transactionNumber', e.target.value)}
                                                label="Transaction Number"
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Handle Debit Card Payment */}
                                {paymentTypes.label === "debit card" && (
                                    <div key="debitCard" className="w-full">
                                        <div className="text-lg font-semibold mb-2">Debit Card Payment</div>
                                        <div className="w-full grid grid-cols-2 gap-4">
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.cardName}
                                                onChange={(e) => handleInputChange('debitCard', 'cardName', e.target.value)}
                                                label="Card Name"
                                                type="text"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.cardNumber}
                                                onChange={(e) => handleInputChange('debitCard', 'cardNumber', e.target.value)}
                                                label="Card Number"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.expiryDate}
                                                onChange={(e) => handleInputChange('debitCard', 'expiryDate', e.target.value)}
                                                label="Expiry Date"
                                                type="text"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.cvv}
                                                onChange={(e) => handleInputChange('debitCard', 'cvv', e.target.value)}
                                                label="CVV"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.amount}
                                                onChange={(e) => handleInputChange('debitCard', 'amount', e.target.value)}
                                                label="Amount"
                                                type="number"
                                            />
                                            <Input crossOrigin
                                                value={paymentInputs.debitCard.transactionNumber}
                                                onChange={(e) => handleInputChange('debitCard', 'transactionNumber', e.target.value)}
                                                label="Transaction Number"
                                                type="text"
                                            />
                                        </div>
                                    </div>

                                )}
                                <div className="pt-2 flex justify-end">
                                    <ActionButton buttonText="Apply" handleSubmit={applyPayment}
                                        width="w-[120px] text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    />
                                </div>
                            </>
                        )}


                    </div>
                    {/* Displaying Payment table */}
                    <div className="w-full mt-6 mb-4 data-grid-newThem">
                        <ReactDatagrid rows={paymentDetails} hideFooter columns={columns} />

                    </div>

                    {/* Displaying Payment Summary */}
                    <div className="w-full mt-2">
                        <h2 className="font-semibold mb-1">Payment Summary</h2>
                        <div>
                            <div className='w-full p-2 flex justify-between gap-4'>
                                <span>Bill Amount:</span>
                                <span>{summaryAmounts.billAmount}</span>
                            </div>
                            <div className='w-full p-2 flex justify-between gap-4'>
                                <span>Discount Amount:</span>
                                <span>{totalDiscount}</span>
                            </div>
                            {getLoginResponse().billingGstIncluded==0?
                             <div className='w-full p-2 flex justify-between gap-4'>
                                <span>{`GST(CGST (${gstDetails.cgst}%) + SGST(${gstDetails.sgst}%))`}</span>
                                <span>{summaryAmounts.gstAmount}</span>
                             </div>:null}
                            <div className='w-full p-2 flex justify-between gap-4'>
                                <span>Net Amount:</span>
                                <span>{summaryAmounts.netAmount}</span>
                            </div>
                            <div className='w-full p-2 flex justify-between gap-4'>
                                <span>Outstanding Amount:</span>
                                <span>{summaryAmounts.netAmount-receptAmount<0?0:summaryAmounts.netAmount-receptAmount}</span>
                            </div>
                            <div className='w-full p-2 flex justify-between gap-4 font-bold'>
                                <span>Receipt Amount:</span>
                                <span> {receptAmount}</span>
                            </div>

                        </div>
                    </div>
                    {/* Displaying Buttons */}
                    <div className='w-full my-3 flex justify-end gap-4'>
                        {screenData?.Save === 1 &&
                            <ActionButton
                                buttonText={
                                    loder ?
                                        <div className='w-full flex justify-center items-center'>
                                            <div className='innerBtnloader'></div>
                                        </div> :
                                        "Save"
                                }
                                // buttonText="Save"
                                width="w-[120px] py-3 bg-blue-500"
                                handleSubmit={generateBill}
                                disabled={isDisabled}
                            />
                        }
                        <ActionButton
                            buttonText="Back"
                            width="w-[120px] py-3 bg-blue-500"
                            handleSubmit={backEncounter}
                        />
                        {screenData?.Print === 1 &&
                            <ActionButton
                                buttonText="Print"
                                width="w-[120px] py-3 bg-blue-500"
                                handleSubmit={PrintRecord}
                                disabled={!isDisabled}
                            />
                        }
                    </div>
                </div>
            </div>

        </>
    );
};

export default roleInfoScreenData(PaymentPage, "Eb")
//export default PaymentPage;
