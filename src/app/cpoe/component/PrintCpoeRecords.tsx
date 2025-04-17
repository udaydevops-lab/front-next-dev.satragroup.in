import moment from 'moment'
import React from 'react'

const PrintCpoeRecords = (props: any) => {

    return (
        <>
            <div className='w-full'>
                <div className='print-Table mt-5'>
                    <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: "100%" }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', textAlign: "left", width: "30px" }}>S.No</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "80%" }}>Order Details</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "10%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.getAddAllCpoe && props.getAddAllCpoe.map((list: any, index: any) =>
                            (
                                <>
                                    <tr key={index + 1}>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>
                                            {`
                                                ${list.conceptFsn ? `${list.conceptFsn} |` : ""}  
                                                ${list.department ? `${list.department} |` : ""}
                                                ${list.conceptId ? `${list.conceptId} |` : ""}
                                                ${list.specimen ? `${list.specimen} |` : ""}
                                                ${list.modality ? `${list.modality} |` : ""}
                                                ${list.priority ? `${list.priority} |` : ""} 
                                                ${list.requestdate ? `${moment(list.requestdate).format("DD-MM-YYYY")} |` : ""} 
                                                ${list.reasonForTesting ? `${list.reasonForTesting} |` : ""} 
                                                ${list.comments ? `${list.comments} |` : ""}
                                            `}
                                        </td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.status}</td>
                                    </tr>
                                </>
                            )
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default PrintCpoeRecords
