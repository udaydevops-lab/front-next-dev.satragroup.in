"use client"
import React, { useEffect, useState } from 'react'
import ResultTamplateMasterForm from './components/ResultTamplateMasterForm'
import ResultTamplateMasterGrid from './components/ResultTamplateMasterGrid'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import ResultTamplateMasterPopup from './components/ResultTamplateMasterPopup'
import services from '@/app/utilities/services'
import { getResultTamplate, getResulUpdateById } from '@/app/utilities/api-urls'
import { TabPageTitle } from '../../_component'
import ActionButton from '@/app/_common/button'


const ResultTemplateMasterPageMainPage = () => {
    const [labServiceNameData, setLabServiceNameData] = useState<any>()
    const [btnType, setBtnType] = useState<any>("save")
    const [gridData, setgridData] = useState<any>([])
    const [mainData, setMainData] = useState<any>([])
    const [fields, setFields] = useState<any>({
        resultTypeValue: "",
    })
    const [feildsData, setFeildsData] = useState<any>()
    const [labServiceFeilsInfo, setlabServiceFeilsInfo] = useState<any>({})
    const [labfeilds, setLabFeilds] = useState<any>({
        labServiceName: { label: "Lab Service Name" },
        //labServiceFeilsInfo: {},
    })
    const [listSel, setListSel] = useState<any>({})
    const [popup, setPopup] = useState<any>({
        open: false
    })

    const feildsinfo = [
        { resultType: "list", parameter: "test 1", listValue: [{ value: "test 1", label: "test 1" }] },
        { resultType: "textbox", parameter: "test 2", },
        { resultType: "textbox", parameter: "test 7", },
        { resultType: "string", parameter: "test 3" },
        { resultType: "file", parameter: "test 4" },
        { resultType: "number", parameter: "test 5", value: 10 },
        { resultType: "link", parameter: "test 6", },

    ]

    const handleSubmit = () => {
        setPopup({
            open: true
        })
        setBtnType("save")
        setFeildsData({})
        setlabServiceFeilsInfo({})
        setLabFeilds({
            labServiceName: { label: "Lab Service Name" }
        })
    }
    const getgridData = () => {

        services
            .get(`${getResultTamplate}`)
            .then((response) => {
                setgridData(response.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    const loadgetgridData = () => {
        getgridData()
    }
    const handleEdit = (row: any) => {
        let id = row.resultTemplateHeaderId
        console.log(id)
        services
            .get(`${getResulUpdateById}${id}`)
            .then((response) => {
                //console.log(response.data)
                // let result = response.data.labResultTemplateItemDto.
                let result = response.data.labResultTemplateItemDto.map((mainList: any, index: any) => {
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
                        if (mainList.listValue === null || mainList.listValue === "") {
                            return {
                                ...mainList,
                                parameter: mainList.parameterDesc,
                                options: []
                            };
                        } else {
                            // Otherwise, map over the valueList to create the desired structure
                            let getData = mainList?.listValue?.split(",").map((innerList: any) => {
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
                let Mainresult = response.data.labResultTemplateItemDto.map((list: any) => ({
                    ...list,
                    parameter: list.parameterDesc,
                }))
                let result1 = { ...response.data, assignParameterItemSet: Mainresult }
                setBtnType("update")
                setlabServiceFeilsInfo(result1)
                setPopup({ ...popup, open: true })
                setLabFeilds({
                    ...labfeilds,
                    labServiceName: { label: response.data.serviceDesc },
                    labResultName: response.data.resultTemplateName,
                })
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    useEffect(() => {
        // setFeildsData(feildsinfo)
        getgridData()
    }, [])
    return (
        <>

            {/* <div className='w-full mt-6'>
                <ResultTamplateMasterForm
                    resultTypeData={resultTypeData}
                    fields={fields}
                    setFields={setFields}
                    handleSubmit={handleSubmit}
                />
                
            </div> */}
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
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem '>
                <ResultTamplateMasterGrid
                    sampleGridData={gridData}
                    getgridData={getgridData}
                    setlabServiceFeilsInfo={setlabServiceFeilsInfo}
                    popup={popup}
                    setPopup={setPopup}
                    labfeilds={labfeilds}
                    setLabFeilds={setLabFeilds}
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
                        setLabFeilds={setLabFeilds}
                        labfeilds={labfeilds}
                        setLabServiceNameData={setLabServiceNameData}
                        labServiceNameData={labServiceNameData}
                        labServiceFeilsInfo={labServiceFeilsInfo}
                        setlabServiceFeilsInfo={setlabServiceFeilsInfo}
                        btnType={btnType}
                        getgridData={loadgetgridData}
                        setPopup={setPopup}
                    />}
                />


            </div>
        </>
    )
}

export default ResultTemplateMasterPageMainPage
