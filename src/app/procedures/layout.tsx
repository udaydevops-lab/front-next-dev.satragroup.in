import React from 'react'
import Header from '../_components/header'
import Proceduresheader from './components/ProceduresHeader'

const ProceduresLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <Header heading={"Procedures"} />
            <Proceduresheader />
            <div className="w-full mx-auto max-w-7xl py-5">
                {children}
            </div>
        </>
    )
}

export default ProceduresLayout
