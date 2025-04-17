
"use client"
import ActionButton from '@/app/_common/button'
import DateInput from '@/app/_common/date-input'
import FormPropsTextFields from '@/app/_common/input'
import services from '@/app/utilities/services'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select'
import { resft } from './Reasonforrequest'
import { toast } from 'react-toastify'
import { getAllCpeoMasterRecord, getProcudersCpoeData, updateCPOE } from '@/app/utilities/api-urls'
import { useParams } from 'next/navigation'


const AllTabCpoeForm = (props: any) => {
    const { patientid, opdEncounterId } = useParams();
    const opAssementHeaderIdEdit = props.sendDataRecord ? props?.sendDataRecord?.opAssementHeaderId : null

    const serviceItmes = [
        { value: "Routine", label: "Routine" },
        { value: "STAT", label: "STAT" },
        { value: "Urgent", label: "Urgent" }
    ]

    const [fields, setFields] = useState<any>({
        snomedsrch: {},
        requestdate: '',
        conceptId: '',
        prty: {},
    })

    const [selectFields, setSelectFields] = useState<any>([])


    const selectresonForTest = resft.map((list: any) => {
        return {
            ...list,
            value: list.Code,
            label: list.Display
        }
    })


    const handleDiagnosisSearch = (data: any) => {

        setFields({
            ...fields,
            snomedsrch: data,
            conceptId: data.serviceCode,
            department: data.departmentDesc,
            specialty: data.superSpecialityDesc,
            modality: data?.superSpecialityDesc,
            records: data
        })
    }

    const onselectPrority = (data: any) => {


        setFields({ ...fields, prty: data })
    }

    const onselectResonforTesting = (data: any) => {
        setFields({ ...fields, reasonForTesting: data })
    }

    const fieldOnchange = (e: any) => {

        setFields({ ...fields, [e.target.name]: e.target.value })
    }


    const addLibararyData = () => {

        if (fields.snomedsrch.label === "Service Items Search") {
            toast.error("Please don't blank service items search field...")
        }
        else if (fields.prty.label === "Select Priority") {
            toast.error("Please don't blank select priority field...")
        }
        else {
            /*
       
           "cpoeType": "Laboratory",
           "basePrice":"1200.00",
           "labServiceDesc": "Amino Acids Urea Cycle Panel LC/MS/MS", - get service desc
           "serviceCode":"LB1003680", - get service code 
           "department": "Laboratory", -
           "specialty": "Biochemistry",
           "specimen": null,
           "modality": "Biochemistry",
           "priority": "Routine",
           "requestdate": "2024-02-03",
           "opAssementCpoeId": null,
           "status": "New Order",
           "comments": "Pain In Ear",
           "reasonForTesting": "Choroidal hemorrhage",
           "statusFlag": 1,
           "snomedCode":"313402005",   - get terminology code 
           "snomedDescription":"Plasma amino acid measurement (procedure)" - get terminology Desc  
       */
            let postObj: any = {
                cpoeType: props.tabType,
                basePrice: fields?.records?.basePrice?.toString(),
                labServiceDesc: fields?.records?.serviceDesc,
                serviceCode: fields?.records?.serviceCode,
                department: fields.department,
                specialty: fields.specialty,
                specimen: fields.specimen,
                modality: fields.modality,
                priority: fields.prty?.label,
                requestdate: fields.requestdate !== null ? fields.requestdate : moment().format("YYYY-MM-DD"),
                opAssementCpoeId: null,
                status: "New Order",
                comments: fields.comments,
                reasonForTesting: fields.reasonForTesting?.label,
                statusFlag: 1,
                snomedCode: fields?.records?.masterTerminologyDto[0]?.terminologyCode,
                snomedDescription: fields?.records?.masterTerminologyDto[0]?.terminologyDesc,
                serviceType: fields?.records?.serviceType,
                serviceTypeDesc: fields?.records?.serviceTypeDesc

                // cpoeCode: Math.random() + 1,
                // snomedData: {
                //     hierarchy: "finding",
                //     isPreferredTerm: "1",
                //     conceptState: "1",
                //     conceptFsn: fields.snomedsrch?.label,
                //     definitionStatus: "900000000000074008",
                //     conceptId: fields.conceptId,
                //     languageCode: "en",
                //     typeId: "SYNONYM",
                //     term: fields.snomedsrch?.value,
                //     caseSignificanceId: "CASE_INSENSITIVE",
                //     requestdate: fields.requestdate,
                //     activeStatus: 1,
                //     moduleId: "900000000000207008"
                // }
            }


            let getStoreData: any = [...props.getAddAllCpoe, postObj].reduce((acc: any, ccmpl: any) => {
                let obj = acc.find((c: any) => (c.labServiceDesc === ccmpl.labServiceDesc) && (c.reasonForTesting === ccmpl.reasonForTesting) && (c.comments === ccmpl.comments));
                if (obj) {
                    return acc;
                }
                else {
                    return acc.concat([ccmpl])
                }
            }, []).filter((list: any) => list.opAssementCpoeId === null)

            // this is save record
            props.setStore(getStoreData)

            props.setGetAddAllCpoe(
                [...props.getAddAllCpoe, postObj].reduce((acc: any, ccmpl: any) => {
                    let obj = acc.find((c: any) => (c.labServiceDesc === ccmpl.labServiceDesc) && (c.reasonForTesting === ccmpl.reasonForTesting) && (c.comments === ccmpl.comments));
                    if (obj) {
                        toast.error("You Have Enter Same Value Again. Please be awair...")
                        return acc;
                    }
                    else {
                        return acc.concat([ccmpl])
                    }
                }, [])
            )

            props.setSendEditRecord((prev: any) => {
                return {
                    ...prev,
                    serviceCode: "",
                    labServiceDesc: "Service Items Search",
                    department: "",
                    specialty: "",
                    specimen: "",
                    modality: "",
                    priority: "Select Priority",
                    requestdate: null,
                    status: "",
                    comments: "",
                    reasonForTesting: "Reason For Testing",
                    statusFlag: "",
                    id: "",
                    opAssementCpoeId: ""
                }
            })
        }
    }


    const UpDateLibararyData = () => {

        let getfinalData = props.getAddAllCpoe.map((list: any) => {
            if (list.id === fields.id) {
                return {
                    ...list,
                    cpoeType: fields.cpoeType,
                    basePrice: list.basePrice,
                    serviceCode: fields.conceptId,
                    labServiceDesc: fields.snomedsrch?.label,
                    department: fields.department,
                    specialty: fields.specialty,
                    specimen: fields.specimen,
                    modality: fields.modality,
                    priority: fields.prty?.label,
                    requestdate: fields.requestdate,
                    status: 'New Order',
                    comments: fields.comments,
                    reasonForTesting: fields.reasonForTesting?.label,
                    id: fields.id,
                    opAssementCpoeId: fields.id,
                    snomedCode: fields?.records?.masterTerminologyDto[0]?.terminologyCode,
                    snomedDescription: fields?.records?.masterTerminologyDto[0]?.terminologyDesc,
                    statusFlag: 1,
                }
            }
            return list
        }).map((list: any) => {
            return {
                ...list,
                labServiceDesc: list.labServiceDesc
            }
        })

        props.setGetAddAllCpoe(getfinalData)


        let updateOBJ = {
            /*

                    patientId={patientid}
                    opdEncounterId={opdEncounterId}
                    patintName={patientDetials.patientName}
                    mrn={patientDetials.mrnNum}


                "opAssementHeaderId":63,
                "patientId": 939,
                "opdEncounterId": 1412,
                "recordedBy": "Kranthi b",
                "statusFlag": 1,
                "patintName": "Daram  Karthik",
                "mrn": "34822",
            */
            opAssementHeaderId: opAssementHeaderIdEdit,
            patientId: Number(patientid),
            opdEncounterId: Number(opdEncounterId),
            patintName: props.patintDetails.patientName,
            mrn: props.patintDetails.mrn,
            recordedBy: props.recordedBy,
            statusFlag: 1,
            opAssessmentCpoeSet: getfinalData
        }

        services.create(updateCPOE, updateOBJ)
            .then((res: any) => {

                toast.success(`Successfully Updated ${props.tabType} Record...`)
                props.getCpoeData();
                props.setSendEditRecord((prev: any) => {
                    return {
                        ...prev,
                        serviceCode: "",
                        labServiceDesc: "Service Items Search",
                        department: "",
                        specialty: "",
                        specimen: "",
                        modality: "",
                        priority: "Select Priority",
                        requestdate: null,
                        status: "",
                        comments: "",
                        reasonForTesting: "Reason For Testing",
                        statusFlag: "",
                        id: "",
                        opAssementCpoeId: ""
                    }
                })
            })

    }


    // get All saved service master details By CPOE TYPE
    const getAllMasterRecords = () => {
        let getPath = `${props.tabType === "Procedures" ? getProcudersCpoeData : getAllCpeoMasterRecord}`
        services.get(getPath + props.tabType)
            .then((res) => {

                let getFinalRecord = res.data.map((list: any) => {
                    return {
                        ...list,
                        label: list.serviceDesc,
                        value: list.serviceCode
                    }
                })
                setSelectFields(getFinalRecord)
            })
            .catch((err) => console.log(err))
    }


    const ClearLibraryData = () => {
        setFields({
            conceptId: '',
            requestdate: null,
            comments: "",
            opAssementCpoeId: ""
        })
        props.setSendEditRecord((prev: any) => {
            return {
                ...prev,
                serviceCode: "",
                labServiceDesc: "Service Items Search",
                department: "",
                specialty: "",
                specimen: "",
                modality: "",
                priority: "Select Priority",
                requestdate: moment(),
                status: "",
                comments: "",
                reasonForTesting: "Reason For Testing",
                statusFlag: "",
                id: "",
                opAssementCpoeId: ""
            }
        })
    }


    useEffect(() => {
        // getResonforTesting()

        setFields({
            opAssementCpoeId: props.sendDataRecord && props.sendDataRecord.opAssementCpoeId,
            id: props.sendDataRecord && props.sendDataRecord.id,
            cpoeType: props.sendDataRecord && props.sendDataRecord.cpoeType,
            conceptId: props.sendDataRecord && props.sendDataRecord.serviceCode,
            department: props.sendDataRecord && props.sendDataRecord.department,
            specialty: props.sendDataRecord && props.sendDataRecord.specialty,
            specimen: props.sendDataRecord && props.sendDataRecord.specimen,
            modality: props.sendDataRecord && props.sendDataRecord.modality,
            snomedsrch: {
                label: props.sendDataRecord ? props.sendDataRecord.labServiceDesc : "Service Items Search",
                value: props.sendDataRecord ? props.sendDataRecord.labServiceDesc : "Service Items Search"
            },
            prty: {
                label: props.sendDataRecord ? props.sendDataRecord.priority : "Select Priority",
                value: props.sendDataRecord ? props.sendDataRecord.priority : "Select Priority"
            },
            requestdate: props.sendDataRecord ? props.sendDataRecord?.requestdate : null,
            comments: props.sendDataRecord && props.sendDataRecord.comments,
            reasonForTesting: {
                value: props.sendDataRecord ? props.sendDataRecord.reasonForTesting : "Reason For Testing",
                label: props.sendDataRecord ? props.sendDataRecord.reasonForTesting : "Reason For Testing"
            },
        })

        getAllMasterRecords();

    }, [props.sendDataRecord, props.tabType])



    return (
        <>
            <div className="w-1/4">
                <div className="mb-3 my-select relative">
                    <Select
                        primaryColor={"indigo"}
                        value={fields.snomedsrch}
                        options={selectFields}
                        onChange={handleDiagnosisSearch}
                        placeholder='Service Item Search'
                        isSearchable={true}
                        classNames={{
                            menuButton: ({ isDisabled }: any) => (
                                `flex capitalize py-0.5 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`
                            ),
                            menu: "absolute z-10 !max-w-lg bg-white  shadow-lg border rounded-[7px] mb-3 mt-1.5 text-sm text-gray-700",
                            listItem: ({ isSelected }: any) => (
                                `block transition duration-200 capitalize px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                }`
                            )
                        }}
                    />
                    <label
                        style={{ fontSize: "11px", color: "rgba(0, 0, 0, 0.6)" }}
                        className={`${fields.snomedsrch?.label !== 'Service Items Search' ? ' bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]' : 'text-sm opacity-0 top-10'} 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     ` }>
                        Service Item Search
                    </label>
                </div>
                <div className="mb-3">
                    <FormPropsTextFields
                        label="Snomed Code"
                        name="conceptId"
                        value={fields.conceptId}
                        className="pointer-events-none !bg-[#eceff1]"
                    />
                </div>
                <div className="mb-3">
                    <FormPropsTextFields
                        label="Department"
                        name="department"
                        value={fields.department}
                        className="pointer-events-none !bg-[#eceff1]"
                    />
                </div>
                <div className="mb-3">
                    <FormPropsTextFields
                        label="Speciality"
                        name="specialty"
                        value={fields.specialty}
                        className="pointer-events-none !bg-[#eceff1]"
                    />
                </div>
                {
                    props.tabType === "Laboratory" ?
                        <>
                            {/* <div className="mb-3">
                                <FormPropsTextFields
                                    label="Specimen"
                                    name="specimen"
                                    value={fields.specimen}
                                    className="pointer-events-none !bg-[#eceff1]"
                                />
                            </div> */}
                        </> :
                        props.tabType === "Radiology" ?
                            <>
                                <div className="mb-3">
                                    <FormPropsTextFields
                                        label="Modality"
                                        name="modality"
                                        value={fields.modality}
                                        className="pointer-events-none !bg-[#eceff1]"
                                    />
                                </div>
                            </> :
                            <>
                            </>
                }


                <div className="mb-3 my-select relative">

                    <Select
                        primaryColor={"indigo"}
                        value={fields.prty}
                        options={serviceItmes}
                        onChange={onselectPrority}
                        placeholder='Select Priority'
                        classNames={{
                            menuButton: ({ isDisabled }: any) => (
                                `flex py-0.5 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`
                            ),
                            menu: "absolute z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                            listItem: ({ isSelected }: any) => (
                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                }`
                            )
                        }}
                    />

                    <label
                        style={{ fontSize: "11px", color: "rgba(0, 0, 0, 0.6)" }}
                        className={`${fields.prty?.label !== 'Select Priority' ? ' bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]' : 'text-sm opacity-0 top-10'} 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}>
                        Select Priority
                    </label>
                </div>
                <div className="mb-3">
                    <DateInput
                        disableFuture={true}
                        label="Request Date"
                        value={fields.requestdate === null ? moment() : moment(fields.requestdate)}
                        // value={moment(fields.requestdate !== null ? fields.requestdate : fields.requestdate)}
                        onChange={(e: any) => setFields((prevState: any) => ({
                            ...prevState,
                            requestdate: moment(e).format('YYYY-MM-DD'),
                        }))}
                    />
                </div>
                <div className="mb-3 my-select relative">

                    <Select
                        primaryColor={"indigo"}
                        value={fields.reasonForTesting}
                        options={selectresonForTest}
                        onChange={onselectResonforTesting}
                        placeholder="Reason For Testing"
                        isSearchable={true}
                        classNames={{
                            menuButton: ({ isDisabled }: any) => (
                                `flex py-0.5 text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`
                            ),
                            menu: "absolute z-10 !max-w-lg bg-white shadow-lg border rounded-[7px] mb-3 mt-1.5 text-sm text-gray-700",
                            listItem: ({ isSelected }: any) => (
                                `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                }`
                            )
                        }}
                    />
                    {/* {`${fields?.reasonForTesting?.label !== '' ? fields.reasonForTesting : `Reason for testing`}`} */}
                    <label
                        style={{ fontSize: "11px", color: "rgba(0, 0, 0, 0.6)" }}
                        className={`${fields.reasonForTesting?.label !== 'Reason For Testing' ? ' bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]' : 'text-sm opacity-0 top-10'} 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}>
                        Reason for testing
                    </label>
                </div>
                {/* <div className="mb-3">
                    <FormPropsTextFields
                        label="Reason for testing"
                        name="reasonForTesting"
                        value={fields.reasonForTesting}
                        handleChange={fieldOnchange}
                    />
                </div> */}
                <div className="mb-3">
                    <FormPropsTextFields
                        label={`Comments For ${props.tabType}`}
                        name="comments"
                        value={fields.comments}
                        handleChange={fieldOnchange}
                    />
                </div>
                <div className="mb-3 flex justify-end gap-x-3">
                    {
                        fields.opAssementCpoeId ?
                            <>
                                <ActionButton buttonText="Update"
                                    handleSubmit={UpDateLibararyData}
                                    width="w-[120px] py-3"
                                />
                            </>
                            :
                            <>
                                <ActionButton buttonText="Add"
                                    handleSubmit={addLibararyData}
                                    width="w-[120px] py-3"
                                />
                            </>
                    }

                    <ActionButton
                        handleSubmit={ClearLibraryData}
                        buttonText="Reset"
                        width="w-[120px] py-3 bg-red-500 hover:bg-red-600 border-red-500"
                    />
                </div>
            </div>
        </>
    )
}

export default AllTabCpoeForm
