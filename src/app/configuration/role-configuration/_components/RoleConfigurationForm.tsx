"use client"
import ActionButton from '@/app/_common/button'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { getHeaderResponse } from '@/app/_commonfeatures/header'
import React, { Dispatch, SetStateAction } from 'react'
interface RoleConfigurationFormprops {
    getAllRoleByIdFun: any,
    fields: any,
    setFields: any,
    handelAddRole: any,
    handelReset: any,
    role: any,
    setRole: Dispatch<SetStateAction<any>>
    landingpage: any,
    setLandingpage: Dispatch<SetStateAction<any>>
    gridNewData: any,
    module: any,
    screenNameInfo: any,
    setModule: Dispatch<SetStateAction<any>>,
    roleData: any,
    handelModule: any,
    moduleData: any,
    defaultLandingPageData: any,
    featuresscreenData: any,
    allData: any,
    organizationList: any,
    organization: any,
    handelOrganization: any,
    facilityList: any,
    facility: any, setFacility: any,
}
const RoleConfigurationForm: React.FC<RoleConfigurationFormprops> = ({ fields, setFields, handelAddRole, handelReset, role, setRole, landingpage, setLandingpage, getAllRoleByIdFun, module, setModule, gridNewData, screenNameInfo, roleData, handelModule, moduleData, defaultLandingPageData, featuresscreenData, allData, organizationList, organization, handelOrganization, facility, setFacility, facilityList }) => {

    const handelAddRoleFun = (row: any) => {
        setRole(row)
        setModule({ label: "Module" })
        setLandingpage({ label: "Assign default landing page" })
        // getAllRoleByIdFun(row)
        setFields({
            featuresscreen: null
        })
    }

    return (
        <>
            <div className='grid grid-cols-3 gap-4'>
                <div className='w-full'>
                    <ReactSelectBox
                        label='Role'
                        value={role}
                        options={roleData}
                        onChange={(e) => handelAddRoleFun(e)}
                        isSearchable={true}
                        isDisabled={allData[0]?.roleAssignId ? true : false}
                    />
                </div>
                <div className='w-full'>
                    <ReactSelectBox
                        label='Organization'
                        value={organization}
                        options={organizationList}
                        onChange={(e) => handelOrganization(e)}
                        isSearchable={true}
                        
                        isDisabled={allData[0]?.roleAssignId || getHeaderResponse().serviceEntityId}
                    />
                </div>
                <div className='w-full'>
                    <ReactSelectBox
                        label='Facility'
                        value={facility}
                        options={facilityList}
                        onChange={(e) => setFacility(e)}
                        isSearchable={true}
                        isDisabled={allData[0]?.roleAssignId ? true : false}
                    />
                </div>
                <div className='w-full'>
                    <ReactSelectBox
                        label='Module'
                        value={module}
                        options={moduleData}
                        //onChange={(e) => setModule(e)}
                        onChange={(e) => handelModule(e)}
                        isSearchable={true}
                        isDisabled={allData[0]?.roleAssignId ? true : false}
                    />
                </div>
                <div className='w-full'>
                    <ReactSelectBox
                        label='Assign default landing page'
                        value={landingpage}
                        options={defaultLandingPageData}
                        onChange={(e) => setLandingpage(e)}
                        isSearchable={true}
                        isDisabled={allData[0]?.roleAssignId ? true : false}
                    />
                </div>

                <div className='w-full'>
                    <ReactSelectBox
                        label='Select features screen'
                        value={fields.featuresscreen}
                        options={featuresscreenData}
                        onChange={(e) => setFields({ ...fields, "featuresscreen": e })}
                        isSearchable={true}
                        isMultiple={true}
                    />
                </div>
            </div>
            <div className='w-full py-5 flex gap-4 justify-end'
            >
                <ActionButton
                    buttonText="Add"
                    width="w-[120px] text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelAddRole}
                    disabled={
                        role?.label !== 'Role' &&
                            landingpage?.label !== 'Assign default landing page' &&
                            module?.label !== 'Module' && organization.label!="Organization"&&facility.label!== 'Facility'&&
                            fields?.featuresscreen !== null ? false : true
                    }
                //disabled={false}
                //   disabled={gridNewData.length > 0 ? false : true}
                />
                {/* <ActionButton
                    buttonText="Reset"
                    width="w-[120px] text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handelReset}
                /> */}
            </div>

        </>
    )
}

export default RoleConfigurationForm