"use client"
import React from 'react'

const HocComp = ({
    children
}: {
    children: React.ReactNode
}) => {
    return (
        <div>
            <div className='w-full p-3 bg-[#f2f9ff] rounded-curve mb-3 h-full shadow-md flex items-center'>
                {children}
            </div>
        </div>
    )
}

export default HocComp
