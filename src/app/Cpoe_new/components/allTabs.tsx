import React, { useEffect, useState } from 'react'
import AllTabCpoeForm from './allTabCpoeForm'
import AllTabsGrid from './allTabsGrid'
import services from '@/app/utilities/services'
import { cpoePrority, cpoeReasonForTesting, getPatientDetails, newSaveCPOE, newgetCPOE } from '@/app/utilities/api-urls'
import { toast } from 'react-toastify'
import { useParams } from 'next/navigation'
import { getLocalItem } from '@/app/utilities/local'

const AllTabs = (props: any) => {

    const { patientid, opdEncounterId } = useParams()
    const [getAddAllCpoe, setGetAddAllCpoe] = useState<any>([])
    const [store, setStore] = useState<any>([])

    // store the Reason For Test data in this states
    const [selectresonForTest, setSelectresonForTest] = useState<any>([])

    // store the Priority Data in this states
    const [serviceItmes, setServiceItmes] = useState<any>([])

    const storedLoginResponse = getLocalItem("loginResponse");
    let empName;
    try {
        empName = storedLoginResponse ? JSON.parse(storedLoginResponse).employeename : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = ""; // Set a default value or handle the error accordingly
    }
    const doctor = empName

    // for this states we have store the patient details
    const [patientDetials, setatientDetials] = useState<any>({
        patientName: '',
        mrnNum: ''
    })

    // get Patient details below function
    const getPatientData = async () => {
        const data: any = await services.get(
            getPatientDetails + patientid + "/" + opdEncounterId
        );
        setatientDetials({
            ...patientDetials,
            pa9tientName: data.data.middleName,
            mrnNum: data.data.mrn
        })
    }

    const [loader, setLoader] = useState<any>(false)
    // for this we have save the cpoe record in respective CPOETYPE
    const copeSaveSubmission = () => {
        setLoader(true)
        if (store.length === 0) {
            toast.error("Please add alteast one record...")
        } else {

            // New payload for save Cpoe
            /* 
                [
                    {
                        "patientId": 916,
                        "opdEncounterId": 680,
                        "cpoeType": "Laboratory",
                        "servicePrice": "5000.00",
                        "serviceDesc": "Hemogram and platelets WO differential panel (Bld)",
                        "serviceCode": "LB243170",
                        "departmentDesc": "Laboratory",
                        "superSpecialityDes": "Biochemistry",
                        "specimen": null,
                        "modality": "Biochemistry",
                        "priority": "Routine",
                        "requestdate": "2024-02-03",
                        "opdEncounterSerId": null,
                        "status": "New Order",
                        "comments": "Pain In Ear",
                        "reasonForTesting": "Choroidal hemorrhage",
                        "statusFlag": 1,
                        "snomedCode": "313402005",
                        "snomedDescription": "Plasma amino acid measurement (procedure)",
                        "orderFrom":"CPOE",
                        "recordedBy":"harish beechani",
                    }
                ]
            */

            /*                
                {
                    "patientId": 939,
                    "opdEncounterId": 1412,
                    "recordedBy": "Kranthi b",
                    "statusFlag": 1,
                    "patintName": "Daram  Karthik",
                    "mrn": "34822",
                    "opAssessmentCpoeSet": [
                        {
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
                            
                        }
                    ]
                }
            */

            // let savePostObj: any = {
            //     patientId: Number(patientid),
            //     opdEncounterId: Number(opdEncounterId),
            //     recordedBy: doctor,
            //     statusFlag: 1,
            //     patintName: patientDetials.patientName,
            //     mrn: patientDetials.mrnNum,
            //     opAssessmentCpoeSet: store
            // }

            // 
            let savePostObj: any = store.map((list: any) => {
                return {
                    ...list,
                    patientId: Number(patientid),
                    opdEncounterId: Number(opdEncounterId),
                    recordedBy: doctor,
                }
            })

            services.create(newSaveCPOE, savePostObj)
                .then((res) => {
                    setTimeout(() => {
                        setLoader(false)
                        toast.success(`Successfully Added ${props.tabType} Record..`)
                        getCpoeData();
                        setStore([])
                    }, 2000);

                })
                .catch((err) => {
                    setTimeout(() => {
                        console.log(err)
                        toast.error("Getting error, Please try again!");
                        setLoader(false)
                    }, 2000);
                })
        }
    }

    // get copoe data as per the copetype
    const getCpoeData = () => {
        // patientId
        // opdEncounterId
        // cpoeType
        // fromDate
        // toDate
        // orderStatus
        // searchString
        services.get(newgetCPOE + `patientId=${patientid}&opdEncounterId=${opdEncounterId}&cpoeType=${props.tabType}`)
            .then((res: any) => {
                let getfilterCpoetype = res.data.map((list: any, index: any) => {
                    if (list.cpoeType === props.tabType) {
                        return {
                            cpoeType: list.cpoeType,
                            opAssementHeaderId: list?.opAssementHeaderId,
                            serviceCode: list.serviceCode,
                            serviceDesc: list.serviceDesc,
                            departmentDesc: list.departmentDesc,
                            superSpecialityDes: list.superSpecialityDes,
                            specimen: list.specimen,
                            modality: list.modality,
                            priority: list.priority,
                            requestdate: list.requestdate,
                            status: list.status,
                            comments: list.comments,
                            reasonForTesting: list.reasonForTesting,
                            statusFlag: list.statusFlag,
                            opdEncounterSerId: list.opdEncounterSerId,
                            serviceType: list.serviceType,
                            serviceTypeDesc: list.serviceTypeDesc,
                            patientId: Number(patientid),
                            opdEncounterId: Number(opdEncounterId),
                            recordedBy: doctor,
                        }
                    }
                }).filter((list: any) => list.cpoeType === props.tabType)
                    .filter((del: any) => del.statusFlag === 1)

                setGetAddAllCpoe(getfilterCpoetype
                    //     .reduce((acc: any, ccmpl: any) => {
                    //     let obj = acc.find((c: any) => (c.labServiceDesc === ccmpl.labServiceDesc) && (c.reasonForTesting === ccmpl.reasonForTesting) && (c.comments === ccmpl.comments));
                    //     if (obj) {
                    //         return acc;
                    //     }
                    //     else {
                    //         return acc.concat([ccmpl])
                    //     }
                    // }, [])
                )
            })
            .catch((err) => {
                console.log(err)
                // toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.response.status}`)
            })
    }


    const [sendEditRecord, setSendEditRecord] = useState<any>(null)
    const onEdit = (data: any) => {
        console.log(data)
        setSendEditRecord(data)
    }

    // Reason For testing Api call here
    const ReasonForTesting = () => {
        services.get(cpoeReasonForTesting)
            .then((res) => {
                setSelectresonForTest(res.data.configData)
            })
            .catch((err: any) => {
                console.log(err)
            })
    }

    // Reason For testing Api call here
    const CpoePriority = () => {
        services.get(cpoePrority)
            .then((res) => {
                setServiceItmes(res.data.configData)
            })
            .catch((err: any) => {
                console.log(err)
            })
    }


    useEffect(() => {
        getCpoeData();
        CpoePriority();
        getPatientData();
        ReasonForTesting();
    }, [props.tabType])

    return (
        <>
            <div className="flex gap-4">
                <AllTabCpoeForm
                    tabType={props.tabType}
                    setGetAddAllCpoe={setGetAddAllCpoe}
                    getAddAllCpoe={getAddAllCpoe}
                    store={store}
                    setStore={setStore}
                    sendDataRecord={sendEditRecord}
                    getCpoeData={getCpoeData}
                    setSendEditRecord={setSendEditRecord}
                    selectresonForTest={selectresonForTest}
                    serviceItmes={serviceItmes}
                />
                <AllTabsGrid
                    getAddAllCpoe={getAddAllCpoe}
                    copeSaveSubmission={copeSaveSubmission}
                    onEdit={onEdit}
                    getCpoeData={getCpoeData}
                    sendEditRecord={sendEditRecord}
                    setGetAddAllCpoe={setGetAddAllCpoe}
                    setStore={setStore}
                    store={store}
                    tabType={props.tabType}
                    loader={loader}
                />
            </div>


        </>
    )
}

export default AllTabs
