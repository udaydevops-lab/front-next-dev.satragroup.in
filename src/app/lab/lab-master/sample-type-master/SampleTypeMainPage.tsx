"use client"
import React, { useEffect, useState } from 'react'
import { TabPageTitle } from '../../_component'
import SampleTypeForm from './components/sampleTypeForm'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import SampleTypePopupForm from './components/SampleTypePopupForm'
import SampleTypeGrid from './components/sampleTypeGrid'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import { getSampleTypeGrid } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import ActionButton from '@/app/_common/button'

const SampleTypeMainPage = () => {
    // field Declaration
    const [feilds, setFeilds] = useState<any>({
        sampletypeDescsel: ""
    })
    const [popupfeilds, setPopupFeilds] = useState<any>({
        typeDesc: ""
    })
    const [popup, setPopup] = useState<any>({
        open: false
    })
    const [gridData, setgridData] = useState<any>([])
    const [loder, setLoder] = useState<any>(false)

    const closePopup = () => {
        setPopup({ ...popup, open: false })
    }
    const openPopup = () => {
        setPopup({ ...popup, open: true })
    }

    // get Sample Type Grid Data from API
    const getSampleTypeGridData = () => {
        services
            .get(`${getSampleTypeGrid}`)
            .then((response) => {
                setgridData(response.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }


    // New Mapping Button Function
    const handelNewMapping = () => {
        openPopup()
        setPopupFeilds({
            typeDesc: ""
        })
    }

    // Clear Button Function
    const handelClear = () => {
        setPopupFeilds({
            typeDesc: '',
            newsampleCode: '',
            newsampleDesc: ''
        })
    }

    useEffect(() => {
        getSampleTypeGridData()
    }, [])

    return (
        <>
            <div className='flex w-full gap-4 mt-3 justify-between items-center'>
                <TabPageTitle
                    title={"Sample Type Master"}
                />
                <ActionButton
                    buttonText="New"
                    handleSubmit={handelNewMapping}
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
            </div>
            {/* <div className='w-full mt-6'>
                <SampleTypeForm
                    feilds={feilds}
                    setFeilds={setFeilds}
                    handleSearch={handleSearch}
                    popupfeilds={popupfeilds}
                    setPopupFeilds={setPopupFeilds}
                    handelNewMapping={handelNewMapping}
                    handelKeyDown={handelKeyDown}
                />
            </div> */}
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <SampleTypeGrid
                    sampleGridData={gridData}
                    popup={popup}
                    setPopup={setPopup}
                    popupfeilds={popupfeilds}
                    setPopupFeilds={setPopupFeilds}
                    getSampleTypeGridData={getSampleTypeGridData}
                />
            </div>
            {/* Dailog Box*/}
            <ReactCommonDialog
                dialogtitle={"New Sample Type Master"}
                open={popup.open}
                size={'md'}
                handler={() => { closePopup }}
                popupClose={closePopup}
                Content={<SampleTypePopupForm
                    popupfeilds={popupfeilds}
                    setPopupFeilds={setPopupFeilds}
                    closePopup={closePopup}
                    getSampleTypeGridData={getSampleTypeGridData}
                    handelClear={handelClear}
                    loder={loder}
                    setLoder={setLoder}

                />}
            />

        </>
    )
}

export default SampleTypeMainPage