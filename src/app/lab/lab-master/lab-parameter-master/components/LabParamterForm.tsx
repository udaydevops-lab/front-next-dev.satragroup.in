"use client"

import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { sanitizeObject } from '@/app/utilities/sanitizeObject'
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import LabTerminologyForm from './LabTerminologyForm'
import { sanitizeInput } from '@/app/utilities/sanitizeInput'
import ActionButton from '@/app/_common/button'
import { toast } from 'react-toastify'
import ReferenceRangeConfig from './ReferenceRangeConfig'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { labParamerMastersaveapie } from '@/app/utilities/api-urls'
import { jsonParse } from '@/app/utilities/local'

interface LabParamterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllParameterFun: any
}

const LabParamterForm: FC<LabParamterFormprops> = ({
    state,
    dispatch,
    getAllParameterFun
}) => {

    // set the values
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "fieldVal",
            payload: {
                [e.target.name]: sanitizeInput(e.target.value)
            }
        })
    }

    // save and update the Lab Parameter value with this function
    const saveReferencerangedata = async () => {
        dispatch({
            type: 'fieldVal',
            payload: {
                loader: true
            }
        })

        // refrenceRangeSetData set as per the given save payload
        const refrenceRangeSetData: any = state.field.addRefrenceranceconfigDatagrid.map((list: any) => ({
            referenceId: list.referenceId ? list.referenceId : null,
            criteriaType: list.criteriaVal,
            criteria: list.criteria ? list.criteria : '',
            refrenceRange: list.normalrange ? list.normalrange : '',
            minValue: `${list.rangeFrom && list.rangeFrom}`, maxValue: `${list.rangeTo && list.rangeTo}`,
            statusFlag: 1
        }))

        // set save Object
        let postObjData: any = {
            parameterId: state.field.parameterId ? state.field.parameterId : null,
            parameterDescription: state.field.parameterDescription,
            parameterCode: state.field.parameterCode,
            resultType: state.field.result_type.label !== 'Result Type *' ? state.field.result_type.value : '',
            units: state.field.units.label !== 'Result Units' ? state.field.units.label : '',
            parameterTerminologySet: state.field.addTerminologyDatagrid.map((list: any) => ({
                terminologyId: list.terminologyId ? list.terminologyId : null,
                terminologyType: list.terminology_type,
                terminologyCode: list.terminologyCode,
                terminologyDesc: list.terminologyDesc
            })),
            updatedBy: jsonParse("loginResponse").employeename,
            comments: state.field.referenceComments,
            listValue: state.field?.addListValues.length > 0 ? state.field.addListValues.map((list: any) => list.list_value).join() : "",
            referenceRangeSet: refrenceRangeSetData && refrenceRangeSetData?.length > 0 ? refrenceRangeSetData : null,
            statusFlag: 1
        }
        // api call
        const response: any = await ApiRequestMethod({ method: "POST", url: labParamerMastersaveapie, postObj: postObjData })

        if (response.success) {
            setTimeout(() => {
                toast.success(`${state.field.parameterId ? 'Updated Successfully' : 'Saved successfully '}`)
                if (state.field.parameterId) {
                    dispatch({
                        type: "fieldVal",
                        payload: {
                            loader: false,
                        }
                    })
                }
                else {
                    dispatch({
                        type: "fieldVal",
                        payload: {
                            loader: false,
                            parameterDescription: '',
                            parameterCode: '',
                            units: {
                                label: 'Result Units'
                            },
                            result_type: {
                                label: 'Result Type *'
                            },
                            terminology_type: {
                                label: "Terminology Type *",
                            },
                            terminology_code_desc: {
                                label: "Terminology code / Desc Search *",
                            },
                            addTerminologyDatagrid: [],
                            addListValues: [],
                            referenceComments: '',
                            criteriaVal: {
                                label: "Criteria Options"
                            },
                            referenceId: null,
                            Refrenceranceconfig: null,
                            getsaveLabparameterref: null,
                            eqpmntMaster: {
                                label: 'Equipment Master'
                            },
                            genderfield: {
                                label: 'Gender'
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
                            rangeTo: '',
                            addRefrenceranceconfigDatagrid: []
                        }
                    })
                }

                getAllParameterFun()
            }, 2000)
        }
        else {
            dispatch({
                type: 'fieldVal',
                payload: {
                    loader: false
                }
            })
            toast.error('Something went wrong')
        }
    }

    // clear data funtion
    const ClearOrganisAnitibiotic = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                parameterId: null,
                parameterDescription: '',
                parameterCode: '',
                units: {
                    label: 'Result Units'
                },
                result_type: {
                    label: 'Result Type *'
                },
                terminology_type: {
                    label: "Terminology Type *",
                },
                terminology_code_desc: {
                    label: "Terminology code / Desc Search *",
                },
                addTerminologyDatagrid: [],
                addListValues: [],
                referenceComments: '',
                criteriaVal: {
                    label: "Criteria Options"
                },
                referenceId: null,
                Refrenceranceconfig: null,
                getsaveLabparameterref: null,
                eqpmntMaster: {
                    label: 'Equipment Master'
                },
                genderfield: {
                    label: 'Gender'
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
                rangeTo: '',
                addRefrenceranceconfigDatagrid: []
            }
        })
    }
    return (
        <>
            <div className='w-full flex gap-4 mt-4'>
                <div className='w-2/5 newInputField'>
                    <FormPropsTextFields
                        label="Parameter Name *"
                        type="text"
                        name="parameterDescription"
                        value={state.field.parameterDescription}
                        handleChange={inputHandler}
                        containerProps={{
                            className: '!min-w-0 h-[43px]'
                        }}
                    />
                </div>
                <div className='w-1/5 newInputField'>
                    <FormPropsTextFields
                        label="Parameter Code *"
                        type="text"
                        name="parameterCode"
                        value={state.field.parameterCode}
                        handleChange={inputHandler}
                        containerProps={{
                            className: '!min-w-0 h-[43px]'
                        }}
                    />
                </div>
                <div className='w-1/5 newSelect'>
                    <ReactSelectBox
                        value={state.field.units}
                        options={state.getApi.unitsSelct}
                        isSearchable={true}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    units: sanitizeObject(data),
                                }
                            })
                        }}
                        label="Result Units"
                    />
                </div>
                <div className='w-1/5 newSelect'>
                    <ReactSelectBox
                        value={state.field.result_type}
                        options={state.getApi.resultType}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    result_type: sanitizeObject(data),
                                    addListValues: [],
                                    criteriaVal: {
                                        label: "Criteria Options"
                                    },
                                    referenceId: null,
                                    Refrenceranceconfig: null,
                                    getsaveLabparameterref: null,
                                    eqpmntMaster: {
                                        label: 'Equipment Master'
                                    },
                                    genderfield: {
                                        label: 'Gender'
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
                                    rangeTo: '',
                                    addRefrenceranceconfigDatagrid: []
                                }
                            })
                        }}
                        label={"Result Type *"}
                    />
                </div>
            </div>


            {/* terminology Form */}
            <LabTerminologyForm
                state={state}
                dispatch={dispatch}
                getAllParameterFun={getAllParameterFun}
            />

            <ReferenceRangeConfig
                state={state}
                dispatch={dispatch}
            />

            <div className='w-full mt-4 flex justify-end items-center gap-4'>
                <ActionButton
                    buttonText={
                        state.field.loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            state.field.parameterId ? 'Update' : "Save"
                    }
                    width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={saveReferencerangedata}
                    disabled={
                        state.field.parameterDescription !== '' &&
                            state.field.parameterCode !== '' &&
                            state.field.result_type.label !== "Result Type *" &&
                            state.field.addTerminologyDatagrid.length > 0 ? false : true
                    }
                />
                {state.field.parameterId?null:
                <ActionButton
                    buttonText="Clear"
                    width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={ClearOrganisAnitibiotic}
                />}
            </div>
        </>
    )
}

export default LabParamterForm
