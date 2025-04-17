"use client"
import { PencilIcon } from '@heroicons/react/24/solid';
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import React, { Dispatch, SetStateAction } from 'react'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';
import { getAllRole, roleUpdateStatus } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';
import services from '@/app/utilities/services';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
interface RoleGridProps {
    gridData: any
    setFeilds: any
    getRoleData: any
}

const RoleGrid: React.FC<RoleGridProps> = ({ gridData, setFeilds, getRoleData }) => {
    // Active button functionality
    const handelActive = (rowData: any) => {
        console.log(rowData)
        const id = rowData.roleId;
        const StatusFlagStatus = rowData.statusFlag === 1 ? 0 : 1;
        const message =
            rowData.statusFlag !== 1
                ? "Successfully Activated the record"
                : "Successfully InActivated the record";
        const postObj = {
            "roleId": id,
            "statusFlag": StatusFlagStatus
        }
        services.create(`${roleUpdateStatus}`, postObj)
            .then((response: any) => {
                toast.success(message);
                getRoleData()
            })
            .catch((e: any) => {
                if (e.response.data.statusMessage) {
                    toast.error(e.response.data.statusMessage);
                } else {
                    toast.error("Technical Error");
                }
                console.log(e.message);
            });
    };
    const handleEdit = (rowData: any) => {
        console.log(rowData)
        setFeilds({
            roleId: rowData.roleId,
            roleDes: rowData.roleDes,
            roleCode: rowData.roleCode,
            statusFlag: rowData.statusFlag
        })
    }
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 70,
            // renderCell: (params: any) => {
            //     const rowNumber = gridData.indexOf(params.row) + 1;
            //     return <span>{rowNumber}</span>;
            // },
        },
        { field: "roleCode", headerName: "Role Code", width: 200 },
        { field: "roleDes", headerName: "Role", width: 350 },
        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params: any) => (
                <>
                    {params.row.statusFlag === 1 ? (
                        <div className="text-green-700">Active</div>
                    ) : (
                        <div className="text-red-700">InActive</div>
                    )}
                </>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 170,
            renderCell: (params: any) => (
                <>
                    <div className="w-5 h-5 me-4">
                        {params.row.statusFlag === 1 && (
                            <PencilIcon
                                className="text-blue-500 w-5 h-5 cursor-pointer me-2"
                                onClick={() => handleEdit(params.row)}
                            />
                        )}
                    </div>

                    <div
                        onClick={(e: any) => {
                            handelActive(params.row);
                        }}
                    >
                        {params.row.statusFlag === 0 ? (
                            <InactiveIcon className="w-5 h-5 cursor-pointer" />
                        ) : (
                            <ActiveIcon className="w-5 h-5 cursor-pointer" />
                        )}
                    </div>
                </>
            ),
        },
    ];

    return (
        <>
        <div className="data-grid-newThem my-3">
              <ReactDatagrid
                rows={gridData}
                toolsRequired={true}
                columns={columns}
              />
            </div>
            {/* <DataGrid
                autoHeight
                rows={gridData}
                columns={columns}
                // getRowId={(row) => uuidv4()}
                getRowId={(row) => row.roleId}
                density="compact"
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[10]}
            /> */}

        </>
    )
}

export default RoleGrid