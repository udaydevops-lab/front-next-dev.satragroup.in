import { getOPEmrData } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ReasonforvisitTab = () => {
    const { patientid, opdEncounterId } = useParams();
    const [resonForVisit, setResonForVisit] = useState<any>([])

    const getReasonForVisitData = () => {
        services.get(getOPEmrData + patientid + "/" + opdEncounterId + "/reasonForVisit")
            .then((res: any) => {
                setResonForVisit(res.data.reasonForVisit.filter((list: any) => list.inActiverow === false))
            })
    }

    useEffect(() => {
        getReasonForVisitData();
    }, [])

    return (
        <>
            <div className="cust-card-body flex flex-col p-2 text-xs">
                {resonForVisit.length > 0 ?
                    <>
                        <ul className=' list-decimal ms-3'>
                            {resonForVisit.map((list: any) => (
                                <>
                                    <li className='mb-1 text-xs text-gray-600'>{list.desc} || {list.recordDateTime} || {list.recordedBy}</li>
                                </>
                            )).reverse().splice(0, 4)}
                        </ul>


                    </>
                    :
                    <>
                        <div className="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 px-0 py-1 ">
                            <p>No Records for now</p>
                        </div>
                    </>
                }


            </div>
        </>
    )
}

export default ReasonforvisitTab
