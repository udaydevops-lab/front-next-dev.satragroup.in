"use client"
import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { containerTypeSave } from '@/app/utilities/api-urls';
import { getLocalItem } from '@/app/utilities/local';
import services from '@/app/utilities/services';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { toast } from 'react-toastify';


interface ContainerTypepopupFormProps {
    popupfeilds: any,
    closePopup: any,
    getSampleTypeGridData: any,
    handelClear: any,
    setPopupFeilds: Dispatch<SetStateAction<any>>,
    loader: any,
    setLoader: Dispatch<SetStateAction<any>>,
}

const ContainerTypepopupForm: FC<ContainerTypepopupFormProps> = ({ popupfeilds, setPopupFeilds, closePopup, getSampleTypeGridData, handelClear, loader, setLoader }) => {
    // geting employee name
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

    // input Feilds onChange Function
    const sampleInputChange = (e: any) => {
        setPopupFeilds({
            ...popupfeilds,
            [e.target.name]: e.target.value
        })
    }

    // save function
    const handelSave = () => {
        setLoader(true)
        const postObj = {
            "containerTypecode": popupfeilds?.newsampleCode,
            "containerTypeDesc": popupfeilds?.newsampleDesc,
            "statusFlag": 1,
            "updatedBy": empName,
            "containerTypeId": popupfeilds?.containerTypeId ? popupfeilds?.containerTypeId : null
        }
        let Headers = getHeaderResponse()
        services
            .create(containerTypeSave, postObj, Headers)
            .then((response) => {
                setTimeout(() => {
                    setLoader(false)
                    toast.success("Success");
                    setPopupFeilds({})
                    closePopup()
                    getSampleTypeGridData()
                }, 1000);
            })
            .catch((e) => {
                toast.error("Getting error, Please try again!");
                setLoader(false)
            });
    }


    return (
        <>
            <div className='w-full flex gap-4 '>
                <div className='w-full'>
                    <FormPropsTextFields
                        label="Container Type Code"
                        handleChange={sampleInputChange}
                        name="newsampleCode"
                        value={popupfeilds?.newsampleCode || ''}
                        disabled={popupfeilds?.containerTypeId}
                    />
                </div>
                <div className='w-full'>
                    <FormPropsTextFields
                        label="Container Type Description"
                        handleChange={sampleInputChange}
                        name="newsampleDesc"
                        value={popupfeilds?.newsampleDesc || ''}
                    />
                </div>
            </div>
            <div className='w-full flex justify-end gap-4 mt-4'>
                <ActionButton
                    buttonText={
                        loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            popupfeilds?.containerTypeId ? "Update" : "Save"
                    }
                    // buttonText={popupfeilds?.containerTypeId ? "Update" : "Save"}
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelSave}
                    disabled={!popupfeilds?.newsampleCode || !popupfeilds?.newsampleDesc}
                />
                {popupfeilds?.containerTypeId?null:
                <ActionButton
                    buttonText="Clear"
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelClear}
                />
                }
            </div>
        </>
    );
};

export default ContainerTypepopupForm;
