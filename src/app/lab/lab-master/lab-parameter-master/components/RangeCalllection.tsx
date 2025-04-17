import ActionButton from '@/app/_common/button'
import FormPropsTextFields from '@/app/_common/input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import React, { Dispatch, FC, SetStateAction } from 'react'

interface RangeCalllectionprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    inputHandler: (e: any) => void
}

const RangeCalllection: FC<RangeCalllectionprops> = ({
    state,
    dispatch,
    inputHandler
}) => {

    const addReferencedata = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                addRefrenceranceconfigDatagrid: [...state.field.addRefrenceranceconfigDatagrid, {
                    sn: Math.random(),
                    criteriaVal: state.field.criteriaVal.label !== 'Criteria Options' ? state.field.criteriaVal.label : '',
                    // genderfield: state.field.genderfield.label !== 'Gender' ? state.field.genderfield.label : '',
                    // eqpmntMaster: state.field.eqpmntMaster.label !== 'Equipment Master' ? state.field.eqpmntMaster.label : '',

                    // fromAge: state.field.fromAge,
                    // fromageUnits: state.field.fromageUnits.label !== 'Age Units' ? state.field.fromageUnits.label : '',
                    // toAge: state.field.toAge,
                    // toageUnits: state.field.toageUnits.label !== 'Age Units' ? state.field.toageUnits.label : '',

                    // rangeFromSymb: state.field.rangeFromSymb.label !== 'Select' ? state.field.rangeFromSymb.label : '',
                    // rangeFrom: state.field.rangeFrom,
                    // rangeToSymb: state.field.rangeToSymb.label !== 'Select' ? state.field.rangeToSymb.label : '',
                    // rangeTo: state.field.rangeTo,
                    minValue: state.field.rangeFrom,
                    maxValue: state.field.rangeTo,
                    criteria: `${state.field.genderfield.label !== 'Gender' ? state.field.genderfield.label : ''} ${state.field.fromAge && state.field.genderfield.label !== 'Gender' ? ` / ` : ''} ${state.field.fromAge && state.field.fromageUnits.label !== 'Age Units' && state.field.toageUnits.label !== 'Age Units' ? `Age : ${state.field.fromAge} ${state.field.fromageUnits.label} - ${state.field.toAge} ${state.field.toageUnits.label} ` : ''} ${state.field.genderfield.label !== 'Gender' && state.field.eqpmntMaster.label !== 'Equipment Master' && state.field.fromAge ? ` / ` : state.field.eqpmntMaster.label !== 'Equipment Master' && state.field.fromAge ? ` / ` : state.field.genderfield.label !== 'Gender' && state.field.eqpmntMaster.label !== 'Equipment Master' ? ` / ` : ''} ${state.field.eqpmntMaster.label !== 'Equipment Master' ? state.field.eqpmntMaster.label : ''}`,
                    normalrange: `${state.field.rangeFromSymb.label !== 'Select' ? state.field.rangeFromSymb.label : ''} ${state.field.rangeFrom ? state.field.rangeFrom : ''} ${state.field.rangeTo ? ` - ` : ''} ${state.field.rangeToSymb.label !== 'Select' ? state.field.rangeToSymb.label : ''} ${state.field.rangeTo ? state.field.rangeTo : ''}`
                }],
                // criteriaVal: {
                //     label: "Criteria Options"
                // },
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
    }

    const updateReferenceData = () => {
        console.log(state)
        dispatch({
            type: "fieldVal",
            payload: {
                addRefrenceranceconfigDatagrid: state.field.addRefrenceranceconfigDatagrid.map((list: any) => {
                    if (list.Refrenceranceconfig === state.field.Refrenceranceconfig) {
                        return {
                            ...list,
                            criteriaVal: state.field.criteriaVal.label !== 'Criteria Options' ? state.field.criteriaVal.label : '',
                            genderfield: state.field.genderfield.label !== 'Gender' ? state.field.genderfield.label : '',
                            eqpmntMaster: state.field.eqpmntMaster.label !== 'Equipment Master' ? state.field.eqpmntMaster.label : '',

                            fromAge: state.field.fromAge,
                            fromageUnits: state.field.fromageUnits.label !== 'Age Units' ? state.field.fromageUnits.label : '',
                            toAge: state.field.toAge,
                            toageUnits: state.field.toageUnits.label !== 'Age Units' ? state.field.toageUnits.label : '',

                            rangeFromSymb: state.field.rangeFromSymb.label !== 'Select' ? state.field.rangeFromSymb.label : '',
                            rangeFrom: state.field.rangeFrom,
                            rangeToSymb: state.field.rangeToSymb.label !== 'Select' ? state.field.rangeToSymb.label : '',
                            rangeTo: state.field.rangeTo,

                        }
                    }
                    return list
                })
            }
        })
    }

    console.log(state)
    return (
        <>
            <div className='flex gap-4 newSelect newInputField items-center'>
                <div>
                    <ReactSelectBox
                        value={state.field.rangeFromSymb}
                        options={state.getApi.LogicalValuesSel}
                        onChange={(data: any) => {
                            dispatch({
                                type: "fieldVal",
                                payload: {
                                    rangeFromSymb: data
                                }
                            })
                        }}
                        label={"Select"}
                    />
                </div>
                <div className='w-[100px]'>
                    <FormPropsTextFields
                        name="rangeFrom"
                        value={state.field.rangeFrom}
                        handleChange={inputHandler}
                        type="text"
                        label="Range From"
                        containerProps={{
                            className: '!min-w-0 h-[43px]'
                        }}
                    />
                </div>
                <div>-</div>
                <div>
                    <ReactSelectBox
                        value={state.field.rangeToSymb}
                        options={state.getApi.LogicalValuesSel}
                        onChange={(data: any) => {
                            dispatch({
                                type: "fieldVal",
                                payload: {
                                    rangeToSymb: data
                                }
                            })
                        }}
                        label={"Select"}
                    />
                </div>
                <div className='w-[100px]'>
                    <FormPropsTextFields
                        name="rangeTo"
                        value={state.field.rangeTo}
                        handleChange={inputHandler}
                        type="text"
                        label="Range To"
                        containerProps={{
                            className: '!min-w-0 h-[43px]'
                        }}
                    />
                </div>
                <ActionButton
                    buttonText={state.field.Refrenceranceconfig ? "Update" : "Add"}
                    width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={state.field.Refrenceranceconfig ? updateReferenceData : addReferencedata}
                    disabled={
                        // state.field.fromAge state.field.rangeFrom ? false : true
                        state.field.rangeFrom ?
                            state.field.criteriaVal.label === 'Gender' && state.field.genderfield.label !== 'Gender' && state.field.rangeFrom ? false :
                                state.field.criteriaVal.label === 'General' && state.field.rangeFrom ? false :
                                    state.field.eqpmntMaster.label !== 'Equipment Master' && state.field.rangeFrom ? false :
                                        state.field.criteriaVal.label === 'Age' && state.field.fromAge && state.field.fromageUnits.label !== 'Age Units' && state.field.rangeFrom ? false :
                                            state.field.criteriaVal.label === 'Combination' &&
                                                (state.field.fromAge && state.field.fromageUnits.label !== 'Age Units' ||
                                                    state.field.eqpmntMaster.label !== 'Equipment Master' ||
                                                    state.field.genderfield.label !== 'Gender'
                                                )
                                                && state.field.rangeFrom
                                                ? false : true
                            : true
                    }
                />
            </div>
        </>
    )
}

export default RangeCalllection
