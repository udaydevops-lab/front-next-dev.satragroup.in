import React from 'react'

interface MasterHeadingProps {
    heading: string
}


const MasterHeading: React.FC<MasterHeadingProps> = ({
    heading
}) => {
    return (
        <>
            <div className="font-bold w-full mb-4">
                <h1 className="w-full">
                    {heading}
                </h1>
            </div>
        </>
    )
}

export default MasterHeading
