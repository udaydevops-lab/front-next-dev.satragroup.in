import {
    Input,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
} from "@material-tailwind/react";

import React, { useState } from 'react'

const InputSelect = () => {
    const [calday, setCalday] = useState([
        { id: 1, days: 'Days' },
        { id: 2, days: 'Weeks' },
    ])
    return (
        <>
            <div className="relative flex w-full max-w-[24rem]">

                <Input
                    crossOrigin={true}
                    type="tel"
                    placeholder="Mobile Number"
                    className="rounded-l-none !border-t-blue-gray-200 focus:!border-t-gray-900"
                    labelProps={{
                        className: "before:content-none after:content-none",
                    }}
                    containerProps={{
                        className: "min-w-0",
                    }}
                />
                <Menu placement="bottom-start">
                    <MenuHandler>
                        <Button
                            ripple={false}
                            variant="text"
                            color="blue-gray"
                            className="flex h-10 items-center gap-2 rounded-r-none border border-r-0 border-blue-gray-200 bg-blue-gray-500/10 pl-3"
                        >

                            {/* {countryCallingCode} */}
                        </Button>
                    </MenuHandler>
                    <MenuList className="max-h-[20rem] max-w-[18rem]">
                        {calday.map((days) => {
                            return (
                                <>
                                    {days.days}
                                </>
                            );
                        })}
                    </MenuList>
                </Menu>
            </div>
        </>
    )
}

export default InputSelect
