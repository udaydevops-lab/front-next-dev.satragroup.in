"use client"
import Header from '@/app/_components/header'
import { getAllRole, roleUpdate } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import { Button, Input } from '@material-tailwind/react'
import React, { ChangeEvent, Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'react-toastify'

interface RoleFormProps {
    getRoleData: any,
    feilds: any,
    setFeilds: Dispatch<SetStateAction<any>>
}

const RoleForm: React.FC<RoleFormProps> = ({ getRoleData, feilds, setFeilds }) => {

    // create role function
    const handelCreateRole = () => {
        const postObj = {
            roleId: feilds.roleId ? feilds.roleId : "",
            roleDes: feilds.roleDes,
            roleCode: feilds.roleCode,
            statusFlag: 1
        }
        const URL = feilds.roleId ? roleUpdate : getAllRole;
        services.create(URL, postObj, Header)
            .then((response) => {
                getRoleData();
                handelReset();
                toast.success("Success");
            })
            .catch((errors) => {
                if(errors.response.data.statusMessage){
                    toast.error(errors.response.data.statusMessage)
                  }else{
                    toast.error("Technical Error")
                  }
                console.log(errors.message);
            });
    }
    // reset role form function
    const handelReset = () => {
        setFeilds({
            roleCode: "",
            roleDes: "",
        })
    }
    // input feilds onchange functionality
    const handelFeilds = (
        e:
            | ChangeEvent<HTMLInputElement>
            | ChangeEvent<HTMLSelectElement>
            | ChangeEvent<HTMLTextAreaElement>
    ) => {
        setFeilds({
            ...feilds,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            <div className='w-full grid grid-cols-3 gap-4 mb-4'>
                <div>
                    <Input
                        crossOrigin
                        value={feilds.roleCode}
                        type="text"
                        label="Role Code"
                        name="roleCode"
                        onChange={handelFeilds}
                        containerProps={{
                            className: "!min-w-0",
                        }}
                        color="blue"
                    />
                </div>
                <div>
                    <Input
                        crossOrigin
                        value={feilds.roleDes}
                        type="text"
                        label="Role Description"
                        name="roleDes"
                        onChange={handelFeilds}
                        containerProps={{
                            className: "!min-w-0",
                        }}
                        color="blue"
                    />
                </div>
                <div>
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600"
                        onClick={handelCreateRole}
                        disabled={feilds.roleCode !== "" && feilds.roleDes !== "" ? false : true}
                    > {feilds.roleId ? "Update" : "Save"}
                    </Button>
                    <Button
                        variant="gradient"
                        color="red"
                        className="mr-2 bg-red-500 hover:bg-red-600"
                        onClick={handelReset}
                    >Reset
                    </Button>
                </div>

            </div>

        </>
    )
}

export default RoleForm