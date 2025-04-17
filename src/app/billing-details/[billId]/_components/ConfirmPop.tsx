import ActionButton from '@/app/_common/button'
import React from 'react'

export default function ConfirmPop({handleYes,handleNo}:any) {
  return (
    <div>
        <>
            <div className='w-full flex items-center justify-center h-full'>
                <div className="w-full">
                    <div className="w-100 font-bold">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            you want to cancel the selected items ?
                        </div>
                    </div>

                    <div className='flex w-full justify-center items-center gap-4 mt-3'>
                        <ActionButton
                            buttonText={"Yes"}
                            width="w-[120px] text-white text-[14px] h-[42px] py-3 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            handleSubmit={handleYes}
                        />

                        <ActionButton
                            buttonText={"No"}
                            width='w-[120px] bg-red-500 hover:bg-red-600 h-[42px] text-[14px] px-2 py-3'
                            handleSubmit={handleNo}
                        />

                    </div>
                </div>
            </div>

        </>
    </div>
  )
}
