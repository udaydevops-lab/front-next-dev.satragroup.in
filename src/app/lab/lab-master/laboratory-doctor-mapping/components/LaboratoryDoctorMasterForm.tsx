"use client"
import ActionButton from '@/app/_common/button'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface LaboratoryEquipmentMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const LaboratoryDoctorMasterForm: FC<LaboratoryEquipmentMasterFormprops> = ({
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
                </div>
                <div className='w-1/2 flex gap-4 justify-end mt-1'>
                    {/* <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
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
                                    labSpSearch: {
                                        label: "Laboratory Specialty"
                                    },
                                    labDocSearch: null,
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

export default LaboratoryDoctorMasterForm
