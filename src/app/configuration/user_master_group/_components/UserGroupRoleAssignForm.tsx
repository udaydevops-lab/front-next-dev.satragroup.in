import FormPropsTextFields from '@/app/_common/input'
import React, { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo } from 'react'
import { MasterHeading } from '../../_components'
import { ReactSelectBox } from '@/app/_commonfeatures'
import moment from 'moment'
import DateInput from '@/app/_common/date-input'
import ActionButton from '@/app/_common/button'
import { toast } from 'react-toastify'
import services from '@/app/utilities/services'
import { getLocationDropDown, getRoleDataById } from '@/app/utilities/api-urls'
import { getHeaderResponse } from '@/app/_commonfeatures/header'

const UserGroupRoleAssignForm: React.FC<any> = (props) => {
    const { state, disptach } = props;

    const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
        disptach({
            type: 'fieldVal',
            payload: {
                [e.target.name]: e.target.value
            }
        })
    }

    const onselectDatafromData = (data: any, key: string) => {
        if (key === 'userGroupRoleOrg') {
            services.get(getLocationDropDown + data.id).then((response) => {
                //  console.log('res')
                disptach({
                    type: "getAllApi",
                    payload: {
                        facilityselect: response.data.map((list: any) => ({ ...list, label: list.desc, value: list.id }))
                    }
                })
            });
        }
        disptach({
            type: "fieldVal",
            payload: {
                [`${key}`]: { ...data }
            }

        })
        // if (key === "empRole") {
        //     handelRoleConfiguration(data)
        // }
    }

useEffect(() => {
    if(getHeaderResponse().serviceEntityId){
        onselectDatafromData({
            label: getHeaderResponse().serviceEntityDesc,
            value: getHeaderResponse().serviceEntityDesc,
            id: getHeaderResponse().serviceEntityId,
          },'userGroupRoleOrg')
    }else{
        disptach({
            type: "fieldVal",
            payload: {
                userGroupRoleOrg: {
                    label: "Organization"
                },
            }

        })
    }
},[])
    const handleAdd = () => {
        const isDuplicateUser = state.userGroupRoleAssignmentTable.some(
            (user: any) => user.roleDesc === state.field.empRole.label &&
                user.serviceEntityDesc === state.field.userGroupRoleOrg.label &&
                user.locationDesc === state.field.userGroupRoleFacility.label
        );

        if (isDuplicateUser) {
            return toast.error("You have entered same value again..");
        }

        disptach({
            type: 'userGroupRoleAssignmentStore',
            payload: {
                userGroupRoleAssignmentTable: Array.isArray(state.userGroupRoleAssignmentTable)
                    ?
                    [
                        ...state.userGroupRoleAssignmentTable,
                        {
                            sn: Math.random(),
                            roleGroupId: Date.now(),
                            empRole: state.field.empRole.label,
                            roleId: state.field.empRole.id,
                            roleDesc: state.field.empRole.label,
                            serviceEntityDesc: state.field.userGroupRoleOrg.label,
                            serviceEntityId: state.field.userGroupRoleOrg.id,
                            locationDesc: state.field.userGroupRoleFacility.label,
                            locationId: state.field.userGroupRoleFacility.id,
                            activeFromDate: moment(state.field.activeFromDate).format('YYYY-MM-DD'),
                            statusFlag: 1,
                            isRolePrimary: state.userGroupRoleAssignmentTable.length == 0 ? 1 : 0
                        }
                    ]
                    :
                    [
                        {
                            sn: Math.random(),
                            roleId: state.field.empRole.id,
                            roleDesc: state.field.empRole.label,
                            empRole: state.field.empRole.label,
                            serviceEntityDesc: state.field.userGroupRoleOrg.label,
                            serviceEntityId: state.field.userGroupRoleOrg.id,
                            locationDesc: state.field.userGroupRoleFacility.label,
                            locationId: state.field.userGroupRoleFacility.id,
                            activeFromDate: moment(state.field.activeFromDate).format('YYYY-MM-DD'),
                            statusFlag: 1,
                            isRolePrimary: state.userGroupRoleAssignmentTable.length == 0 ? 1 : 0
                        }
                    ]
            }

        })
        if(getHeaderResponse().isSuperAdmin){
            disptach({
                type: 'fieldVal',
                payload: {
                    empRole: {
                        label: "Role"
                    },
                    userGroupRoleOrg: {
                        label: "Organization"
                    },
                    userGroupRoleFacility: {
                        label: "Facility"
                    }
                }
            })
        }else{
            disptach({
                type: 'fieldVal',
                payload: {
                    empRole: {
                        label: "Role"
                    },
                    // userGroupRoleOrg: {
                    //     label: "Organization"
                    // },
                    userGroupRoleFacility: {
                        label: "Facility"
                    }
                }
            })
        }
       
    }
    const AddMultiplerole = async() => {
        // if(getHeaderResponse().isSuperAdmin){
        //     handleAdd()
        // }else{
            await services.get(
                `${getRoleDataById}?roleId=${
                  state.field.empRole.id
                }&serviceEntityId=${state.field.userGroupRoleOrg.id}&locationId=${
                  state.field.userGroupRoleFacility.value
                }`
              ).then((response)=>{
                  if (response.data.length===0) {
                      toast.error("There is no role configuration available for this role. Please contact the administrator.")
                      return;
                  }else{
                      handleAdd()
                  }
              }).catch((error) => {
                  if (error.response.data=='No Data Found') {
                      toast.error("There is no role configuration available for this role. Please contact the administrator.")
                      return;
                  }
              });
        // }

        // console.log(state.field.roleConfiguration)
        // Check if the user already exists in addUserdatatable
        // if (state.field.roleConfiguration.length === 0) {
        //     toast.error("There is no role configuration available for this role. Please contact the administrator.")
        //     return;
        // }
    } 
    const handelRoleConfiguration = async (roleInfo: any) => {
        try {
            const res = await services.get(`${getRoleDataById}${roleInfo?.id}`)
            disptach({
                type: "fieldVal",
                payload: {
                    roleConfiguration: res.data
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className='w-full flex gap-4' id="sectionRef">
                <div className='w-3/4'>
                    <FormPropsTextFields
                        label={`User Group Name`}
                        name="usergroupName"
                        value={state.field.usergroupName}
                        containerProps={{
                            className: "!min-w-0",
                        }}
                        handleChange={inputHandler}
                    />
                </div>
                <div className='w-1/4'>
                    <FormPropsTextFields
                        label={`User Group Code`}
                        name="usergroupCode"
                        value={state.field.usergroupCode}
                        containerProps={{
                            className: "!min-w-0",
                        }}
                        handleChange={inputHandler}
                    />
                </div>
            </div>

            <div className='w-full border-t border-gray-300 mt-3'></div>

            <div className='mt-3'>
                <MasterHeading
                    heading='Role Assignment'
                />
            </div>

            <div className='w-full flex gap-4 mb-5'>
                <div className='w-3/4'>
                    <div className='w-full flex gap-4'>
                        <div className="w-1/4">
                            <ReactSelectBox
                                value={state.field.empRole}
                                options={state.getApi.role}
                                onChange={(data: any) => onselectDatafromData(data, 'empRole')}
                                label="Role"
                                isSearchable={true}
                            />
                        </div>
                        <div className="w-1/4">
                            <ReactSelectBox
                                value={state.field.userGroupRoleOrg}
                                options={state.getApi.organizationselect}
                                onChange={(data: any) => onselectDatafromData(data, 'userGroupRoleOrg')}
                                label="Organization"
                                isSearchable={true}
                                isDisabled={!getHeaderResponse().isSuperAdmin}
                            />
                        </div>
                        <div className="w-1/4">
                            <ReactSelectBox
                                value={state.field.userGroupRoleFacility}
                                options={state.getApi.facilityselect}
                                onChange={(data: any) => onselectDatafromData(data, 'userGroupRoleFacility')}
                                label="Facility"
                                isSearchable={true}
                            />
                        </div>
                        <div className="w-1/4">
                            <DateInput
                                disableFuture={false}
                                label="Active From Date"
                                value={moment(state.field.activeFromDate)}
                                onChange={(e: any) =>
                                    disptach({
                                        type: 'fieldVal',
                                        payload: {
                                            activeFromDate: moment(e).format("YYYY-MM-DD")
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>

                <div className="w-1/4 flex gap-2">
                    <ActionButton
                        buttonText="Add Role"
                        handleSubmit={AddMultiplerole}
                        width="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        disabled={
                            state.field.empRole?.label !== 'Role' &&
                                state.field.userGroupRoleOrg?.label !== 'Organization' &&
                                state.field.userGroupRoleFacility?.label !== 'Facility' ?
                                false : true
                        }
                    />
                    {/* <button
                        className="w-[120px] text-white text-[14px] py-2 h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9] font-semibold rounded-md"
                        onClick={(e) => props.handeleGoToRole("role", e)}
                    >Create Role</button> */}
                </div>

            </div>
        </>
    )
}

export default UserGroupRoleAssignForm
