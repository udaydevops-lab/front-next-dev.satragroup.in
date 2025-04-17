import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { Dispatch, SetStateAction, memo, useCallback } from 'react'
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';

interface RoleAssignGridtableprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const RoleAssignGridtable: React.FC<RoleAssignGridtableprops> = ({
    state,
    dispatch
}) => {

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 50,
            // renderCell: (params) => {
            //     const rowNumber = userGroupRoleAssignmentTable.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        {
            field: "roleDesc",
            headerName: 'Role Description',
            width: 150,
        },
        {
            field: "serviceEntityDesc",
            headerName: 'Organization',
            width: 200,
        },
        {
            field: "locationDesc",
            headerName: 'Facility',
            width: 180,
        },
        {
            field: "activeFromDate",
            headerName: 'Active From Date',
            width: 150,
            renderCell: (params: any) => {
                return moment(params.row.activeFromDate).format('DD-MM-YYYY')
            }
        },
        {
            field: "actions",
            headerName: 'Actions',
            width: 80,
            renderCell: (params: any) => (
                <>

                    {
                        params.row.roleGroupId ?
                            <div className='flex justify-end cursor-pointer' onClick={() => activeInactiveuser(params.row)}>
                                {params.row.statusFlag === 1 ?
                                    <div className="cursor-pointer">
                                        <ActiveIcon
                                            className="cursor-pointer"
                                            onClick={(e: any) => {
                                                // inActiveMerMisstionPopup(e, params.row)
                                                // setPopup({ ...popup, activeInactive: true, data: params.row })
                                            }}
                                        />
                                    </div>
                                    :
                                    <div className="cursor-pointer">
                                        <InactiveIcon
                                            className="cursor-pointer float-left w-5 h-4"
                                        />
                                    </div>}
                            </div>
                            :
                            <div className='cursor-pointer'>
                                <TrashIcon
                                    className='w-4 h-4 text-red-500 cursor-pointer'
                                    onClick={() => deleteDatagridData(params.row)}
                                />
                            </div>
                    }


                </>
            ),
        },
        {
            field: "isPrimary",
            headerName: 'Is Role Primary',
            width: 200,
            renderCell: (params: any) => (
                <>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value={params.row.isRolePrimary}
                            className="form-radio h-5 w-5 text-blue-500 cursor-pointer"
                            onClick={() => handleRadio(params.row)}
                            checked={params.row.isRolePrimary == 1}
                        />
                        <span className="ml-2"></span>
                    </label>
                </>
            ),
        },
    ];

    const handleRadio = (data: any) => {
        dispatch({
            type: "userGroupRoleAssignmentStore",
            payload: {
                userGroupRoleAssignmentTable: state.userGroupRoleAssignmentTable.map((list: any) => {
                    if (list.roleGroupId === data.roleGroupId) {
                        return {
                            ...list,
                            isRolePrimary: data.isRolePrimary == 0 ? 1 : 0
                        }
                    } else {
                        return {
                            ...list,
                            isRolePrimary: 0
                        }
                    }
                })
            }
        })
    }
    // Block or Unblock 
    const activeInactiveuser = (data: any) => {
        //  console.log(data)
        dispatch({
            type: "userGroupRoleAssignmentStore",
            payload: {
                userGroupRoleAssignmentTable: state.userGroupRoleAssignmentTable.map((list: any) => {
                    if (list.roleGroupId === data.roleGroupId) {
                        return {
                            ...list,
                            statusFlag: list.statusFlag === 1 ? 0 : 1
                        }
                    }
                    return list
                })
            }
        })
    }

    // Delete Data grid
    const deleteDatagridData = useCallback((data: any) => {
        dispatch({
            type: "userGroupRoleAssignmentStore",
            payload: {
                userGroupRoleAssignmentTable: state.userGroupRoleAssignmentTable.filter((list: any) => list.sn !== data.sn)
            }
        })
    }, [])

    return (
        <>
            <div className="w-full capi min-h-[50px] mb-3 data-grid-newThem role-Assign">
                <ReactDatagrid
                    rows={state.userGroupRoleAssignmentTable}
                    columns={columns}
                    // hideFooter={true}
                />
            </div>

        </>
    )
}

export default memo(RoleAssignGridtable)
