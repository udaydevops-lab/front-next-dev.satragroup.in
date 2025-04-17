'use client'
import { newgetCPOE } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import React, { FC, useEffect, useState } from 'react'
import CpoeRecords from './CpoeRecords'

interface ServiceOrderCpoeprops {
    patientid: any,
    opdEncounterId: any
}

const ServiceOrderCpoe: FC<ServiceOrderCpoeprops> = ({
    patientid,
    opdEncounterId
}) => {

    const [cpeoRecord, setCpoeRecord] = useState<any>({})

    const getCpoeData = async (Cpoetype: string) => {
        services.get(newgetCPOE + `patientId=${patientid}&opdEncounterId=${opdEncounterId}&cpoeType=${Cpoetype}`)
            .then((res) => {
                console.log(res)
                setCpoeRecord((prev: any) => {
                    return {
                        ...prev,
                        [`${Cpoetype}`]: res.data
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    console.log(cpeoRecord)
    useEffect(() => {
        getCpoeData('Radiology')
        getCpoeData('Procedures')
        getCpoeData('Laboratory')
    }, [patientid, opdEncounterId])
    return (
        <>
            {cpeoRecord.Laboratory && cpeoRecord.Laboratory.length > 0 ?
                <CpoeRecords
                    cpoeTitle={"Laboratory"}
                    data={cpeoRecord.Laboratory}
                /> :
                <div className="flex items-center w-full my-2 ">
                    <div className="w-[30px] z-10">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="w-full">
                        <p className="text-sm">Laboratory</p>
                        <div className="relative">
                            <p>No record for Laboratory</p>
                        </div>
                    </div>
                </div>
            }

            {cpeoRecord.Radiology && cpeoRecord.Radiology.length > 0 ?
                <CpoeRecords
                    cpoeTitle={"Radiology"}
                    data={cpeoRecord.Radiology}
                /> :
                <div className="flex items-center w-full my-2 ">
                    <div className="w-[30px] z-10">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="w-full">
                        <p className="text-sm">Radiology</p>
                        <div className="relative">
                            <p>No record for Radiology</p>
                        </div>
                    </div>
                </div>
            }

            {cpeoRecord.Procedures && cpeoRecord.Procedures.length > 0 ?
                <CpoeRecords
                    cpoeTitle={"Procedures"}
                    data={cpeoRecord.Procedures}
                /> :
                <div className="flex items-center w-full my-2 ">
                    <div className="w-[30px] z-10">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="w-full">
                        <p className="text-sm">Procedures</p>
                        <div className="relative">
                            <p>No record for Procedures</p>
                        </div>
                    </div>
                </div>
            }



        </>
    )
}

export default ServiceOrderCpoe
