import React from 'react'

function PrintGrid() {
    return (
        <>
            <div className='w-full'>
                <h1>LOGO</h1>
                <div style={{ width: '100%', float: 'left', marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: "20px" }}>
                    <div style={{ width: '100%', float: "left" }}>
                        <span style={{ width: '25%', float: "left" }}><b>Patient Name: </b></span>
                        <span style={{ width: 'auto', float: "left" }}> Patient Name</span>
                    </div>
                    <div style={{ width: '100%', float: "left" }}>
                        <span style={{ width: '25%', float: "left" }}><b>Encounter Number: </b></span>
                        <span style={{ width: 'auto', float: "left" }}>1001 </span>
                    </div>
                    <div style={{ width: '100%', float: "left" }}>
                        <span style={{ width: '25%', float: "left" }}><b>Doctor name: </b></span>
                        <span style={{ width: 'auto', float: "left" }}> mahesh</span>
                    </div>
                </div>
                <div className='w-full mt-2 mb-2'>

                </div>
                <div style={{ width: '100%', float: "right", marginTop: "100px", textAlign: "right" }}>
                    <span> mahesh</span>
                </div>
            </div>
        </>
    )
}

export default PrintGrid