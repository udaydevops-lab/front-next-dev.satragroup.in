"use client"
import React, { useEffect, useReducer } from 'react'
import { TabPageTitle } from '../../_component'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { LaboratoryEquipmentMasterReducer, LaboratoryInitialState } from './components/LaboratoryEquipmentMasterReducerFun'
import LaboratoryEquipmentMasterForm from './components/LaboratoryEquipmentMasterForm'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import LaboratoryEquipmentCreation from './components/LaboratoryEquipmentCreation'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon'
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon'
import { GridColDef } from '@mui/x-data-grid'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllEquipmentDetails, getAllSpecialities, getAllSpeciality, updateEquipmentStatusFlag } from '@/app/utilities/api-urls'
import moment from 'moment'
import services from '@/app/utilities/services'
import { toast } from 'react-toastify'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import { stat } from 'fs'

const LaboratoryEquipmentMasterPage = () => {
    const [state, dispatch] = useReducer(LaboratoryEquipmentMasterReducer, LaboratoryInitialState)
    const columns: GridColDef[] = [
        {
            field: "equipmentId",
            headerName: "S. No",
            width: 220,
            renderCell: (params: any) => {
                return <>{params.row.id}</>
            },
        },
        { field: "equipmentDesc", headerName: "Description", width: 500 },
        // {
        //     field: "generatedDate", headerName: "Created Date", width: 140,
        //     renderCell: (params: any) => (
        //         params.row.generatedDate && moment(params.row.generatedDate).format("DD-MM-YYYY")
        //     )
        // },
        // {
        //     field: "updatedDate", headerName: "Modified Date", width: 140,
        //     renderCell: (params: any) => (
        //         params.row.updatedDate && moment(params.row.updatedDate).format("DD-MM-YYYY")
        //     )
        // },
        // {
        //     field: "statusFlag",
        //     headerName: "Status",
        //     width: 120,
        //     renderCell: (params: any) => (
        //         <div>
        //             {params.row.statusFlag === 1 ? (
        //                 <div className='text-green-600'>
        //                     Active
        //                 </div>
        //             ) : (
        //                 <div className='text-red-600'>Inactive</div>
        //             )}
        //         </div>
        //     ),
        // },
        {
            field: "actions", headerName: "Actions", width: 280,
            renderCell: (params: any) => (
                // <div className='flex gap-2'>
                <PencilIcon
                    className="text-blue-500 w-10 h-5 cursor-pointer"
                    onClick={() => editDetails(params.row)}
                />
                // <div onClick={() => updateUserStatusflag(params.row.equipmentId, params.row.statusFlag)}>
                //     {params.row.statusFlag === 0 ? (
                //         <InactiveIcon />
                //     ) : (
                //         <ActiveIcon
                //             className="cursor-pointer"
                //         />
                //     )}
                // </div>
                // </div>
            )
        }
    ]

    const editDetails = (data: any) => {
        let newArr: [] = data.equipmentList.map((item: any) => {
            return {
                id: Math.random(),
                equipmentId: item.equipmentId,
                equipmentCode: item.equipmentCode,
                equipmentDesc: item.equipmentDesc,
                bioMedicalAssetNo: item.bioMedicalAssetNo,
                manufacturer: item.manufacturer,
                laboratorySpeciality: item.laboratorySpeciality,
                laboratorySpecialityDesc: item.laboratorySpecialityDesc
            }
        })

        dispatch({
            type: 'fieldVal',
            payload: {
                rowData: data
            }
        })

        dispatch({
            type: 'dialogPop',
            payload: {
                open: true
            }
        })
        // let extractedData = data.equipmentList"Biochemistry"
        dispatch({
            type: 'fieldVal',
            payload: {
                equipmentId: data?.equipmentList[0].equipmentId,
                labEquiCode: data?.equipmentList[0].equipmentCode,
                labEquiDesc: data?.equipmentList[0].equipmentDesc,
                bioMedicalAssetNo: data?.equipmentList[0].bioMedicalAssetNo,
                manufacturer: data?.equipmentList[0].manufacturer,
                labSpecialtySearch: data?.equipmentList.map((item: any) => ({
                    ...item,
                    value: item.laboratorySpeciality,
                    label: item.laboratorySpecialityDesc
                })),
                addListValues: newArr
            }
        })
    }

    const updateUserStatusflag = async (id: any, status: any) => {
        const headers = getHeaderResponse;
        const flag = status === 0 ? 1 : 0;
        await services
            .create(`${updateEquipmentStatusFlag}${id}/${flag}`, headers)
            .then((response: any) => {
                toast.success(
                    `Successfully ${status === 1 ? "InActive" : "Active"} this Record`
                );
                getApiesData();
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    const getApiesData = async () => {
        const responses: any = await Promise.allSettled([
            ApiRequestMethod({ method: 'GET', url: getAllEquipmentDetails }),
            ApiRequestMethod({ method: 'GET', url: getAllSpecialities })
        ]);
        const LaboratorySrcGrid: any = responses[0]?.value?.data?.['data'];
        const labSpecialityDropdown: any = responses[1]?.value?.data?.['data'].map((item: any) => {
            return {
                ...item,
                value: item.specialityCode,
                label: item.specialityDescription
            }
        });
        dispatch({
            type: 'getApis',
            payload: {
                labEquipGriddata: LaboratorySrcGrid,
                labSpesSel: labSpecialityDropdown
            }
        })
    }

    useEffect(() => {
        getApiesData();
    }, []);

    return (
        <div>
            <div className="w-full flex justify-between">
                <TabPageTitle
                    title="Laboratory Equipment Asset"
                />
                <LaboratoryEquipmentMasterForm state={state} dispatch={dispatch} />
            </div>
            <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactCommonDialog
                    dialogtitle={'Laboratory Equipment Asset'}
                    open={state.popup.open}
                    size={'lg'}
                    handler={() => {
                        // dispatch({
                        //     type: 'dialogPop',
                        //     payload: {
                        //         open: false
                        //     }
                        // })
                    }}
                    popupClose={() => {
                        dispatch({
                            type: 'dialogPop',
                            payload: {
                                open: false
                            }
                        })
                    }}
                    Content={<LaboratoryEquipmentCreation state={state} dispatch={dispatch} getApiesData={getApiesData} />}
                />
                <div className='data-grid-newThem mt-4'>
                    <ReactDatagrid
                        rows={state.getAppApi.labEquipGriddata}
                        columns={columns}
                    />
                </div>
            </div>
        </div>
    )
}

export default LaboratoryEquipmentMasterPage
