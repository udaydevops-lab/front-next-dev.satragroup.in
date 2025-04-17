import React from 'react'

const PrintGrid = ({ printData }: any) => {
    return (
        <>

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
                                <td style={{ border: '1px solid black', borderCollapse: 'collapse', padding: '5px 15px' }}>
                                    <p style={{ margin: "0px" }}>{list.drugDesc}</p>
                                    <p style={{ margin: "0px" }}>Quantity :{list.dosageQnty} /
                                        Frequency:{list.frequencymap && list.frequencymap?.frequency} -
                                        {list.frequencymap && list.frequencymap?.periodUnit === "h" ? "Howers" :
                                            list.frequencymap && list.frequencymap?.periodUnit === "d" ? "Days" :
                                                list.frequencymap && list.frequencymap?.periodUnit === "w" ? "Weeks" :
                                                    list.frequencymap && list.frequencymap?.periodUnit === "m" ? "Months" :
                                                        list.frequencymap && list.frequencymap?.periodUnit === "y" ? "Years" :
                                                            null} / {list.frequencymap && list.frequencymap?.description} </p>
                                </td>
                            </tr>
                        </>
                    )
                    )}

                </tbody>
            </table>

        </>
    )
}

export default PrintGrid
