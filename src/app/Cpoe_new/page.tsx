"use client";
import {
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { AllTabs } from "./components";
import roleInfoScreenData from "../_commonfeatures/ScreenDataHoc";
import NoScreenData from "../_common/NoScreenData";


function CpoeNew(props: any) {
    const [tabType, setTabType] = useState<string>("Laboratory")
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <Tabs value="1" className="!overflow-visible mostly-customized-scrollbar">
            <TabsHeader>
                <Tab value={"1"} onClick={() => setTabType('Laboratory')}>Laboratory</Tab>
                <Tab value={"2"} onClick={() => setTabType('Radiology')}>Radiology</Tab>
                <Tab value={"3"} onClick={() => setTabType('Procedures')}>Procedures</Tab>
            </TabsHeader>
            <div className="bg-white rounded-curve rounded-curve mx-auto w-full border border-stroke mt-3">
                <TabsBody className="!overflow-visible">
                    <TabPanel value={"1"} className="!overflow-visible !p-3">
                        <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                            <AllTabs
                                tabType={tabType}
                                key={Math.random()}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value={"2"} className="!overflow-visible !p-3">
                        <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                            <AllTabs
                                tabType={tabType}
                                key={Math.random()}
                            />
                        </div>
                    </TabPanel>

                    <TabPanel value={"3"} className="!overflow-visible !p-3">
                        <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                            <AllTabs
                                tabType={tabType}
                                key={Math.random()}
                            />
                        </div>
                    </TabPanel>

                </TabsBody>
            </div>
        </Tabs>
    );
}


export default roleInfoScreenData(CpoeNew, "CPOE")