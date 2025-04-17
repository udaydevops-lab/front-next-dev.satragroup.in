import ActionButton from '@/app/_common/button'
import React, { Dispatch, FC, SetStateAction } from 'react'
interface RadiologyEquipmentMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const RadiologyEquipmentMasterForm: FC<RadiologyEquipmentMasterFormprops> = ({
    state,
    dispatch
}) => {
    return (
        <>
            <div className='flex w-full gap-4 newInputField'>
                <div className='w-1/2 newSelect mt-1'></div>
                <div className='w-1/2 flex gap-4 justify-end mt-1'>
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
                                    radEquiCode: '',
                                    radEquiDesc: '',
                                    bioMedicalAssetNo: '',
                                    manufacturer: '',
                                    radSpecialtySearch: null,
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
                        width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>
        </>
    )
}

export default RadiologyEquipmentMasterForm