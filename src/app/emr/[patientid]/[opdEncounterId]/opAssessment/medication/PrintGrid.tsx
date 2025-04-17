import moment from 'moment'
import React from 'react'

const PrintGrid = ({ printData }: any) => {
    return (
        <>

            <h1>LOGO</h1>
            <div className='w-full'>
                <div className='print-Table mt-5'>
                    <table style={{ border: '1px solid black', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>S.No</th>
                                <th style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>Drug Details</th>


                            </tr>
                        </thead>
                        <tbody>
                            {printData && printData.map((list: any, index: any) =>
                            (
                                <>
                                    <tr key={index + 1}>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{index + 1}
                                        </td>
                                        <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>{list.drugDesc}</td>




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
