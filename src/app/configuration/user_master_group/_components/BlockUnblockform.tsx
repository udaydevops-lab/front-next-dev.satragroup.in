import ActionButton from '@/app/_common/button'
import Textarea from '@/app/_common/text-area'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface BlockUnblockformprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    inActiveRecord: () => void
}

const BlockUnblockform: FC<BlockUnblockformprops> = ({
    state,
    dispatch,
    inActiveRecord
}) => {

    const selectLabel = (data: any, key: string) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                [`${key}`]: data
            }
        })
    }
    const filterblock: any = state.field.statusList.filter((list: any) => list.value !== state.field.activeData.isBlocked)
    return (
        <>
            <div className='w-full'>
                <div className="w-1/3 ">Current Status:<span className={`${state.field.activeData.isBlocked === 1 ? 'text-green-500' : 'text-red-500'} font-semibold`}>{state.field.activeData.isBlocked === 1 ? "Active" : "Inactive"}</span></div>
            </div>
            <div className='w-full mt-4'>
                <div className="w-full">New Status</div>
            </div>
            <div className='w-full mt-4'>
                <div className='flex gap-4'>
                    <div className='w-1/2'>
                        <ReactSelectBox
                            value={state.field.blockUnblock}
                            options={filterblock}
                            onChange={(data: any) => selectLabel(data, 'blockUnblock')}
                            label={'Block / Unblock'}
                        />
                    </div>
                    <div className='w-1/2'>
                        <ReactSelectBox
                            value={state.field.resonForBlock}
                            options={state.getApi.reasonList}
                            onChange={(data: any) => selectLabel(data, 'resonForBlock')}
                            label={'Reason'}
                            smallHeight={true}
                        />
                    </div>
                </div>
                <div className='w-full mt-3  '>
                    <Textarea
                        label="Remarks"
                        name="blockedRemarks"
                        onChange={(e: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    blockedRemarks: e.target.value
                                }

                            })
                        }}
                    />
                </div>

                <div className='w-full flex justify-end mt-4'>
                    <ActionButton
                        buttonText={
                            state.field.blockloader ?
                                <div className='w-full flex justify-center items-center'>
                                    <div className='innerBtnloader'></div>
                                </div> :
                                filterblock[0].label
                        }
                        handleSubmit={inActiveRecord}
                        disabled={state.field.blockUnblock.label !== "Block / Unblock" ? false : true}
                        width="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>
        </>
    )
}

export default BlockUnblockform
