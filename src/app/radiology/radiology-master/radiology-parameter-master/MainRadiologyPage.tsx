"use client"
import React, { useEffect, useReducer } from 'react'
import { radilogyInitialstate, reducerRadiology } from './components/RadiologyReducerfun'
import { RadioloagySearchform, RadiologyCreateParameterMasterForm, RadiologyParameterGrid } from './components'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllRadiologyParameters, getConfigData, ParamterUnits, snomedLoincSearch } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'

const MainRadiologyPage = () => {
    const resultTypeDataList: any = [
        { label: "Number", value: "number" },
        { label: "String", value: "string" },
        { label: "Multiline rich textbox", value: "textbox" },
        { label: "Images", value: "file" },
        { label: "List", value: "list" },
        { label: "Link", value: "link" },
    ];
    const getResulttypes = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                resultTypeData: resultTypeDataList,
            },
        });
    };
    const [state, dispatch] = useReducer(reducerRadiology, radilogyInitialstate)

    const addLabelValFun = (data: any) => {
        const result: any = data.map((list: any) => {
            return {
                ...list,
                label: list.label,
                value: list.value ? list.value : list.label
            }
        })
        return result
    }

    const getRelectedSelectBoxApies = async (fieldKey: string, apiUrl: any) => {
        const response: any = await ApiRequestMethod({ method: "GET", url: apiUrl })
        const addkeysLabelVal: any = addLabelValFun(response?.data?.data?.configData ? response?.data?.data?.configData ? response?.data?.data?.configData : [] : response?.data?.data ? response?.data?.data : [])
        dispatch({
            type: "fieldVal",
            payload: {
                [`${fieldKey}`]: addkeysLabelVal,
            }
        })
    }

    const getSavedRadiologyParameterData = () => {
        services.get(getAllRadiologyParameters).then((response) => {
            dispatch({
                type: "getApies",
                payload: {
                    radiologyParameterSavedData: response.data
                },
            });
        })
    }

    useEffect(() => {

        let terminolgyOtpselData = getConfigData + "TerminologyType" + "/0";
        getRelectedSelectBoxApies('TerminologyOptions', terminolgyOtpselData)
        getRelectedSelectBoxApies('unitsSelct', ParamterUnits)
        getSavedRadiologyParameterData()
        getResulttypes()
    }, [])


    return (
        <>
            <RadioloagySearchform
                state={state}
                dispatch={dispatch}
            />

            {/* Radilogy Parameter Saved Grid show here */}
            <RadiologyParameterGrid
                state={state}
                dispatch={dispatch}
                getSavedRadiologyParameterData={getSavedRadiologyParameterData}
            />

            {/* Daiolog box for New Radilogy Parameter Form */}
            <ReactCommonDialog
                open={state.popup.popupOpenclose}
                handler={() => {
                    // dispatch({
                    //     type: "popupSec",
                    //     payload: {
                    //         popupOpenclose: false
                    //     }
                    // })
                }}
                popupClose={() => {
                    dispatch({
                        type: "popupSec",
                        payload: {
                            popupOpenclose: false
                        }
                    })
                }}
                Content={
                    <RadiologyCreateParameterMasterForm
                        state={state}
                        dispatch={dispatch}
                        getSavedRadiologyParameterData={getSavedRadiologyParameterData}
                    />
                }
                size={'xl'}
                dialogtitle='Parameter Master Form'
            />
        </>
    )
}

export default MainRadiologyPage
