"use client"
import React, { useEffect, useState } from 'react'
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import eventBus from "@/app/utilities/eventbus";
import { DASHBOARD_SUMMARY } from "@/app/utilities/constants";
// import Calendar from './calendar'
const DateCalendar = () => {
    const [formattedDate, setFormattedDate] = useState("");
    const [newDate, setNewDate] = useState(false);

    const formatDate = (inputDate: any) => {
        const dateObject = new Date(inputDate);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    };
    const handleLabelClick = () => {
        setNewDate(true);
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
    };
    useEffect(() => {
        eventBus.on(DASHBOARD_SUMMARY, (data) => {
        });
        return () => {
            // Anything in here is fired on component unmount.
            eventBus.remove(DASHBOARD_SUMMARY, () => { });
        }
    }, []);
    return (
        <>
            <div className="min-h-[2em] self-stretch flex items-center">
                <div className="px-4 items-center">
                    <div className="text-sm w-full text-center font-bold" id="dateLval" ></div>
                    <div className="flex-1"></div>
                    <div id="dateLval" className="block text-blueGray-500 text-xl font-bold mt-1 text-center cursor-pointer hover:text-blue-600">
                        {newDate ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <StaticDatePicker
                                    slotProps={{
                                        actionBar: {
                                            actions: ['today', 'accept'],
                                        },
                                    }}
                                    // showToolbar={false}

                                    disableFuture={true}

                                // disablePast={true}
                                />
                            </LocalizationProvider>
                        ) : ''}
                    </div>
                </div>
            </div>
        </>
    )
}

export default DateCalendar
