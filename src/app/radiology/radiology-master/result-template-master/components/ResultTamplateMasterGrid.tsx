"use client"
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import React, { FC } from 'react'
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import moment from 'moment';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import services from '@/app/utilities/services';
import { getRadiologyResulUpdateById, getResulUpdateById, resulStatusUpdate, updateStatusRadiologyResultTamplate } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';

interface ResultTamplateMasterGridProps {
    sampleGridData: any,
    getgridData: any,
    setRadServiceFeilsInfo: any,
    popup: any,
    setPopup: any,
    radfeilds: any,
    setRadFeilds: any,
    setBtnType: any,
    handleEdit: any,
}

const ResultTamplateMasterGrid: FC<ResultTamplateMasterGridProps> = ({ sampleGridData, getgridData, setRadServiceFeilsInfo, popup, setPopup, radfeilds, setRadFeilds, setBtnType, handleEdit }) => {


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
            field: "serviceDesc",
            headerName: "Service Description",
            width: 300,
        },
        {
            field: "radiologyResultTemplateName",
            headerName: "Result Template Name",
            width: 250,
        },
        {
            field: "status",
            headerName: "Status",
            width: 100,
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
            field: "modifiedDate",
            headerName: "Modified Date",
            width: 120,
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
        // },
        {
            field: "action",
            headerName: "Action",
            width: 100,
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
        //resulStatusUpdate
        let Headers = getHeaderResponse()
        let id = row.radiologyResultTemplateHeaderId
        let status = row.statusFlag === 1 ? 0 : 1
        let message = row.statusFlag === 1 ? "Successfully inactive the row Data" : "Successfully active the row Data"
        const postObj = {
            statusFlag: status,
            headerId: id,
        }
        services
            .create(`${updateStatusRadiologyResultTamplate}`, postObj, Headers)
            .then((response) => {
                getgridData()
                toast.success(message)
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    return (
        <>
            {sampleGridData &&
            <div>
            <div className="data-grid-newThem my-3">
                <ReactDatagrid
                toolsRequired={true}
                pageNationNumber={3}
                    rows={sampleGridData} columns={columns}
                />
                </div>
                </div>
            }

        </>
    )
}

export default ResultTamplateMasterGrid