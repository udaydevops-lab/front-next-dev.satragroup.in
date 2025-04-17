import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { getUserByIdapiData, userLocationOrganizationBlockunBlockape } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction, useEffect } from 'react';

interface OrganizationFacilityProps {
    dataGridTable: any,
    deleteDatagridData: (data: any) => void,
    getFun: () => void,
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
}

const OrgnizationFacilitygrid: React.FC<OrganizationFacilityProps> = ({
    dataGridTable,
    deleteDatagridData,
    getFun,
    state,
    dispatch
}) => {
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 30,
            // renderCell: (params) => {
            //     const rowNumber = dataGridTable.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        {
            field: "serviceEntityDesc",
            headerName: 'Organization',
            width: 150,
        },
        {
            field: "locationDesc",
            headerName: 'Facility',
            width: 150,
        },
        {
            field: "isPrimary",
            headerName: 'Primary',
            width: 80,
            renderCell: (params: any) => (
                <>{getRadioElement(params)}</>
            ),
        },
        {
            field: "actions",
            headerName: 'Actions',
            width: 80,
            renderCell: (params: any) => (

                <>
                    <div className='w-[80px] flex justify-center items-center'>
                        {params.row.userId && <div className='w-full cursor-pointer'
                            onClick={() => blockUnblockorgFacility(params.row)}
                        >
                            {params.row.statusFlag == 1 ? <ActiveIcon /> : params.row.userId && params.row.statusFlag == 0 && <InactiveIcon />}
                        </div>}

                        {params.row.userId ? '' : <TrashIcon
                            className='w-4 h-4 text-red-500 cursor-pointer'
                            onClick={() => deleteDatagridData(params.row)}
                        />}
                    </div>


                </>
            ),
        },
    ];
    const getRadioElement = (params: any) => {
        return (
            <div className='cursor-pointer'>
                <label className="inline-flex items-center">
                    <input
                        type="radio"
                        disabled={params.row.isBlocked == 0}
                        value={params.row.isLocationPrimary}
                        className="form-radio h-5 w-5 text-blue-500"
                        onClick={() => handleRadio(params.row)}
                        checked={params.row.isLocationPrimary}
                    />
                    <span className="ml-2"></span>
                </label>
            </div>
        )
    }
    const handleRadio = (data: any) => {
        dispatch({
            type: "getData",
            payload: {
                userGroupTable:state.getApi.userGroupTableCopy.filter((item:any)=>item.locationId==data.locationId),
                orgFacilityStore: state.getApi.orgFacilityStore.map((list: any) => {
                    if (list.locationId === data.locationId) {
                        return {
                            ...list,
                            isLocationPrimary: 1
                        }
                    } else {
                        return {
                            ...list,
                            isLocationPrimary: 0
                        }
                    }
                })
            }
        })
    }
    
    const blockUnblockorgFacility = async (data: any) => {
        console.log(data)
        let flag = data.statusFlag === 1 ? 0 : 1
        const postObjData: any = {
            userLocAssignId: data.userLocAssignId,
            statusFlag: flag
        }
        const response: any = await ApiRequestMethod({
            method: "POST",
            url: userLocationOrganizationBlockunBlockape,
            postObj: postObjData
        })

        if (response.success) {
            // let urlbyId: any = getUserById + `${editData.userId}`//orignial
            let urlByUserId: any = getUserByIdapiData + `${data.userId}` // testing

            const getUserByIdData: any = await ApiRequestMethod({ method: 'GET', url: urlByUserId })
            getFun();
            toast.success(`Successfully ${flag ? 'active' : 'inactive'} record`)
            dispatch({
                type: "getData",
                payload: {
                    orgFacilityStore: [...getUserByIdData?.data?.data[0]?.userProfileLocationList]
                }
            })
        }
        else {
            toast.error('Something went wrong...')
        }

    }
    return (
        <>
            <div className='data-grid-newThem w-full'>
                <ReactDatagrid
                    rows={dataGridTable}
                    columns={columns}
                    hideFooter
                />
            </div>

        </>
    )
}

export default OrgnizationFacilitygrid
