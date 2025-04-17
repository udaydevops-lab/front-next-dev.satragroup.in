"use client"
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import React, { useEffect, useReducer } from 'react';
import { RadEquipInitialState, RadiologyEquipmentMasterReducer } from './components/RadiologyEquipmentMasterReducer';
import { getAllRadiologyEquipmentDetails, getRadiologySpeciality } from '@/app/utilities/api-urls';
import { TabPageTitle } from '@/app/lab/_component';
import RadiologyEquipmentMasterForm from './components/RadiologyEquipmentMasterForm';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import RadiologyEquipmentCreation from './components/RadiologyEquipmentCreation';
import { GridColDef } from '@mui/x-data-grid'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
const RadiologyEquipmentMappingPage = () => {
    const [state, dispatch] = useReducer(RadiologyEquipmentMasterReducer, RadEquipInitialState)
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
        console.log(data)
        let newArr: [] = data.equipmentList.map((item: any) => {
            return {
                id: Math.random(),
                equipmentId: item.equipmentId,
                equipmentCode: item.equipmentCode,
                equipmentDesc: item.equipmentDesc,
                bioMedicalAssetNo: item.bioMedicalAssetNo,
                manufacturer: item.manufacturer,
                radiologySpecialityCode: item.radiologySpecialityCode,
                radiologySpecialityDesc: item.radiologySpecialityDesc,
                departmentCode: item.departmentCode,
                departmentDesc: item.departmentDesc
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
                radEquiCode: data?.equipmentList[0].equipmentCode,
                radEquiDesc: data?.equipmentList[0].equipmentDesc,
                bioMedicalAssetNo: data?.equipmentList[0].bioMedicalAssetNo,
                manufacturer: data?.equipmentList[0].manufacturer,
                radSpecialtySearch: data?.equipmentList.map((item: any) => ({
                    ...item,
                    value: item.radiologySpecialityCode,
                    label: item.radiologySpecialityDesc
                })),
                addListValues: newArr
            }
        })
    }

    const getApiesData = async () => {
        const responses: any = await Promise.allSettled([
            ApiRequestMethod({ method: 'GET', url: getAllRadiologyEquipmentDetails }),
            ApiRequestMethod({ method: 'GET', url: getRadiologySpeciality })
        ]);
        const RadiologySrcGrid: any = responses[0]?.value?.data?.['data'] ?? [];
        const radSpecialityDropdown: any = responses[1]?.value?.data?.['data'].map((item: any) => {
            return {
                ...item,
                value: item.specialityCode,
                label: item.specialityDescription,
            }
        }) ?? [];
        console.log(radSpecialityDropdown)
        // const labTechnicianDropdown: any = [];
        dispatch({
            type: 'getApis',
            payload: {
                radEquipGriddata: RadiologySrcGrid,
                radspecDd: radSpecialityDropdown,
            }
        })
    }

    useEffect(() => {
        getApiesData();
    }, [])

    return (
        <>
            <div className="w-full flex justify-between mb-2">
                <TabPageTitle
                    title="Radiology Equipment Asset"
                />
                <RadiologyEquipmentMasterForm state={state} dispatch={dispatch} />
            </div>
            <div className='w-full px-3 pb-3 pt-1 mt-5 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactCommonDialog
                    dialogtitle={'Radiology Equipment Asset'}
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
                    Content={<RadiologyEquipmentCreation state={state} dispatch={dispatch} getApiesData={getApiesData} />}
                />
                <div className='data-grid-newThem mt-2'>
                    <ReactDatagrid
                        rows={state.getAppApi.radEquipGriddata}
                        columns={columns}
                    />
                </div>
            </div>
        </>
    )
}

export default RadiologyEquipmentMappingPage
