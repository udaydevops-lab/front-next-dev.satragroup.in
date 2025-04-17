"use client"
import React, { Dispatch, FC, SetStateAction } from 'react';
import ActionButton from '@/app/_common/button';

interface RadiologyDoctorMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const RadiologyDoctorMasterForm: FC<RadiologyDoctorMasterFormprops> = ({
    state,
    dispatch
}) => {
    return (
        <div>
            <div className='flex w-full gap-4'>
                <div className='w-1/2 newSelect'></div>
                <div className='w-1/2 flex gap-4 justify-end'>
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
                                    addListValues: [],
                                    radDocMapId: null,
                                    radSpecialtySearch: {
                                        label: "Radiology Specialty"
                                    },
                                    radDeptDoctorsSearch: null
                                }
                            })
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    rowData: {}
                                }
                            })
                        }}
                        width="w-[220px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>
        </div>
    )
}

export default RadiologyDoctorMasterForm
