"use client"
import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface LaboratoryEquipmentMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const LaboratoryEquipmentMasterForm: FC<LaboratoryEquipmentMasterFormprops> = ({
    state,
    dispatch
}) => {
    return (
        <div>
            <div className='flex w-full gap-4 newInputField'>
                <div className='w-1/2 newSelect mt-1'>
                    {/* <FormPropsTextFields
                        label="Laboratory Equipment Description "
                        width="100%"
                        value={state.field.labEqippDesc}
                        handleChange={(e: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labEqippDesc: e.target.value
                                }
                            })
                        }}
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
                                type: 'fieldVal',
                                payload: {
                                    labEquiCode: '',
                                    labEquiDesc: '',
                                    bioMedicalAssetNo: '',
                                    manufacturer: '',
                                    labSpecialtySearch: null,
                                    addListValues: []
                                }
                            })
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    rowData: {}
                                }
                            })
                            dispatch({
                                type: 'dialogPop',
                                payload: {
                                    open: true
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

export default LaboratoryEquipmentMasterForm
