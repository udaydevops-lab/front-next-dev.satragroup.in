import React from 'react'
import Header from '../_components/header'
import { Labheader } from './_component'

const LabLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header heading={"Laboratory"} />
            <Labheader />
            <div className="w-full mx-auto max-w-7xl py-5">
                {children}
            </div>
        </>
    )
}

export default LabLayout
