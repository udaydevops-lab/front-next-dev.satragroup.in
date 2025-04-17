import moment from 'moment'
import React from 'react'

const PrintGrid = ({ AdditionVacciSaveData }: any) => {
    return (
        <>

            <div className='w-full'>
                <div className='print-Table mt-5'>
                    <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>S.No</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Vaccine Name</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Dose Unit</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Administered</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Administered Date</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Administered By Doctor</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Manufacturer</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Batch Number</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Expiry Date</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Next Due Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {AdditionVacciSaveData && AdditionVacciSaveData.map((list: any, index: any) =>
                            (
                                <>
                                    <tr key={index + 1}>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{index + 1}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.vaccineName}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.doseUnit}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.administred}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{moment(list.administeredDate).format('YYYY-MM-DD')}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.administeredByDoctor}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.manufacturer}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.batchNumber}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{moment(list.expiryDate).format('YYYY-MM-DD')}</td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{moment(list.nextDueDate).format('YYYY-MM-DD')}</td>
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

export default PrintGrid
