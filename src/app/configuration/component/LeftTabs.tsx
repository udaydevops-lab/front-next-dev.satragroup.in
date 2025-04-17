"use client";
import {
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import React, { useState, useRef, useEffect } from "react";

interface TabsMap {
    data: any[];
    gridCols?: number | any;
}

const LeftTabs: React.FC<TabsMap> = ({ data, gridCols }) => {
    const [tabVal, setTabVal] = useState<any>(
        data[0].mainTabList && data[0].mainTabList.length > 0
            ? data[0].mainTabList[0].value
            : data[0].value
    );

    // Create refs for each panel
    const panelRefs = useRef<any>({});

    // Function to handle smooth scrolling to the selected panel
    const handleTabClick = (value: any, e: React.MouseEvent) => {
        e.preventDefault();
        setTabVal(value);

        // Smooth scroll to the selected panel
        if (panelRefs.current[value]) {
            panelRefs.current[value].scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    let colsPan: number | undefined = gridCols > 0 ? gridCols - 1 : 4;

    return (
        <>
            <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
                <Tabs
                    value={tabVal}
                    orientation="vertical"
                    className={`gap-3 grid grid-cols-${gridCols > 0 ? gridCols : 5
                        } !overflow-visible`}
                >
                    <div className="w-full h-full">
                        <TabsHeader className="text-left cust-tabs w-full">
                            {data.map((list: any) => (
                                <React.Fragment key={list.value || Math.random()}>
                                    {list.mainTabList && list.mainTabList.length > 0 ? (
                                        <>
                                            <h3 className="py-1 mb-3 border-b border-gray-500 text-[15px] font-semibold">
                                                {list.mainTabTitle}
                                            </h3>
                                            {list.mainTabList.map(({ label, value, icon }: any) => (
                                                <Tab
                                                    key={value}
                                                    value={value}
                                                    onClick={(e) => handleTabClick(value, e)}
                                                    className="place-items-start items-start justify-start text-start py-1"
                                                >
                                                    <div className="flex text-left text-sm items-center gap-2 menuiconn capitalize">
                                                        {React.createElement(icon, {
                                                            className: "w-5 h-5",
                                                        })}
                                                        {label}
                                                    </div>
                                                </Tab>
                                            ))}
                                        </>
                                    ) : (
                                        <Tab
                                            key={list.value}
                                            value={list.value}
                                            onClick={(e) => handleTabClick(list.value, e)}
                                            className="place-items-start items-start justify-start text-start py-1"
                                        >
                                            <div className="flex text-left items-start gap-2 menuiconn capitalize">
                                                {React.createElement(list.icon, {
                                                    className: "w-5 h-5",
                                                })}
                                                {list.label}
                                            </div>
                                        </Tab>
                                    )}
                                </React.Fragment>
                            ))}
                        </TabsHeader>
                    </div>
                    <div className={`col-span-${colsPan} w-full`}>
                        <TabsBody className="!overflow-visible w-full">
                            {data.map((list: any) => (
                                <React.Fragment key={list.value || Math.random()}>
                                    {list.mainTabList && list.mainTabList.length > 0 ? (
                                        list.mainTabList.map(({ desc, value }: any) => (
                                            value === tabVal && (
                                                <TabPanel
                                                    key={value}
                                                    value={value}
                                                    className="py-0 px-0 !overflow-visible"
                                                    ref={(el) => (panelRefs.current[value] = el)} // Store ref
                                                >
                                                    <div ref={(el) => (panelRefs.current[value] = el)}>
                                                        {desc}
                                                    </div>
                                                </TabPanel>
                                            )
                                        ))
                                    ) : (
                                        list.value === tabVal && (
                                            <TabPanel
                                                key={list.value}
                                                value={list.value}
                                                className="py-0 px-0 !overflow-visible"
                                                ref={(el) => (panelRefs.current[list.value] = el)} // Store ref
                                            >
                                                <div ref={(el) => (panelRefs.current[list.value] = el)}>
                                                    {list.desc}
                                                </div>
                                            </TabPanel>
                                        )
                                    )}
                                </React.Fragment>
                            ))}
                        </TabsBody>
                    </div>
                </Tabs>
            </div>
        </>
    );
};

export default LeftTabs;
