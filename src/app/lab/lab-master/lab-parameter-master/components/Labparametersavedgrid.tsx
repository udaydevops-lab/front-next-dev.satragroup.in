import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { Dispatch, FC, SetStateAction } from 'react'
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import DelMsg from './DelMsg';
import { toast } from 'react-toastify';
import DeletePopupMsg from '@/app/_commonfeatures/DeletePopupMsg';
import moment from 'moment';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { delLabparameterapi } from '@/app/utilities/api-urls';

interface Labparametersavedgridprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllParameterFun: any
}

const Labparametersavedgrid: FC<Labparametersavedgridprops> = ({
    state,
    dispatch,
    getAllParameterFun
}) => {

    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 70,
        },
        { field: "parameterDescription", headerName: "Parameter Name", width: 250 },
        {
            field: "generatedDate", headerName: "Generated Date", width: 200,
            renderCell: (params: any) => (
                <>
                    <div className='flex gap-4'>
                        {params.row.generatedDate ? moment(params.row.generatedDate).format('DD-MM-YYYY') : ''}
                    </div>
                </>
            )
        },
        {
            field: "updatedDate", headerName: "Modify Date", width: 200,
            renderCell: (params: any) => (
                <>
                    <div className='flex gap-4'>
                        {params.row.updatedDate ? moment(params.row.updatedDate).format('DD-MM-YYYY') : ''}
                    </div>
                </>
            )
        },
        // {
        //     field: "normalrange", headerName: "Normal Range", width: 150,
        //     renderCell: (params: any) => (
        //         <>
        //             {params.row.addRefrenceranceconfigDatagrid && <>
        //                 {params.row.addRefrenceranceconfigDatagrid[0].rangeFromSymb}
        //                 {params.row.addRefrenceranceconfigDatagrid[0].rangeFrom}
        //                 {params.row.addRefrenceranceconfigDatagrid[0].rangeToSymb && ' - '}
        //                 {params.row.addRefrenceranceconfigDatagrid[0].rangeToSymb}
        //                 {params.row.addRefrenceranceconfigDatagrid[0].rangeTo}
        //             </>}
        //         </>
        //     )
        // },
        // {
        //     field: "status", headerName: "Status", width: 150,
        //     renderCell: (params: any) => (
        //         <>
        //             <div className='cursor-pointer flex justify-center gap-3'>
        //                 {params.row.status ? <>
        //                     <div className='cursor-pointer' onClick={() => activeInActiveParamter(params.row.id)}>
        //                         <ActiveIcon />
        //                     </div>
        //                 </> : <>
        //                     <div className='cursor-pointer' onClick={() => activeInActiveParamter(params.row.id)}>
        //                         <InactiveIcon />
        //                     </div>
        //                 </>}

        //             </div>
        //         </>
        //     )
        // },
        {
            field: "orderingDr", headerName: "Actions", width: 90,
            renderCell: (params: any) => (
                <>
                    <div className='cursor-pointer flex justify-center gap-3'>
                        <div className='cursor-pointer' onClick={() => editSavedParameterGrid(params.row)}>
                            <PencilIcon className='w-5 h-5 text-blue-500' />
                        </div>
                        <div className='cursor-pointer' onClick={() => {
                            dispatch({
                                type: "dailogModal",
                                payload: {
                                    delMsg: true,
                                    dataId: params.row.parameterId
                                }
                            })

                            // delSavedParameterGrid(params.row.id) state.dailoagPop.dataId
                        }}>
                            <TrashIcon className='w-5 h-5 text-red-500' />
                        </div>
                    </div>
                </>
            )
        },


    ];

    // const activeInActiveParamter = (id: any) => {
    //     dispatch({
    //         type: "getAllApies",
    //         payload: {
    //             getsaveLabparameterDataresults: state.getApi.getsaveLabparameterDataresults.map((list: any) => {
    //                 if (list.id === id) {
    //                     return {
    //                         ...list,
    //                         status: !list.status
    //                     }
    //                 }
    //                 return list
    //             })
    //         }
    //     })
    // }



    const delSavedParameterGrid = async () => {
        dispatch({
            type: "fieldVal",
            payload: {
                loader: true
            }
        })

        const response: any = await ApiRequestMethod({ method: "POST", url: `${delLabparameterapi}${state.dailoagPop.dataId}`, postObj: {} })

        if (response.success) {
            setTimeout(() => {

                toast.success("Successfully Deleted Parameter")

                dispatch({
                    type: "dailogModal",
                    payload: {
                        delMsg: false
                    }
                })

                dispatch({
                    type: "fieldVal",
                    payload: {
                        loader: false
                    }
                })
                getAllParameterFun()
            }, 2000)
        } else {
            toast.success("Something went wrong")
            dispatch({
                type: "dailogModal",
                payload: {
                    delMsg: false
                }
            })

            dispatch({
                type: "fieldVal",
                payload: {
                    loader: false
                }
            })
            getAllParameterFun()
        }


    }

    const editSavedParameterGrid = (data: any) => {
        console.log(data)
        const resultTypeVal = state.getApi.resultType.filter((list: any) => list.value === data.resultType)

        let refrenceRangeVal: any = data?.referenceRange?.length > 0 ? data.referenceRange.map((list: any) => ({
            referenceId: list.referenceId ? list.referenceId : null,
            criteriaVal: list.criteriaType ? list.criteriaType : '',
            criteria: list.criteria ? list.criteria : '',
            normalrange: list.refrenceRange ? list.refrenceRange : '',
            maxValue: list.maxValue ? list.maxValue : '',
            minValue: list.minValue ? list.minValue : ''
        })) : []

        let listValueData: any = data.listValue.split().map((list: any) => ({ list_value: list }))
        console.log('listValueData', listValueData)
        dispatch({
            type: "fieldVal",
            payload: {
                parameterId: data.parameterId,
                parameterDescription: data.parameterDescription,
                parameterCode: data.parameterCode,
                referenceComments: data.comments,
                units: {
                    label: data.units
                },
                addTerminologyDatagrid: data?.parameterTerminology?.length > 0 ? data.parameterTerminology.map((list: any) => {
                    return {
                        terminologyId: list.terminologyId ? list.terminologyId : null,
                        terminology_type: list.terminologyType,
                        terminologyDesc: list.terminologyDesc,
                        terminologyCode: list.terminologyCode
                    }
                }) : [],
                result_type: {
                    label: resultTypeVal[0].label,
                    value: resultTypeVal[0].value
                },
                addRefrenceranceconfigDatagrid: refrenceRangeVal,
                addListValues: [...listValueData]
            }
        })
        dispatch({
            type: 'dailogModal',
            payload: {
                open: true
            }
        })
    }

    return (
        <>
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactDatagrid
                    rows={state.getApi.getsaveLabparameterDataresults}
                    columns={columns1}
                />
            </div>

            <ReactCommonDialog
                open={state.dailoagPop.delMsg}
                handler={() => {
                    dispatch({
                        type: "dailogModal",
                        payload: {
                            delMsg: false
                        }
                    })
                }}
                popupClose={() => {
                    dispatch({
                        type: "dailogModal",
                        payload: {
                            delMsg: false
                        }
                    })
                }}

                Content={
                    <DeletePopupMsg
                        btnYesFun={delSavedParameterGrid}
                        btnNoFun={() => {
                            dispatch({
                                type: "dailogModal",
                                payload: {
                                    delMsg: false
                                }
                            })
                        }}
                        content={"Do you want to delete this parameter?"}
                        loader={state.field.loader}
                    />
                    // <DelMsg
                    //     state={state}
                    //     dispatch={dispatch}
                    //     btnYesFun={delSavedParameterGrid}
                    //     btnNoFun={() => {
                    //         dispatch({
                    //             type: "dailogModal",
                    //             payload: {
                    //                 delMsg: false
                    //             }
                    //         })
                    //     }}
                    // />
                }
            />
        </>
    )
}

export default Labparametersavedgrid
