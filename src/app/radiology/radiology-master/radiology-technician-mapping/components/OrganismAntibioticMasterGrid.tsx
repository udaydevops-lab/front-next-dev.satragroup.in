import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { PencilIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import React, { Dispatch, FC, SetStateAction } from 'react'
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon';
import { organismAntibioticMapingActiveInactiveapie } from '@/app/utilities/api-urls';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { toast } from 'react-toastify';

interface OrganismAntibioticMasterGridprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getAllorganismAntibioticDatafun: () => void
}

const OrganismAntibioticMasterGrid: FC<OrganismAntibioticMasterGridprops> = ({
    state,
    dispatch,
    getAllorganismAntibioticDatafun
}) => {

    const columns1: GridColDef[] = [
        { field: "id", headerName: "S.no", width: 90 },
        { field: "radSpecialityDesc", headerName: "Radiology Speciality", width: 320 },
        {
            field: "generatedDate", headerName: "Created Date", width: 150,
            renderCell: (params: any) => {
                return moment(params.row.generatedDate).format('DD-MM-YYYY')
            }
        },
        {
            field: "actions", headerName: "Actions", width: 120,
            renderCell: (params: any) => (
                <PencilIcon
                    className="text-blue-500 w-10 h-5 cursor-pointer"
                    onClick={() => editDetails(params.row)}
                />
            )
        }
    ];

    const editDetails = (data: any) => {
        let newArr: [] = data.technicianList.map((item: any) => {
            return {
                id: Math.random(),
                specialityCode: item.radSpecialityCode,
                specialityDescription: item.radSpecialityDesc,
                firstName: item.technicianName,
                employeeId: item.empId,
                value: item?.empId,
                label: item?.technicianName,
                radTechMapId: item?.radTechMapId
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
        let radiologySpecialtyData = state?.field?.radiologyspecSerchDesc.filter((item: any) => item.label === data.radSpecialityDesc)[0];

        dispatch({
            type: 'fieldVal',
            payload: {
                radTechMapId: data?.radTechMapId,
                radiologyspecDesc: { value: radiologySpecialtyData.value, label: radiologySpecialtyData.label },
                radiologydeptTech: data.technicianList.map((item: any) => ({
                    ...item,
                    value: item?.empId,
                    label: item?.technicianName
                })),
                newMappingGrid: newArr
            }
        })
    }

    return (
        <>
            <div className='w-full data-grid-newThem '>

                <ReactDatagrid
                    rows={state.getAppApi.getAllradiologytechDatastore}
                    columns={columns1}
                />

            </div>
        </>
    )
}

export default OrganismAntibioticMasterGrid
