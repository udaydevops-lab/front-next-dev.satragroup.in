import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { FC } from 'react'
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import services from '@/app/utilities/services';
import { assignRadiologyParameterHeaderId, updateStatusProcedureAssignParameter, updateStatusRadiologyAssignParameter } from '@/app/utilities/api-urls';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { toast } from 'react-toastify';

interface AssignTestParameterGridProps {
    sampleGridData: any,
    handleEdit: any,
    getAllAssignServicesData: any,
}
const AssignTestParameterGrid: FC<AssignTestParameterGridProps> = ({ sampleGridData, handleEdit, getAllAssignServicesData }) => {
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Sno",
            width: 50,
            // renderCell: (params) => {
            //     const rowNumber = sampleGridData.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        {
            field: "serviceCode",
            headerName: "Service Code",
            width: 130,
        },
        {
            field: "serviceDesc",
            headerName: "Service Description",
            width: 270,
        },

        {
            field: "status",
            headerName: "Status",
            width: 80,
            renderCell: (params: any) => (
                <>
                    {params.row.statusFlag === 1 ?
                        <div className="text-green-600">Active</div>
                        : <div className="text-red-600">Inactive</div>
                    }
                </>
            ),
        },
        {
            field: "createdDate",
            headerName: "Created Date",
            width: 120,
            renderCell: (params: any) => (
                <>
                    {params.row.generatedDate && moment(params.row.generatedDate).format("DD-MM-YYYY")}
                </>
            ),
        },
        {
            field: "updatedDate",
            headerName: "Modified Date",
            width: 120,
            renderCell: (params: any) => (
                <>
                    {params.row.updatedDate && moment(params.row.updatedDate).format("DD-MM-YYYY")}
                </>
            ),
        },
        {
            field: "action",
            headerName: "Action",
            width: 90,
            renderCell: (params: any) => (
                <div className='flex gap-4 items-center w-[80px] justify-end'>
                    <div className='flex justify-center'>
                        {params.row.statusFlag === 1 ?
                            <PencilIcon
                                onClick={(e: any) => handleEdit(params.row)}
                                className="w-5 h-5 cursor-pointer text-blue-500"
                            />

                            : ""}
                    </div>
                    <div onClick={(e: any) => handleActive(params.row)}>
                        {params.row.statusFlag === 0 ? (
                            <InactiveIcon />
                        ) : (
                            <ActiveIcon />
                        )}
                    </div>
                </div>

            ),
        },
    ];
    const handleActive = (row: any) => {
        //updateStatusRadiologyAssignParameter
        console.log(row)
        let Headers = getHeaderResponse()
        let id = row.assignProcedureParameterHeaderId
        let status = row.statusFlag === 1 ? 0 : 1
        let message = row.statusFlag === 1 ? "Successfully inactive the row Data" : "Successfully active the row Data"
        const postObj = {}
        services
            .create(`${updateStatusProcedureAssignParameter}assignProcedureParameterHeaderId=${id}&statusFlag=${status}`, postObj, Headers)
            .then((response) => {
                getAllAssignServicesData()
                toast.success(message)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <>
            {sampleGridData &&
                <ReactDatagrid
                    rows={sampleGridData} columns={columns}
                />
            }

        </>
    )
}

export default AssignTestParameterGrid