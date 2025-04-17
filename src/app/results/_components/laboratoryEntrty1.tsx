"use client"
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import OrderHeader from './OrderHeader'
interface LaboratoryEntryprops {
    // feilds: any,
    // setFeilds: Dispatch<SetStateAction<any>>,
    // selectedRowId: any
    // getGridData: any
    setModaloc: any,
    modaloc: any,
    setKey: any,
    getOrders: any,
    field: any,
    setField: Dispatch<SetStateAction<any>>,

}
const LaboratoryEntry1: React.FC<LaboratoryEntryprops> = ({ setModaloc, modaloc, setKey, getOrders, field, setField }) => {

    return (
        <>
            <div className='w-full'>
                <OrderHeader rowData={modaloc.rowData} />

            </div>
        </>
    )
}

export default LaboratoryEntry1