import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import React, { FC } from 'react'
import { PencilIcon } from '@heroicons/react/24/solid'

interface ProceduresEquipmentMasterGridProps {
    gridData: any,
    handleEdit: any,
}
const ProceduresEquipmentMasterGrid: FC<ProceduresEquipmentMasterGridProps> = ({ gridData, handleEdit }) => {
    const columns = [
        {
            field: "id", headerName: "S No", width: 80, renderCell: (params: any) => {
                return <>{params.row.id}</>
            }
        },
        { field: "equipmentDesc", headerName: " equipment Description", width: 500 },

        {
            field: "Delete",
            headerName: "Actions",
            width: 120,
            renderCell: (params: any) => (
                <>
                    <div className='flex gap-4 items-center w-[80px]'>
                        <div className='flex justify-center'>
                            <PencilIcon
                                onClick={(e: any) => handleEdit(params.row)}
                                className="w-5 h-5 cursor-pointer text-blue-500"
                            />
                        </div>

                    </div>
                </>
            ),
        },
    ]
    return (
        <>
            <ReactDatagrid rows={gridData} columns={columns} />
        </>
    )
}

export default ProceduresEquipmentMasterGrid