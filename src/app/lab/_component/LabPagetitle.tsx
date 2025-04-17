import React from 'react'
interface Labpagetitleprops {
    title: string
}

const LabPagetitle: React.FC<Labpagetitleprops> = ({
    title
}) => {
    return (
        <>
            <div className='w-full text-[#707070] font-bold text-[22px]'>
                {title}
            </div>
        </>
    )
}

export default LabPagetitle
