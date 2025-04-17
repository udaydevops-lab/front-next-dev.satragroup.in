import moment from 'moment';
import React from 'react'

export default function PrintGeneratedBills(props: any) {
    return (
        <div className='w-full'>
            <div className='print-Table mt-5'>
                <table style={{ border: '1px solid black', borderCollapse: 'collapse', width: "100%" }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', textAlign: "left", width: "30px" }}>S.No</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "10%" }}>Bill Number</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "80%" }}>Service Name</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "10%" }}>Service Type</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "10%" }}>Amount</th>
                            <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px', width: "10%" }}>Date</th>
                        </tr>
                        <tbody>
                            {props?.getBillData && props?.getBillData?.opBillItemTbl?.map((list: any, index: any) => (
                                <>
                                    <tr key={index + 1}>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.billNumber}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.serviceName}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.serviceTypeDesc}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.serviceAmount}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{moment(list.generatedDate).format("DD-MM-YYYY")}</td>
                                    </tr>
                                </>
                            )
                            )}
                        </tbody>
                    </thead>
                </table>
            </div>
        </div>
    )
}
