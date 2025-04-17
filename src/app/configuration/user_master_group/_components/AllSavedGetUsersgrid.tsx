"use client"
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Button, Dialog, DialogFooter, DialogHeader } from '@material-tailwind/react';
import { GridColDef } from '@mui/x-data-grid';
import React, { Dispatch, SetStateAction, useState } from 'react'
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';
import moment from 'moment';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import DeletePopupMsg from '@/app/_commonfeatures/DeletePopupMsg';
import BlockUnblockform from './BlockUnblockform';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { getRoles, userMastergroupDataBlockUnblockapie, userMastergroupDatagetByIDapie } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';


interface AllSavedGetUsersgridprops {
    state: any,
    disptach: Dispatch<SetStateAction<any>>,
    getuserGroupData: () => void,
    getuserDetailsbyId: any
}

const AllSavedGetUsersgrid: React.FC<AllSavedGetUsersgridprops> = ({
    state,
    disptach,
    getuserGroupData,
    getuserDetailsbyId
}) => {

    const [popup, setPopup] = useState<any>({
        open: false,
        deleteId: '',
        activeInactive: false,
    })

    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 30,
        },
        {
            field: "groupName",
            headerName: 'User Group Name',
            width: 240,
        },
        {
            field: "groupCode",
            headerName: 'User Group Code',
            width: 180,
        },
        {
            field: "generatedDate",
            headerName: 'Created Date',
            width: 130,
            renderCell: (params: any) => {
                return params.row.generatedDate ? moment(params.row.generatedDate).format("DD-MM-YYYY") : ''
            }
        },
        {
            field: "updatedDate",
            headerName: 'Modify Date',
            width: 130,
            renderCell: (params: any) => {
                return params.row.updatedDate ? moment(params.row.updatedDate).format("DD-MM-YYYY") : ''
            }
        },
        // {
        //     field: "activeFromDate",
        //     headerName: 'Requested Date',
        //     width: 100,
        //     renderCell(params) {
        //         return moment(params.row.activeFromDate).format("DD-MM-YYYY")
        //     },
        // },
        {
            field: "blockActiveStatus",
            headerName: 'Status',
            width: 100,
            renderCell: (params: any) => {
                return params.row.isBlocked ? <div className='text-green-500'>Active</div> : <div className='text-red-500'>Inactive</div>
            }
        },
        {
            field: "actions",
            headerName: 'Actions',
            width: 100,
            renderCell: (params: any) => (
                <>
                    <div className='flex gap-1 items-center justify-end w-full'>
                        {

                            params.row.isBlocked ? <>
                                <div className="cursor-pointer">
                                    <PencilIcon
                                        className="w-5 h-5 text-blue-400 cursor-pointer"
                                        onClick={() => editUser(params.row)}
                                    />
                                </div>
                                <div className="cursor-pointer">
                                    <ActiveIcon
                                        className="cursor-pointer"
                                        onClick={(e: any) => {
                                            // inActiveMerMisstionPopup(e, params.row)
                                            setPopup({ ...popup, activeInactive: true, data: params.row })
                                            disptach({
                                                type: 'fieldVal',
                                                payload: {
                                                    activeData: params.row,
                                                    blockUnblock: {
                                                        label: "Block / Unblock"
                                                    },
                                                    resonForBlock: {
                                                        label: 'Reason'
                                                    },
                                                }
                                            })
                                        }}
                                    />
                                </div>

                            </> : <>
                                <div className="cursor-pointer" onClick={(e: any) => {
                                    // inActiveMerMisstionPopup(e, params.row)
                                    setPopup({ ...popup, activeInactive: true, data: params.row })
                                    disptach({
                                        type: 'fieldVal',
                                        payload: {
                                            activeData: params.row,
                                            blockUnblock: {
                                                label: "Block / Unblock"
                                            },
                                            resonForBlock: {
                                                label: 'Reason'
                                            },
                                        }
                                    })
                                }}>
                                    <InactiveIcon
                                        className="cursor-pointer float-left w-5 h-4"

                                    />
                                </div>

                            </>
                        }
                    </div>
                </>
            ),
        },
    ];

    const deleteDatagridData = () => {
        disptach({ type: 'fieldVal', payload: { loader: true } })

        setTimeout(() => {
            disptach({ type: 'fieldVal', payload: { loader: false } })
        }, 1000)
    }

    const roleIdnamebyroleid = async (id: any) => {
        const response: any = await ApiRequestMethod({ method: "GET", url: getRoles })
        const result: any = response?.data?.data.filter((list: any) => list.id === id)
        // console.log(result[0].desc)
        return result[0].desc;
    }

    // found the data by group id from the below function
    const editUser = async (editData: any) => {
        const section = document.getElementById('sectionRef');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }


        let mainUrl: any = userMastergroupDatagetByIDapie + editData.groupId

        const response: any = await ApiRequestMethod({ method: "GET", url: mainUrl })
        const results: any = { ...response?.data?.data }
        const mergedArray: any = results.userGroupAssignSet.length > 0 ? results.userGroupAssignSet.map((group: any) => {
            const userProfile = results.userProfilesBasicList.find(
                (profile: any) => profile.userId === group.userId
            );
            return {
                ...group,
                userName: userProfile ? userProfile.userName : null,
                empName: userProfile ? userProfile.fullName : null,
                empId: userProfile ? userProfile.empId : null,
                empCode: userProfile ? userProfile.employeCode : null,
                empDepartment: userProfile ? userProfile.departmentDescription : null,
                empProfiletype: userProfile ? userProfile.employeTypeDesc : null,
                isNew:group.isGroupPrimary==1?0:1,
            };

        }) : [];

        if (response.success) {
            disptach({
                type: "fieldVal",
                payload: {
                    usergroupName: results.groupName,
                    usergroupCode: results.groupCode,
                    groupId: results.groupId,
                    isBlocked: results.isBlocked
                    // empRole: {
                    //     label: ''
                    // }
                }
            })

            disptach({
                type: "userGroupRoleAssignmentStore",
                payload: {
                    userGroupRoleAssignmentTable: results.roleIds
                }
            })

            disptach({
                type: "addUsers",
                payload: {
                    addUserdatatable: mergedArray
                }
            })
        }
    }

    // block and unblock the user group data from this function
    const inActiveRecord = async () => {
        disptach({
            type: "fieldVal",
            payload: {
                blockloader: true
            }
        })

        let blockUnblocVal: any = state.field.activeData.isBlocked === 1 ? 0 : 1;

        let data: any = {
            groupId: state.field.activeData.groupId,
            isBlocked: blockUnblocVal,
            resonForBlock: state.field.resonForBlock.label,
            blockedRemarks: state.field.blockedRemarks
        }

        const response: any = await ApiRequestMethod({ method: "POST", url: userMastergroupDataBlockUnblockapie, postObj: data })

        if (response.success) {
            setTimeout(() => {
                disptach({
                    type: "fieldVal",
                    payload: {
                        blockloader: false
                    }
                })

                toast.success(`Successfully ${blockUnblocVal ? 'Unblock' : 'Block'} user master group`);
                getuserGroupData();

                setPopup({
                    ...popup,
                    activeInactive: false
                })
            }, 2000)
        }
        else {
            disptach({
                type: "fieldVal",
                payload: {
                    blockloader: false
                }
            })
            getuserGroupData();
            toast.error(`Something went wrong`);
        }
    }

    //console.log(state)
    return (
        <>



            <div className={`${state.getApi.userMastergroupData.length > 0 ? 'min-h-[250px]' : 'h-[250px]'} w-full mb-3 data-grid-newThem`}>
                <ReactDatagrid
                    toolsRequired={true}
                    rows={state.getApi.userMastergroupData}
                    columns={columns}
                />

            </div>

            {/* Dailog box for delete */}

            <Dialog
                open={popup.open}
                handler={() => setPopup({
                    ...popup,
                    open: false
                })}
                size={"sm"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5"
            >
                <DialogHeader className=" justify-center">
                    <div className="w-100">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            Do you want to delete this employee record?
                        </div>
                    </div>
                </DialogHeader>

                <DialogFooter className="text-center justify-center">
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600"
                        onClick={deleteDatagridData}
                    >
                        {
                            state.field.loader ?
                                <div className='w-full flex justify-center items-center'>
                                    <div className='innerBtnloader'></div>
                                </div> :
                                'Yes'
                        }
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-red-500 hover:bg-red-600"
                        color="red"
                        onClick={() => setPopup({ open: false })}
                    >
                        <span>No</span>
                    </Button>
                </DialogFooter>
            </Dialog>

            {/** Popup for Active inActive records popup message */}
            <ReactCommonDialog
                dialogtitle='Block or Unblock user group master'
                open={popup.activeInactive}
                handler={() => setPopup({
                    ...popup,
                    activeInactive: false
                })}
                popupClose={() => setPopup({
                    ...popup,
                    activeInactive: false
                })}
                Content={

                    <BlockUnblockform
                        state={state}
                        dispatch={disptach}
                        inActiveRecord={inActiveRecord}
                    />
                }
                size='lg'
            />


        </>
    )
}

export default AllSavedGetUsersgrid
