"use client"
import React, { useEffect, useReducer } from 'react'
import { TabPageTitle } from '../../_component'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { LaboratoryDoctorInitialState, LaboratoryDoctorMasterReducer } from './components/LaboratoryDoctorMasterReducerFun'
import LaboratoryDoctorMasterForm from './components/LaboratoryDoctorMasterForm'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import LaboratoryDoctorCreation from './components/LaboratoryDoctorCreation'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllDoctorsGridData, getAllLabDoctors, getAllSpecialities } from '@/app/utilities/api-urls'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon'
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon'

const LaboratoryDoctorMasterPage = () => {
    const [state, dispatch] = useReducer(LaboratoryDoctorMasterReducer, LaboratoryDoctorInitialState)
    const columns = [
        {
            field: "labMappingId",
            headerName: "S. No",
            width: 220,
            renderCell: (params: any) => {
                return <>{params.row.id}</>;
            },
        },
        { field: "labSpecialityDesc", headerName: "Specialty", width: 500 },
        // { field: "createdDate", headerName: "Created Date", width: 130 },
        // { field: "modifiedDate", headerName: "Modified Date", width: 130 },
        // { field: "lastModifiedBy", headerName: "Last Modified By", width: 160 },
        {
            field: "actions", headerName: "Actions", width: 120,
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
        let newArr: [] = data.doctorList.map((item: any) => {
            return {
                id: Math.random(),
                labSpecialityCode: item.labSpecialityCode,
                labSpecialityDesc: item.labSpecialityDesc,
                doctorName: item.doctorName,
                empId: item?.empId,
                labMappingId: item?.labMappingId,
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
        let labSpecialtyData = state?.getAppApi?.labSpDd.filter((item: any) => item.label === data.labSpecialityDesc)[0];
        dispatch({
            type: 'fieldVal',
            payload: {
                labMappingId: data?.labTechMapId,
                labSpSearch: {
                    value: labSpecialtyData?.value || "",
                    label: labSpecialtyData?.label || "",
                },
                labDocSearch: data.doctorList.map((item: any) => ({
                    ...item,
                    value: item?.empId,
                    label: item?.doctorName
                })),
                addListValues: newArr
            }
        })
    }

    const updateUserStatusflag = async (id: any, status: any) => { }

    const getApiesData = async () => {
        const responses: any = await Promise.allSettled([
            ApiRequestMethod({ method: 'GET', url: getAllDoctorsGridData }),
            ApiRequestMethod({ method: 'GET', url: getAllSpecialities }),
            ApiRequestMethod({ method: 'GET', url: getAllLabDoctors })
        ]);
        const LaboratorySrcGrid: any = responses[0]?.value?.data?.['data'] ?? [];
        const labSpecialityDropdown: any = responses[1]?.value?.data?.['data'].map((item: any) => {
            return {
                ...item,
                value: item.specialityCode,
                label: item.specialityDescription
            }
        });
        const labDoctorsDropdown: any = responses[2]?.value?.data?.['data'].map((item: any) => {
            return {
                ...item,
                value: item.employeeId,
                label: item.firstName
            }
        });
        dispatch({
            type: 'getApis',
            payload: {
                labDoctorGriddata: LaboratorySrcGrid,
                labSpDd: labSpecialityDropdown,
                labDocDd: labDoctorsDropdown
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
                    title="Laboratory Specialty - Doctor Mapping"
                />
                <LaboratoryDoctorMasterForm state={state} dispatch={dispatch} />
            </div>
            <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactCommonDialog
                    dialogtitle={'Laboratory Specialty - Doctor Mapping'}
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
                    Content={<LaboratoryDoctorCreation state={state} dispatch={dispatch} getApiesData={getApiesData} />}
                />
                <div className='data-grid-newThem mt-4'>
                    <ReactDatagrid
                        rows={state.getAppApi.labDoctorGriddata}
                        columns={columns}
                    />
                </div>
            </div>
        </div>
    )
}

export default LaboratoryDoctorMasterPage
