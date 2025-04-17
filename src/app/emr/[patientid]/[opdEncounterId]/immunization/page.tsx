"use client"

import React, { useCallback, useEffect, useState } from 'react'
import services from '@/app/utilities/services'
import {
    DoctorList,
    getAdditionalVaccinationList,
    getImmunizationRecord,
    getImmunizationRecordDataById,
} from '@/app/utilities/api-urls'
import { useParams } from 'next/navigation'
import moment from 'moment'
import ImmunizationRecords from './ImmunizationRecords/ImmunizationRecords'
import AdditionalVaccinationRecord from './AdditionalVaccinationRecord/AdditionalVaccinationRecord'
import useLoginResponse from './useLoginResponse'
import { getLocalItem } from '@/app/utilities/local'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc'
import NoScreenData from '@/app/_common/NoScreenData'

const Immunization = (props: any) => {
    const { patientid, opdEncounterId } = useParams()

    // get the login respoonse from the below custome hook
    const { loggedDetalls, patinetDob, setPatientDob } = useLoginResponse()

    // statefor store immunization master saved record
    const [imzMasterSaveData, setImzMasterSaveData] = useState<any>([])

    // After save the immunzation record and get the data from below api
    const [imnzRecord, setImnzRecord] = useState<any>([])

    const [recordField, setRecordField] = useState<any>({})

    // sotre Doctors list
    const [storeDoctor, setStoreDoctor] = useState<any>([])

    // store dueDate 
    const [storeDueDate, setStoreDueDate] = useState<any>([])

    // store vaccination list
    const [vaccinationname, setVaccinationname] = useState<any>([])

    // get Additional Vaccination List
    const [AdditionVacciSaveData, setAdditionVacciSaveData] = useState<any>([])
    const getResponse = JSON.parse(getLocalItem("loginResponse") ?? '')
    const headers = getHeaderResponse();

    // get the Immunization record after add into the Master data
    const getImmunizationRecordData = () => {

        // Doctors List
        services.get(DoctorList)
            .then((res) => {

                //filter loggedDetail with emaployeeid and employeename                
                setStoreDoctor(res.data.map((list: any) => {
                    return {
                        employeeId: list.employeeId,
                        label: list.firstName,
                        value: list.firstName
                    }
                }).filter((list: any) => list.label != undefined))
            })
            .catch((err) => {
                console.log(err)
            })

        // get the all data from immunization master save list
        services.get(getImmunizationRecord)

            .then((res: any) => {
                setImzMasterSaveData(res.data.map((list: any, index: any) => {
                    return {
                        ...list,
                        id: index + 1,
                        age: list.schedulePeriod,
                        vaccineName: list.immunizationDesc,
                        doseUnit: list.doseUnit,
                        dueDate: patinetDob,
                        administred: list.administred,
                        administeredDate: list.administeredDate,
                        administeredByDoctor: list.administeredByDoctor,
                        batchNumber: list.batchNumber,
                        expiryDate: list.expiryDate,
                        nextDueDate: list.nextDueDate,
                        manufacturer: list.manufacturer,
                        isActive: false,
                        patientId: patientid,
                        isSave: list.isSave,
                        snomedCode: list.snomedCode,
                        snomedDesc: list.snomedDesc,
                        vaccineNum: index + 1
                    }
                }))

                res.data.map((list: any, index: any) => {
                    setRecordField((prev: any) => {
                        return {
                            ...prev,
                            [`doctor${index}`]: {
                                label: list.administeredByDoctor === undefined || list.administeredByDoctor === '' ? loggedDetalls.employeename : list.administeredByDoctor,
                                value: list.administeredByDoctor === undefined || list.administeredByDoctor === '' ? loggedDetalls.employeename : list.administeredByDoctor,
                            }
                        }
                    })

                })

                setVaccinationname(res.data.map((list: any, index: any) => {
                    return {
                        label: list.immunizationDesc,
                        value: list.immunizationCode,
                    }

                }))


            })
            .catch((err) => console.log(err))
    }

    // // get the Immunization Record after save the Immunization Record
    const getSaveImmunizationRecordData = () => {
        services.get(getImmunizationRecordDataById + patientid)
            .then((res) => {
                setImnzRecord(res.data.map((list: any, index: any) => {
                    return {
                        id: index + 1,
                        doseUnit: list.doseUnit,
                        administred: list.administred,
                        administeredDate: list.administeredDate,
                        administeredByDoctor: list.administeredByDoctor === null ? loggedDetalls.employeename : list.administeredByDoctor,
                        batchNumber: list.batchNumber,
                        manufacturer: list.manufacturer,
                        expiryDate: list.expiryDate,
                        nextDueDate: list.nextDueDate,
                        isActive: list.isActive,
                        isSave: list.isSave,
                        vaccineNum: list.vaccineNum,
                        immunizationCode: list.immunizationCode,
                        vaccineSerial: list.vaccineSerial
                    }
                }))

                res.data.map((list: any, index: any) => {
                    setRecordField((prev: any) => {
                        return {
                            ...prev,
                            [`sel${index}`]: {
                                label: list.administred,
                                value: list.administred
                            },
                            [`doctor${index}`]: {
                                label: list.administeredByDoctor === null ? loggedDetalls.employeename : list.administeredByDoctor,
                                value: list.administeredByDoctor === null ? loggedDetalls.employeename : list.administeredByDoctor
                            }
                        }
                    })
                })

            })
            .catch((err) => console.log(err))
    }

    // below function and varible set the date of the next vacination
    var afterDobDates: any;
    var getDueDate: any = []
    var getMonthsData: any = []
    var endDate: any;
    var startDate: any;

    const getAgeFilter = (age: any, index: any) => {
        const yourBirthDate = moment(patinetDob);
        switch (age) {
            case "0 days":
                afterDobDates = yourBirthDate;
                getDueDate[index] = afterDobDates
                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())
                return afterDobDates;

            case "6 weeks":
                afterDobDates = yourBirthDate.clone().add(6, 'weeks').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;

            case "10 weeks":
                afterDobDates = yourBirthDate.clone().add(10, 'weeks').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;

            case "14 weeks":
                afterDobDates = yourBirthDate.clone().add(14, 'weeks').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "6 months":
                afterDobDates = yourBirthDate.clone().add(6, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "7 months":
                afterDobDates = yourBirthDate.clone().add(7, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "8 months":
                afterDobDates = yourBirthDate.clone().add(8, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "9 months":
                afterDobDates = yourBirthDate.clone().add(9, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "12 months":
                afterDobDates = yourBirthDate.clone().add(12, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "14 months":
                afterDobDates = yourBirthDate.clone().add(14, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;
            case "15 months":
                afterDobDates = yourBirthDate.clone().add(15, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;
            case "17 months":
                afterDobDates = yourBirthDate.clone().add(17, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;
            case "19 months":
                afterDobDates = yourBirthDate.clone().add(19, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;
            case "5 years":
                afterDobDates = yourBirthDate.clone().add(5, 'years').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;
            case "10 years":
                afterDobDates = yourBirthDate.clone().add(5, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;

            case "11 years":
                afterDobDates = yourBirthDate.clone().add(11, 'years').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;

            case "2nd year":
                afterDobDates = yourBirthDate.clone().add(2, 'years').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;

            case "3rd year":
                afterDobDates = yourBirthDate.clone().add(36, 'months').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())

                return afterDobDates;

            case "4th year":
                afterDobDates = yourBirthDate.clone().add(4, 'years').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;

            case "5th year":
                afterDobDates = yourBirthDate.clone().add(5, 'years').format('YYYY-MM-DD');
                getDueDate[index] = afterDobDates

                endDate = moment(afterDobDates).format("YYYY-MM-DD")
                startDate = moment().format("YYYY-MM-DD")
                getMonthsData[index] = new Date(startDate).getMonth() -
                    new Date(endDate).getMonth() +
                    12 * (new Date(startDate).getFullYear() - new Date(endDate).getFullYear())


                return afterDobDates;

            default:
                return getDueDate
        }
    }

    // Merge two get records in one record arrays based on the 'id' property    
    const mergedArray = imzMasterSaveData.map((list: any, index: any) => {
        getAgeFilter(list.age, index)
        return {
            ...list,
            dueDate: getDueDate[index],
            outDated: getMonthsData[index]
        }
    }).map((item1: any) => {
        const matchingItem2 = imnzRecord.find((item2: any) => (item2.vaccineNum === item1.vaccineNum) || (item2.id === item1.id));
        return { ...item1, ...(matchingItem2 || {}) };
    })

    // get additional Vaccination Record after save Addtional Record
    const getAdditionalVccinationRecordData = () => {
        {
            services.get(getAdditionalVaccinationList + patientid)
                .then((res) => {
                    setAdditionVacciSaveData(res.data)

                    res.data.map((list: any, index: any) => {
                        setRecordField((prev: any) => {
                            return {
                                ...prev,
                                [`additionalsel${index}`]: {
                                    label: list.administred === null ? "-----" : list.administred,
                                    value: list.administred === null ? "-----" : list.administred
                                },
                                [`additionaldoctor${index}`]: {
                                    label: list.administeredByDoctor === null ? loggedDetalls.employeename : list.administeredByDoctor,
                                    value: list.administeredByDoctor === null ? loggedDetalls.employeename : list.administeredByDoctor
                                }
                            }
                        })
                    })
                })
                .catch((err) => console.log(err))
        }
    }

    useEffect(() => {
        setStoreDueDate({ ...storeDueDate, getDueDate: afterDobDates })
        getImmunizationRecordData();
        getSaveImmunizationRecordData();
        getAdditionalVccinationRecordData();
    }, [])

    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>

                {/* Datagrid table used here */}


                <ImmunizationRecords
                    imzMasterSaveData={mergedArray}
                    setImzMasterSaveData={setImzMasterSaveData}
                    storeDoctor={storeDoctor}
                    recordField={recordField}
                    setRecordField={setRecordField}
                    getSaveImmunizationRecordData={getSaveImmunizationRecordData}
                    patientid={patientid}
                    opdEncounterId={opdEncounterId}
                    headers={headers}
                />

                <AdditionalVaccinationRecord
                    storeDoctor={storeDoctor}
                    recordField={recordField}
                    setRecordField={setRecordField}
                    patientid={patientid}
                    opdEncounterId={opdEncounterId}
                    vaccinationname={vaccinationname}
                    loggedDetalls={loggedDetalls}
                    getAdditionalVccinationRecordData={getAdditionalVccinationRecordData}
                    AdditionVacciSaveData={AdditionVacciSaveData}
                    setAdditionVacciSaveData={setAdditionVacciSaveData}
                    headers={headers}
                />
            </div>
            {/* End Datagrid table used here */}
        </>
    )
}

export default roleInfoScreenData(Immunization, "IMM")
