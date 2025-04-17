"use client"
import React, { useEffect, useReducer } from 'react'
import { TabPageTitle } from '../../_component'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import LaboratoryTechnicianMasterForm from './components/LaboratoryTechnicianMasterForm'
import { LabTechInitialState, LaboratoryTechnicianMasterReducer } from './components/LaboratoryTechnicianMasterReducerFun'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import LaboratoryTechnicianCreation from './components/LaboratoryTechnicianCreation'
import { PencilIcon } from '@heroicons/react/24/solid'
import { getAllLabTechnicians, getAllSpecialities, getAllTechnicianDetails, updateTechnicianStatusFlag } from '@/app/utilities/api-urls'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon'
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon'
import services from '@/app/utilities/services'
import { toast } from 'react-toastify'
import moment from 'moment'
import { GridColDef } from '@mui/x-data-grid'

const LaboratoryTechnicianMasterPage = () => {
    const [state, dispatch] = useReducer(LaboratoryTechnicianMasterReducer, LabTechInitialState)
    const columns: GridColDef[] = [
        {
            field: "labTechMapId",
            headerName: "S. No",
            width: 220,
            renderCell: (params: any) => {
                return <>{params.row.id}</>;
            },
        },
        { field: "labSpecialityDesc", headerName: "Specialty", width: 500 },
        // {
        //     field: "generatedDate", headerName: "Created Date", width: 130,
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
        //     width: 130,
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
                // <div onClick={() => updateUserStatusflag(params.row.labTechMapId, params.row.statusFlag)}>
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
        let newArr: [] = data.technicianList.map((item: any) => {
            return {
                id: Math.random(),
                labSpecialtyId: item.labSpecialityCode,
                labSpecialtySearch: item.labSpecialityDesc,
                labTechnicianSearch: item.technicianName,
                labTechnicianId: item.empId,
                value: item?.empId,
                label: item?.technicianName,
                labTechMapId: item?.labTechMapId
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
        let labSpecialtyData = state?.getAppApi?.labspecDd.filter((item: any) => item.label === data.labSpecialityDesc)[0];

        dispatch({
            type: 'fieldVal',
            payload: {
                labTechMapId: data?.labTechMapId,
                labSpecialtySearch: { value: labSpecialtyData.value, label: labSpecialtyData.label },
                labTechnicianSearch: data.technicianList.map((item: any) => ({
                    ...item,
                    value: item?.empId,
                    label: item?.technicianName
                })),
                addListValues: newArr
            }
        })


    }

    const updateUserStatusflag = async (id: any, status: any) => {
        const flag = status === 0 ? 1 : 0;
        await services
            .create(updateTechnicianStatusFlag, {
                statusFlag: flag,
                mapId: id
            })
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
            ApiRequestMethod({ method: 'GET', url: getAllTechnicianDetails }),
            ApiRequestMethod({ method: 'GET', url: getAllSpecialities }),
            ApiRequestMethod({ method: 'GET', url: getAllLabTechnicians })
        ]);
        const LaboratorySrcGrid: any = responses[0]?.value?.data?.['data'] ?? [];
        const labSpecialityDropdown: any = responses[1]?.value?.data?.['data'].map((item: any) => {
            return {
                ...item,
                value: item.specialityCode,
                label: item.specialityDescription,
            }
        }) ?? [];
        const labTechnicianDropdown: any = responses[2]?.value?.data?.data?.map((item: any) => {
            return {
                ...item,
                value: item.employeeId,
                label: item.firstName
            };
        }) ?? [];
        // const labTechnicianDropdown: any = [];
        dispatch({
            type: 'getApis',
            payload: {
                labTechGriddata: LaboratorySrcGrid,
                labspecDd: labSpecialityDropdown,
                labTechDd: labTechnicianDropdown

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
                    title="Laboratory Specialty - Technician Mapping"
                />
                <LaboratoryTechnicianMasterForm state={state} dispatch={dispatch} />
            </div>
            <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <ReactCommonDialog
                    dialogtitle={'Laboratory Specialty - Technician Mapping'}
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
                    Content={<LaboratoryTechnicianCreation state={state} dispatch={dispatch} getApiesData={getApiesData} />}
                />
                <div className='data-grid-newThem mt-4'>
                    <ReactDatagrid
                        rows={state.getAppApi.labTechGriddata}
                        columns={columns}
                    />
                </div>
            </div>
        </div>
    )
}

export default LaboratoryTechnicianMasterPage
