"use client"
import React, { useEffect, useReducer } from 'react'
import { NewMappingform, OrganismAntibioticMasterForm, OrganismAntibioticMasterGrid } from './components'
import { OrganismInitilalState, OrgnismAntibioticMasterReducer } from './components/OrganismAntibioticMasterReducerfun'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllAntibioticData, getAllOrganismsData, organismAntibioticMapingAllgridapi } from '@/app/utilities/api-urls'

const MainPage = () => {
    const [state, dispatch] = useReducer(OrgnismAntibioticMasterReducer, OrganismInitilalState)

    // add the label and value keys in the get apies for select box
    const changeConvertIntoselectKey = (data: any) => {
        const result: any = data.map((list: any) => {
            return {
                ...list,
                label: list.organismDesc ? list.organismDesc : list.antibioticDesc,
                value: list.organismCode ? list.organismCode : list.antibioticCode
            }
        })
        return result
    }

    // get the respective select box apies
    const getApiesData = async (keyName: string, apieUrl: any) => {
        const response: any = await ApiRequestMethod({ method: "GET", url: apieUrl })
        let data: any = response?.data?.data ? response?.data?.data : []
        const convertIntoselectkeys: any = changeConvertIntoselectKey(data)
        dispatch({
            type: 'fieldVal',
            payload: {
                [`${keyName}`]: convertIntoselectkeys
            }
        })
    }

    const getAllorganismAntibioticDatafun = async () => {
        const response: any = await ApiRequestMethod({ method: "GET", url: organismAntibioticMapingAllgridapi })
        dispatch({
            type: "getApis",
            payload: {
                getAllOrganismsDatastore: response?.data?.data
            }
        })
    }

    useEffect(() => {
        getApiesData('organismSerchDesc', getAllOrganismsData);
        getApiesData('AntibioticSerchDesc', getAllAntibioticData);
        getAllorganismAntibioticDatafun();
    }, [])

    return (
        <>


            <OrganismAntibioticMasterForm
                state={state}
                dispatch={dispatch}
            />

            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029]'>
                <OrganismAntibioticMasterGrid
                    state={state}
                    dispatch={dispatch}
                    getAllorganismAntibioticDatafun={getAllorganismAntibioticDatafun}
                />
            </div>

            {/* Dailog Box*/}
            <ReactCommonDialog
                dialogtitle={"Create Organism - Antibiotic Mapping"}
                open={state.popup.open}
                size={'lg'}
                handler={() => {
                    // dispatch({
                    //     type: 'dialogPop',
                    //     payload: {
                    //         open: false
                    //     }
                    // })
                }}
                popupClose={() => {
                    dispatch({
                        type: 'dialogPop',
                        payload: {
                            open: false
                        }
                    })
                }}
                Content={
                    <NewMappingform
                        state={state}
                        dispatch={dispatch}
                        getAllorganismAntibioticDatafun={getAllorganismAntibioticDatafun}
                    />}
            />


        </>
    )
}

export default MainPage
