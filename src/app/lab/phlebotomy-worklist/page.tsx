
"use client"
import React from 'react'
import { LabPagetitle } from '../_component'
import PhlebotomyMainPage from './MainPage'
import NoScreenData from '@/app/_common/NoScreenData'
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc'

const PhlebotomyWorklist = (props: any) => {

    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>

                <LabPagetitle
                    title={'Phlebotomy Worklist'}
                />
                <PhlebotomyMainPage />
            </div>
        </>
    )
}

export default roleInfoScreenData(PhlebotomyWorklist, "PW")
