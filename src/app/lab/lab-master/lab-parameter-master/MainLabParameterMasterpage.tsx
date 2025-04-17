"use client"
import React, { useEffect, useReducer } from 'react'
import { TabPageTitle } from '../../_component'
import { LabParamterForm, Labparamertersearchform } from './components'
import { LabparameterReducer, labParamertinitialState } from './components/LabParameterReducerfun'
import services from '@/app/utilities/services'
import { ParamterUnits, getAllLabParameterapi, getConfigData, snomedLoincSearch } from '@/app/utilities/api-urls'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import Labparametersavedgrid from './components/Labparametersavedgrid'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'

const MainLabParameterMasterpage = () => {
    const [state, dispatch] = useReducer(LabparameterReducer, labParamertinitialState)

    // result type values here
    const resultTypeData: any = [
        { label: "Number", value: "number" },
        { label: "String", value: "string" },
        { label: "Multiline rich textbox", value: "textbox" },
        { label: "Images", value: "file" },
        { label: "List", value: "list" },
        { label: "Link", value: "link" },
    ];

    // placeholder text for equpiment master this value come from equipment master 
    const equipmntMasterData: any = [
        { label: "equipmntMasterData 1", value: "equipmntMasterData 1" },
        { label: "equipmntMasterData 2", value: "equipmntMasterData 2" },
        { label: "equipmntMasterData 3", value: "textbox" },
        { label: "equipmntMasterData 4", value: "file" },
        { label: "equipmntMasterData 5", value: "list" },
        { label: "equipmntMasterData 6", value: "link" },
    ];

    // for the selectbox we need to key label and value
    const changeLableValue = (data: any) => {
        const result = data.map((list: any) => {
            return {
                ...list,
                value: list.code ? list.code : list.desc ? list.desc : list.value,
                label: list.label ? list.label : list.desc
            }
        })
        return result
    }

    // getApiData
    const getApiData = (key: string, url: any) => {
        services.get(url)
            .then((res) => {
                const result = changeLableValue(res.data.configData)
                dispatch({
                    type: 'getAllApies',
                    payload: {
                        [`${key}`]: result
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // get all  parameter data grid api
    const getAllParameterFun = async () => {
        const response: any = await ApiRequestMethod({ method: "GET", url: getAllLabParameterapi })
        dispatch({
            type: 'getAllApies',
            payload: {
                getsaveLabparameterDataresults: response.data.data
            }
        })
    }


    useEffect(() => {
        getAllParameterFun();
        let terminolgyOtpselData = getConfigData + "TerminologyType" + "/0";
        let durationList = getConfigData + "Duration" + "/0";

        getApiData('unitsSelct', ParamterUnits)
        getApiData('TerminologyOptions', terminolgyOtpselData)
        getApiData('durationListSel', durationList)

        dispatch({
            type: 'getAllApies',
            payload: {
                resultType: [...resultTypeData],
                equipmentMasterSel: [...equipmntMasterData],
            }
        })

        return () => {
            getApiData('unitsSelct', ParamterUnits)
            getApiData('TerminologyOptions', terminolgyOtpselData)
            getApiData('durationListSel', durationList)
            getAllParameterFun();
        }

    }, [])

    return (
        <>


            {/* Lab Parameter Search form */}
            <Labparamertersearchform
                state={state}
                dispatch={dispatch}
            />

            {/* Lab parameter Saved Data Grid */}
            <Labparametersavedgrid
                state={state}
                dispatch={dispatch}
                getAllParameterFun={getAllParameterFun}
            />

            {/* New Lab Parameter create form popup */}
            <ReactCommonDialog
                open={state.dailoagPop.open}
                handler={() => {
                    // dispatch({
                    //     type: 'dailogModal',
                    //     payload: {
                    //         open: false
                    //     }
                    // })
                }}
                size={"xl"}
                popupClose={() => {
                    dispatch({
                        type: 'dailogModal',
                        payload: {
                            open: false
                        }
                    })
                }}

                Content={
                    <LabParamterForm
                        state={state}
                        dispatch={dispatch}
                        getAllParameterFun={getAllParameterFun}
                    />
                }
                dialogtitle='Lab Parameter Master'
            />
        </>
    )
}

export default MainLabParameterMasterpage
