import ActionButton from '@/app/_common/button';
import { Button } from '@material-tailwind/react';
import React, { Dispatch, FC, SetStateAction } from 'react'

interface DelMsgProps {
    btnYesFun: () => void,
    btnNoFun: () => void,
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const DelMsg: FC<DelMsgProps> = ({
    btnYesFun,
    btnNoFun,
    state,
    dispatch
}) => {
    return (
        <>
            <div className="w-100">
                <div className="text-center text-[20px] text-blue-500">
                    Are you sure,
                </div>
                <div className="text-center text-[20px] text-blue-500">
                    Do you want to Delete this record?
                </div>
            </div>

            <div className='flex w-full justify-center items-center gap-4 mt-3'>
                <ActionButton
                    buttonText={
                        state.field.loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            "Yes"
                    }
                    width='mr-2 bg-blue-500 hover:bg-blue-600 px-2 py-3 w-[100px]'
                    handleSubmit={btnYesFun}
                />

                <ActionButton
                    buttonText={"No"}
                    width='bg-red-500 hover:bg-red-600 px-2 py-3 w-[100px]'
                    handleSubmit={btnNoFun}
                />

            </div>
        </>
    )
}

export default DelMsg
