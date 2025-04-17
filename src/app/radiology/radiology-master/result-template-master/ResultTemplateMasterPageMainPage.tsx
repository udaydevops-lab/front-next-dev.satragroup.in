"use client"
import React, { useEffect, useState } from 'react'

import ResultTamplateMasterGrid from './components/ResultTamplateMasterGrid'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import ResultTamplateMasterPopup from './components/ResultTamplateMasterPopup'
import services from '@/app/utilities/services'
import { getAllRadiologyAssignServices, getRadiologyResultTamplate, getRadiologyResulUpdateById, getResultTamplate } from '@/app/utilities/api-urls'
import { TabPageTitle } from '@/app/lab/_component'
import ActionButton from '@/app/_common/button'


const ResultTemplateMasterPageMainPage = () => {
    const [radServiceNameData, setRadServiceNameData] = useState<any>()
    const [btnType, setBtnType] = useState<any>("save")
    const [gridData, setgridData] = useState<any>([])
    const [feildsData, setFeildsData] = useState<any>([])
    const [radServiceFeilsInfo, setRadServiceFeilsInfo] = useState<any>({})
    const [radfeilds, setRadFeilds] = useState<any>({
        radServiceName: { label: "Radiology Service Name" },
        //labServiceFeilsInfo: {},
    })

    const [listSel, setListSel] = useState<any>({})
    const [popup, setPopup] = useState<any>({
        open: false
    })


    const resultTypeData = [
        {
            label: "test 1",
            value: "test 1"
        },

        {
            label: "test 2",
            value: "test 2"
        },
        {
            label: "test 3",
            value: "test 3"
        },
        {
            label: "test 4",
            value: "test 4"
        },
    ]

    // const feildsinfo = [
    //     { resultType: "list", parameter: "test 1", listValue: [{ value: "test 1", label: "test 1" }] },
    //     { resultType: "textbox", parameter: "test 2", },
    //     { resultType: "textbox", parameter: "test 7", },
    //     { resultType: "string", parameter: "test 3" },
    //     { resultType: "file", parameter: "test 4" },
    //     { resultType: "number", parameter: "test 5", value: 10 },
    //     { resultType: "link", parameter: "test 6", },

    // ]

    const handleSubmit = () => {
        setPopup({
            open: true
        })
        setBtnType("save")
        setFeildsData({})
        setRadServiceFeilsInfo({})
        setRadFeilds({
            radServiceName: { label: "Radiology Service Name" }
        })
    }

    const getgridData = () => {
        //getResultTamplate
        services
            .get(`${getRadiologyResultTamplate}`)
            .then((response) => {
                setgridData(response.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    //geting rad Service Name Data function
    const getRadServiceNamelist = async () => {
        // radServiceNameData
        try {
            const response = await services.get(`${getAllRadiologyAssignServices}`);
            let result = response.data.map((list: any) => ({
                ...list,
                label: list.serviceDesc,
                value: list.serviceCode
            }))
            setRadServiceNameData(result)
        } catch (error) {
            console.error("Error fetching lab service names:", error);
        }
    }
    const handleEdit = (row: any) => {
        let id = row.radiologyResultTemplateHeaderId
        console.log(row)
        services
            .get(`${getRadiologyResulUpdateById}${id}`)
            .then((response) => {
                // let result = { ...response.data, assignParameterItemSet: response.data.labResultTemplateItemDto }
                let result = response.data.radiologyResultTemplateItemDto.map((mainList: any, index: any) => {
                    if (mainList.resultType === "list") {
                        // If valueList is null, return the object with an empty array for valueList
                        if (mainList.result) {
                            setListSel((prev: any) => {
                                return {
                                    ...prev,
                                    [`sel${index}`]: {
                                        label: mainList.result,
                                    },
                                };
                            });
                        }
                        if (mainList.valueList === null || mainList.valueList === "") {
                            return {
                                ...mainList,
                                parameter: mainList.parameterDesc,
                                options: []
                            };
                        } else {
                            // Otherwise, map over the valueList to create the desired structure
                            let getData = mainList?.valueList?.map((innerList: any) => {
                                return {
                                    label: innerList,
                                    value: innerList,
                                };
                            });
                            setListSel((prev: any) => {
                                return {
                                    ...prev,
                                    [`options${index}`]: getData,
                                };
                            });
                            return {
                                ...mainList,
                                options: getData,
                                parameter: mainList.parameterDesc,
                            };
                        }
                    }
                    // If resultType is not "list", return the object as is
                    mainList.parameter = mainList.parameterDesc;
                    return mainList;
                });
                // setFeildsData(result)
                setFeildsData(result)

                let Mainresult = response.data.radiologyResultTemplateItemDto.map((list: any) => ({
                    ...list,
                    parameter: list.parameterDesc,
                }))
                let result1 = { ...response.data, assignParameterItemSet: Mainresult }
                console.log(result1)
                setBtnType("update")
                setRadServiceFeilsInfo(result1)
                setPopup({ ...popup, open: true })
                setRadFeilds({
                    ...radfeilds,
                    radServiceName: { label: response.data.serviceDesc },
                    resultTemplateName: response.data.radiologyResultTemplateName
                })

            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        //setFeildsData(feildsinfo)
        getgridData()
        getRadServiceNamelist()
    }, [])
    console.log(feildsData)
    return (
        <>
            <div className='flex w-full justify-between gap-4 mt-3'>

                <div className=''>
                    <TabPageTitle
                        title='Result Template Master'
                    />
                </div>
                <ActionButton
                    buttonText="New"
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleSubmit}
                />
            </div>

            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ResultTamplateMasterGrid
                    sampleGridData={gridData}
                    getgridData={getgridData}
                    setRadServiceFeilsInfo={setRadServiceFeilsInfo}
                    popup={popup}
                    setPopup={setPopup}
                    radfeilds={radfeilds}
                    setRadFeilds={setRadFeilds}
                    setBtnType={setBtnType}
                    handleEdit={handleEdit}
                />
            </div>
            <div>
                <ReactCommonDialog
                    dialogtitle={"New Result Template Master"}
                    open={popup.open}
                    size={'lg'}
                    handler={() => {
                        // setPopup({
                        //     open: false
                        // })
                    }}
                    popupClose={() => {
                        setPopup({
                            open: false
                        })
                    }}
                    Content={<ResultTamplateMasterPopup
                        feildsData={feildsData}
                        setFeildsData={setFeildsData}
                        listSel={listSel}
                        setListSel={setListSel}
                        setRadFeilds={setRadFeilds}
                        radfeilds={radfeilds}
                        radServiceNameData={radServiceNameData}
                        radServiceFeilsInfo={radServiceFeilsInfo}
                        setRadServiceFeilsInfo={setRadServiceFeilsInfo}
                        btnType={btnType}
                        getgridData={getgridData}
                        setPopup={setPopup}
                        popup={popup}
                    />}
                />


            </div>
        </>
    )
}

export default ResultTemplateMasterPageMainPage
