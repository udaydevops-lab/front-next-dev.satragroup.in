"use client"
import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'

interface LaboratoryEquipmentMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const LaboratoryTechnicianMasterForm: FC<LaboratoryEquipmentMasterFormprops> = ({
    state,
    dispatch
}) => {
    const srchSpecialty = (data: any) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                labSpecialtySrch: data
            }
        })
    }

    const setSelectchange = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                [e.target.name]: e.target.value
            }
        })
    }

    const handleSearch = () => {
        const result = state.getAppApi.labTechGriddata
            .filter((list: any) =>
                list?.labSpecialityDesc.toLowerCase().includes(state.field.labSpecialtySrch?.toLowerCase())
            );
        dispatch({
            type: 'getApis',
            payload: {
                labTechGriddata: result
            }
        })
    }

    return (
        <div>
            <div className='flex w-full gap-4'>
                <div className='w-1/2 newSelect'>
                    {/* <ReactSelectBox
                        value={state.field.labSpecialtySrch}
                        options={state.getAppApi.labSearchDropdown}
                        onChange={srchSpecialty}
                        label={"Lab Specialty Search"}
                        isSearchable={true}
                    /> */}
                    {/* <FormPropsTextFields
                        label="Lab Specialty Search"
                        handleChange={setSelectchange}
                        name="labSpecialtySearch"
                        value={state.field.labSpecialtySrch}
                    /> */}
                </div>
                <div className='w-1/2 flex gap-4 justify-end mt-1'>
                    {/* <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handleSearch}
                    /> */}
                    <ActionButton
                        buttonText="New"
                        handleSubmit={() => {
                            dispatch({
                                type: 'dialogPop',
                                payload: {
                                    open: true
                                }
                            })
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labSpecialtySearch: {
                                        label: "Laboratory Specialty"
                                    },
                                    labTechnicianSearch: null,
                                    addListValues: []
                                }
                            })
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    rowData: {}
                                }
                            })
                        }}
                        width="w-[200px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>
        </div>
    )
}

export default LaboratoryTechnicianMasterForm
