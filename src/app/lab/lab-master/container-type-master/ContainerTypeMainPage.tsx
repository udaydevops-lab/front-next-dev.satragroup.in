"use client"
import React, { useEffect, useState } from 'react'
import { TabPageTitle } from '../../_component'
import ContainerTypeForm from './components/containerTypeForm'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import ContainerTypepopupForm from './components/ContainerTypepopupForm'
import ContainerTypeGrid from './components/ContainerTypeGrid'
import { getContainerTypeGrid } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import ActionButton from '@/app/_common/button'

const ContainerTypeMainPage = () => {
    const [loader, setLoader] = useState<any>(false)
    const [gridData, setgridData] = useState<any>([])
    const [mainData, setMainData] = useState<any>([])
    const [feilds, setFeilds] = useState<any>({
        serchFeilds: ""
    })
    const [popupfeilds, setPopupFeilds] = useState<any>({
        typeDesc: ""
    })
    const [popup, setPopup] = useState<any>({
        open: false
    })
    const containerTypedata = [
        { label: "test 1", value: "test 1" },
        { label: "test 2", value: "test 2" },
        { label: "test 3", value: "test 3" },
    ]
    const sampleGridData = [
        {
            mrn: "test 1",
            patientName: "test 1",
            orderId: "test 1"
        },
        {
            mrn: "test 2",
            patientName: "test 2",
            orderId: "test 2"
        },
        {
            mrn: "test 3",
            patientName: "test 3",
            orderId: "test 3"
        },
    ]
    const closePopup = () => {
        setPopup({ ...popup, open: false })
    }
    const openPopup = () => {
        setPopup({ ...popup, open: true })
    }
    // get Sample Type Grid Data from API
    const getSampleTypeGridData = async () => {
        await services
            .get(`${getContainerTypeGrid}`)
            .then((response) => {
                setgridData(response.data);
                setMainData(response.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    // when user search filtering the grid
    const handleSearch = async () => {
        // await services
        //     .get(getContainerTypeGrid)
        //     .then((response) => {
        //         const result = response.data
        //             .filter((list: any) =>
        //                 list?.containerTypeDesc.toLowerCase().includes(feilds.serchFeilds?.toLowerCase())
        //             );
        //         setgridData(result);
        //     })
        //     .catch((err) => {
        //         console.error('Error fetching data:', err.message);
        //     });

        const result = mainData
            .filter((list: any) =>
                list?.containerTypeDesc.toLowerCase().includes(feilds.serchFeilds?.toLowerCase())
            );
        setgridData(result);
    }

    // New Mapping Button Function
    const handelNewMapping = () => {
        openPopup()
        setPopupFeilds({
            typeDesc: ""
        })
    }

    //search field key down data has been added to the grid
    const handelKeyDown = (e: any) => {
        setgridData(mainData);
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
                    title={"Container Type Master"}
                />
                <ActionButton
                    buttonText="New"
                    handleSubmit={handelNewMapping}
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
            </div>
            {/* <div className='w-full mt-6'>
                <ContainerTypeForm
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
                <ContainerTypeGrid
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
                dialogtitle={"New Container Type Master"}
                open={popup.open}
                size={'md'}
                handler={() => {
                    // setPopup({ ...popup, open: false })
                }}
                popupClose={() => {
                    setPopup({ ...popup, open: false })
                }}
                Content={<ContainerTypepopupForm
                    popupfeilds={popupfeilds}
                    setPopupFeilds={setPopupFeilds}
                    closePopup={closePopup}
                    getSampleTypeGridData={getSampleTypeGridData}
                    handelClear={handelClear}
                    loader={loader}
                     setLoader={setLoader}
                />}
            />
        </>
    )
}

export default ContainerTypeMainPage