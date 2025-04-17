import React from 'react'

const MainGridBox = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className='w-full bg-[#F2F9FF] rounded-[15px] shadow-[0_3px_6px_#00000029] mt-4 p-4'>
                {children}
            </div>
        </>
    )
}

export default MainGridBox
