"use client"
import React, { useEffect, useReducer } from 'react'
import { NewMappingform, OrganismAntibioticMasterForm, OrganismAntibioticMasterGrid } from './components'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllRadiologyTechnicianMapping, getRadiologySpeciality, getRadiologyTechnicians } from '@/app/utilities/api-urls'
import { RadiologyInitilalState, RadiologyTechnicianMapingReducer } from './components/RadiologyTechnicianMappingReducerfun'

const RadiologyTechnicianMappingPage = () => {
    const [state, dispatch] = useReducer(RadiologyTechnicianMapingReducer, RadiologyInitilalState)

    // add the label and value keys in the get apies for select box
    const changeConvertIntoselectKey = (data: any) => {
        const result: any = data.map((list: any) => {
            return {
                ...list,
                label: list.specialityDescription ? list.specialityDescription : list.firstName,
                value: list.specialityCode ? list.specialityCode : list.employeeId
            }
        })
        return result
    }

    // get the respective select box apies
    const getApiesData = async (keyName: string, apieUrl: any) => {
        const response: any = await ApiRequestMethod({ method: "GET", url: apieUrl })
        let data: any = response?.data?.data ? response?.data?.data : []
        const convertIntoselectkeys: any = changeConvertIntoselectKey(data)
        console.log(convertIntoselectkeys);
        dispatch({
            type: 'fieldVal',
            payload: {
                [`${keyName}`]: convertIntoselectkeys
            }
        })
    }

    console.log(state.field);

    const getAllorganismAntibioticDatafun = async () => {
        const response: any = await ApiRequestMethod({ method: "GET", url: getAllRadiologyTechnicianMapping })
        dispatch({
            type: "getApis",
            payload: {
                getAllradiologytechDatastore: response?.data?.data
            }
        })
    }

    useEffect(() => {
        getApiesData('radiologyspecSerchDesc', getRadiologySpeciality);
        getApiesData('radiologydeptTechSerchDesc', getRadiologyTechnicians);
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
                dialogtitle={"Radiology – Technician Mapping"}
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

export default RadiologyTechnicianMappingPage
