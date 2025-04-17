"use client"
import React, { useEffect, useState } from 'react'
import RoleConfigurationForm from './_components/RoleConfigurationForm'
import RoleConfigurationGrid from './_components/RoleConfigurationGrid'
import { v4 as uuidv4 } from "uuid";
import { toast } from 'react-toastify';
import services from '@/app/utilities/services';
import { getAllRoleData, getLocations, getRoleDataById, getRoles, getServiceEntitys, roleMasterSideMenu } from '@/app/utilities/api-urls';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { getLocalItem } from '@/app/utilities/local';

const RoleConfiguration = () => {
    const [role, setRole] = useState<any>(
        { label: "Role" }
    )
    const [landingpage, setLandingpage] = useState<any>(
        { label: "Assign default landing page" }
    )
    const [module, setModule] = useState<any>(
        { label: "Module" }
    )
    const [organization, setOrganization] = useState<any>(
        getHeaderResponse().serviceEntityId
            ? {
                label: getHeaderResponse().serviceEntityDesc,
                value: getHeaderResponse().serviceEntityId,
            }
            : { label: "Organization" }
    );
    const [facility, setFacility] = useState<any>(
        { label: "Facility" }
    )
    // const [fields, setFields] = useState({
    //     featuresscreen: {
    //         label: 'Select features screen', uiElementts: [],
    //         moduleCode: "",
    //         screenCode: "",
    //     }
    // }) 
    const [fields, setFields] = useState({
        featuresscreen: null
    })
    const [roleAssignid, setRoleAssignid] = useState<any>(null)
    const [allData, setAllData] = useState<any>([])
    const [gridData, setGridData] = useState<any>([])
    const [gridNewData, setGridNewData] = useState([])
    const [screenNameInfo, setScreenNameInfo] = useState<any>([])
    const [roleData, setRoleData] = useState<any>()
    const [featuresscreenData, setFeaturesscreenData] = useState<any>([])
    const [moduleData, setModuleData] = useState<any>([])
    const [defaultLandingPageData, setDefaultLandingPageData] = useState<any>([])
    const [organizationList, setOrganizationList] = useState<any>([])
    const [facilityList, setFacilityList] = useState<any>([])

    const transformRolePrivilege = (rolePrivilegeArray: any,) => {
        const result = rolePrivilegeArray.reduce((acc: any, privilege: any) => {
            acc[privilege] = 0;
            return acc;
        }, {});
        const finalResult = { ...result };
        return finalResult;
    };
    // Adding new row from grid function
    const handelAddRole = () => {
        let roleData = fields?.featuresscreen ? fields?.featuresscreen : []
        if (!fields.featuresscreen) {
            console.error("featuresscreen is null or undefined");
            return;
        }
        const rolePrivileges = roleData.map((item: any) => {
            // Check if item is not null or undefined
            if (!item) {
                console.error("Item in featuresscreen is null or undefined");
                return null;
            }
            const transformedPrivileges = transformRolePrivilege(item.uiElementts);

            // Define the privilegeObject with index signature
            const privilegeObject: { [key: string]: any } = {
                id: uuidv4(),
                module: item.moduleCode,
                txScreen: item.screenCode,
                statusFlag: item.statusFlag,
                isDefault: 1,
                screenName: item.screenName,
                routingPath: item.routingPath,
            };

            let mainObj = { ...privilegeObject, ...transformedPrivileges }
            return mainObj;
        })

        // Function to remove duplicates gridData
        const removeDuplicates = (dataArray: any) => {
            const seen = new Set();
            return dataArray.filter((item: any) => {
                const screenName = item.screenName;
                if (seen.has(screenName)) {
                    toast.error(`You have entered the same values again, Please be aware....`);
                    return false;
                } else {
                    seen.add(screenName);
                    return true;
                }
            });
        };
        // Function to remove duplicates gridData
        const removeNewItemDuplicates = (dataArray: any) => {
            const seen = new Set();
            return dataArray.filter((item: any) => {
                const screenName = item.screenName;
                if (seen.has(screenName)) {
                    return false;
                } else {
                    seen.add(screenName);
                    return true;
                }
            });
        };

        // Update gridData without duplicates
        const oldData = [...gridData, ...rolePrivileges];
        const finalOldMerge = removeDuplicates(oldData);
        setGridData(finalOldMerge)


        // Update gridNewData without duplicates
        const newData = [...gridNewData, ...rolePrivileges];
        const finalNewMerge = removeNewItemDuplicates(newData);
        setGridNewData(finalNewMerge)
        //removing feilds module and featuresscreen
        setFields({
            featuresscreen: null
        })
    }
    // reset function
    const handelReset = () => {
        setFields({
            featuresscreen: null
        })
        setModule({ label: "Module" })
        setRole({ label: "Role" })
        setLandingpage({ label: "Assign default landing page" })
        // setOrganization({ label: "Organization" })
        setFacility({ label: "Facility" })
        setAllData({})
        setGridData({})
        setGridNewData([])
        setDefaultLandingPageData([])
        setFeaturesscreenData([])
        setRoleAssignid(null)
        let isAdmin = JSON.parse(getLocalItem("loginResponse")!).isSuperAdmin
        if (isAdmin) {
            setOrganization({ label: "Organization" })
        }
    }

    // get all role data from api function
    const getAllRoleDataFun = async () => {
        try {
            const res = await services.get(getAllRoleData)
            // setGridData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    // get data by id function
    const getAllRoleByIdFun = async () => {
        //getRoleDataById
        let roleId = role.id
        let organizationId = organization.id
        let newRoleIdId = facility.id
        try {
            if (roleId && organizationId && newRoleIdId) {
                const res: any = await services.get(`${getRoleDataById}?roleId=${roleId}&serviceEntityId=${organizationId}&locationId=${newRoleIdId}`)
                setLandingpage({ label: res.data[0].defaultScreenName })
                setModule({ label: res.data[0].moduleName })
                roleScreenNameData(res.data[0].moduleName)
                setRoleAssignid(res.data[0].roleAssignId)
                let roleAssignIdInfo = res.data[0].roleAssignId;
                let roleIdInfo = res.data[0].roleId;
                setAllData(res.data)
                let RowIdData = res.data[0].rolePrivileges.length
                if (RowIdData > 0) {
                    let gridInfo = res.data[0].rolePrivileges.map((list: any, inx: number) => ({
                        ...list,
                        id: inx + 1,
                        roleAssignId: roleAssignIdInfo,
                        roleId: roleIdInfo,
                    }))
                    setGridData(gridInfo)
                }

            }
        } catch (error) {
            console.log(error)
            setGridData([])
        }
    }

    //role change Featuresscreen and DefaultLandingPage setting the data
    const roleScreenNameData = (name: any) => {
        let screenInfo = screenNameInfo.filter((list: any) => list.moduleName === name);
        setFeaturesscreenData(screenInfo)
        setDefaultLandingPageData(screenInfo)
    }

    //role data
    const rollMasterData = async () => {
        //roleMaster
        try {
            const res = await services.get(getRoles)
            const result = res.data.map((list: any) => ({
                ...list,
                value: list.id,
                label: list.desc
            }))
            setRoleData(result)
        } catch (error) {
            console.log(error)
        }
    }

    // onchange module Featuresscreen and DefaultLandingPage setting the data
    const handelModule = (moduleInfo: any) => {
        setModule(moduleInfo)
        let screenInfo = screenNameInfo.filter((list: any) => list.moduleCode === moduleInfo.moduleCode);
        setFeaturesscreenData(screenInfo)
        setDefaultLandingPageData(screenInfo)
    }

    // module Name data api function 
    const roleMasterSideMenuData = async () => {
        //roleMaster
        try {
            const res = await services.get(roleMasterSideMenu)
            const moduleNameData = res.data.map((list: any) => ({
                ...list,
                value: list.moduleName,
                label: list.moduleName
            }));
            // Remove duplicates from the moduleNameData Data
            const uniqueArray = Array.from(new Set(moduleNameData.map((item: any) => item.moduleName)))
                .map(moduleName => moduleNameData.find((item: any) => item.moduleName === moduleName));

            const screenName = res.data.map((list: any) => ({
                ...list,
                value: list.screenCode,
                label: list.screenName
            }))

            // setFeaturesscreenData(screenName)
            setModuleData(uniqueArray)
            setScreenNameInfo(screenName)
        } catch (error) {
            console.log(error)
        }
    }
    // get Organization data function
    const getOrganization = async () => {
        try {
            const res = await services.get(getServiceEntitys)
            const finalData = res.data.map((list: any) => ({
                ...list,
                value: list.id,
                label: list.desc
            }))
            // console.log(finalData)
            setOrganizationList(finalData)
        } catch (error) {

        }
    }
    // get Facility data function
    const getFacility = async (id: any) => {
        try {
            const res = await services.get(`${getLocations}/${id}`)
            const finalData = res.data.map((list: any) => ({
                ...list,
                value: list.id,
                label: list.desc
            }))
            // console.log(finalData)
            setFacilityList(finalData)
        } catch (error) {

        }
    }
    const handelOrganization = (data: any) => {
        setOrganization(data)
        getFacility(data.id)
    }

    // console.log(getHeaderResponse())
    useEffect(() => {
        getAllRoleDataFun()
        rollMasterData()
        roleMasterSideMenuData()
        getOrganization()
    }, [])
    useEffect(() => {
        if (getHeaderResponse().serviceEntityId) {
            handelOrganization({
                value: getHeaderResponse().serviceEntityId,
                label: getHeaderResponse().serviceEntityDesc,
                id: getHeaderResponse().serviceEntityId,
            });
        } else {
            setOrganization({ label: "Organization" })
        }
    }, []);
    useEffect(() => {
        getAllRoleByIdFun()
    }, [role.id, organization.id, facility.id])
    return (
        <>
            <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
                <div className="px-4 md:pt-3 pb-2 mx-auto w-full flex justify-between">
                    <div className="font-bold w-full mb-4">
                        <h1 className="w-full flex justify-between">
                            <span>Role Configuration</span>
                        </h1>
                    </div>
                </div>
                <div className='w-full'>
                    <RoleConfigurationForm
                        fields={fields}
                        setFields={setFields}
                        handelAddRole={handelAddRole}
                        handelReset={handelReset}
                        role={role}
                        setRole={setRole}
                        landingpage={landingpage}
                        setLandingpage={setLandingpage}
                        getAllRoleByIdFun={getAllRoleByIdFun}
                        module={module}
                        setModule={setModule}
                        gridNewData={gridNewData}
                        screenNameInfo={screenNameInfo}
                        roleData={roleData}
                        handelModule={handelModule}
                        moduleData={moduleData}
                        defaultLandingPageData={defaultLandingPageData}
                        featuresscreenData={featuresscreenData}
                        allData={allData}
                        organizationList={organizationList}
                        organization={organization}
                        handelOrganization={handelOrganization}
                        facility={facility}
                        setFacility={setFacility}
                        facilityList={facilityList}
                    />
                </div>
                <div className='w-full'>
                    <RoleConfigurationGrid
                        gridData={gridData}
                        setGridData={setGridData}
                        role={role}
                        landingpage={landingpage}
                        gridNewData={gridNewData}
                        handelReset={handelReset}
                        module={module}
                        roleAssignid={roleAssignid}
                        getAllRoleByIdFun={getAllRoleByIdFun}
                        organization={organization}
                        facility={facility}
                    />
                </div>
            </div>
        </>
    )
}

export default RoleConfiguration 