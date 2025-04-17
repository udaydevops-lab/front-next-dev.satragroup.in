"use client"
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import { ReactSelectBox } from '@/app/_commonfeatures'
import FormPropsTextFields from '@/app/_common/input';
import ActionButton from '@/app/_common/button';
import { passwordPattern } from '@/app/utilities/validations';
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun';
import { empDetailsById, getUserByIdapiData, userDetailsById } from '@/app/utilities/api-urls';
import { toast } from 'react-toastify';
import { sanitizeInput } from '@/app/utilities/sanitizeInput';
import { sanitizeObject } from '@/app/utilities/sanitizeObject';

interface UserMasterFormprops {
    state: any,
    // dispatch: Dispatch<SetStateAction<any>>
    dispatch: any,
    onselectPrority:any
}

const UserMasterForm: React.FC<UserMasterFormprops> = ({
    state,
    dispatch,
    onselectPrority
}) => {
    const [passwordStat, setPasswordStat] = useState<any>({
        showPwd: false,
        fieldName: ''
    })

    //get the user list by the id from the below function
    const getEmpDataById = async (id: any) => {
        const empDataResult: any = await ApiRequestMethod({ method: "GET", url: `${userDetailsById}${id}` })
        let urlByUserId: any = getUserByIdapiData + `${id}` // 
        const getUserByIdData: any = await ApiRequestMethod({ method: 'GET', url: urlByUserId })
        // console.log(empDataResult.data.data[0].empData.firstName)
        console.log(getUserByIdData.data.data[0])
        if (empDataResult.success === false) {
            return toast.error('Network Error')
        }


        dispatch({
            type: 'fieldVal',
            payload: {
                // empName: `${empDataResult.data.data[0].empData.firstName} ${empDataResult.data.data[0].empData.lastName}`,
                empName: getUserByIdData.data.data[0].fullName,
                empCode: empDataResult.data.data[0].employeCode,
                empDepartment: empDataResult.data.data[0].departmentName,
                empOrg: empDataResult.data.data[0].empData.serviceEntityDesc,
                serviceEntityId: empDataResult.data.data[0].empData.serviceEntityId,
                empPrimaryLocation: empDataResult.data.data[0].empData.locationDesc,
                locationId: empDataResult.data.data[0].empData.locationId,
                empProfiletype: empDataResult.data.data[0].empData.employeTypeDesc,
                // userName: empDataResult.data.data[0].username,
                userId: empDataResult.data.data[0].userId
            },
        })


    }

    // select the already added employee name from the below list
    // const onselectPrority = (data: any) => {
    //     console.log('empData', data)
    //     dispatch({
    //         type: 'getData',
    //         payload: {
    //             userName: sanitizeObject(data),
    //         },
    //     })
    //      getEmpDataById(data.userId)

    // }

    //select the already added employee name from the below list
    


    // input handler from the below list

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: 'fieldVal',
            payload: {
                [e.target.name]: sanitizeInput(e.target.value)
            }
        })
    }

    // default button click set the password data data and confirmdata
    const defaultPwdfun = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                isDefaultPassword: 1
            }
        })

        // dispatch({
        //     type: 'defaultVal',
        //     payload: {
        //         userPwd: state.field.data && state.field?.data?.userPwd ? state.field?.data?.userPwd : '',
        //         userCnfPwd: state.field.data && state.field?.data?.userCnfPwd ? state.field?.data?.userCnfPwd : '',
        //         action: true
        //     }
        // })

    }

    // from the below function clear all the data 
    const resetFun = () => {
        dispatch({
            type: 'fieldVal',
            payload: {
                empName: {
                    label: "Employee Name",
                },
                empCode: '',
                empDepartment: '',
                empOrg: '',
                empPrimaryLocation: '',
                empProfiletype: '',
                userName: '',
                userPwd: '',
                userCnfPwd: '',
                orgNiz: {
                    label: "Organization"
                },
                facility: {
                    label: "Facility"
                },
                userGroup: {
                    label: "User Group"
                },
                data: {}
            },
        })

        dispatch({
            type: 'defaultVal',
            payload: {
                userPwd: '',
                userCnfPwd: '',
                action: false
            },
        })
    }


    // userHistory
    const userHistory = () => {
        const userDetails: any = state.getApi.saveUserMasterresult.filter((list: any) => list.userId === state.field.userId)
        console.log(userDetails)
        dispatch({
            type: "getData",
            payload: {
                historyData: userDetails ? userDetails : []
            }
        })
        dispatch({
            type: "fieldVal",
            payload: {
                hxPopup: true
            }
        })
    }


    //get the user list by the id from the below function
    // const getNewEmpDataById = async (id: any) => {
    //     const empDataResult: any = await ApiRequestMethod({ method: "GET", url: `${empDetailsById}${id}` })
    //     console.log(empDataResult.data.data[0].empData.firstName, empDataResult.data.data[0].empData.lastName)
    //     if (empDataResult.success === false) {
    //         return toast.error('Network Error')
    //     }
    //     const data = {
    //         id: id,
    //         label: empDataResult?.data?.data[0]?.empData?.firstName + " " + empDataResult?.data?.data[0]?.empData?.lastName,
    //         value: empDataResult?.data?.data[0]?.empData?.firstName + " " + empDataResult?.data?.data[0]?.empData?.lastName,
    //     }
    //     dispatch({
    //         type: 'fieldVal',
    //         payload: {
    //             empName: empDataResult?.data?.data[0]?.empData?.firstName + " " + empDataResult?.data?.data[0]?.empData?.lastName,
    //             empCode: empDataResult.data.data[0].employeCode,
    //             empDepartment: empDataResult.data.data[0].departmentName,
    //             empOrg: empDataResult.data.data[0].empData.serviceEntityDesc,
    //             serviceEntityId: empDataResult.data.data[0].empData.serviceEntityId,
    //             empPrimaryLocation: empDataResult.data.data[0].empData.locationDesc,
    //             locationId: empDataResult.data.data[0].empData.locationId,
    //             empProfiletype: empDataResult.data.data[0].empData.employeTypeDesc,
    //             userName: { label: empDataResult.data.data[0].username },
    //             userId: empDataResult.data.data[0].userId
    //         },
    //     })
    // }
    const editUser = async (userId: any) => {
        const section = document.getElementById('sectionRef');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }

        // let urlbyId: any = getUserById + `${editData.userId}`//orignial
        let urlByUserId: any = getUserByIdapiData + `${userId}` // testing

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
        dispatch({
            type: 'fieldVal',
            payload: {
                employeeId: getUserByIdData.data.data[0].employeeId,
                empName: getUserByIdData.data.data[0].fullName,
                empCode: empDatabyEmpId.data.data[0].employeCode,
                empDepartment: empDatabyEmpId.data.data[0].departmentDescription,
                empOrg: empDatabyEmpId.data.data[0].serviceEntityDesc,
                empPrimaryLocation: empDatabyEmpId.data.data[0].locationDesc,
                empProfiletype: empDatabyEmpId.data.data[0].employeTypeDesc,
                userName: { label: empDatabyEmpId.data.data[0].username },
                userId: userId,
                serviceEntityId: mergedArray.serviceEntityId,
                locationId: mergedArray.locationId
            }
        })

        dispatch({
            type: "getData",
            payload: {
                orgFacilityStore: [...getUserByIdData?.data?.data[0]?.userProfileLocationList],
                historyData: getUserByIdData?.data?.data,
                userGroupTable: mergedArray
            }
        })

    }

    useEffect(() => {
        if (state?.field?.empInfo?.userId) {
            editUser(state.field.empInfo.userId)
        }
    }, [state?.field?.empInfo?.userId])
    return (
        <>
            <div className='w-full gap-4 grid grid-cols-4 newInputField newSelect' id="sectionRef">
                <div className="col-span-2">
                    <ReactSelectBox
                        value={state.field.userName}
                        options={state.getApi.empData}
                        onChange={onselectPrority}
                        label="User Name"
                        isSearchable={true}
                        isDisabled={state.field.userId !== null ? true : false}
                    />
                </div>
                <div className="">
                    <FormPropsTextFields
                        label={`Employee Name`}
                        name="empName"
                        value={state.field.empName}
                        className="!bg-[#eceff1] pointer-events-none"
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                        handleChange={inputHandler}
                    />
                </div>
                <div className="">
                    <FormPropsTextFields
                        label={`Emp Code`}
                        name="empCode"
                        value={state.field.empCode}
                        className="!bg-[#eceff1] pointer-events-none"
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                    />
                </div>
            </div>

            <div className='w-full flex gap-4 mt-4 mb-2 newInputField'>
                <div className="w-1/4">
                    <FormPropsTextFields
                        label={`Emp Orgnization`}
                        name="empOrg"
                        value={state.field.empOrg}
                        className="!bg-[#eceff1] pointer-events-none  "
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                    />
                </div>

                <div className="w-1/4">
                    <FormPropsTextFields
                        label={`Emp Primary Location`}
                        name="empPrimaryLocation"
                        value={state.field.empPrimaryLocation}
                        className="!bg-[#eceff1] pointer-events-none  "
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                    />
                </div>
                <div className="w-1/4">
                    <FormPropsTextFields
                        label={`Emp Profile Type`}
                        name="empProfiletype"
                        value={state.field.empProfiletype}
                        className="!bg-[#eceff1] pointer-events-none  "
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                    />
                </div>
                <div className="w-1/4">
                    <FormPropsTextFields
                        label={`Emp Department`}
                        name="empDepartment"
                        value={state.field.empDepartment}
                        className="!bg-[#eceff1] pointer-events-none  "
                        containerProps={{
                            className: "!min-w-0 !h-[43px]",
                        }}
                    />
                </div>
            </div>



        </>
    )
}

export default UserMasterForm
