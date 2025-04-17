"use client";
import {
    Tab,
    TabPanel,
    Tabs,
    TabsBody,
    TabsHeader,
} from "@material-tailwind/react";
import React, { useEffect, useState } from "react";

import { AllTabs } from "./component";

export default function Cpoe() {
    const [tabType, setTabType] = useState<string>("Laboratory");
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
                        <AllTabs
                            tabType={tabType}
                            key={Math.random()}
                        />
                    </TabPanel>

                    <TabPanel value={"2"} className="!overflow-visible !p-3">
                        <AllTabs
                            tabType={tabType}
                            key={Math.random()}
                        />
                    </TabPanel>

                    <TabPanel value={"3"} className="!overflow-visible !p-3">
                        <AllTabs
                            tabType={tabType}
                            key={Math.random()}
                        />
                    </TabPanel>

                </TabsBody>
            </div>
        </Tabs>
    );
}
