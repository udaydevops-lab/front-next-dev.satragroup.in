import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { delLabTerminologyApi } from '@/app/utilities/api-urls';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { Dispatch, FC, SetStateAction } from 'react'
import { toast } from 'react-toastify';

interface LabTerminologyGridprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllParameterFun: any
}

const LabTerminologyGrid: FC<LabTerminologyGridprops> = ({
    state,
    dispatch,
    getAllParameterFun
}) => {

    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 90,
            // renderCell: (params: any) => {
            //     const number = state.field.addTerminologyDatagrid.indexOf(params.row) + 1
            //     return number
            // }
        },
        { field: "terminology_type", headerName: "Terminology Type", width: 150 },
        { field: "terminologyDesc", headerName: "Terminology Description", width: 420 },
        { field: "terminologyCode", headerName: "Terminology Code", width: 180 },
        {
            field: "orderingDr", headerName: "Actions", width: 120,
            renderCell: (params: any) => (
                <>
                    <div className='cursor-pointer flex justify-center gap-3'>
                        <div className='cursor-pointer' onClick={() => delTerminologyGriddata(params.row)}>
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

    const terminolReferncerefereshfun = () => {
        dispatch({
            type: "fieldVal",
            payload: {

            }
        })
    }


    const delTerminologyGriddata = async (data: any) => {
        if (data.terminologyId) {
            let urlDel: any = delLabTerminologyApi + `terminologyId=${data.terminologyId}&parameterId=${state.field.parameterId}`
            const response: any = await ApiRequestMethod({ method: 'POST', url: urlDel, postObj: {} })
            if (response.success) {
                toast.success(`Successfully ${data.terminologyDesc} deleted`)
                getAllParameterFun()
                dispatch({
                    type: 'fieldVal',
                    payload: {
                        addTerminologyDatagrid: state.field.addTerminologyDatagrid.filter((list: any) => list.terminologyId !== data.terminologyId)
                    }
                })
            } else {
                toast.error('Something went wrong...')
            }

        }
        else {
            dispatch({
                type: 'fieldVal',
                payload: {
                    addTerminologyDatagrid: state.field.addTerminologyDatagrid.filter((list: any) => list.sn !== data.sn)
                }
            })
        }
    }

    console.log(state)
    return (
        <>
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactDatagrid
                    rows={state.field.addTerminologyDatagrid}
                    columns={columns1}
                />
            </div>
        </>
    )
}

export default LabTerminologyGrid
