import moment from 'moment'
import React, { FC } from 'react'

interface CpoeRecordsdetailsprops {
    cpoeTitle: any,
    data: any
}

const CpoeRecords: FC<CpoeRecordsdetailsprops> = ({
    cpoeTitle,
    data
}) => {
    return (
        <>

            <div className="flex items-center w-full my-2 ">
                <div className="w-[30px] z-10">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                <div className="w-full">
                    <p className="text-sm">{cpoeTitle}</p>
                    <ul className=' list-decimal ms-3 mt-1'>
                        {data && data.map((list: any) => (
                            <>
                                <li className='mb-1 text-xs text-gray-600'>{list.serviceDesc} || {list.superSpecialityDesc} || {list.recordedBy} || {moment(list.requestdate).format("DD-MM-YYYY")}</li>
                            </>
                        )).reverse().splice(0, 4)}
                    </ul>

                </div>
            </div>

        </>
    )
}

export default CpoeRecords