"use client"
import ActionButton from '@/app/_common/button';
import RadiologyPrintlayout from '@/app/_common/PrintLayout/RadiologyPrintLayout';
import { ReactSelectBox } from '@/app/_commonfeatures';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import QuillRichEditer from '@/app/_commonfeatures/QuillRichEditer';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import { getAllEquipmentData, getDepartmentPrac, getLabEquipment, getRadiologyEquipment } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select';

interface ResultEnteryFormProps {
    feildsData: any,
    setFeildsData: Dispatch<SetStateAction<any>>
    listSel: any,
    setListSel: Dispatch<SetStateAction<any>>
    selectfeilds: any,
    setSelectFeilds: Dispatch<SetStateAction<any>>
    setLoader: Dispatch<SetStateAction<any>>
    btnStatues: any,
    loader: any,
    onSave: any,
    onVerify: any,
    setConsumables: any,
    consumables: any,
    verified: any,
    loader1: any,
    patientData: any,
    orderData: any,
    screenInfo: any,
}
const ResultEnteryForm: FC<ResultEnteryFormProps> = ({ feildsData, setFeildsData, listSel, setListSel, selectfeilds, setSelectFeilds, btnStatues, loader, onSave, setLoader, setConsumables, consumables, onVerify, verified, loader1, patientData, orderData, screenInfo }) => {
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => reader.result ? resolve(reader.result.toString()) : reject(new Error("Failed to convert image to base64."));
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await convertToBase64(file);
            setFeildsData((prevData: any) =>
                prevData.map((item: any, i: number) => i === index ? { ...item, result: base64 } : item)
            );
        }
    };

    const handleChange = (index: number, value: any, key = "result") => {
        setFeildsData((prevData: any) =>
            prevData.map((item: any, i: number) => i === index ? { ...item, [key]: value } : item)
        );
    };
    const pathologistList: any = [
        { label: "test 1", value: "test 1" },
        { label: "test 2", value: "test 2" },
    ]
    const [multSel, setMultSel] = useState<any>(null)
    const prdVal: any = [
        { value: "Antibiotic 1", label: "Antibiotic 1" },
        { value: "Antibiotic 2", label: "Antibiotic 2" },
        { value: "Antibiotic 3", label: "Antibiotic 3" },
    ]
    const [addOrg, setAddOrg] = useState<any>([])
    const [equipmentList, setEquipmentList] = useState<any>([])
    const [verifyedBy, setVerifyedBy] = useState<any>([])
    const [suspect, setSuspect] = useState<any>({})
    const suspectibilityData: any = [
        { label: "Sensitive", value: "Sensitive" },
        { label: "Resistance", value: "Resistance" },
    ]
    let headers = getHeaderResponse()
    const reagentsList: any = [
        {
            label: "Masks",
            value: "Masks",
        },
        {
            label: "Surgical drapes",
            value: "Surgical drapes",
        },
        {
            label: "Epidural kits",
            value: "Epidural kits",
        },
        {
            label: "Gauze",
            value: "Gauze",
        },
        {
            label: "Syringes",
            value: "Syringes",
        },
        {
            label: "Catheters",
            value: "Catheters",
        },
    ]

    // console.log(orderData)
    const getEquipment = () => {
        const url: any = `${getAllEquipmentData}specialityCode=${orderData?.specialityCode}&departMentCode=&type=${orderData?.departmentCode}`
        services.get(url).then((response) => {
            // console.log(response.data)
            let result: any = response.data.map((list: any) => ({
                ...list,
                label: list.equipmentDesc,
                value: list.equipmentCode,
            }))
            setEquipmentList(result);
        });
    };


    // const filterByDepartmentCode = (data: any, code: any) => {
    //     if (!Array.isArray(data)) {
    //         console.error("Expected data to be an array, but got:", data);
    //         return [];
    //     }
    //     const res: any = data
    //         .map((group: any) => Array.isArray(group.equipmentList) ? group.equipmentList : [])
    //         .reduce((acc: any[], curr: any[]) => acc.concat(curr), []) 
    //         .filter((equipment: any) => equipment.radiologySpecialityCode === code);
    //     return res
    // };

    // const getEquipment = () => {
    //     services.get(getLabEquipment).then((response) => {
    //         let result = response.data[0].equipmentList.map((list: any) => ({
    //             ...list,
    //             label: list.equipmentDesc,
    //             value: list.equipmentId,
    //         }))
    //         setEquipmentList(result);
    //     });
    // };
    const handleSelectChange = (data: any) => {
        setConsumables(data);
    }
    // getting the doctor list function
    const handledepartmentDropdown = () => {
        let getDeportment = "D015";
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
        handledepartmentDropdown()
    }, [])
    useEffect(() => {
        getEquipment()
    }, [orderData?.specialityCode])

    return (
        <>
            <div id="divToPrint" className="hidden w-full">
                <RadiologyPrintlayout
                    patientid={orderData.patientId}
                    opdEncounterId={patientData.opdEncounterId}
                    orderId={patientData.orderId}
                    billNumber={patientData.billNumber}
                    serviceName={orderData.serviceName}
                    verifiedBy={verifyedBy?.label !== "Verified By" ? verifyedBy?.label : ''}
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
                                                width: "30%",
                                            }}
                                        >
                                            Parameter
                                        </th>
                                        <th
                                            style={{
                                                borderCollapse: "collapse",
                                                padding: "5px 15px",
                                                textAlign: "left",
                                                width: "70%",
                                            }}
                                        >
                                            Result
                                        </th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {feildsData.length > 0 ? (
                                        feildsData.map((item: any, index: number) => (
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
                                                    {item?.parameter}
                                                </td>
                                                <td
                                                    style={{
                                                        borderCollapse: "collapse",
                                                        padding: "5px 15px",
                                                    }}
                                                >
                                                    {item?.resultType === "file" ? (
                                                        <img
                                                            src={item.result}
                                                            alt="Selected"
                                                            style={{ width: "100px" }}
                                                        />
                                                    ) : item?.resultType === "textbox" ? (
                                                        <>
                                                            <div dangerouslySetInnerHTML={{ __html: item.result }} />

                                                        </>
                                                    ) : (
                                                        item?.result
                                                    )}
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
            </div>
            <div className="w-full border mt-6 p-2">
                <div className="w-full flex gap-4">
                    <div className="w-1/3 mb-2">Parameter</div>
                    <div className="w-2/3 mb-2">Result</div>

                </div>
                {feildsData.map((field: any, index: number) => (
                    <div className="w-full flex gap-4" key={index}>
                        <div className="w-1/3 mb-2">{field?.parameter}</div>
                        <div className="w-2/3 mb-2">
                            {field?.resultType === "list" ? (
                                <Select
                                    isDisabled={verified}
                                    primaryColor="blue"
                                    value={listSel[`sel${index}`]}
                                    options={field?.options}
                                    onChange={(e: any) => {
                                        handleChange(index, e.label);
                                        setListSel((prevListSel: any) => ({ ...prevListSel, [`sel${index}`]: e }));
                                    }}
                                    placeholder="Results"
                                />
                            ) : field?.resultType === "textbox" ? (
                                <>
                                    <QuillRichEditer
                                        statValue={field?.result ? field?.result : field?.contentText}
                                        onChange={(data: any) => handleChange(index, data)}
                                    />

                                </>
                            ) : field?.resultType === "file" ? (
                                <>
                                    <input
                                        type="file"
                                        className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={(e) => handleImageChange(e, index)}
                                        disabled={verified}
                                    />
                                    {field?.result && <img src={field?.result} alt="Selected" style={{ width: "100px" }} />}
                                </>
                            ) : (
                                field?.resultType === "link" ? (
                                    <>
                                        <input
                                            disabled={verified}
                                            type="file"
                                            className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                                            onChange={(e) => handleImageChange(e, index)}
                                        />
                                    </>

                                ) : (
                                    <input
                                        disabled={verified}
                                        placeholder="Result"
                                        value={field?.result}
                                        type={field?.resultType}
                                        className="flex py-2 px-3 w-full text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none"
                                        onChange={(e) => handleChange(index, e.target.value)}
                                    />
                                ))}
                        </div>

                    </div>
                ))}


            </div>
            <div className='w-full mt-4 flex gap-3'>
                <div className='w-1/2'>
                    <div className='flex gap-4'>
                        <div className='w-1/3'>
                            <ReactSelectBox
                                isDisabled={verified}
                                value={selectfeilds?.pathologist}
                                options={verifyedBy}
                                onChange={(e: any) => {
                                    setSelectFeilds({ ...selectfeilds, "pathologist": e })
                                }}
                                height="100"
                                label="Verified By"
                            />
                        </div>
                        <div className='w-1/3'>
                            <ReactSelectBox
                                isDisabled={verified}
                                isMultiple={true}
                                value={consumables}
                                options={reagentsList}
                                onChange={handleSelectChange}
                                label="Consumables"
                                height="100"
                            />

                        </div>
                        <div className='w-1/3'>
                            <ReactSelectBox
                                isDisabled={verified}
                                value={selectfeilds.equipment}
                                options={equipmentList}
                                onChange={(e: any) => {
                                    setSelectFeilds({ ...selectfeilds, "equipment": e })
                                }}
                                height="100"
                                label="Equipment"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full mt-6 pb-4 flex gap-3 justify-end'>
                <div className='w-1/2'>
                    <div className='flex justify-end gap-4'>
                        {/* <ActionButton
                            buttonText={
                                loader ?
                                    <div className='w-full flex justify-center items-center'>
                                        <div className='innerBtnloader'></div>
                                    </div> :
                                    btnStatues !== "save" ? "Update" : "Save"
                            }
                            width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            handleSubmit={onSave}
                            disabled={verified}
                        /> */}
                        {screenInfo?.Save === 1 && btnStatues === "save" &&
                            <ActionButton
                                buttonText={loader ?
                                    <div className='w-full flex justify-center items-center'>
                                        <div className='innerBtnloader'></div>
                                    </div>
                                    : "Save"
                                }
                                width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={onSave}
                                disabled={verified}
                            />
                        }

                        {screenInfo?.Update === 1 && btnStatues !== "save" &&
                            <ActionButton
                                buttonText={loader ?
                                    <div className='w-full flex justify-center items-center'>
                                        <div className='innerBtnloader'></div>
                                    </div>
                                    : "Update"
                                }
                                width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={onSave}
                                disabled={verified}
                            />
                        }

                        {screenInfo?.Update !== 1 && screenInfo?.Save !== 0 && btnStatues !== "save" &&
                            <ActionButton
                                buttonText={loader ?
                                    <div className='w-full flex justify-center items-center'>
                                        <div className='innerBtnloader'></div>
                                    </div>
                                    : "Save"
                                }
                                width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={true}
                            />
                        }


                        <ActionButton
                            // buttonText="Verify"
                            buttonText={
                                loader1 ?
                                    <div className='w-full flex justify-center items-center'>
                                        <div className='innerBtnloader'></div>
                                    </div> : "Verify"
                            }
                            width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            handleSubmit={onVerify}
                            disabled={verified}
                        />
                        {screenInfo?.Print === 1 &&
                            <ActionButton
                                buttonText="Print"
                                width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={PrintRecord}
                            />
                        }
                        {/* <ActionButton
                            buttonText="Cancel Result"
                            width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        /> */}
                    </div>
                </div>
            </div>

        </>
    )
}


export default ResultEnteryForm