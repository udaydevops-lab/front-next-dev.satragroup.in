"use client"
import React, { useEffect, useState } from 'react'
import RoleGrid from './_components/RoleGrid'
import services from '@/app/utilities/services'
import { getAllRole } from '@/app/utilities/api-urls'
import RoleForm from './_components/RoleForm'

function Role() {
    const [gridData, setGridData] = useState([])
    const [feilds, setFeilds] = useState({
        roleCode: "",
        roleDes: "",
    })
    const getRoleData = async () => {
        try {
            const res = await services.get(getAllRole)
            //  console.log(res.data)
            setGridData(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getRoleData()
    }, [])
    return (
        <>
            <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
                <div className="px-4 md:pt-3 pb-2 mx-auto w-full flex justify-between">
                    <div className="font-bold w-full mb-4">
                        <h1 className="w-full flex justify-between">
                            <span>Role</span>
                        </h1>
                    </div>
                </div>
                <div className='w-full'>
                    <RoleForm getRoleData={getRoleData} setFeilds={setFeilds} feilds={feilds} />
                </div>
                <div className='w-full'>
                    <RoleGrid gridData={gridData} setFeilds={setFeilds} getRoleData={getRoleData} />
                </div>
            </div>
        </>
    )
}
export default Role