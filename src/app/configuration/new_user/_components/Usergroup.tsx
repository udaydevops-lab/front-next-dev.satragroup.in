'use client'
import ActionButton from '@/app/_common/button';
import DeletePopupMsg from '@/app/_commonfeatures/DeletePopupMsg';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { TrashIcon } from '@heroicons/react/24/solid'
import { GridColDef } from '@mui/x-data-grid';
import { useState } from 'react';

interface useGroupDataprops {
    userGroupData: any,
    deleteUserGroup: any,
    deleteUserGroupfromuser: any,
    state: any,
    dispatch: any
}

const Usergroup: React.FC<useGroupDataprops> = ({
    state,
    dispatch,
    userGroupData,
    deleteUserGroup,
    deleteUserGroupfromuser
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
            field: "groupName",
            headerName: 'Group name',
            width: 100,
        },
        {
            field: "locationDesc",
            headerName: 'Status',
            width: 60,
            renderCell: (params: any) => (

                <>
                    {params.row.groupCode ? params.row.isBlocked === 1 ? <div className='text-green-500'>Active</div> : <div className='text-red-500'>Inactive</div> : ''}
                </>
            ),
        },
        {
            field: "isPrimary",
            headerName: 'Primary',
            width: 60,
            renderCell: (params: any) => (
                <>{getRadioElement(params)}</>
            ),
        },
        {
            field: "actions",
            headerName: 'Actions',
            width: 60,
            renderCell: (params: any) => (

                <>
                    {
                            <><div className='w-full flex justify-between px-2 py-1 text-[13px] position-relative '>
                                {params.row.userGroupId ?
                                <TrashIcon
                                        className='w-4 h-4 text-red-500 cursor-pointer'
                                        onClick={() => {
                                            confirmDelete(params.row)
                                        }}
                                    />:
                                    <TrashIcon
                                        className='w-4 h-4 text-red-500 cursor-pointer x'
                                        onClick={() => {
                                            deleteUserGroup(params.row.groupId)
                                        }}
                                    />
                                }

                            </div></>

                    }


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
                        value={params.row.isGroupPrimary}
                        className="form-radio h-5 w-5 text-blue-500"
                        onClick={() => handleRadio(params.row)}
                        checked={params.row.isGroupPrimary}
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
                userGroupTableCopy:state.getApi.userGroupTableCopy.map((list: any) => {
                    if (list.groupId === data.groupId) {
                        return {
                            ...list,
                            isGroupPrimary: 1
                        }
                    } else {
                        return {
                            ...list,
                            isGroupPrimary: 0
                        }
                    }
                }),
                userGroupTable: state.getApi.userGroupTable.map((list: any) => {
                    if (list.groupId === data.groupId) {
                        return {
                            ...list,
                            isGroupPrimary: 1
                        }
                    } else {
                        return {
                            ...list,
                            isGroupPrimary: 0
                        }
                    }
                })
            }
        })
    }
    const [popup, setPopup] = useState<any>({
        open: false,
        data: null,
    })
    const confirmDelete=(data:any)=>{
        setPopup({open:true,data:data})
    }
    return (
        <>
            <div className='mt-3 data-grid-newThem w-full'>
                <ReactDatagrid 
                    rows={state.getApi.userGroupTable}
                    columns={columns}
                    hideFooter
                />
            </div>
            <div>
                <ReactCommonDialog
                open={popup.open}
                handler={() => setPopup({
                    ...popup,
                    open: false
                })}
                popupClose={() => setPopup({
                    ...popup,
                    open: false
                })}
                Content={
                    <>
            <div className="w-100 font-bold">
                <div className="text-center text-[20px] text-blue-500">
                    Are you sure,
                </div>
                <div className="text-center text-[20px] text-blue-500">
                Do you want to delete this record?
                </div>
            </div>

            <div className='flex w-full justify-center items-center gap-4 mt-3'>
                <ActionButton
                    buttonText={
                        // loader ?
                        //     <div className='w-full flex justify-center items-center'>
                        //         <div className='innerBtnloader'></div>
                        //     </div> :
                            "Yes"
                    }
                    width="w-[120px] text-white text-[14px] h-[42px] py-3 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={()=>deleteUserGroupfromuser(popup.data)}
                />

                <ActionButton
                    buttonText={"No"}
                    width='w-[120px] bg-red-500 hover:bg-red-600 h-[42px] text-[14px] px-2 py-3'
                    handleSubmit={()=>setPopup({...popup,open:false})}
                />

               </div>
             </>
                }
            />
            </div>
            {/* {userGroupData && userGroupData.length > 0 &&
                <div className='w-full'>
                    <div className='bg-gray-500 px-2 py-1 text-center text-[13px] fw-bold '>
                        Assigned User Group
                    </div>
                    {userGroupData.map((list: any, index: number) => {
                        return (
                            <>
                                <div key={index} className='w-full flex justify-between pl-2 py-1 text-[13px] border-b border-gray-400 pr-2 position-relative '>
                                    {list.groupName}
                                    <TrashIcon
                                        className='w-4 h-4 text-red-500 cursor-pointer'
                                        onClick={() => deleteUserGroup(index)}
                                    />
                                </div>
                            </>
                        )

                    })}
                </div>
            } */}
        </>
    )
}

export default Usergroup
