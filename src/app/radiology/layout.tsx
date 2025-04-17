import React from 'react'
import { Radiologyheader } from './components'
import Header from '../_components/header'

const RadiologyLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header heading={"Radiology"} />
            <Radiologyheader />
            <div className="w-full mx-auto max-w-7xl py-5">
                {children}
            </div>
        </>
    )
}

export default RadiologyLayout
