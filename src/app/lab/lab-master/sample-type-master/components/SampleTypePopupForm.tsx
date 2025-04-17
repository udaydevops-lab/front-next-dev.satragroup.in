"use client"
import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { sampleTypeSave } from '@/app/utilities/api-urls';
import { getLocalItem } from '@/app/utilities/local';
import services from '@/app/utilities/services';
import { Button } from '@material-tailwind/react';
import React, { Dispatch, FC, SetStateAction } from 'react';
import { toast } from 'react-toastify';

interface SampleTypePopupFormProps {
    popupfeilds: any,
    closePopup: any,
    getSampleTypeGridData: any,
    handelClear: any,
    setPopupFeilds: Dispatch<SetStateAction<any>>,
    loder: any,
    setLoder: Dispatch<SetStateAction<any>>,

}

const SampleTypePopupForm: FC<SampleTypePopupFormProps> = ({ popupfeilds, setPopupFeilds, closePopup, getSampleTypeGridData, handelClear, loder, setLoder }) => {

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
        setLoder(true)
        const postObj = {
            "sampleTypeCode": popupfeilds?.newsampleCode,
            "sampleTypeDesc": popupfeilds?.newsampleDesc,
            "statusFlag": 1,
            "updatedBy": empName,
            "sampleMasterId": popupfeilds?.sampleMasterId ? popupfeilds?.sampleMasterId : null
        }
        let Headers = getHeaderResponse()
        services
            .create(sampleTypeSave, postObj, Headers)
            .then((response) => {
                setTimeout(() => {
                    setLoder(false)
                    toast.success("Success");
                    setPopupFeilds({})
                    closePopup()
                    getSampleTypeGridData()
                }, 1000);

            })
            .catch((e) => {
                toast.error("Getting error, Please try again!");
                setLoder(false)
            });
    }

    return (
        <>
            <div className='w-full flex gap-4 '>
                <div className='w-full'>
                    <FormPropsTextFields
                        label="Sample Type Code"
                        handleChange={sampleInputChange}
                        name="newsampleCode"
                        value={popupfeilds?.newsampleCode}
                        disabled={popupfeilds?.sampleMasterId}
                    />
                </div>
                <div className='w-full'>
                    <FormPropsTextFields
                        label="Sample Type Description"
                        handleChange={sampleInputChange}
                        name="newsampleDesc"
                        value={popupfeilds?.newsampleDesc}
                    />
                </div>
            </div>
            <div className='w-full flex justify-end gap-4 mt-4'>

                <ActionButton
                    buttonText={
                        loder ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            popupfeilds?.sampleMasterId ? "Update" : "Save"
                    }
                    // buttonText={popupfeilds?.sampleMasterId ? "Update" : "Save"}
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelSave}
                    disabled={!popupfeilds?.newsampleCode || !popupfeilds?.newsampleDesc}
                />

                {popupfeilds?.sampleMasterId?null:
                <ActionButton
                    buttonText="Clear"
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelClear}
                />}
            </div>
        </>
    );
};

export default SampleTypePopupForm;
