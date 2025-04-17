"use client"
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useReducer } from 'react'

import ActionButton from '@/app/_common/button'
import { TabPageTitle } from '@/app/lab/_component'

interface OrganismAntibioticMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const OrganismAntibioticMasterForm: FC<OrganismAntibioticMasterFormprops> = ({
    state,
    dispatch
}) => {

    // const srchOrgnism = (data: any) => {
    //     dispatch({
    //         type: 'fieldVal',
    //         payload: {
    //             organismSrch: data
    //         }
    //     })
    // }

    // const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    //     dispatch({
    //         type: "fieldVal",
    //         payload: {
    //             [e.target.name]: e.target.value
    //         }
    //     })
    // }

    // const organismSrchfun = () => {
    //     const results: any = state.getAppApi.organismSrcGriddata
    //         .filter((list: any) => list.speciality.toLowerCase().includes(state.field.organismSrch.toLowerCase()))
    //     dispatch({
    //         type: "getApis",
    //         payload: {
    //             organismSrcGriddata: results
    //         }
    //     })

    // }


    return (
        <>
            {/** New code */}
            <div className='flex w-full gap-4 mt-3 justify-between items-center'>
                <TabPageTitle
                    title='Radiology – Technician Mapping'
                />
                <ActionButton
                    buttonText="New"
                    width="w-[140px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => {
                        dispatch({
                            type: 'dialogPop',
                            payload: {
                                open: true
                            }
                        })
                        dispatch({
                            type: 'fieldVal',
                            payload: {
                                newMappingGrid: [],
                                radTechMapId: null,
                                radiologyspecDesc: {
                                    label: "Radiology Speciality"
                                },
                                radiologydeptTech: null
                            }
                        })
                        dispatch({
                            type: 'fieldVal',
                            payload: {
                                rowData: {}
                            }
                        })
                    }}
                />
            </div>

            {/** old code */}
            {/* <div className='flex w-full gap-4 mt-3'>
                <div className='w-1/2 newSelect'>
                    <ReactSelectBox
                        value={state.field.organismSrch}
                        options={state.getAppApi.ornsismSel}
                        onChange={srchOrgnism}
                        label={"Organism Search"}
                        isSearchable={true}
                    />
                </div>
                <div className='w-1/2 newInputField'>
                    <FormPropsTextFields
                        label="Organism Search"
                        handleChange={inputHandler}
                        name="organismSrch"
                        value={state.field.organismSrch}
                    />
                </div>
                <div className='w-1/2 flex gap-4 justify-center newBtn-theme'>
                    <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={organismSrchfun}
                    />

                    <ActionButton
                        buttonText="New Mapping"
                        handleSubmit={() => {
                            dispatch({
                                type: 'dialogPop',
                                payload: {
                                    open: true
                                }
                            })
                        }}
                        width="w-full h-[42px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>

            </div> */}
        </>
    )
}

export default OrganismAntibioticMasterForm
