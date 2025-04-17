"use client"
import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import { ReactSelectBox } from '@/app/_commonfeatures';
import { sanitizeInput } from '@/app/utilities/sanitizeInput';
import { sanitizeObject } from '@/app/utilities/sanitizeObject';
import { TrashIcon } from '@heroicons/react/24/solid';
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import LabTerminologyGrid from './LabTerminologyGrid';
import { toast } from 'react-toastify';
import { snomedLoincSearch, snowmedChiefcomplaint } from '@/app/utilities/api-urls';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';

interface LabTerminologyFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllParameterFun: any
}

const LabTerminologyForm: FC<LabTerminologyFormprops> = ({
    state,
    dispatch,
    getAllParameterFun
}) => {
    // from this state we have add in the apies for snomed apie
    const [semantic, setSemantic] = useState<any>(["procedure", "record artifact",]);

    // from api add label and value key from below function
    const addLabelValuekeyfun = (data: any) => {
        const result = data.map((item: any) => ({
            ...item,
            value: item.conceptId ? item.conceptId : item.LOINC_NUMBER,
            label: item.conceptFsn ? item.conceptFsn : item.LONG_COMMON_NAME,
        }));

        return result
    }

    // terminology Desc Search according to Terminology Type from below function
    const terminologyDescSearchfun = useMemo(() => async (value: any) => {
        //
        let apiUrl: any;
        if (state.field.terminology_type.value === "TT1001") {
            apiUrl = snowmedChiefcomplaint + `term=${value}&state=active&semantictag=${semantic.join("++")}&acceptability=synonyms&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
        }
        else if (state.field.terminology_type.value === "TT1002") {
            apiUrl = `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=1000&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${value}&timing=ALL`
        }

        // we get response from below api works according to Terminology Type select 
        const response: any = await ApiRequestMethod({ method: 'GET', url: apiUrl })

        // from below function we have to add the label and value key 
        const result: any = addLabelValuekeyfun(response?.data?.data ? response?.data?.data : [])

        // from this dispatch method we have store the values
        dispatch({
            type: "getAllApies",
            payload: {
                terminologycodeDesc: result
            }
        })
    }, [state.getApi.terminologycodeDesc])

    // input the value here
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                [e.target.name]: sanitizeInput(e.target.value)
            }
        })
    }

    // add the list value
    const addList = () => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addListValues: [...state.field.addListValues, { list_value: state.field.list_value }],
                list_value: ''
            }
        })
    }

    // Delete the list value
    const deleteList = (id: any) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addListValues: state.field.addListValues.filter((list: any, index: any) => index !== id)
            }
        })
    }

    const AddTerminologyDescdata = () => {
        // Check if the user already exists in addUserdatatable
        const isDuplicateUser = state.field.addTerminologyDatagrid.some(
            (list: any) => list.terminology_type === state.field.terminology_type.label &&
                list.terminologyDesc === state.field.terminology_code_desc.label
        );

        if (isDuplicateUser) {
            return toast.error("You have entered same Terminology Type and Terminology Description again.."); // Exit the function without dispatching the action
        }
        dispatch({
            type: 'fieldVal',
            payload: {
                addTerminologyDatagrid: [
                    ...state.field.addTerminologyDatagrid,
                    {
                        sn: Math.random(),
                        terminology_type: state.field.terminology_type.label,
                        terminology_typeCode: state.field.terminology_type.value,
                        terminologyCode: state.field.terminology_code_desc.value,
                        terminologyDesc: state.field.terminology_code_desc.label
                    }
                ],
                terminology_type: {
                    label: "Terminology Type *"
                },
                terminology_code_desc: {
                    label: "Terminology code / Desc Search *"
                }
            }

        })

        dispatch({
            type: "getAllApies",
            payload: {
                terminologycodeDesc: []
            }
        })
    }

    return (
        <>
            <div className={`${state.field.result_type.value === 'list' ? 'gap-4 flex' : ''} w-full mt-4`}>
                <div className={`${state.field.result_type.value === 'list' ? 'w-3/4' : 'w-full '}`}>
                    <div className='w-full flex gap-4'>
                        <div className='w-1/5 newSelect my-select'>
                            <ReactSelectBox
                                value={state.field.terminology_type}
                                options={state.getApi.TerminologyOptions}
                                onChange={(e: any) => {
                                    dispatch({
                                        type: 'fieldVal',
                                        payload: {
                                            terminology_type: sanitizeObject(e),
                                            terminology_code_desc: {
                                                label: "Terminology code / Desc Search *"
                                            }
                                        }
                                    })
                                    // from this dispatch method we have store the values
                                    dispatch({
                                        type: "getAllApies",
                                        payload: {
                                            terminologycodeDesc: []
                                        }
                                    })
                                }}
                                label="Terminology Type *"
                                isMultiple={false}
                                isSearchable={false}
                            />
                        </div>
                        <div className='w-3/5 newSelect my-select'>
                            <ReactSelectBox
                                value={state.field.terminology_code_desc}
                                options={state.getApi.terminologycodeDesc}
                                onChange={(e: any) => {
                                    dispatch({
                                        type: 'fieldVal',
                                        payload: {
                                            terminology_code_desc: sanitizeObject(e)
                                        }
                                    })

                                }}
                                onSearchInputChange={(e: any) => {
                                    dispatch({
                                        type: "fieldVal",
                                        payload: {
                                            terminologyText: e.target.value
                                        }
                                    })
                                    terminologyDescSearchfun(e.target.value)
                                }}
                                label="Terminology code / Desc Search *"
                                isMultiple={false}
                                isSearchable={true}
                                isDisabled={state.field.terminology_type.label !== 'Terminology Type *' ? false : true}
                            />
                        </div>
                        <div className='w-1/5 newBtn-theme'>
                            <ActionButton
                                buttonText="Add"
                                width="w-full text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={AddTerminologyDescdata}
                                disabled={
                                    state.field.terminology_code_desc.label !== 'Terminology code / Desc Search *' &&
                                        state.field.terminology_type.label !== 'Terminology Type *' ? false : true
                                }
                            />
                        </div>
                    </div>


                    <div className='w-full'>
                        <LabTerminologyGrid
                            state={state}
                            dispatch={dispatch}
                            getAllParameterFun={getAllParameterFun}
                        />
                    </div>
                </div>
                {state.field.result_type.value === 'list' &&
                    <div className='w-1/4'>
                        <div className="w-full flex gap-4 newInputField newBtn-theme">
                            <div className='w-2/3'>
                                <FormPropsTextFields
                                    label={`Enter List Value`}
                                    name="list_value"
                                    value={state.field.list_value}
                                    handleChange={inputHandler}
                                    containerProps={{
                                        className: "!min-w-0 rounded-lg  rounded-r-none",
                                    }}
                                />
                            </div>
                            <ActionButton
                                buttonText="Add"
                                handleSubmit={addList}
                                width="w-[80px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={
                                    state.field.list_value !== '' ? false : true
                                }
                            />
                        </div>
                        {state.field.addListValues.length > 0 &&
                            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                                <div className="w-full mt-3">
                                    <div
                                        className="w-full bg-gray-200 
                                                font-bold text-center text-black 
                                                 px-3"
                                    >
                                        List Value
                                    </div>
                                    <div className="w-full bg-white">
                                        <ul className=" list-none m-0 p-0 divide-y">
                                            {state.field.addListValues.map((list: any, index: any) => (
                                                <>
                                                    <li className="py-1 px-2 text-sm flex justify-between items-center">
                                                        {list.list_value}
                                                        <div className='cursor-pointer' onClick={() => deleteList(index)}>
                                                            <TrashIcon className='w-3 h-3 text-red-500' />
                                                        </div>

                                                    </li>
                                                </>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                }
            </div>
        </>
    )
}

export default LabTerminologyForm
