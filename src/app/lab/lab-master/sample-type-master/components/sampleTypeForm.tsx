"use client"
import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface SampleTypeFormProps {
    handelKeyDown: any,
    handleSearch: any,
    handelNewMapping: any,
    feilds: any,
    setFeilds: Dispatch<SetStateAction<any>>,
    popupfeilds: any,
    setPopupFeilds: Dispatch<SetStateAction<any>>,
}
const SampleTypeForm: FC<SampleTypeFormProps> = ({ feilds, setFeilds, handleSearch, popupfeilds, setPopupFeilds, handelNewMapping, handelKeyDown }) => {

    // input Feilds onChange Function
    const setSelectchange = (e: any) => {
        setFeilds({
            ...feilds,
            [e.target.name]: e.target.value
        })
    }

    return (
        <>
            <div className='flex w-full gap-4 mt-3'>
                <div className='w-1/2 newInputField'>
                    <FormPropsTextFields
                        label="Sample Type Code"
                        handleChange={setSelectchange}
                        name="sampletypeDescsel"
                        value={feilds.sampletypeDescsel}
                        handleKeyPress={handelKeyDown}
                    />
                </div>
                <div className='w-1/2 flex gap-4 justify-center mt-1'>
                    <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handleSearch}
                    />

                    <ActionButton
                        buttonText="New Mapping"
                        handleSubmit={handelNewMapping}
                        width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>

            </div>
        </>
    )
}

export default SampleTypeForm