"use client"
import React, { useEffect, useState } from "react";
import { Input } from "@material-tailwind/react";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";
import services from "../utilities/services";
import { getConfigData } from "../utilities/api-urls";

interface reactInput {
    name: string,
    color?: string,
    label: string,
    value: any,
    onChange: (e: any) => void
    handleData: (e: any) => void
}

const ReactDurationField: React.FC<reactInput> = ({
    name,
    color,
    label,
    value,
    onChange,
    handleData
}) => {
    const [timesData, setTimesData] = useState<any>("Period");
    const [durationList, setDurationList] = useState([]);
    useEffect(() => {
        try {
            services.get(getConfigData + "Duration" + "/0")
                .then((res: any) => {
                    const selTimes = res.data.configData.map((list: any) => {
                        return {
                            ...list,
                            label: list.desc,
                            value: list.desc,
                        };
                    });
                    setDurationList(selTimes);
                })
                .catch((err: any) => {
                    console.log(err)
                })

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    return (
        <div className="relative flex w-full max-w-[24rem]">
            <Input
                crossOrigin={false}
                name={name}
                color={"blue" || color}
                label={label}
                value={value}
                onChange={onChange}
                className=" !rounded-[8px] !rounded-r-none border-top focus:border-t-0"
                containerProps={{
                    className: "!min-w-0 rounded-lg  rounded-r-none !border-r-0",
                }}
            />
            <Menu placement="bottom-start">
                <MenuHandler>
                    <Button
                        ripple={false}
                        variant="text"
                        color="blue"
                        className="flex h-10 items-center gap-2 rounded-l-none 
                                            border border-l-0 border-blue-gray-200
                                             bg-blue-gray-500/10 pl-3 capitalize text-blue-gray-500 text-sm font-normal"
                    >
                        {/* {countryCallingCode} */}
                        {timesData}
                    </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                    {durationList.map((list: any, index: number) => {
                        return (
                            <MenuItem
                                key={index}
                                value={list.value}
                                className="flex items-center gap-2 capitalize"
                                onClick={() => {
                                    setTimesData(list.value);
                                    handleData(list);
                                }}
                            >
                                {list.label}
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </Menu>
        </div>
    )
}

export default ReactDurationField;