"use client"
import React, { FC, useState } from 'react'
import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { Labheader } from '../lab/_component';


interface ReactTabsDataprops {
    reactData: { label: string, value: string, desc: string, icon: string }[],
    tabTitle?: string,
    orientation?: string
}

const ReactTabs: FC<ReactTabsDataprops> = ({
    reactData,
    tabTitle,
    orientation
}) => {

    const [tabVal, setTabVal] = useState<any>(reactData[0].value)

    return (
        <>
            <Tabs value={`${reactData[0].value}`} className='w-full bg-white p-3 rounded-[14px] flex gap-2 reactTabs'>

                <div className='w-1/4'>
                    <h2 className='text-[18px] font-bold text-[#707070]'>{tabTitle}</h2>
                    <TabsHeader className="text-left cust-tabs w-full">
                        {reactData.map(({ label, value, icon }) => (
                            <Tab
                                className="place-items-start flex items-start justify-start text-start py-2"
                                key={value}
                                value={value}
                                onClick={() => setTabVal(value)}
                            >
                                <i className='w-[30px] me-3 h-[30px] iconTab bg-[#2196F3] rounded-full p-2 justify-center flex items-center'>{icon}</i>  {label}
                            </Tab>
                        ))}
                    </TabsHeader>
                </div>
                <div className='w-3/4'>
                    <div className='w-full h-full bg-[#F2F9FF] rounded-[15px] shadow-[0_3px_6px_#00000029]  p-4'>
                        <TabsBody className="text-left cust-tabs w-full !overflow-visible">
                            {reactData.map(({ value, desc, label }) => (
                                value === tabVal &&

                                <>
                                    {/* <div className='w-full mb-2'>
                                        <h2 className='text-[18px] font-bold text-[#707070]'>{label}</h2>
                                    </div> */}
                                    <div className='w-full'>
                                        <TabPanel
                                            key={value}
                                            value={value}
                                            className={`${value === tabVal ? " !block" : "!hidden"} py-0 px-0 !overflow-visible`}
                                        >
                                            {desc}
                                        </TabPanel>
                                    </div>

                                </>

                            ))}
                        </TabsBody>
                    </div>
                </div>
            </Tabs>

        </>
    )
}

export default ReactTabs
