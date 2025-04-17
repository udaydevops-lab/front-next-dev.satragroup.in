import moment from 'moment'
import React from 'react'

const PrintCpoeRecords = (props: any) => {

    return (
        <>
            <div className='w-full'>
                <div className='print-Table mt-2'>
                    <table style={{ borderCollapse: 'collapse', width: "100%" }}>
                        <thead style={{ paddingBottom: "10px" }}>
                            <tr>
                                <th style={{ borderCollapse: 'collapse', padding: '15px 15px', textAlign: "left", width: "30px" }}>S.No</th>
                                <th style={{ borderCollapse: 'collapse', padding: '15px 15px', width: "80%" }}>Order Details</th>
                                <th style={{ borderCollapse: 'collapse', padding: '15px 15px', width: "10%" }}>Status</th>
                            </tr>
                        </thead>
                        <tbody style={{ borderTop: "1px solid #aaa", paddingTop: "0px", position: "relative", top: "10px" }}>
                            {props.getAddAllCpoe && props.getAddAllCpoe.map((list: any, index: any) =>
                            (
                                <>
                                    <tr key={index + 1}>
                                        <td style={{ borderCollapse: 'collapse', padding: '5px 15px' }}>{index + 1}</td>
                                        <td style={{ borderCollapse: 'collapse', padding: '5px 15px' }}>
                                            {`
                                                ${list.serviceDesc ? `${list.serviceDesc} |` : ""}  
                                                ${list.departmentDesc ? `${list.departmentDesc} |` : ""}
                                                ${list.serviceCode ? `${list.serviceCode} |` : ""}
                                                ${list.specimen ? `${list.specimen} |` : ""}
                                                ${list.modality ? `${list.modality} |` : ""}
                                                ${list.priority ? `${list.priority} |` : ""} 
                                                ${list.requestdate ? `${moment(list.requestdate).format("DD-MM-YYYY")} |` : ""} 
                                                ${list.reasonForTesting ? `${list.reasonForTesting} |` : ""} 
                                                ${list.comments ? `${list.comments} |` : ""}
                                            `}
                                        </td>
                                        <td style={{ borderCollapse: 'collapse', padding: '5px 15px' }}>{list.status}</td>
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
