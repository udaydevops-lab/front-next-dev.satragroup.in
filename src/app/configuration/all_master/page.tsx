"use client";
import React, { useState, useEffect } from "react";
import ComplintIcon from "../../../../public/icons/opAssessment/complint";
import ParameterMaster from "../parametermaster/page";
import LaboratoryMaster from "../laboratorymaster/page";
import RadiologoyMaster from "../radiologymaster/page";
import ProceduresMasterPage from "../proceduresmaster/page";
import AssignServiceEntityLocation from "../assign_service_entity_location/page";
import Location from "../location/page";
import ServiceEntity from "../service-entity/page";
import Department from "../department/page";
import Speciality from "../speciality/page";
import EmpMasterCreation from "../emp-master-creation/page";
import NewUserCreationPage from "../new_user/page";
import UserMasterGroupPage from "../user_master_group/page";
import BlockComponent from "../block_user/page";
import Role from "../role/page";
import RoleConfiguration from "../role-configuration/page";
import Report from "@/app/report/page";
import Reports from "@/app/reports/page";
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";
import ServicemasterList from "../service-master-list/page";
import { getLocalItem } from "@/app/utilities/local";
import ConfigurationMaster from "../configuration_master/page";

const CpoeMasterPage = () => {
    const [empData, setEmpData] = useState<any>(null);
    const [tabVal, setTabVal] = useState("serviceCreation");
    const [key, setKey] = useState(0);
    const [username, setUserName] = useState<any>("");
    //  const username = "satraadmin"; 

    // Function to handle tab click 
    const handleTabClick = (value: string, e?: React.MouseEvent) => {
        e ? e.preventDefault() : ""
        setTabVal(value);
        setKey(Math.random());
        // Scroll to top code
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        if (value !== "user_master") {
            setEmpData(null);
        }
    };

    const AllPageTabs = [
        {
            mainTabTitle: "Services Master Creation",
            mainTabList: [
                {
                    label: "Service Master",
                    value: "serviceCreation",
                    icon: ComplintIcon,
                    desc: <ServicemasterList />,
                },
                {
                    label: "Configuration Master",
                    value: "configurationMaster",
                    icon: ComplintIcon,
                    desc: <ConfigurationMaster />,
                },
            ],
        },
        {
            mainTabTitle: "Service Entity Master Creation",
            mainTabList: [
                {
                    label: "Service Entity",
                    value: "service_entity",
                    icon: ComplintIcon,
                    desc: <ServiceEntity />,
                },
                {
                    label: "Location",
                    value: "location",
                    icon: ComplintIcon,
                    desc: <Location />,
                },
                // {
                //     label: "Assign Service Entity Location",
                //     value: "service_location",
                //     icon: ComplintIcon,
                //     desc: <AssignServiceEntityLocation handleTabClick={handleTabClick} />,
                // },
                {
                    label: "Department",
                    value: "department",
                    icon: ComplintIcon,
                    desc: <Department />,
                },
                {
                    label: "Speciality",
                    value: "speciality",
                    icon: ComplintIcon,
                    desc: <Speciality />,
                },
            ].filter(
                (tab) =>
                    !(username !== "satraadmin" && ["service_entity"].includes(tab.value))
            ),
        },
        {
            mainTabTitle: "User Master Creation",
            mainTabList: [
                {
                    label: "Role",
                    value: "role",
                    icon: ComplintIcon,
                    desc: <Role />,
                },
                {
                    label: "Role Configuration",
                    value: "role-configuration",
                    icon: ComplintIcon,
                    desc: <RoleConfiguration />,
                },
                {
                    label: "User Group Master",
                    value: "user_master_group",
                    icon: ComplintIcon,
                    desc: <UserMasterGroupPage handleTabClick={handleTabClick} />,
                },
                {
                    label: "Employee Creation",
                    value: "create_employee",
                    icon: ComplintIcon,
                    desc: <EmpMasterCreation handleTabClick={handleTabClick} setEmpData={setEmpData} />,
                },
                {
                    label: "User Master",
                    value: "user_master",
                    icon: ComplintIcon,
                    desc: <NewUserCreationPage empData={empData} />,
                },
                {
                    label: "Block/UnBlock User",
                    value: "block_user",
                    icon: ComplintIcon,
                    desc: <BlockComponent />,
                },
            ],
        },
        {
            mainTabTitle: "Report",
            mainTabList: [
                {
                    label: "Upload Report",
                    value: "uploadReport",
                    icon: ComplintIcon,
                    desc: <Report />,
                },
                {
                    label: "View Reports",
                    value: "viewReport",
                    icon: ComplintIcon,
                    desc: <Reports />,
                },
            ],
        },
    ];

    useEffect(() => {
        if (JSON.parse(getLocalItem("loginResponse")!)?.username) {
            setUserName(JSON.parse(getLocalItem("loginResponse")!)?.username?.toLowerCase())
        }
    }, [])
    return (
        <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke" key={key}>
            <Tabs value={tabVal} orientation="vertical" className="gap-3 grid grid-cols-5 !overflow-visible">
                <div className="w-full h-full">
                    <TabsHeader className="text-left cust-tabs w-full">
                        {AllPageTabs.map((list) => (
                            <React.Fragment key={list.mainTabTitle}>
                                <h3 className="py-1 mb-3 border-b border-gray-500 text-[15px] font-semibold">
                                    {list.mainTabTitle}
                                </h3>
                                {list.mainTabList.map(({ label, value, icon }) => (
                                    <Tab
                                        key={value}
                                        value={value}
                                        onClick={(e) => handleTabClick(value, e)}
                                        className={`place-items-start items-start justify-start text-start py-1 ${tabVal === value ? "active-tab" : ""
                                            }`}
                                    >
                                        <div className="flex text-left text-sm items-center gap-2 menuiconn capitalize">
                                            {React.createElement(icon, { className: "w-5 h-5" })}
                                            {label}
                                        </div>
                                    </Tab>
                                ))}
                            </React.Fragment>
                        ))}
                    </TabsHeader>
                </div>
                <div className="col-span-4 w-full">
                    <TabsBody className="!overflow-visible w-full">
                        {AllPageTabs.map((list) => (
                            <React.Fragment key={list.mainTabTitle}>
                                {list.mainTabList.map(({ desc, value }) =>
                                    value === tabVal ? (
                                        <TabPanel
                                            key={value}
                                            value={value}
                                            className="py-0 px-0 !overflow-visible transition-all duration-500 ease-in-out opacity-100"
                                        >
                                            {desc}
                                        </TabPanel>
                                    ) : null
                                )}
                            </React.Fragment>
                        ))}
                    </TabsBody>
                </div>
            </Tabs>
        </div>
    );
};

export default CpoeMasterPage;
