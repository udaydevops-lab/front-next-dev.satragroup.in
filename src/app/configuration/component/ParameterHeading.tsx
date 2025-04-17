import React, { FC } from 'react'
interface ParameterHeadingProps {
    title: string
}
const ParameterHeading: FC<ParameterHeadingProps> = ({
    title
}) => {
    return (
        <div>
            <div className="font-bold mb-4 w-full ">
                <h1 className="w-full">{title}</h1>
            </div>
        </div>
    )
}

export default ParameterHeading
