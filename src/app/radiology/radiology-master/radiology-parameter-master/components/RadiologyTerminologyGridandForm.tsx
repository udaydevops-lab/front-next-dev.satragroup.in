import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import Textarea from '@/app/_common/text-area';
import { ReactSelectBox } from '@/app/_commonfeatures';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { snomedLoincSearch, snowmedChiefcomplaint } from '@/app/utilities/api-urls';
import { sanitizeInput } from '@/app/utilities/sanitizeInput';
import { sanitizeObject } from '@/app/utilities/sanitizeObject';
import { TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import { toast } from 'react-toastify';

interface RadiologyTerminologyGridandFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const RadiologyTerminologyGridandForm: FC<RadiologyTerminologyGridandFormprops> = ({
    state,
    dispatch
}) => {

    // from this state we have add in the apies for snomed apie
    const [semantic, setSemantic] = useState<any>(["procedure", "record artifact",]);

    // from this columns1 
    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 90,
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
        },
        { field: "terminologyType", headerName: "Terminology Type", width: 220 },
        {
            field: "terminologyDesc", headerName: "Terminology Code - Description", width: 500,
            renderCell: (params: any) => {
                return `${params.row.terminologyCode} - ${params.row.terminologyDesc}`
            }
        },
        // { field: "terminologyCode", headerName: "Terminology Code", width: 180 },
        {
            field: "orderingDr", headerName: "Actions", width: 120,
            renderCell: (params: any) => (
                <>
                    <div className='cursor-pointer flex justify-center gap-3'>
                        <div className='cursor-pointer' onClick={() => delTerminologyDatagridSingldata(params.row)}>
                            <TrashIcon className='w-5 h-5 text-red-500' />
                        </div>
                        {/* <div className='cursor-pointer'>
                            <PencilIcon className='w-5 h-5 text-[#2196F3]' />
                        </div> */}
                    </div>
                </>
            )
        },
    ];

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

        // if Terminology Type don't select then this message should appear
        if (state.field.terminology_type.label === "Terminology Type *") {
            return toast.error('You are not able to search without select terminology Type...')
        }

        // if Terminology Type select below functionality works
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
            type: "fieldVal",
            payload: {
                terminologycodeDesc: result
            }
        })
    }, [state.field.terminologycodeDesc])



    // from this inputhandler we have add the input values
    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                [e.target.name]: sanitizeInput(e.target.value)
            }
        })
    }

    // from this selecthandler we have to add the select values
    const selectHandler = (selectKey: string, data: any) => {
        if (state.field.terminology_type.value === "TT1001") {
            dispatch({
                type: "fieldVal",
                payload: {
                    terminology_code_desc: {
                        label: "Terminology code / Desc Search *"
                    },
                    terminologycodeDesc: []
                }
            })
        }
        else {
            dispatch({
                type: "fieldVal",
                payload: {
                    terminology_code_desc: {
                        label: "Terminology code / Desc Search *"
                    },
                    terminologycodeDesc: []
                }
            })
        }
        dispatch({
            type: "fieldVal",
            payload: {
                [`${selectKey}`]: data
            }
        })
    }

    // from this we have to add this list when select the result type list
    const addList = () => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addListValues: [...state.field.addListValues, {list_value: state.field.list_value }],
                list_value: ''
            }
        })
    }

    // from this we have to delete this list when select the result type list
    const deleteList = (id: any) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addListValues: state.field.addListValues.filter((list: any, index: any) => list.id !== id)
            }
        })
    }

    // add Terminology Type and Terminology desc with code in below function
    const addTerminologyCodeDesc = () => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addTerminologyDatagrid: [
                    ...state.field.addTerminologyDatagrid,
                    {
                        // id: Math.random(),
                        terminologyId:null,
                        terminologyType: state.field.terminology_type.label,
                        // terminology_typeCode: state.field.terminology_type.value,
                        terminologyCode: state.field.terminology_code_desc.value,
                        terminologyDesc: state.field.terminology_code_desc.label
                    }
                ],
                terminology_type: {
                    label: "Terminology Type *"
                },
                terminology_code_desc: {
                    label: "Terminology code / Desc Search *"
                },
                terminologycodeDesc: []
            }
        })
    }


    // delete terminology and terminology desc - code data
    const delTerminologyDatagridSingldata = (data: any) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                addTerminologyDatagrid: state.field.addTerminologyDatagrid.filter((list: any) => list.terminologyCode !== data.terminologyCode)
            }
        })
    }



    return (
        <>


            {/* Radiology Terminology Form */}
            <div className={`${state.field.result_type.value === 'list' ? 'gap-4 flex' : ''} w-full mt-4`}>
                <div className={`${state.field.result_type.value === 'list' ? 'w-3/4' : 'w-full '}`}>
                    <div className='w-full flex gap-4'>
                        <div className='w-1/5 newSelect my-select'>
                            <ReactSelectBox
                                value={state.field.terminology_type}
                                options={state.field.TerminologyOptions}
                                onChange={(data: any) => selectHandler('terminology_type', data)}
                                label="Terminology Type *"
                                isMultiple={false}
                                isSearchable={false}
                            />
                        </div>
                        <div className='w-3/5 newSelect my-select'>
                            <ReactSelectBox
                                value={state.field.terminology_code_desc}
                                options={state.field.terminologycodeDesc}
                                onChange={(data: any) => selectHandler('terminology_code_desc', data)}
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
                            />
                        </div>
                        <div className='w-1/5 newBtn-theme'>
                            <ActionButton
                                buttonText="Add"
                                width="w-full text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={addTerminologyCodeDesc}
                                disabled={
                                    state.field.terminology_code_desc.label !== "Terminology code / Desc Search *" &&
                                        state.field.terminology_type.label !== 'Terminology Type *' ? false : true
                                }
                            />
                        </div>
                    </div>


                    {/* Radiology Terminology grid */}
                    <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                        <ReactDatagrid
                            rows={state.field.addTerminologyDatagrid}
                            columns={columns1}
                        />
                    </div>

                    <div className='w-full mt-4 newInputField'>
                        <Textarea
                            label="Comments"
                            value={state.field.referenceComments}
                            name="referenceComments"
                            minRows={2}
                            onChange={(e: any) => {
                                dispatch({
                                    type: "fieldVal",
                                    payload: {
                                        referenceComments: e.target.value
                                    }
                                })
                            }}
                            containerProps={{
                                className: '!min-w-0'
                            }}
                        />
                        {/* <FormPropsTextFields
                            label="Parameter Code*"
                            type="text"
                            name="parameterCode"
                            value={state.field.parameterCode}
                            handleChange={inputHandler}
                            containerProps={{
                                className: '!min-w-0 h-[43px]'
                            }}
                        /> */}
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
                                                        <div className='cursor-pointer' onClick={() => deleteList(list.id)}>
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

export default RadiologyTerminologyGridandForm
