import ActionButton from '@/app/_common/button';
import { Button } from '@material-tailwind/react';
import React, { Dispatch, FC, SetStateAction } from 'react'

interface DeletePopupMsgProps {
    btnYesFun: () => void,
    btnNoFun: () => void,
    loader?: boolean,
    content: any
}

const DeletePopupMsg: FC<DeletePopupMsgProps> = ({
    btnYesFun,
    btnNoFun,
    loader,
    content
}) => {
    return (
        <>
            <div className="w-100 font-bold">
                <div className="text-center text-[20px] text-blue-500">
                    Are you sure,
                </div>
                <div className="text-center text-[20px] text-blue-500">
                    {content}
                </div>
            </div>

            <div className='flex w-full justify-center items-center gap-4 mt-3'>
                <ActionButton
                    buttonText={
                        loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            "Yes"
                    }
                    width="w-[120px] text-white text-[14px] h-[42px] py-3 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={btnYesFun}
                />

                <ActionButton
                    buttonText={"No"}
                    width='w-[120px] bg-red-500 hover:bg-red-600 h-[42px] text-[14px] px-2 py-3'
                    handleSubmit={btnNoFun}
                />

            </div>
        </>
    )
}

export default DeletePopupMsg
