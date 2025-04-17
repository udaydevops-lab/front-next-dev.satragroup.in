"use client"
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import React, { Dispatch, SetStateAction, useState } from 'react'
import {
    Dialog,
    DialogFooter,
    DialogHeader,
    Button
} from "@material-tailwind/react";
import moment from 'moment';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import ActiveIcon from '../../../../../public/icons/wellness-record/active-icon';
import InactiveIcon from '../../../../../public/icons/wellness-record/inactive-icon';
import services from '@/app/utilities/services';
import { GridColDef } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
import { deleteUser, empDetailsById, getUserById, getUserByIdapiData, updateUserStatusflag } from '@/app/utilities/api-urls';
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import DeletePopupMsg from '@/app/_commonfeatures/DeletePopupMsg';

interface SavegetUsermastergridprops {
    state: any,
    disptach: Dispatch<SetStateAction<any>>,
    getFun: any
}

const SavegetUsermastergrid: React.FC<SavegetUsermastergridprops> = ({
    state,
    disptach,
    getFun
}) => {


    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "S.No",
            width: 50,
            // renderCell: (params: any) => {
            //     const rowNumber = state.getApi.saveUserMasterresult.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        { field: "username", headerName: "User Name", width: 140 },
        { field: "serviceEntityDesc", headerName: "Organization", width: 140 },
        { field: "locationDesc", headerName: "Location", width: 140 },
        { field: "departmentName", headerName: "Department", width: 140 },
        // { field: 'generatedBy', headerName: "Created By", width: 120 },
        {
            field: "createdDate",
            headerName: "Created Date",
            width: 110,
            renderCell: (params: any) => {
                return moment(params?.row?.createdDate).format("DD-MM-YYYY");
            },
        },
        // { field: 'updatedBy', headerName: "Updated By", width: 110 },
        // {
        //     field: "updatedDate",
        //     headerName: "Updated Date",
        //     width: 110,
        //     renderCell: (params: any) => {
        //         return params?.row?.updatedDate ? moment(params?.row?.updatedDate).format("DD-MM-YYYY") : '';
        //     },
        // },
        {
            field: "status",
            headerName: "Status",
            width: 80,
            renderCell: (params: any) => (
                <div>
                    {params.row.status === "Active" ? (
                        <div className="text-green-600">Active</div>
                    ) : (
                        <div className="text-red-600">Inactive</div>
                    )}
                </div>
            ),
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params: any) => (
                <div className="flex gap-2 ml-[-10px] cursor-pointer">
                    {params.row.status === "Active" ? (
                        <PencilIcon
                            className="text-blue-500 mt-4 w-5 h-5 cursor-pointer me-2"
                            onClick={() => {
                                editUser(params.row);
                            }}
                        />
                    ) : (
                        <div className="ml-7"></div>
                    )}
                    {/* </button> */}
                    <div
                        onClick={(e: any) => {
                            handelActive(params.row);
                        }}
                    >
                        {params.row.statusFlag == 1 ? <ActiveIcon /> : <InactiveIcon />}
                    </div>
                </div>
            ),
        },

    ];

    const [popup, setPopup] = useState<any>({
        open: false,
        deleteId: ''
    })

    // delete the user for the below function
    const deleteDatagridData = async () => {
        disptach({ type: 'fieldVal', payload: { loader: true } })
        const id = popup.id;

        const res: any = await ApiRequestMethod({ method: "POST", url: `${deleteUser}/${id}`, postObj: {} })
        if (res.success) {
            toast.success("Successfully deleted the record");
            disptach({ type: 'fieldVal', payload: { loader: false } })
            setPopup({ ...popup, open: false })
            getFun()
        }
        else {
            toast.success("Successfully deleted the record");
            disptach({ type: 'fieldVal', payload: { loader: false } })
            setPopup({ ...popup, open: false })
        }
    }

    // edit button click show the details as respective of data on the field
    const editUser = async (editData: any) => {
        const section = document.getElementById('sectionRef');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // let urlbyId: any = getUserById + `${editData.userId}`//orignial
        let urlByUserId: any = getUserByIdapiData + `${editData.userId}` // testing

        const getUserByIdData: any = await ApiRequestMethod({ method: 'GET', url: urlByUserId })
        const empDatabyEmpId: any = await ApiRequestMethod({ method: "GET", url: `${empDetailsById}${getUserByIdData.data.data[0].empId}` })

        console.log('getUserByIdData', getUserByIdData)
        console.log('empDatabyEmpId', empDatabyEmpId)


        const mergedArray: any = state.getApi.userGroupData.map((group: any) => {
            const userProfile = getUserByIdData?.data?.data[0]?.userProfileGroupList.find(
                (profile: any) => profile.groupId === group.groupId
            );
            return {
                ...group,
                userGroupId: userProfile ? userProfile.userGroupId : null,
                generatedBy: userProfile ? userProfile.generatedBy : null,
                serviceEntityDesc: userProfile ? userProfile.serviceEntityDesc : null,
                locationDesc: userProfile ? userProfile.locationDesc : null,
                generatedId: userProfile ? userProfile.generatedId : null,
                generatedDate: userProfile ? userProfile.generatedDate : null,
                isGroupPrimary: userProfile ? userProfile.isGroupPrimary : null
            };
        }).filter((list: any) => list.userGroupId);

        //  console.log(mergedArray)
        console.log("EditData", editData)
        disptach({
            type: 'fieldVal',
            payload: {
                employeeId: getUserByIdData.data.data[0].employeeId,
                empName: getUserByIdData.data.data[0].fullName,
                empCode: empDatabyEmpId.data.data[0].employeCode,
                empDepartment: empDatabyEmpId.data.data[0].departmentDescription,
                empOrg: empDatabyEmpId.data.data[0].serviceEntityDesc,
                empPrimaryLocation: empDatabyEmpId.data.data[0].locationDesc,
                empProfiletype: empDatabyEmpId.data.data[0].employeTypeDesc,
                userName: { label: editData.username },
                userId: editData.userId,
                serviceEntityId: editData.serviceEntityId,
                locationId: editData.locationId
            }
        })

        disptach({
            type: "getData",
            payload: {
                orgFacilityStore: [...getUserByIdData?.data?.data[0]?.userProfileLocationList],
                historyData: getUserByIdData?.data?.data,
                userGroupTable: mergedArray
            }
        })

    }

    // for the below function active and inactive the user 
    const handelActive = (rowData: any) => {
        try {
            const id = rowData.userId;
            const statusFlag =
                rowData.statusFlag === 1 || rowData.statusFlag === null ? 0 : 1;
            const message =
                rowData.statusFlag === 0
                    ? "Successfully activated the record"
                    : "Successfully inactivated the record";
            services
                .create(`${updateUserStatusflag}${id}/${statusFlag}`, [])
                .then((response: any) => {
                    toast.success(message);
                    getFun();
                })
                .catch((e: any) => {
                    console.log(e.message);
                });
        } catch (error: any) {
            console.log(error.message);
        }
    };


    return (
        <>
            <div className='data-grid-newThem w-full mt-4'>
                <ReactDatagrid
                    rows={state.getApi.saveUserMasterresult}
                    toolsRequired={true}
                    columns={columns}
                />
            </div>

            {/* Dailog box */}

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
                    <DeletePopupMsg
                        btnYesFun={deleteDatagridData}
                        btnNoFun={() => setPopup({
                            ...popup,
                            open: false
                        })}
                        content={
                            <>
                                Do you want to delete this record?
                            </>
                        }
                    />
                }
            />
        </>
    )
}

export default SavegetUsermastergrid
