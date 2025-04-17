import ActionButton from '@/app/_common/button'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import FormField from '@/app/lab/laboratory-worklist/_components/FormField'
import { saveGroupMaster } from '@/app/utilities/api-urls'
import { getLocalItem } from '@/app/utilities/local'
import services from '@/app/utilities/services'
import { Input } from '@material-tailwind/react'
import React, { FC, useState } from 'react'
import { toast } from 'react-toastify'

interface CreateGroupFormProps {
    setPopup: any
}

const CreateGroupForm: FC<CreateGroupFormProps> = ({ setPopup }) => {
    const [reportGroupName, setReportGroupName] = useState("")

    //employe name
    const storedLoginResponse = getLocalItem("loginResponse");
    let empName: any;
    try {
        empName = storedLoginResponse
            ? JSON.parse(storedLoginResponse).employeename
            : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = "";
    }
    let headers = getHeaderResponse()
    const handelSaveGroupName = async () => {
        const postObj = [
            {
                "reportGroupId": null,
                "reportGroupName": reportGroupName,
                "statusFlag": 1,
                "generatedBy": empName,
            }
        ]
        try {
            const response = await services.create(saveGroupMaster, postObj, headers);
            toast.success("successfully created Group Name");
            setPopup(false)
        } catch (error) {
            console.error("Error:", error);
            toast.error("something wrong, please try again.");
        }
    }
    return (
        <>
            <Input
                crossOrigin
                onChange={(e) => setReportGroupName(e.target.value)}
                value={reportGroupName}
                label='Group Name'
            />
            <div className='w-full flex justify-end mt-3'>
                <ActionButton
                    buttonText="Save"
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelSaveGroupName}
                />
            </div>
        </>
    )
}

export default CreateGroupForm