"use client"
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { sanitizeInput } from '@/app/utilities/sanitizeInput'
import { sanitizeObject } from '@/app/utilities/sanitizeObject'
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect } from 'react'
import RangeCalllection from './RangeCalllection'
import ActionButton from '@/app/_common/button'

interface ReferenceRangeFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const ReferenceRangeForm: FC<ReferenceRangeFormprops> = ({
    state,
    dispatch
}) => {

    const criteiraOptions: any[] = [
        { label: 'General', value: 'general' },
        { label: 'Gender', value: 'gender' },
        { label: 'Age', value: 'age' },
        { label: 'Equipment', value: 'equipment' },
        { label: 'Combination', value: 'combination' }
    ]

    const LogicalValues: any[] = [
        { label: "=", value: "=" },
        { label: "<", value: "<" },
        { label: "<=", value: "<=" },
        { label: ">", value: ">" },
        { label: ">=", value: ">=" },
    ]

    const genderVal: any[] = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
    ]


    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "fieldVal",
            payload: {
                [e.target.name]: sanitizeInput(e.target.value)
            }
        })
    }

    useEffect(() => {
        dispatch({
            type: 'getAllApies',
            payload: {
                criteiraOptionsel: [...criteiraOptions],
                LogicalValuesSel: [...LogicalValues],
                GenderSel: [...genderVal]
            }
        })
    }, [])

    return (
        <>
            <div className='w-full flex gap-4'>
                <div className='w-1/4 newSelect'>
                    <ReactSelectBox
                        value={state.field.criteriaVal}
                        options={state.getApi.criteiraOptionsel}
                        onChange={(data: any) => {
                            dispatch({
                                type: "fieldVal",
                                payload: {
                                    criteriaVal: sanitizeObject(data),
                                    genderfield: {
                                        label: "Gender"
                                    },
                                    eqpmntMaster: {
                                        label: 'Equipment Master'
                                    },
                                    fromAge: '',
                                    fromageUnits: {
                                        label: 'Age Units'
                                    },
                                    toAge: '',
                                    toageUnits: {
                                        label: 'Age Units'
                                    },
                                    rangeFromSymb: {
                                        label: 'Select'
                                    },
                                    rangeFrom: '',
                                    rangeToSymb: {
                                        label: 'Select'
                                    },
                                    rangeTo: ''
                                }
                            })
                        }}
                        label={"Criteria Options"}
                    />
                </div>
            </div>

            {/* border section */}
            {state.field.criteriaVal.label !== 'Criteria Options' && <div className='my-3 w-full border-b border-gray-300'></div>}

            {/* General Selection option */}
            {state.field.criteriaVal.label === 'General' &&
                <div className='w-full flex justify-between items-center'>
                    <div className='flex items-center'>General</div>
                    <RangeCalllection
                        state={state}
                        dispatch={dispatch}
                        inputHandler={inputHandler}

                    />
                </div>}

            {/* gender Selection option */}
            {
                state.field.criteriaVal.label === 'Gender' &&
                <div className='w-full flex justify-between items-center'>
                    <div className='flex items-center newSelect w-[140px]'>
                        <ReactSelectBox
                            value={state.field.genderfield}
                            options={state.getApi.GenderSel}
                            onChange={(data: any) => {
                                dispatch({
                                    type: "fieldVal",
                                    payload: {
                                        genderfield: data
                                    }
                                })
                            }}
                            label={"Gender"}
                        />
                    </div>
                    <RangeCalllection
                        state={state}
                        dispatch={dispatch}
                        inputHandler={inputHandler}

                    />
                </div>
            }

            {/* Age Selection option */}
            {
                state.field.criteriaVal.label === 'Age' &&
                <div className='w-full'>
                    <div className='w-2/3 flex items-center gap-4 newSelect mb-4 newInputField'>
                        <div className='w-full'>
                            <FormPropsTextFields
                                label="From Age"
                                name="fromAge"
                                value={state.field.fromAge}
                                handleChange={inputHandler}
                                containerProps={{
                                    className: '!min-w-0 h-[43px]'
                                }}
                            />
                        </div>
                        <div className='w-full'>
                            <ReactSelectBox
                                value={state.field.fromageUnits}
                                label='Age Units'
                                options={state.getApi.durationListSel}
                                onChange={(data: any) => {
                                    dispatch({
                                        type: "fieldVal",
                                        payload: {
                                            fromageUnits: sanitizeObject(data)
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div>-</div>
                        <div className='w-full'>
                            <FormPropsTextFields
                                label="To Age"
                                name="toAge"
                                value={state.field.toAge}
                                handleChange={inputHandler}
                                containerProps={{
                                    className: '!min-w-0 h-[43px]'
                                }}
                            />
                        </div>
                        <div className='w-full'>
                            <ReactSelectBox
                                value={state.field.toageUnits}
                                label='Age Units'
                                options={state.getApi.durationListSel}
                                onChange={(data: any) => {
                                    dispatch({
                                        type: "fieldVal",
                                        payload: {
                                            toageUnits: sanitizeObject(data)
                                        }
                                    })
                                }}
                            />
                        </div>
                    </div>
                    <div className='w-full'>
                        <RangeCalllection
                            state={state}
                            dispatch={dispatch}
                            inputHandler={inputHandler}

                        />
                    </div>
                </div>
            }

            {/* Equipment Selection option */}
            {
                state.field.criteriaVal.label === 'Equipment' &&
                <div className='w-full flex justify-between items-center newSelect'>
                    <div className='flex items-center '>
                        <ReactSelectBox
                            value={state.field.eqpmntMaster}
                            label='Equipment Master'
                            options={state.getApi.equipmentMasterSel}
                            onChange={(data: any) => {
                                dispatch({
                                    type: 'fieldVal',
                                    payload: {
                                        eqpmntMaster: sanitizeObject(data)
                                    }
                                })
                            }}
                            optionListWidtsize={true}
                        />
                    </div>
                    <RangeCalllection
                        state={state}
                        dispatch={dispatch}
                        inputHandler={inputHandler}

                    />
                </div>
            }

            {/* Combination Selection option */}
            {
                state.field.criteriaVal.label === 'Combination' &&
                <div className='w-full newSelect'>
                    <div className='flex gap-4 justify-between items-center mb-4'>
                        <div className='w-1/3'>
                            <ReactSelectBox
                                value={state.field.genderfield}
                                options={state.getApi.GenderSel}
                                onChange={(data: any) => {
                                    dispatch({
                                        type: "fieldVal",
                                        payload: {
                                            genderfield: data
                                        }
                                    })
                                }}
                                label={"Gender"}
                            />
                        </div>
                        <div className='w-2/3 flex items-center gap-4 newSelect newInputField'>
                            <div className='w-full'>
                                <FormPropsTextFields
                                    label="From Age"
                                    name="fromAge"
                                    value={state.field.fromAge}
                                    handleChange={inputHandler}
                                    containerProps={{
                                        className: '!min-w-0 h-[43px]'
                                    }}
                                />
                            </div>
                            <div className='w-full'>
                                <ReactSelectBox
                                    value={state.field.fromageUnits}
                                    label='Age Units'
                                    options={state.getApi.durationListSel}
                                    onChange={(data: any) => {
                                        dispatch({
                                            type: "fieldVal",
                                            payload: {
                                                fromageUnits: sanitizeObject(data)
                                            }
                                        })
                                    }}
                                />
                            </div>
                            <div>-</div>
                            <div className='w-full'>
                                <FormPropsTextFields
                                    label="To Age"
                                    name="toAge"
                                    value={state.field.toAge}
                                    handleChange={inputHandler}
                                    containerProps={{
                                        className: '!min-w-0 h-[43px]'
                                    }}
                                />
                            </div>
                            <div className='w-full'>
                                <ReactSelectBox
                                    value={state.field.toageUnits}
                                    label='Age Units'
                                    options={state.getApi.durationListSel}
                                    onChange={(data: any) => {
                                        dispatch({
                                            type: "fieldVal",
                                            payload: {
                                                toageUnits: sanitizeObject(data)
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-4 justify-between items-center mb-4'>
                        <div className='w-1/3'>
                            <ReactSelectBox
                                value={state.field.eqpmntMaster}
                                label='Equipment Master'
                                options={state.getApi.equipmentMasterSel}
                                onChange={(data: any) => {
                                    dispatch({
                                        type: 'fieldVal',
                                        payload: {
                                            eqpmntMaster: sanitizeObject(data)
                                        }
                                    })
                                }}
                                optionListWidtsize={true}
                            />
                        </div>
                        <div className='w-2/3 flex items-center gap-4 newSelect newInputField'>
                            <RangeCalllection
                                state={state}
                                dispatch={dispatch}
                                inputHandler={inputHandler}

                            />
                        </div>
                    </div>

                </div>
            }

        </>
    )
}

export default ReferenceRangeForm
