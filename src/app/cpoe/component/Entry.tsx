import React, { useEffect } from 'react'
import LaboratoryEntry from './laboratoryEntry'
import RadiologyEntry from './radiologyEntry'
import ProceduresEntry from './proceduresEntry'

function Entry(props: any) {
    useEffect(() => {
    }, [props.tabType])
    return (
        <>
            {props.tabType === "Laboratory" ? <LaboratoryEntry /> :
                props.tabType === "Radiology" ? <RadiologyEntry /> : <ProceduresEntry />}
        </>
    )
}

export default Entry