"use client"
import React, { useEffect, useState } from 'react'
import ResultPatientHeader from './components/ResultPatientHeader'
import { ReactSelectBox } from '@/app/_commonfeatures'
import ResultEnteryForm from './components/ResultEnteryForm'
import services from '@/app/utilities/services'
import { getPatientDetails, getProceduresDetailsByOrderId, getProcedureServicesData, getProcedureServicesDataAfterSave, getProcedureTemplet, saveProcedureResultEntry, updateprocedureResultEntry, verifyProcedureResultEntry } from '@/app/utilities/api-urls'
import { useParams, useRouter } from "next/navigation";
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import { toast } from 'react-toastify'
import { getLocalItem } from '@/app/utilities/local'
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc'
import NoScreenData from '@/app/_common/NoScreenData'

const ResultEnteryMainPage = (props: any) => {
    let headers = getHeaderResponse()
    const { orderId } = useParams();
    const [verified, setVerified] = useState<any>(false);
    const [btnStatues, setBtnStatues] = useState<any>("save");

    const [showaddendum, setShowAddendum] = useState<any>(false)
    const [loader, setLoader] = useState<any>(false)
    const [loader1, setLoader1] = useState<any>(false)
    const [resultTemplate, setResultTemplate] = useState<any>("")
    const [serviceTemplate, setServiceTemplate] = useState<any>([])
    const [feildsData, setFeildsData] = useState<any>([])
    const [orderData, setOrderData] = useState<any>({})
    const [serviceData, setServiceData] = useState<any>({})
    const [patientData, setPatientData] = useState<any>({})
    const [consumables, setConsumables] = useState<any>(null)
    const [selectfeilds, setSelectFeilds] = useState<any>({
        equipment: "",
        pathologist: "",
    })
    let resultTemplateDetails: any = [
        { label: "test 1", value: "test 1" },
        { label: "test 2", value: "test 2" },
    ]
    const router = useRouter()
    const [listSel, setListSel] = useState<any>({})
    //employe name
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

    // input types data
    const feildsinfo = [
        { resultType: "list", parameter: "test 1", listValue: [{ value: "test 1", label: "test 1" }] },
        { resultType: "textbox", parameter: "test 2", },
        { resultType: "textbox", parameter: "test 7", },
        { resultType: "string", parameter: "test 3", units: "10", referanceRange: "7-10" },
        { resultType: "file", parameter: "test 4" },
        { resultType: "number", parameter: "test 5", value: 10, units: "10", referanceRange: "7-10" },
        { resultType: "link", parameter: "test 6", },

    ]


    const handelShowAddendum = () => {
        setShowAddendum(!showaddendum)
    }

    // getting Service Details function
    const getServiceDetails = async () => {

        try {
            // Fetch the order data
            const response = await services.get(`${getProceduresDetailsByOrderId}${orderId}`);
            setOrderData(response.data);
            getPatientData(response.data.patientId, response.data.encounterId, response.data.orderId)
            // geeting result template function
            services
                .get(
                    `${getProcedureTemplet}serviceName=${response.data.serviceName}&serviceCode=${response.data.serviceCode}`
                )
                .then((response) => {
                    const resultServiceTemplate = response.data.map((item: any) => ({
                        ...item,
                        label: item.proceduresResultTemplateName,
                        value: item.proceduresResultTemplateName,
                    }))
                    setServiceTemplate(resultServiceTemplate)
                });

            const entered = response.data.orderDetailsItemList.some(
                (item: any) => item.event.toLowerCase() === "result entered"
            );
            const verified = response.data.orderDetailsItemList.some(
                (item: any) => item.event.toLowerCase() === "result verified"
            );

            if (entered || verified) {
                const serviceResponse: any = await services.get(
                    `${getProcedureServicesDataAfterSave}${orderId}`
                );
                let result = serviceResponse.data.procedureResultEntryItemDto?.map((mainList: any, index: any) => {
                    if (mainList.resultType === "list") {
                        // If valueList is null, return the object with an empty array for valueList
                        if (mainList.result) {
                            setListSel((prev: any) => {
                                return {
                                    ...prev,
                                    [`sel${index}`]: {
                                        label: mainList.result,
                                    },
                                };
                            });
                        }
                        if (mainList.valueList === null || mainList.valueList === "") {
                            return {
                                ...mainList,
                                options: []

                            };
                        } else {
                            // Otherwise, map over the valueList to create the desired structure
                            let getData = mainList?.valueList?.map((innerList: any) => {
                                return {
                                    label: innerList,
                                    value: innerList,
                                };
                            });
                            setListSel((prev: any) => {
                                return {
                                    ...prev,
                                    [`options${index}`]: getData,
                                };
                            });
                            return {
                                ...mainList,
                                options: getData,
                            };
                        }
                    }
                    // If resultType is not "list", return the object as is
                    return mainList;
                });
                setFeildsData(result)
                setBtnStatues("update")
                setServiceData(serviceResponse.data)

                if (verified) {
                    setVerified(true)
                }

                // Map over the array to create an array of objects
                if (serviceResponse?.data?.consumables) {
                    const arr = serviceResponse.data.consumables.split(',');
                    const consumablesArray = arr.map((item: any) => ({
                        label: item.trim(),
                        value: item.trim()
                    }));
                    setConsumables(consumablesArray)
                }

                setSelectFeilds(
                    {
                        ...selectfeilds,
                        pathologist: serviceResponse.data.verifiedBy !== null ? { label: serviceResponse.data.verifiedBy } : "",
                        equipment: serviceResponse.data.equipment !== null ? { label: serviceResponse.data.equipment } : "",
                    });

            }
            else {
                const serviceResponse: any = await services.get(
                    `${getProcedureServicesData}serviceCode=${response.data.serviceCode}&serviceName=${response.data.serviceName}`
                );
                //values set to select box new code
                let result = serviceResponse?.data?.assignProcedureParameterItemSet?.map((mainList: any, index: any) => {
                    mainList.parameter = mainList.procedureParameterDesc;
                    if (mainList.resultType === "list") {
                        // If valueList is null, return the object with an empty array for valueList
                        if (mainList.valueList === null || mainList.valueList === "") {
                            return {
                                ...mainList,
                                options: [],
                            };
                        } else {
                            // Otherwise, map over the valueList to create the desired structure
                            let getData = mainList?.valueList?.map((innerList: any) => {
                                return {
                                    label: innerList,
                                    value: innerList,
                                };
                            });
                            setListSel((prev: any) => {
                                return {
                                    ...prev,
                                    [`options${index}`]: getData,
                                };
                            });
                            return {
                                ...mainList,
                                options: getData,
                            };
                        }
                    }
                    // If resultType is not "list", return the object as is

                    return mainList;
                });


                setFeildsData(result)

                setServiceData(serviceResponse.data)
                //setFeildsData(serviceResponse.data.assignParameterItemSet)
            }
            // Fetch the radiology services data using the response from the previous api call


        } catch (error: any) {
            console.log(error.message);
        }
    };

    //save Radiology Result Entry Function
    const onSave = () => {
        setLoader(true)
        const examCompleted: any = orderData.orderDetailsItemList
        const examCompletedData = examCompleted[examCompleted.length - 1];
        const url = btnStatues === "save" ? saveProcedureResultEntry : updateprocedureResultEntry;
        const message = btnStatues === "save" ? "Successfully saved the record" : "Successfully updated the record";

        let consumablesString: any;
        if (consumables) {
            consumablesString = consumables.map((item: any) => item.label).join(',');
        }
        const procedureResulEntryItemSetData = feildsData.map((list: any) => ({
            ...list,
            procedureEntryItemId: btnStatues === "save" ? null : list.procedureEntryItemId,
            parameter: list.parameter,
            result: list.result,
            units: list.units,
            refrenceRange: list.refrenceRange,
            statusFlag: 1,
            resultType: list.resultType,
            generatedDate: list.generatedDate,
            updatedDate: list.updatedDate,
        }))


        const postObj = {
            procedureEnryHeaderId: btnStatues === "save" ? null : serviceData.procedureEnryHeaderId,
            patientId: orderData.patientId,
            patientName: patientData.patientName,
            patientMrn: patientData.MRN,
            opdEncouterId: orderData.encounterId,
            specimenType: orderData.specimenType,
            examCompletedDate: examCompletedData.eventTime,
            resultVerifedDateTime: null,
            speciality: orderData.specialityDesc,
            resultEntryType: orderData.resultEntryType,
            department: orderData.departmentDesc,
            serviceName: orderData.serviceName,
            snomedCode: orderData.snomedCode,
            orderId: orderData.orderId,
            departmentCode: orderData.departmentCode,
            specialityCode: orderData.specialityCode,
            serviceCode: orderData.serviceCode,
            statusFlag: 1,
            generatedBy: empName,
            equipment: selectfeilds.equipment.label,
            consumables: consumablesString,
            procedureResultEntryItemDto: procedureResulEntryItemSetData
        }
        //save Radiology Result Entry api call
        services.create(url, postObj, headers)
            .then((res) => {
                setTimeout(() => {
                    setLoader(false)
                    toast.success(message)
                    setBtnStatues("update")
                    getServiceDetails()
                }, 1000);

            })
            .catch((error) => {
                setLoader(false)
                console.log(error)
                toast.error("something went wrong please try again")
            })
            .finally(() => {
                setLoader(false)
            })
        setLoader(false)
    }

    // on verify function
    const onVerify = () => {

        const postObj = {
            patientId: orderData.patientId,
            opdEncouterId: orderData.encounterId,
            generatedBy: empName,
            orderId: patientData.orderId,
            procedureEnryHeaderId: serviceData.procedureEnryHeaderId,
            verifiedBy: selectfeilds.pathologist.label,
        }
        if (!selectfeilds.pathologist.label) {
            toast.error("Please select the verify By")
        }
        else {
            //console.log(postObj)
            setLoader1(true)
            services.create(verifyProcedureResultEntry, postObj, headers)
                .then((res) => {
                    setTimeout(() => {
                        setLoader1(false)
                        toast.success("successfully verifyed the record")
                        getServiceDetails()
                    }, 1000);
                })
                .catch((error) => {
                    setLoader1(false)
                    console.log(error)
                    toast.error("something went wrong please try again")
                })
                .finally(() => {
                    setLoader1(false)
                })
            setLoader1(false)
        }
    }

    // get pationt data gunction
    const getPatientData = async (patientid: any, opdEncounterId: any, orderId: any) => {
        try {
            const data = await services.get(
                `${getPatientDetails}${patientid}/${opdEncounterId}/${orderId}`
            );
            setPatientData(data.data);
        } catch (error: any) {
            console.log(error.message)
        }

    };


    // getting the result template function
    const handelResultTemplate = (inputVal: any) => {
        // console.log(inputVal)
        setResultTemplate(inputVal)
        setServiceData(inputVal);
        // let result = inputVal?.proceduresResultTemplateItemDto?.map((list: any) => ({
        //     ...list,
        //     procedureParameterDesc: list.parameterDesc,
        // }))
        let result = inputVal?.proceduresResultTemplateItemDto?.map((mainList: any, index: any) => {
            mainList.parameter = mainList.parameterDesc;
            if (mainList.resultType === "list") {
                // If valueList is null, return the object with an empty array for valueList
                if (mainList.result) {
                    setListSel((prev: any) => {
                        return {
                            ...prev,
                            [`sel${index}`]: {
                                label: mainList.result,
                            },
                        };
                    });
                }
                if (mainList.valueList === null || mainList.valueList === "") {
                    return {
                        ...mainList,
                        options: []

                    };
                } else {
                    // Otherwise, map over the valueList to create the desired structure
                    let getData = mainList?.valueList?.map((innerList: any) => {
                        return {
                            label: innerList,
                            value: innerList,
                        };
                    });
                    setListSel((prev: any) => {
                        return {
                            ...prev,
                            [`options${index}`]: getData,
                        };
                    });
                    return {
                        ...mainList,
                        options: getData,
                    };
                }
            }
            // If resultType is not "list", return the object as is
            return mainList;
        });
        setFeildsData(result)
    }


    useEffect(() => {
        // setFeildsData(feildsinfo)
        getServiceDetails()
    }, [])
    // console.log(patientData.department)

    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <>
            <div className='w-full flex justify-between'>
                <div className='w-auto text-[#707070] font-bold text-[18px]'>
                    Procedures Result Entry

                </div>
                {/* <span className='text-blue-400 cursor-pointer hover:underline'>Back</span> */}
                <div onClick={() => router.back()}>{/*href={`/procedures/0/${orderId}/order-details`}>*/}
                    <span className="cursor-pointer text-white  text-[14px] py-2 px-6 rounded-lg  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]" >
                        Back
                    </span>
                </div>
            </div>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                {/* Result Patient Header */}
                <div className="w-full mt-4">
                    <ResultPatientHeader patientData={patientData} />
                </div>

                {/* Result Service Info */}
                <div className='w-full mt-4 flex gap-4'>
                    <div className='w-3/4'>
                        <strong>Service Name:</strong>{orderData.serviceName}{" "}|{" "}
                        <strong>Department:</strong>Procedures {" "}|{" "}
                        <strong>Speciality:</strong>{orderData.specialityDesc}
                    </div>

                    <div className='w-1/4'>
                        <ReactSelectBox
                            value={resultTemplate}
                            options={serviceTemplate}
                            onChange={
                                (e) => handelResultTemplate(e)
                            }
                            label="Select Result Template"
                            isDisabled={verified}
                        />

                    </div>
                </div>

                {/* Result Form */}
                <div className='w-full mt-6 '>
                    <ResultEnteryForm
                        feildsData={feildsData}
                        setFeildsData={setFeildsData}
                        listSel={listSel}
                        setListSel={setListSel}
                        selectfeilds={selectfeilds}
                        setSelectFeilds={setSelectFeilds}
                        btnStatues={btnStatues}
                        loader={loader}
                        setLoader={setLoader}
                        onSave={onSave}
                        onVerify={onVerify}
                        consumables={consumables}
                        setConsumables={setConsumables}
                        verified={verified}
                        loader1={loader1}
                        patientData={patientData}
                        orderData={orderData}
                        screenInfo={props?.screenData}
                    />
                </div>
                {/* <div>
                {verified && verified === true ?
                    <div className='w-full border rounded-md mt-10'>
                        <div className='px-2 py-3 bg-gray-300 text-black cursor-pointer flex justify-between' onClick={handelShowAddendum}>
                            Addendum
                            <div >
                                {showaddendum ?
                                    <ChevronUpIcon className='w-5 h-5' />
                                    : <ChevronDownIcon className='w-5 h-5' />
                                }
                            </div>
                        </div>
                        {showaddendum &&
                            <div className='p-3'>
                                <ResultEntryAddendum
                                    orderId={orderId}
                                    empName={empName}
                                    headers={headers}
                                />
                            </div>
                        }
                    </div>
                    : null}
            </div> */}
            </div>
        </>
    )
}

export default roleInfoScreenData(ResultEnteryMainPage, "Pre")