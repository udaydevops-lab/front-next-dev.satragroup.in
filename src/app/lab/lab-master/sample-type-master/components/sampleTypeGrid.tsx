"use client"
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { Dispatch, SetStateAction, FC } from 'react'
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import services from '@/app/utilities/services';
import { sampleTypeUpdateStatus } from '@/app/utilities/api-urls';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { toast } from 'react-toastify';

interface SampleTypeGridProps {
    sampleGridData: any,
    popup: any,
    setPopup: Dispatch<SetStateAction<any>>,
    setPopupFeilds: Dispatch<SetStateAction<any>>,
    popupfeilds: any,
    getSampleTypeGridData: any,


}
const SampleTypeGrid: FC<SampleTypeGridProps> = ({ sampleGridData, popup, setPopup, setPopupFeilds, popupfeilds, getSampleTypeGridData }) => {

    // Edit button function
    const handleEdit = (row: any) => {
        setPopupFeilds({
            ...popupfeilds,
            sampleMasterId: row.sampleMasterId,
            newsampleCode: row.sampleTypeCode,
            newsampleDesc: row.sampleTypeDesc,
        })
        setPopup({ ...popup, open: true, })
    }

    // Active & Inactive Button function
    const handleActive = (row: any) => {
        let Headers = getHeaderResponse()
        let id = row.sampleMasterId
        let status = row.statusFlag === 1 ? 0 : 1
        let message = row.statusFlag === 1 ? "Successfully inactive the row Data" : "Successfully active the row Data"
        services
            .create(`${sampleTypeUpdateStatus}${id}/${status}`, Headers)
            .then((response) => {
                console.log(response.data)
                getSampleTypeGridData()
                toast.success(message)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    // Grid colums Data
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "SNO",
            width: 50,
            // renderCell: (params) => {
            //     const rowNumber = sampleGridData.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        {
            field: "sampleTypeCode",
            headerName: "Sample Code",
            width: 120,
        },
        {
            field: "sampleTypeDesc",
            headerName: "Sample Description",
            width: 200,
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
            width: 100,
            renderCell: (params: any) => (
                <>
                    {params.row.generatedDate && moment(params.row.generatedDate).format("DD-MM-YYYY")}
                </>
            ),
        },
        {
            field: "modifiedDate",
            headerName: "Modified Date",
            width: 100,
            renderCell: (params: any) => (
                <>
                    {params.row.updatedDate && moment(params.row.updatedDate).format("DD-MM-YYYY")}
                </>
            ),
        },
        // {
        //     field: "lastmodifiedDate",
        //     headerName: "Last Modified Date",
        //     width: 160,
        //     renderCell: (params: any) => (
        //         <>
        //             {params.row.updatedDate && moment(params.row.updatedDate).format("DD-MM-YYYY")}
        //         </>
        //     ),
        // },
        {
            field: "updatedBy",
            headerName: "Recorded By",
            width: 150,
        },
        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params: any) => (
                <div className='flex gap-4 items-center w-[80px] justify-end'>
                    <div className='flex justify-center'>
                        {params.row.statusFlag === 0 ? "" :
                            <PencilIcon
                                onClick={(e: any) => handleEdit(params.row)}
                                className="w-5 h-5 cursor-pointer text-blue-500"
                            />
                        }
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

    return (
        <>{sampleGridData &&
            <ReactDatagrid
                rows={sampleGridData} columns={columns}
            />
        }

        </>
    )
}

export default SampleTypeGrid