"use client"
import React, { FC, useEffect, useState } from 'react'
import { LabPagetitle } from '../lab/_component'
import ReactAccordion from '../_commonfeatures/ReactAccordion';
import ServiceList from './components/ServiceList';
import DiscountPage from './components/Discount';
import PaymentPage from './components/PaymentPage';
import { getLocalItem } from '../utilities/local';
import services from '../utilities/services';
import { getConfigData, saveGenerateBill } from '../utilities/api-urls';
import { getHeaderResponse } from '../_commonfeatures/header';
import { toast } from 'react-toastify';
import { useParams } from "next/navigation";
import NoScreenData from '../_common/NoScreenData';
import roleInfoScreenData from '../_commonfeatures/ScreenDataHoc';
import PatientInfo from './components/PatientInfo';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';


// interface GenerateBillProps {
//     patientName: any,
//     mrnNo: any,
//     getSelectedItems: any,
//     handleBillResponse: any,
//     hideGenerateBill: any,
// }
const GenerateBill = ({ ...props }: any) => {
    const [totalAmount, setTotalAmount] = useState<any>(0)
    const [outStandingAmount, setOutStandingAmount] = useState<any>(0)
    const [receptAmount, setReceptAmount] = useState<any>(0)
    const [discount, setDiscount] = useState<any>(0)
    const [selectedItems, setSelectedItems] = useState<any>([])
    const [servicetypeList, setServicetypeList] = useState<any>([])
    const [discountType, setDiscountType] = useState<any>("");
    const [discountDetails, setDiscountDetails] = useState<any>();
    const [totalDiscount, setTotalDiscount] = useState(0)
    const [deportment, setDeportment] = useState<any>("");
    const [selectedServices, setSelectedServices] = useState<any>([]);
    const [paymentDetails, setPaymentDetails] = useState<any[]>([]);
    const [isDisabled, setIsDisabled] = useState<any>(false)
    const [loder, setLoder] = useState<any>(false)
    const [screenData, setScreenData] = useState<any>()
    const [billNoRes, setBillNoRes] = useState<any>()
    const [summaryAmounts,setSummaryAmounts]=useState<any>({
        billAmount:0,
        gstAmount:0,
        netAmount:0,
        discountAmount:0
    })
    const { mrn, encouterId } = useParams();
    let patientid: any = mrn;
    let opdEncounterId: any = encouterId;

    const header = getHeaderResponse()
    // handel Discount function
    const handelDiscount = () => {

    }
    // geting employee name
    const storedLoginResponse = getLocalItem("loginResponse");
    let empName: any;
    try {
        empName = storedLoginResponse
            ? JSON.parse(storedLoginResponse).employeename
            : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = "";
    }
    const [isAdded,setIsAdded]=useState(true)
    //accordion list
    let accordionItems = [
      {
        title: "Discount",
        content: (
          <DiscountPage
            discount={discount}
            setTotalDiscount={setTotalDiscount}
            totalDiscount={totalDiscount}
            setDiscount={setDiscount}
            handelDiscount={handelDiscount}
            servicetypeList={servicetypeList}
            totalAmount={totalAmount}
            discountType={discountType}
            setDiscountType={setDiscountType}
            discountDetails={discountDetails}
            setDiscountDetails={setDiscountDetails}
            deportment={deportment}
            setDeportment={setDeportment}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
            serviceData={selectedItems}
            setSelectedItems={setSelectedItems}
            setIsAdded={setIsAdded}
            isAdded={isAdded}
          />
        ),
      },
      {
        title: "Service List",
        content: (
          <ServiceList
            isAdded={isAdded}
            setServiceData={setSelectedItems}
            ServiceData={selectedItems}
            discount={discount}
            discountDetails={discountDetails}
            setDiscountDetails={setDiscountDetails}
            setSummaryAmounts={setSummaryAmounts}
          />
        ),
      },
    ];
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

    const getserviceList = async () => {
        let seen = new Set();

        let result = props?.getSelectedItems
            .map((list: any) => ({
                ...list,
                label: list.serviceTypeDesc,
                value: list.servicetype,
            }))
            .filter((item: any) => {
                const duplicate = seen.has(item.value);
                seen.add(item.value);
                return !duplicate;
            });
        let totalAmount = props?.getSelectedItems.reduce((total: any, item: any) => total + item.charge, 0);
        // console.log(result)
        let selectedItems= props.getSelectedItems.map((item:any)=>{
            let gst=item.charge *12/100
            return {
              ...item,
              discount: 0,
              gst: loginResponse.billingGstIncluded == 1 ? 0 : gst,
              netAmount: item.charge + Number(loginResponse.billingGstIncluded == 1 ? 0 : gst),
            };
        })
        setTotalAmount(totalAmount)
        setServicetypeList(result)
        setSelectedItems(selectedItems)
    }

    // back to Encounter function
    const backEncounter = () => {
        props.hideGenerateBill(true)
    }
    const loginResponse=JSON.parse(getLocalItem('loginResponse')!)
    //OP Billing Item function
    const getOPBillingItem = (itms: any) => {
       
        if (!discountDetails || discountDetails.length === 0) {
            return itms.map((service: any) => {
                const index=selectedItems.findIndex((item1:any)=>item1.servicename==service.servicename)
                return {
                  discount: 0,
                  discountPercentage: selectedItems[index].discountPercentage,
                  serviceAmount: service.charge,
                  serviceCode: service.servicecode,
                  serviceType: service.servicetype,
                  serviceName: service.servicename,
                  departmentCode: service.department,
                  departmenttDesc: service.departmentDesc,
                  specialityCode: service.superSpeciality,
                  specialityDesc: service.superSpecialityDesc,
                  billId: null,
                  servicePackRateId: service.servicePktRateId,
                  serviceTypeDesc: service.serviceTypeDesc,
                  isPaid: 1,
                  orderId: service.orderId,
                  opdEncounterSerId: service.opdEncounterSerId,
                  statusFlag: 1,
                  totalGst: Number(gstDetails.cgst) + Number(gstDetails.sgst),
                  cgst: gstDetails.cgst,
                  sgst: gstDetails.sgst,
                  billingGstIncluded: loginResponse.billingGstIncluded,
                };
            });
        } else {
            if (discountDetails[0].serviceName === "total") {
                return itms.map((service: any) => {
                    const index=selectedItems.findIndex((item1:any)=>item1.servicename==service.servicename)
                    return {
                      discount: 1,
                      discountPercentage:
                      selectedItems[index].discountPercentage,
                      serviceAmount: service.charge,
                      serviceCode: service.servicecode,
                      serviceType: service.servicetype,
                      serviceName: service.servicename,
                      departmentCode: service.department,
                      departmenttDesc: service.departmentDesc,
                      specialityCode: service.superSpeciality,
                      specialityDesc: service.superSpecialityDesc,
                      billId: null,
                      servicePackRateId: service.servicePktRateId,
                      serviceTypeDesc: service.serviceTypeDesc,
                      isPaid: 1,
                      orderId: service.orderId,
                      opdEncounterSerId: service.opdEncounterSerId,
                      statusFlag: 1,
                      totalGst: Number(gstDetails.cgst) + Number(gstDetails.sgst),
                      cgst: gstDetails.cgst,
                      sgst: gstDetails.sgst,
                      billingGstIncluded:loginResponse.billingGstIncluded ,
                    };
                });
            }
            else {

                return itms.map((service: any) => {
                    // Find discount for the current service
                    const discount = discountDetails.find((d: any) => d.serviceName === service.serviceTypeDesc);
                    const index=selectedItems.findIndex((item1:any)=>item1.servicename==service.servicename)
                    return {
                        //  ...service,
                        discount:  selectedItems[index].discountPercentage&&selectedItems[index].discountPercentage!==0 ? 1 : 0,
                        discountPercentage: selectedItems[index].discountPercentage,//discount ? Number(discount.percentage) : 0,
                        serviceAmount: service.charge,
                        serviceCode: service.servicecode,
                        serviceType: service.servicetype,
                        serviceName: service.servicename,
                        departmentCode: service.department,
                        departmenttDesc: service.departmentDesc,
                        specialityCode: service.superSpeciality,
                        specialityDesc: service.superSpecialityDesc,
                        billId: null,
                        servicePackRateId: 201,
                        serviceTypeDesc: service.serviceTypeDesc,
                        isPaid: 1,
                        orderId: service.orderId,
                        opdEncounterSerId: service.opdEncounterSerId,
                        statusFlag: 1,
                        totalGst: Number(gstDetails.cgst) + Number(gstDetails.sgst),
                        cgst: gstDetails.cgst,
                        sgst: gstDetails.sgst,
                        billingGstIncluded:loginResponse.billingGstIncluded ,
                    };
                });

            };
        }
    }

    //OP Billing Receipt function
    const getOPBillingReceipt = (amount: any, total: any) => {
        const totalReceived = amount.reduce((acc: number, payment: any) => acc + parseFloat(payment.amount), 0);

        // Define the payment modes and details
        const paymentDetails: any = {};
        const modeOfPayment: string[] = [];

        amount.forEach((payment: any) => {
            const paymentType = payment.paymentType.toLowerCase();
            modeOfPayment.push(paymentType);

            // Add specific payment details for each payment type
            if (paymentType === "credit card") {
                paymentDetails["credit card"] = {
                    amount: payment.amount,
                    cardName: payment.cardName,
                    cardNumber: payment.cardNumber,
                    cvv: payment.cvv,
                    expiryDate: payment.expiryDate,
                    paymentType: payment.paymentType,
                    transactionNumber: payment.transactionNumber
                };
            } else if (paymentType === "debit card") {
                paymentDetails["debit card"] = {
                    amount: payment.amount,
                    cardName: payment.cardName,
                    cardNumber: payment.cardNumber,
                    cvv: payment.cvv,
                    expiryDate: payment.expiryDate,
                    paymentType: payment.paymentType,
                    transactionNumber: payment.transactionNumber
                };
            } else if (paymentType === "cheque") {
                paymentDetails["cheque"] = {
                    amount: payment.amount,
                    referenceNumber: payment.referenceNumber,
                    paymentType: payment.paymentType
                }
            } else if (paymentType === "upi") {
                paymentDetails["upi"] = {
                    amount: payment.amount,
                    referenceNumber: payment.referenceNumber,
                    paymentType: payment.paymentType
                };
            } else if (paymentType === "cash") {
                paymentDetails["cash"] = {
                    amount: payment.amount
                };
            }
        });
        const discountAmount = discountDetails?.reduce((acc: any, curr: any) => acc + curr.amount, 0) || 0;

        const outstandingAmount = total - totalReceived - discountAmount;

        const result = [
            {
                modeOfPayment,
                paymentDetails: paymentDetails,
                receiptAmount: totalReceived,
                generatedId: null,
                discountAmount: discountAmount,
                cancelAmount: 0.00,
                outStandingAmount: outStandingAmount,
                patientId: patientid,
                encounterId: opdEncounterId,
            }
        ];

        return result;
    };

    // Generate Bill function
    const generateBill: any = async () => {
        if (receptAmount === 0) {
            toast.error("Please add a payment.")
            return
        }
        if (summaryAmounts.netAmount < receptAmount) {
            toast.error("The receipt amount cannot exceed the outstanding amount.")
            return
        }
        setLoder(true)
        const opBillingItem = getOPBillingItem(props.getSelectedItems);
        const opBillingReceipt = getOPBillingReceipt(paymentDetails, totalAmount);

        const postObj: any = {
            billHeaderId: null,
            billNumber: null,
            patientId: patientid,
            opdEncounterId: opdEncounterId,
            isPaid: 1,
            generatedId: null,
            generatedBy: empName,
            statusFlag: 1,
            mrn: props.mrnNo,
            patientName: props.patientName,
            opBillingItemSet: opBillingItem,
            opBillingReceiptDto: opBillingReceipt,
        };
        // console.log("postObj",postObj)
        services.create(saveGenerateBill, postObj, header).then((responce) => {
            setTimeout(() => {
                setLoder(false)
                toast.success(responce.data.statusMessage ? responce.data.statusMessage : "success")
                props.setSelectedRowIds([])
                props.handleBillResponse()
                setIsDisabled(true)
                setBillNoRes(responce.data)
            }, 1000);
        }).catch((err) => {
            setLoder(false)
            toast.error(err.responce.data.statusMessage ? err.responce.data.statusMessage : "something wrong, please try again")
        })
    };



    useEffect(() => {
        setIsDisabled(false)
        getserviceList()
        if (!props?.screenData || props?.screenData.View !== 1) {
            setScreenData(props?.screenData)
        }
    }, [])

    //console.log(props?.screenData)
    if (!props?.screenData || props?.screenData.View !== 1) {
        return <NoScreenData />;
    }

    return (
        <>
            <div className={props?.screenData.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <PatientInfo patientid={patientid} opdEncounterId={opdEncounterId} />
                <div className="top-0 w-full ">
                    <div className="mx-auto mt-2 max-w-7xl pb-0">
                        <div className='bg-white p-2 px-4 rounded-md'>
                            {/* <LabPagetitle title='Generate Bill' /> */}
                            <div className="font-bold  md:pt-1 pb-1 flex mx-auto w-full justify-between ">
                                <h1 className="mt-2">Generate Bill</h1>
                            </div>
                            <div className='w-full py-3 grid grid-cols-2 gap-4 '>
                                <div className=''>
                                    {/* <ReactAccordion items={accordionItems} /> */}
                                    <div className="accordion">
                                    {accordionItems.map((item, index) => (
                                        <div key={index} className="border-b border-gray-200">
                                            <button
                                                className="w-full flex justify-between items-center text-left px-4 py-3 "
                                            
                                            >
                                                {/* Accordion Header */}
                                                <span className="text-[14px] font-medium text-gray-700">{item.title}</span>

                                                {/* Chevron Icon based on state */}
                                                {/* {activeIndex === index ? (
                                                    <ChevronUpIcon className="h-5 w-5 text-gray-700" />
                                                ) : (
                                                    <ChevronDownIcon className="h-5 w-5 text-gray-700" />
                                                )} */}
                                            </button>

                                            {/* Accordion Content */}
                                            <div
                                                // className={`transition-max-height duration-500 ease-in-out overflow-hidden ${activeIndex === index ? 'max-h-screen' : 'max-h-0'
                                                //     }`}
                                            >
                                                <div className="p-4 bg-white text-gray-600">
                                                    {item.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                </div>
                                <div className=''>
                                    <PaymentPage
                                        totalAmount={totalAmount}
                                        setTotalAmount={setTotalAmount}
                                        receptAmount={receptAmount}
                                        setReceptAmount={setReceptAmount}
                                        discountDetails={discountDetails}
                                        totalDiscount={totalDiscount}
                                        generateBill={generateBill}
                                        backEncounter={backEncounter}
                                        paymentDetails={paymentDetails}
                                        setPaymentDetails={setPaymentDetails}
                                        setOutStandingAmount={setOutStandingAmount}
                                        outStandingAmount={outStandingAmount}
                                        isDisabled={isDisabled}
                                        patientId={patientid}
                                        encounterId={opdEncounterId}
                                        selectedItems={selectedItems}
                                        loder={loder}
                                        screenData={screenData}
                                        billNoRes={billNoRes}
                                        summaryAmounts={summaryAmounts}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default roleInfoScreenData(GenerateBill, "Eb")
