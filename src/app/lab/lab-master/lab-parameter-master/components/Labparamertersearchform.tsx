import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { TabPageTitle } from '@/app/lab/_component'
import { sanitizeObject } from '@/app/utilities/sanitizeObject'
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'

interface Labparamertersearchformprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const Labparamertersearchform: FC<Labparamertersearchformprops> = ({
    state,
    dispatch
}) => {

    // const srchlabParameter = (data: any, key: string) => {
    //     dispatch({
    //         type: 'fieldVal',
    //         payload: {
    //             [`${key}`]: sanitizeObject(data)
    //         }
    //     })
    // }

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "fieldVal",
            payload: {
                labprameterSrch: e.target.value
            }
        })
    }

    const labSearch = () => {
        const result = state.getApi.getsaveLabparameterDataresults
            .filter((list: any) =>
                list?.parameterDescription.toLowerCase().includes(state.field.labprameterSrch?.toLowerCase())
            );
        dispatch({
            type: "getAllApies",
            payload: {
                getsaveLabparameterDataresults: result
            }
        })
    }

    return (
        <>
            <div className='flex w-full gap-4 mt-3 justify-between items-center'>
                <TabPageTitle
                    title='Lab Parameter Master'
                />
                <ActionButton
                    buttonText="New"
                    width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={() => {
                        dispatch({
                            type: 'dailogModal',
                            payload: {
                                open: true
                            }
                        })
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
                                terminology_code_desc: {
                                    label: "Terminology code / Desc Search *"
                                },
                                addTerminologyDatagrid: [],
                                addListValues: [],
                                referenceComments: '',
                                criteriaVal: {
                                    label: "Criteria Options"
                                },
                                referenceId: null,
                                Refrenceranceconfig: null,
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
                />
            </div>

            {/* <div className='flex w-full gap-4 mt-3'>
                <div className='w-1/2 newSelect'>
                    <ReactSelectBox
                        value={state.field.labprameterSrch}
                        options={state.getApi.saveLabparametersel}
                        onChange={(data: any) => srchlabParameter(data, 'labprameterSrch')}
                        label={"Lab Parameter Search"}
                        isSearchable={true}
                    />
                </div>

                <div className='w-1/2 newInputField'>
                    <FormPropsTextFields
                        label="Lab Parameter Search"
                        handleChange={inputHandler}
                        name="labprameterSrch"
                        value={state.field.labprameterSrch}
                    />
                </div>

                <div className='w-1/2 flex gap-4 justify-center  newBtn-theme'>
                    <ActionButton
                        buttonText="Search"
                        width="w-full text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

                        handleSubmit={labSearch}
                    />

                    <ActionButton
                        buttonText="New Lab Parameter"
                        handleSubmit={() => {
                            dispatch({
                                type: 'dailogModal',
                                payload: {
                                    open: true
                                }
                            })
                            dispatch({
                                type: "fieldVal",
                                payload: {
                                    parameterDescription: '',
                                    parameterCode: '',
                                    units: {
                                        label: 'Result Units'
                                    },
                                    result_type: {
                                        label: 'Result Type *'
                                    },
                                    terminology_code_desc: {
                                        label: "Terminology code / Desc Search"
                                    },
                                    addTerminologyDatagrid: [],
                                    addListValues: [],
                                    referenceComments: '',
                                    criteriaVal: {
                                        label: "Criteria Options"
                                    },
                                    referenceId: null,
                                    Refrenceranceconfig: null,
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
                        width="w-full h-[42px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>

            </div> */}
        </>
    )
}

export default Labparamertersearchform
