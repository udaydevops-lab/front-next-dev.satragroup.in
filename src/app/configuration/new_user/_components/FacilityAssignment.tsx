
"use client"
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { MasterHeading } from '../../_components'
import { ReactSelectBox } from '@/app/_commonfeatures'
import ActionButton from '@/app/_common/button'
import OrgnizationFacilitygrid from './OrgnizationFacilitygrid'
import Usergroup from './Usergroup'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { checkIsRoleAssignedToLocation, deluserGroupfromuserMasterapi, getLocationDropDown, getUserByIdapiData, saveUser, saveUserMaster, updateUser, updateUserData } from '@/app/utilities/api-urls'
import { toast } from 'react-toastify'
import { sanitizeObject } from '@/app/utilities/sanitizeObject'
import services from '@/app/utilities/services'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import { getLocalItem } from '@/app/utilities/local'

interface FacilityAssignmentprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
    getFun: any,
    GetHistoryDataListfun: any,
    onselectPrority:any
}
const FacilityAssignment: React.FC<FacilityAssignmentprops> = ({
    state,
    dispatch,
    getFun,
    GetHistoryDataListfun,
    onselectPrority
}) => {

    // select organization and Facility list from the below function
    const selectSelctionOrg = (data: any, key: string) => {
        if (key === 'orgNiz') {
            services.get(getLocationDropDown + data.id).then((response) => {
                console.log('res')
                dispatch({
                    type: "getData",
                    payload: {
                        facilityData: response.data.map((list: any) => ({ ...list, label: list.desc, value: list.id }))
                    }
                })
            });
        }
        dispatch({
            type: 'fieldVal',
            payload: {
                [`${key}`]: sanitizeObject(data)
            }
        })
    }
 useEffect(()=>{
    if(getHeaderResponse().serviceEntityId){
        selectSelctionOrg({
            label: getHeaderResponse().serviceEntityDesc,
            value: getHeaderResponse().serviceEntityDesc,
            id: getHeaderResponse().serviceEntityId,
          },'orgNiz')
    }else{
        dispatch({
            type: 'fieldVal',
            payload: {
                orgNiz:  {
                    label: "Organization"
                },
            }
        })
    }
 },[])
    // select user group from the list
    const selectSelctionUserGroup = (data: any) => {
        console.log(data)
        dispatch({
            type: "fieldVal",
            payload: {
                userGroup: sanitizeObject(data)
            }

        })

    }

    // add organization and facility in to the grid from below function 
    const addOrgFacFun = () => {
        dispatch({
            type: "fieldVal",
            payload: {

                // orgNiz: {
                //     label: 'Organization'
                // },
                facility: {
                    label: 'Facility'
                }
            }

        })

        let getStoreData: any = [...state.getApi.orgFacilityStore, {
            sn: Math.random(),
            serviceEntityId: state.field.orgNiz.id,
            serviceEntityDesc: state.field.orgNiz.label,
            locationId: state.field.facility.id,
            locationDesc: state.field.facility.label,
            statusFlag: 1,
            isLocationPrimary: state.getApi.orgFacilityStore.length > 0 ? 0 : 1
        }]
            .reduce((acc: any, ccmpl: any) => {
                let obj = acc.find(
                    (c: any) =>
                        c.serviceEntityDesc === ccmpl.serviceEntityDesc && c.locationDesc === ccmpl.locationDesc
                );
                if (obj) {
                    toast.error("You have entered same location");
                    return acc;
                } else {
                    return acc.concat([ccmpl]);
                }
            }, [])

        dispatch({
            type: 'getData',
            payload: {
                orgFacilityStore: getStoreData
            }
        })

    }
    const handleAddGroups=() => {
        let getStoreData: any = [...state.getApi.userGroupTable, {
            groupName: state.field.userGroup.label,
            groupId: state.field.userGroup.groupId,
            groupCode: null,
            isGroupPrimary: state.getApi.userGroupTable.length > 0 ? 0 : 1
        }]
            .reduce((acc: any, ccmpl: any) => {
                let obj = acc.find(
                    (c: any) =>
                        c.groupName === ccmpl.groupName
                );
                if (obj) {
                    toast.error("You have entered same group");
                    return acc;
                } else {
                    return acc.concat([ccmpl]);
                }
            }, [])

        dispatch({
            type: "fieldVal",
            payload: {
                userGroup: {
                    label: "User Group"
                }
            }
        })

        dispatch({
            type: "getData",
            payload: {
                userGroupTable: getStoreData
            }
        })
    }
    // add user group from the below function 
    const addUserGroupFun = () => {
        let index=state.getApi.orgFacilityStore.findIndex((item:any)=>item.isLocationPrimary)
        if(index<0){
            toast.error("Please select a location");
            return;
        }else{

        }
        services
          .get(
            `${checkIsRoleAssignedToLocation}?locationId=${state.getApi.orgFacilityStore[index].locationId}&groupId=${state.field.userGroup.groupId}&userId=`
          )
          .then((response) => {
            if (!response.data) {
              toast.error(
                "No Role Assigned in Selected Group For Selected Location"
              );
              return;
            } else {
              handleAddGroups();
            }
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong");
            ``;
            return;
          });

        

    }

    // delete user group from the below function
    const deleteUserGroup = (index: any) => {
        dispatch({
            type: 'getData',
            payload: {
                userGroupTable: state.getApi.userGroupTable.filter((list: any, idx: any) => list.groupId !== index)
            }

        })
    }

    // delete organization and facility from below function 
    const deleteDatagridData = (data: any) => {
        console.log(data)
        dispatch({
            type: 'getData',
            payload: {
                orgFacilityStore: state.getApi.orgFacilityStore.filter((list: any, idx: any) => list.sn !== data.sn)
            }

        })
    }

    // from below functio we have clear all the data
    const allClear = () => {
        dispatch({
            type: "fieldVal",
            payload: {
                userName: {
                    label: "User Name",
                },
                empName: "",
                empCode: '',
                empDepartment: '',
                empOrg: '',
                empPrimaryLocation: '',
                empProfiletype: '',
                // orgNiz: {
                //     label: "Organization"
                // },
                facility: {
                    label: "Facility"
                },
                userGroup: {
                    label: "User Group"
                },
                data: {},
                userId: null,
                isDefaultPassword: 0
            }
        })

        dispatch({
            type: "getData",
            payload: {
                orgFacilityStore: [],
                userGroupTable: []
            }
        })
    }


    type DataType = {
        sn: number;
        serviceEntityId: number;
        serviceEntityDesc: string;
        locationId: number;
        locationDesc: string;
    };

    const removeSnKey = (data: DataType[]): Omit<DataType, 'sn'>[] => {
        return data.map(({ sn, ...rest }) => rest);
    };

    // Save the user master screen from the below funtion
    const saveData = async () => {
        dispatch({ type: 'loader', payload: { loader: true } })

        const removeSnkeyfun: any = removeSnKey(state.getApi.orgFacilityStore)

        const postObjsave = {
            employeeId: state.field.empName.id,
            userId: state.field.userId ? state.field.userId : null,
            username: state.field.userName,
            isEmpidAsUsername: 1,
            tempPwd: null,//state.field.isDefaultPassword ? null : "Satra@2023",
            confirmPassword: null,//state.field.isDefaultPassword ? null : "Satra@2023",
            serviceEntityId: state.field.serviceEntityId,
            locationId: state.field.locationId,
            serviceEntityDesc: state.field.empOrg,
            locationDesc: state.field.empPrimaryLocation,
            isDefaultPassword: state.field.userId ? 1 : state.field.isDefaultPassword ? 1 : 0,
            userProfileLocationSet: removeSnkeyfun,
            userProfileGroupList: state.getApi.userGroupTableCopy && state.getApi.userGroupTableCopy.length > 0 ? state.getApi.userGroupTableCopy : [],
            statusFlag: 1,
            generatedBy: null
        }

        console.log('postObjsave', postObjsave)
        // main api
        // const response = await ApiRequestMethod({ method: "POST", url: saveUser, postObj: postObjsave })

        const response: any = await ApiRequestMethod({ method: "POST", url: saveUserMaster, postObj: postObjsave })
        console.log('response', response)
        if (response.success) {
            setTimeout(() => {
                toast.success('Successfully Added User List...')
                dispatch({ type: 'loader', payload: { loader: false } })
                dispatch({
                    type: "fieldVal",
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
                        orgNiz: {
                            label: "Organization"
                        },
                        facility: {
                            label: "Facility"
                        },
                        userGroup: {
                            label: "User Group"
                        },
                        data: {},
                        userId: null,
                        isDefaultPassword: 0
                    }
                })

                dispatch({
                    type: "getData",
                    payload: {
                        orgFacilityStore: [],
                        userGroupTable: []
                    }
                })
                getFun()
            }, 2000)
        } else {
            toast.error(`${response?.error?.response?.data?.statusMessage}`)
            dispatch({ type: 'loader', payload: { loader: false } })
        }
    }



    const orgnizationFacilityFun = async (urlByUserId: any) => {
        let getUserByIdData: any ={}
        await services.get(urlByUserId).then((response)=>{
            getUserByIdData=response
        })
        const mergedArray: any = state.getApi.userGroupData.map((group: any) => {
            const userProfile = getUserByIdData?.data[0]?.userProfileGroupList.find(
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

        getFun();
        dispatch({
            type: "getData",
            payload: {
                orgFacilityStore: [...getUserByIdData?.data[0]?.userProfileLocationList],
                userGroupTable: mergedArray
            }
        })
    }

    // updated user master screen for below function
    const updateUserFun = async () => {
        const removeSnkeyfun: any = removeSnKey(
          state.getApi.orgFacilityStore
        ).map((item: any) => ({ ...item, updatedBy: state.field.loginUser }));
        const facilityData: any = state.getApi.userGroupTableCopy.map(
          (item: any) => ({ ...item, updatedBy: state.field.loginUser })
        );
        const postObjsave = {
          employeeId: state.field.employeeId,
          userId: state.field.userId ? state.field.userId : null,
          username: state.field.userName.label,
          isEmpidAsUsername: 1,
          tempPwd: null, //state.field.isDefaultPassword ? null : "Satra@2023",
          confirmPassword: null, //state.field.isDefaultPassword ? null : "Satra@2023",
          serviceEntityId: state.field.serviceEntityId,
          locationId: state.field.locationId,
          serviceEntityDesc: state.field.empOrg,
          locationDesc: state.field.empPrimaryLocation,
          isDefaultPassword: state.field.userId
            ? 1
            : state.field.isDefaultPassword
            ? 1
            : 0,
          userProfileLocationSet: removeSnkeyfun,
          userProfileGroupList:state.getApi.userGroupTable&&state.getApi.userGroupTable.length>0?
          state.getApi.userGroupTable:[],
          statusFlag: 1,
          generatedBy: null,
          updatedBy: state.field.loginUser,
        };
        if(state.getApi.userGroupTable.length > 0) {
            let index=state.getApi.userGroupTable.findIndex((item:any) => item.isGroupPrimary==1)
            if(index<0){
                toast.error("Please set primary group")
                return
            }
        }
        dispatch({ type: 'loader', payload: { loader: true } })
        //updateUserData
        // const response: any = await ApiRequestMethod({ method: "POST", url: updateUser, postObj: postObjData })
        const response: any = await ApiRequestMethod({ method: "POST", url: updateUserData, postObj: postObjsave })

        if (response.success) {
            let urlByUserId: any = getUserByIdapiData + `${postObjsave.userId}` // testing 
            // const getUserByIdData: any = await ApiRequestMethod({ method: 'GET', url: urlByUserId })



            setTimeout(() => {
                toast.success("User updated successfully")
                orgnizationFacilityFun(urlByUserId)
                onselectPrority(postObjsave)
                dispatch({ type: 'loader', payload: { loader: false } })
                // dispatch({
                //     type: "fieldVal",
                //     payload: {
                //         empName: {
                //             label: "Employee Name",
                //         },
                //         empCode: '',
                //         empDepartment: '',
                //         empOrg: '',
                //         empPrimaryLocation: '',
                //         empProfiletype: '',
                //         userName: '',
                //         orgNiz: {
                //             label: "Organization"
                //         },
                //         facility: {
                //             label: "Facility"
                //         },
                //         userGroup: {
                //             label: "User Group"
                //         },
                //         data: {},
                //         userId: null,
                //         isDefaultPassword: 0
                //     }
                // })

                // dispatch({
                //     type: "getData",
                //     payload: {
                //         userGroupTable: mergedArray
                //     }
                // })
                getFun()
            }, 2000)
        }
        else {
            setTimeout(() => {
                toast.error("Something went wrong. Please try again");
                dispatch({ type: 'loader', payload: { loader: false } })
                getFun()
            }, 2000)
        }
    }

    // Get the History data from below function 
    const historyData = () => {
        let userId: any = state.field.userId
        // let locationId: any = state.field.locationId
        GetHistoryDataListfun(userId)
    }

    // delete user master group from user
    const deleteUserGroupfromuser = async (data: any) => {
        if (data.isGroupPrimary === 1) {
            toast.error("Please update the group. Once updated, you may delete this group")
            return;
        }
        const response: any = await ApiRequestMethod({ method: "POST", url: deluserGroupfromuserMasterapi, postObj: { userGroupId: data.userGroupId } })
        if (response.success) {
            let urlByUserId: any = getUserByIdapiData + `${state.field.userId}`
            orgnizationFacilityFun(urlByUserId)
            toast.success('Successfully delete the user master group from user')
        }
        else {
            toast.error('Something went wrong')
        }
    }

    return (
        <>
            <div className=' border-t border-gray-500 py-3'>
                <div className='w-full'>
                    <MasterHeading
                        heading='Facility Assignment'
                    />
                </div>

                <div className='w-full flex gap-4'>
                    <div className='w-3/5 px-3 bg-white rounded-curve py-3 border border-stroke'>
                        <div className='flex gap-4'>
                            <div className='w-2/5 newSelect'>
                                <ReactSelectBox
                                    value={state.field.orgNiz}
                                    options={state.getApi.orgnizationData}
                                    onChange={(data: any) => selectSelctionOrg(data, 'orgNiz')}
                                    label="Organization"
                                    isSearchable={true}
                                    isDisabled={getHeaderResponse().serviceEntityId}
                                />
                            </div>
                            <div className='w-2/5 newSelect'>
                                <ReactSelectBox
                                    value={state.field.facility}
                                    options={state.getApi.facilityData}
                                    onChange={(data: any) => selectSelctionOrg(data, 'facility')}
                                    label="Facility"
                                    isSearchable={true}
                                />
                            </div>
                            <div className='w-1/5 flex gap-2'>
                                <ActionButton
                                    buttonText="Add"
                                    handleSubmit={addOrgFacFun}
                                    width="w-full text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    disabled={
                                        state.field.orgNiz.label !== 'Orgnization' && state.field.userName.label!=='User Name'&&
                                            state.field.facility.label !== 'Facility' ? false : true}
                                />

                                <ActionButton
                                    buttonText={"HX"}
                                    width="w-full text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    handleSubmit={historyData}
                                    disabled={state.field.userId !== null ? false : true}
                                />
                            </div>
                        </div>

                        <div className='w-full mt-3 data-grid-newTheme'>
                            <OrgnizationFacilitygrid
                                dataGridTable={state.getApi.orgFacilityStore}
                                deleteDatagridData={deleteDatagridData}
                                getFun={getFun}
                                dispatch={dispatch}
                                state={state}
                            />
                        </div>


                    </div>
                    <div className='w-2/5 px-3 bg-white rounded-curve py-3 border border-stroke'>
                        <div className='w-full'>
                            <div className='w-full flex gap-4'>
                                <div className='w-full newSelect'>
                                    <ReactSelectBox
                                        value={state.field.userGroup}
                                        options={state.getApi.userGroupData}
                                        onChange={selectSelctionUserGroup}
                                        label="User Group"
                                        isSearchable={true}
                                    />
                                </div>
                                <div className='w-[120px]'>
                                    <ActionButton
                                        buttonText="Add"
                                        handleSubmit={addUserGroupFun}
                                        width="w-full text-white text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                        disabled={state.field.userGroup.label !== 'User Group'&&state.field.userName.label!=='User Name' ? false : true}
                                    />
                                </div>
                            </div>

                            <div className='w-full mt-3'>
                                <Usergroup
                                    state={state}
                                    dispatch={dispatch}
                                    userGroupData={state.getApi.userGroupTable}
                                    deleteUserGroup={deleteUserGroup}
                                    deleteUserGroupfromuser={deleteUserGroupfromuser}
                                />
                            </div>


                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full flex justify-between items-center'>
                <div className=''>
                    {/* User Status: <span className={`${state.field?.status === 'active' ? 'text-green-500' : 'text-red-500'} capitalize`}>{field.status}</span> */}
                </div>
                <div className='flex gap-4'>
                    <ActionButton
                        buttonText={
                            state.loader ?
                                <div className='w-full flex justify-center items-center'>
                                    <div className='innerBtnloader'></div>
                                </div> :
                                <>
                                    {state.field.userId ? "Update" : 'Update'}
                                </>
                        }
                        // handleSubmit={upDateParamerter}
                        width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={state.field.userId ? updateUserFun : saveData}
                        disabled={
                            state.field.userId ? state.field.userName !== '' ? false : true :
                                state.field.empName !== 'Employee Name' &&
                                    state.field.userName.label !== 'User Name' &&
                                    (state.field.userPwd !== '' || state.DefaultPwd.userPwd !== '') &&
                                    (state.field.userCnfPwd !== '' || state.DefaultPwd.userCnfPwd !== '') &&
                                    state.field.userCnfPwd !== '' &&
                                    state.getApi.orgFacilityStore.length > 0 ? false : true
                        }
                    />
                    <ActionButton
                        buttonText="Reset"
                        handleSubmit={allClear}
                        width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>

        </>
    )
}

export default FacilityAssignment
