import Textarea from '@/app/_common/text-area';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { delLabReferencerangeApi } from '@/app/utilities/api-urls';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { ChangeEvent, Dispatch, FC, SetStateAction } from 'react'
import { toast } from 'react-toastify';

interface LabRefrencerangeconfigGridprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const LabRefrencerangeconfigGrid: FC<LabRefrencerangeconfigGridprops> = ({
    state,
    dispatch
}) => {

    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 70,
            // renderCell: (params: any) => {
            //     const number = state.field.addRefrenceranceconfigDatagrid.indexOf(params.row) + 1
            //     return number
            // }
        },
        { field: "criteriaVal", headerName: "Criteria Type", width: 150 },
        {
            field: "criteria", headerName: "Criteria", width: 500,
            // renderCell: (params: any) => (
            //     <>
            //         <div className=' capitalize'>
            //             {
            //                 params.row?.criteria ? params.row?.criteria :
            //                     <div className='w-full flex gap-2'>
            //                         {params.row.genderfield && params.row.genderfield}
            //                         {params.row.fromAge && params.row.genderfield && ` / `}
            //                         {params.row.fromAge && params.row.fromageUnits && params.row.toageUnits && `Age : ${params.row.fromAge} ${params.row.fromageUnits} - ${params.row.toAge} ${params.row.toageUnits} `}
            //                         {params.row.genderfield && params.row.eqpmntMaster && params.row.fromAge ? ` / ` : params.row.eqpmntMaster && params.row.fromAge ? ` / ` : params.row.genderfield && params.row.eqpmntMaster && ` / `}
            //                         {params.row.eqpmntMaster && params.row.eqpmntMaster}
            //                     </div>
            //             }
            //         </div>
            //     </>
            // )
        },
        {
            field: "normalrange", headerName: "Normal Range", width: 150,
            // renderCell: (params: any) => (
            //     <>
            //         <div className=' capitalize'>
            //             {
            //                 params.row?.normalrange ? params.row?.normalrange :
            //                     <div className='w-full flex gap-2'>
            //                         {params.row.rangeFromSymb && params.row.rangeFromSymb}
            //                         {params.row.rangeFrom && params.row.rangeFrom} &nbsp;
            //                         {params.row.rangeTo && ` - `}  &nbsp;
            //                         {params.row.rangeToSymb && params.row.rangeToSymb}
            //                         {params.row.rangeTo && params.row.rangeTo}
            //                     </div>
            //             }
            //         </div>

            //     </>
            // )
        },
        {
            field: "orderingDr", headerName: "Actions", width: 90,
            renderCell: (params: any) => (
                <>
                    <div className='cursor-pointer flex justify-center gap-3'>
                        {/* {state.field.parameterDescription && <div className='cursor-pointer' onClick={() => editReferenceData(params.row)}>
                            <PencilIcon className='w-5 h-5 text-blue-500' />
                        </div>} */}

                        <div className='cursor-pointer' onClick={() => delReferenceData(params.row)}>
                            <TrashIcon className='w-5 h-5 text-red-500' />
                        </div>
                    </div>
                </>
            )
        },


    ];



    // const editReferenceData = (data: any) => {
    //     console.log(data)
    //     dispatch({
    //         type: "fieldVal",
    //         payload: {
    //             criteriaVal: {
    //                 label: data.criteriaVal
    //             },
    //             referenceId: data.referenceId,
    //             Refrenceranceconfig: data.Refrenceranceconfig,
    //             eqpmntMaster: {
    //                 label: data.eqpmntMaster ? data.eqpmntMaster : 'Equipment Master'
    //             },
    //             genderfield: {
    //                 label: data.genderfield ? data.genderfield : 'Gender'
    //             },
    //             fromAge: data.fromAge,
    //             fromageUnits: {
    //                 label: data.fromageUnits ? data.fromageUnits : 'Age Units'
    //             },
    //             toAge: data.toAge,
    //             toageUnits: {
    //                 label: data.toageUnits ? data.toageUnits : 'Age Units'
    //             },
    //             rangeFromSymb: {
    //                 label: data.rangeFromSymb ? data.rangeFromSymb : 'Select'
    //             },
    //             rangeFrom: data.rangeFrom,
    //             rangeToSymb: {
    //                 label: data.rangeToSymb ? data.rangeToSymb : 'Select'
    //             },
    //             rangeTo: data.rangeTo
    //         }
    //     })
    // }

    const delReferenceData = async (data: any) => {
        if (data.referenceId) {
            let urlData: any = delLabReferencerangeApi + `referenceId=${data.referenceId}&parameterId=${state.field.parameterId}`
            const response: any = await ApiRequestMethod({ method: "POST", url: urlData, postObj: {} })
            if (response.success) {
                toast.success('Successfully Deleted Reference Range data..')
                dispatch({
                    type: 'fieldVal',
                    payload: {
                        addRefrenceranceconfigDatagrid: state.field.addRefrenceranceconfigDatagrid.filter((list: any) => list.referenceId !== data.referenceId)
                    }
                })
            }
            else {
                toast.error('Something went wrong...')
            }

        }
        else {
            dispatch({
                type: 'fieldVal',
                payload: {
                    addRefrenceranceconfigDatagrid: state.field.addRefrenceranceconfigDatagrid.filter((list: any) => list.sn !== data.sn)
                }
            })
        }
        // if (state.field.parameterDescription) {
        //     dispatch({
        //         type: 'fieldVal',
        //         payload: {
        //             addRefrenceranceconfigDatagrid: state.field.addRefrenceranceconfigDatagrid.filter((list: any) => list.id !== id),
        //             criteriaVal: {
        //                 label: "Criteria Options"
        //             },
        // referenceId: null,
        // Refrenceranceconfig: null,
        // eqpmntMaster: {
        //     label: 'Equipment Master'
        // },
        // genderfield: {
        //     label: 'Gender'
        // },
        // fromAge: '',
        // fromageUnits: {
        //     label: 'Age Units'
        // },
        // toAge: '',
        // toageUnits: {
        //     label: 'Age Units'
        // },
        // rangeFromSymb: {
        //     label: 'Select'
        // },
        // rangeFrom: '',
        // rangeToSymb: {
        //     label: 'Select'
        // },
        // rangeTo: ''
        //         }
        //     })
        // }
        // else {
        //     dispatch({
        //         type: 'fieldVal',
        //         payload: {
        //             addRefrenceranceconfigDatagrid: state.field.addRefrenceranceconfigDatagrid.filter((list: any) => list.id !== id)
        //         }
        //     })
        // }

    }

    return (
        <>
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactDatagrid
                    rows={state.field.addRefrenceranceconfigDatagrid}
                    columns={columns1}
                />
                </div>
                <div className='w-full mt-6'>
                <Textarea
                    label="Comments"
                    name="referenceComments"
                    value={state.field.referenceComments}
                    onChange={(e: any) => (
                        dispatch({
                            type: "fieldVal",
                            payload: {
                                referenceComments: e.target.value
                            }
                        }))
                    }
                    minrows={4}
                />
            </div>
        </>
    )
}

export default LabRefrencerangeconfigGrid
