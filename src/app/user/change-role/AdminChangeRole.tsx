"use client"
import { clearLocalItems, getLocalItem, setLocalItem } from '@/app/utilities/local'
import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { CapitalizeName } from './utilities';

const AdminChangeRole = () => {
    const [rolesList, setRolesList] = useState<any>()
    let response = JSON.parse(getLocalItem("loginResponse")!)
    const router = useRouter();

    const changeRole = (row: any) => {
        console.log(row)
        let newResponse = { ...response, rollDesc: row.roleDesc }
        console.log(newResponse)
        setLocalItem("loginResponse", JSON.stringify(newResponse));
        if (newResponse.rollDesc == "Front Office") {
            router.push("/frontdesk/dashboard");
        } else if (newResponse.rollDesc == "DOCTOR") {
            router.push("/doctor/dashboard");
        } else if (newResponse.rollDesc == "Nurse") {
            router.push("/nurse/dashboard");
        } else if (newResponse.rollDesc == "laboratory") {
            router.push("/lab/dashboard");
        } else if (newResponse.rollDesc == "Procedures") {
            router.push("/procedures/dashboard");
        } else if (newResponse.rollDesc == "Radiology") {
            router.push("/radiology/dashboard");
        } else {
            router.replace("/login");
            clearLocalItems();
        }
        toast.success("Role Change Successfully")
    }
    const getRolesList = () => {
        let list = response.roleList
        let newList = list.map((list: any) => list.roleDesc === response.rollDesc ? { ...list, isActive: 1 } : { ...list, isActive: 0 })
        setRolesList(newList)

    }
    useEffect(() => {
        getRolesList()
    }, [])
    return (
        <>
            {rolesList && rolesList.length > 0 ? (
                rolesList.map((list: any, index: number) => (
                    <div
                        key={index}
                        className={`text-[15px] mb-2 p-3 rounded-md cursor-pointer transition ${list.isActive === 1
                            ? "bg-green-100 text-green-700 font-semibold"
                            : "bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600"
                            }`}
                        onClick={(e) => changeRole(list)}
                    >
                        <span> {CapitalizeName(list.roleDesc)}</span>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-500">No roles available</p>
            )}
        </>
    )
}

export default AdminChangeRole