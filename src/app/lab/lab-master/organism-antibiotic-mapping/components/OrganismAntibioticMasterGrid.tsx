import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { Dispatch, FC, SetStateAction } from 'react'
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import { organismAntibioticMapingActiveInactiveapie } from '@/app/utilities/api-urls';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { toast } from 'react-toastify';

interface OrganismAntibioticMasterGridprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllorganismAntibioticDatafun: () => void
}

const OrganismAntibioticMasterGrid: FC<OrganismAntibioticMasterGridprops> = ({
    state,
    dispatch,
    getAllorganismAntibioticDatafun
}) => {

    const columns1: GridColDef[] = [
        {
            field: "id", headerName: "S.no", width: 90,
            // renderCell: (params: any) => {
            //     const number = state.getAppApi.getAllOrganismsDatastore.indexOf(params.row) + 1
            //     return number
            // }
        },
        { field: "organismDesc", headerName: "Organism", width: 350 },
        {
            field: "generatedDate", headerName: "Created Date", width: 170,
            renderCell: (params: any) => {
                return params.row.generatedDate ? moment(params.row.generatedDate).format('DD-MM-YYYY') : ''
            }
        },
        {
            field: "modifyDate", headerName: "Modify Date", width: 170,
            renderCell: (params: any) => {
                return params.row.updatedDate ? moment(params.row.updatedDate).format('DD-MM-YYYY') : ''
            }
        },
        // { field: "lastModifyDate", headerName: "Last Modify Date", width: 150 },
        // {
        //     field: "statusFlag", headerName: "Actions", width: 120,
        //     renderCell: (params: any) => (
        //         <>
        //             <div className='cursor-pointer flex justify-center gap-3'>
        //                 {params.row.statusFlag ? <>
        //                     <div className='cursor-pointer'
        //                         onClick={() => activeInActiveParamter(params.row)}
        //                     >
        //                         <ActiveIcon />
        //                     </div>
        //                 </> : <>
        //                     <div className='cursor-pointer'
        //                         onClick={() => activeInActiveParamter(params.row)}>
        //                         <InactiveIcon />
        //                     </div>
        //                 </>}
        //             </div>
        //         </>
        //     )
        // },
        {
            field: "orderingDr", headerName: "Actions", width: 80,
            renderCell: (params: any) => (
                <>
                    <div className='flex gap-4 items-center w-[40px] justify-end'>
                        {params.row.statusFlag === 1 ?

                            <>
                                <div className='cursor-pointer flex justify-center'
                                    onClick={() => onEdit(params.row)}>
                                    <PencilIcon className='w-5 h-5 text-[#2196F3]' />
                                </div>
                                {/* <div className='cursor-pointer'
                                    onClick={() => activeInActiveParamter(params.row)}
                                >
                                    <ActiveIcon />
                                </div> */}
                            </> :
                            <>
                                {/* <div className='cursor-pointer'
                                    onClick={() => activeInActiveParamter(params.row)}>
                                    <InactiveIcon />
                                </div> */}
                            </>
                        }

                        {/* <div className='cursor-pointer flex justify-center gap-3'>
                            {params.row.statusFlag ? <>
                                <div className='cursor-pointer'
                                    onClick={() => activeInActiveParamter(params.row)}
                                >
                                    <ActiveIcon />
                                </div>
                            </> : <>
                                <div className='cursor-pointer'
                                    onClick={() => activeInActiveParamter(params.row)}>
                                    <InactiveIcon />
                                </div>
                            </>}
                        </div> */}
                    </div>
                </>
            )
        },


    ];

    // active and in active this record function
    const activeInActiveParamter = async (data: any) => {
        const activeInactive = data.statusFlag === 0 ? 1 : 0
        const mainUrl: any = organismAntibioticMapingActiveInactiveapie + `${data.organismAssignId}/${activeInactive}`
        const response: any = await ApiRequestMethod({ method: "POST", url: mainUrl, })
        if (response.success) {
            toast.success(` Successfully ${activeInactive === 1 ? 'active' : "inactive"} the row data`)
            getAllorganismAntibioticDatafun();
        }
        else {
            toast.error('Something went wrong')
        }
    }

    const onEdit = (data: any) => {
        console.log(data)
        dispatch({
            type: 'dialogPop',
            payload: {
                open: true
            }
        })
        dispatch({
            type: "fieldVal",
            payload: {
                newMappingGrid: [...data.oraganismList?.map((list: any) => ({ ...list, label: list.antibioticDesc, value: list.antibioticCode }))],
                organismAssignId: data.oraganismList[0].organismCode,
                organismDesc: {
                    label: data.organismDesc,
                    value: data.organismCode
                },

                antibioticDesc: [...data.oraganismList?.map((list: any) => ({ ...list, label: list.antibioticDesc, value: list.antibioticCode }))]
            }
        })
    }



    const organizmData: any = state.getAppApi?.getAllOrganismsDatastore ? state.getAppApi?.getAllOrganismsDatastore.map((list: any) => ({
        ...list,
        statusFlag: 1,
        generatedDate: list?.oraganismList[`${list?.oraganismList.length - 1}`]?.generatedDate ? list?.oraganismList[`${list?.oraganismList.length - 1}`]?.generatedDate : null,
        updatedDate: list?.oraganismList[`${list?.oraganismList.length - 1}`]?.updatedDate ? list?.oraganismList[`${list?.oraganismList.length - 1}`]?.updatedDate : null,
    })) : []



    return (
        <>
            <div className='w-full data-grid-newThem '>

                <ReactDatagrid
                    rows={organizmData}
                    columns={columns1}
                />

            </div>
        </>
    )
}

export default OrganismAntibioticMasterGrid
