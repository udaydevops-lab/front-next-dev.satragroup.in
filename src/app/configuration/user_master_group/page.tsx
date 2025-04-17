"use client"
import React, { FC, useEffect, useReducer } from 'react'
import { MasterHeading } from '../_components'
import { AllValuesgive, initialState } from './_components/AllValuesgive'
import { AssignUserFrom, RoleAssignGridtable, UserGroupRoleAssignForm } from './_components'
import { ApiRequestMethod } from '@/app/_commonfeatures/ApiRequestFun'
import { getAllUsers, getServiceEntity, getRoles, userMastergroupAllDataapie, getReasonForBlock, userMastergroupDatagetByIDapie, getUserByIdapiData } from '@/app/utilities/api-urls'
import AssignUserAddGrid from './_components/AssignUserAddGrid'
import AllSavedGetUsersgrid from './_components/AllSavedGetUsersgrid'
import services from '@/app/utilities/services'
import { getHeaderResponse } from '@/app/_commonfeatures/header'


const UserMasterGroupPage = (props: any) => {

    const [state, disptach] = useReducer(AllValuesgive, initialState)

    const changeLabelVal = (list: any, key: string) => {
        const data: any = list.data ? list.data : list
        const result = data.map((list: any) => (
            {
                ...list,
                label: list[key],
                value: list[key]
            }
        ))
        return result
    }


    const getApiSelectSection = async (url: any, key: string, labelkey: string) => {
        const response: any = await ApiRequestMethod({ method: 'GET', url: url })
        const result: any = response?.data?.data?.configData ? response?.data?.data?.configData : response.data ? changeLabelVal(response.data, labelkey) : []
        disptach({
            type: 'getAllApi',
            payload: {
                [`${key}`]: result
            }
        })
    }

    // get all saved user group master
    const getuserGroupData = async () => {
        // const response: any = await ApiRequestMethod({ method: "GET", url: userMastergroupAllDataapie })
         services.get(userMastergroupAllDataapie).then((response)=>{
            disptach({
                type: "getAllApi",
                payload: {
                    userMastergroupData: response.data
                }
            })
         })
        // if (response.success) {
        //     disptach({
        //         type: "getAllApi",
        //         payload: {
        //             userMastergroupData: response?.data?.data
        //         }
        //     })

        // }
        // else {
        //     toast.error(`${response?.error?.message ? response?.error?.message : 'Something went wrong'}`)
        // }
    }


    const editUserdata = async (groupId: any) => {
        let mainUrl: any = userMastergroupDatagetByIDapie + groupId

        const response: any = await ApiRequestMethod({ method: "GET", url: mainUrl })
        const results: any = { ...response?.data?.data }
        // console.log(results)
        const mergedArray: any = results.userGroupAssignSet.map((group: any) => {
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
                isNew:0,
            };
        });
        if (response.success) {
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

    const getuserDetailsbyId = async (userId: any) => {
        // getUserByIdapiData
        const response: any = await ApiRequestMethod({ method: "GET", url: getUserByIdapiData + userId })
        // console.log('userDetails', response.data.data)
        disptach({
            type: "fieldVal",
            payload: {
                empDetails: response.data.data.map((list: any) => ({
                    userName: list.userName,
                    empName: list.fullName,
                    empCode: list.employeCode,
                    empDepartment: list.departmentDescription,
                    empProfiletype: list.employeType,
                    empId: list.empId,
                    userId: list.userId,
                    isGroupPrimary: 1,
                    statusFlag: list.statusFlag ? list.statusFlag : 1
                }))
            }
        })
    }

    const handeleGoToRole = (value: any, e: any) => {
        props.handleTabClick(value, e)
    }
    useEffect(() => {
        getuserGroupData();
        let getResonlistApi: any = getReasonForBlock + 0;
        getApiSelectSection(getRoles, 'role', 'desc')
        getApiSelectSection(getServiceEntity, 'organizationselect', 'desc')
        getApiSelectSection(getResonlistApi, 'reasonList', 'label')
        getApiSelectSection(getAllUsers, 'getAllsaveusers', 'userName')

        return () => {
            getuserGroupData();
            getApiSelectSection(getRoles, 'role', 'desc')
            getApiSelectSection(getServiceEntity, 'organizationselect', 'desc')
            getApiSelectSection(getResonlistApi, 'reasonList', 'label')
            getApiSelectSection(getAllUsers, 'getAllsaveusers', 'userName')
        }
    }, [])

    //console.log(state)
    return (
        <>
            <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
                <MasterHeading
                    heading={'User Group Master'}
                />

                {/* User group section start from here */}
                <UserGroupRoleAssignForm
                    state={state}
                    disptach={disptach}
                    handeleGoToRole={handeleGoToRole}
                />

                <RoleAssignGridtable
                    state={state}
                    dispatch={disptach}

                />

                {/* Assign Users Section Start from here*/}
                <AssignUserFrom
                    state={state}
                    dispatch={disptach}
                    getuserDetailsbyId={getuserDetailsbyId}
                />

                <AssignUserAddGrid
                    state={state}
                    dispatch={disptach}
                    getuserGroupData={getuserGroupData}
                    editUserdata={editUserdata}

                />

            </div>

            <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke mt-4">
                <MasterHeading
                    heading={'User Group Master Worklist'}
                />
                {/* User Saved Grid List */}
                <AllSavedGetUsersgrid
                    state={state}
                    disptach={disptach}
                    getuserGroupData={getuserGroupData}
                    getuserDetailsbyId={getuserDetailsbyId}
                />
            </div>
        </>
    )
}



export default UserMasterGroupPage
