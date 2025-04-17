import React, { FC } from 'react'

interface TabPageTitleProps {
    title: string
}

const TabPageTitle: FC<TabPageTitleProps> = ({
    title
}) => {
    return (
        <>
            <div className='w-full text-[#707070] font-bold text-[18px]'>
                {title}
            </div>
        </>
    )
}

export default TabPageTitle
