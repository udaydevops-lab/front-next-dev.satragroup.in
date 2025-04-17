"use client"

import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import VerticalComponent from "./vertical-line";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import eventBus from "@/app/utilities/eventbus";
import { DASHBOARD_SUMMARY } from "@/app/utilities/constants";
import Calendar from './calendar'
import moment from "moment";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";

export default function DashboardSummaryComponent(props: any) {

    const { setSelectHeaderDate, selectHeaderCurrDate, setSelectHeaderCurrDate } = PatientDatadataAuth()

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [myData, setMyData] = useState({
        total: 0,
        consultationcompleted: 0,
        waiting: 0,
    });
    //   const [myData, setMyData] = useState({
    //     // id: 1,
    //     // total: 190,
    //     // consultationcompleted: 100,
    //     // waiting: 70,
    //   });
    const [newDate, setNewDate] = useState(false);
    const [date, setDate] = useState<Date | null>(null);
    const [open, setOpen] = React.useState(true);
    const [additionalDetails, setAdditionalDetails] = useState(false);

    const formatDate = (inputDate: any) => {
        const dateObject = new Date(inputDate);
        const day = dateObject.getDate().toString().padStart(2, "0");
        const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
        const year = dateObject.getFullYear().toString();
        const formattedDate = `${day}/${month}/${year}`;
        return formattedDate;
    };

    const handleDateChange = (event: any) => {
        const inputDate = event.target.value;
        const newFormattedDate = formatDate(inputDate);
        setFormattedDate(newFormattedDate);
        event.preventDefault();
    };

    const handleLabelClick = () => {
        setShowDatePicker(false);
        setNewDate(true);
    };

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${day}/${month}/${year}`;
    };

    const ref = useRef(null);

    // const handleClickOutside = () => {
    //   if (ref.current && !ref.current.contains(event.target)) {
    //     setNewDate(false)
    //   }
    // }
    useEffect(() => {
        eventBus.on(DASHBOARD_SUMMARY, (data) => {
            setMyData(data);
        });
        return () => {
            // Anything in here is fired on component unmount.
            eventBus.remove(DASHBOARD_SUMMARY, () => { });
        }
    }, []);
    useEffect(() => {
        // slotProps={()=>setNewDate(false)}
        // document.addEventListener('click', handleClickOutside, true);
        // return () => {
        //   document.removeEventListener('click', handleClickOutside, true);
        // };
    }, [])



    // {props.getLanData?.topheader && props.getLanData.topheader?.completed}
    return (
        //============================================
        <div className="flex-auto datestyle">
            {/* <label className="block text-blueGray-500 text-xs font-bold mb-2 text-center cursor-pointer hover:text-blue-600">
        Patients
      </label> */}
            {/* <label
        className="block text-blueGray-500 text-xl font-bold mb-2 text-center cursor-pointer hover:text-blue-600"
       // htmlFor="datepicker"
        onClick={handleLabelClick}
        id="dateLval"
      >
        {showDatePicker ? "" : formattedDate || getCurrentDate()}
      </label>
      {newDate ? (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            value={date}
            onChange={(date: Date | null) => setDate(date)} // Change the type of 'newDate' to Date | null
            orientation="landscape"
            onAccept={(date: Date | null) => {
              if (date) {
                setFormattedDate(dayjs(date).format("DD/MM/YYYY"));
                setNewDate(false);
                setShowDatePicker(false);
              }
            }}
            onClose={() => setNewDate(false)}
          />
        </LocalizationProvider>
      ) : null} */}

            <div className="items-center flex cut-border">

                {/* <div className="min-h-[2em] self-stretch flex flex-wrap flex-1 flex-col items-center">
                    <div className="text-tiny">{props.getLanData?.topheader && props.getLanData.topheader?.total}</div>
                    <div className="text-40px text-cyan-400  leading-none font-extralight">
                        {myData.total}
                    </div>
                </div>

                <div className="min-h-[2em] self-stretch flex items-center">
                    <div className="flex flex-wrap items-center">
                        <VerticalComponent />
                    </div>
                </div>

                <div className="min-h-[2em] self-stretch flex flex-wrap flex-1 flex-col items-center">
                    <div className="text-tiny text-center">{props.getLanData?.topheader && props.getLanData.topheader?.completed}</div>
                    <div className="text-40px text-violet-400  leading-none font-extralight">
                        {myData.consultationcompleted}
                    </div>
                </div>

                <div className="min-h-[2em] self-stretch flex items-center">
                    <div className="flex flex-wrap items-center">
                        <VerticalComponent />
                    </div>
                </div>

                <div className="min-h-[2em] self-stretch flex flex-wrap flex-1 flex-col items-center">
                    <div className="text-tiny">{props.getLanData?.topheader && props.getLanData.topheader?.waiting}</div>
                    <div className="text-40px text-red-900  leading-none font-extralight">
                        {myData.waiting}
                    </div>
                </div>
                <div className="min-h-[2em] self-stretch flex items-center">
                    <div className="flex flex-wrap items-center">
                        <VerticalComponent />
                    </div>
                </div> */}

                <div className="min-h-[2em] self-stretch flex items-center">
                    <div className="px-4 items-center">
                        <div className="text-sm w-full text-center font-bold" id="dateLval" > {selectHeaderCurrDate ? <>
                            {selectHeaderCurrDate}
                        </> : formattedDate || getCurrentDate()}</div>
                        <div className="flex-1"></div>
                        <div id="dateLval" className="block text-blueGray-500 text-xl font-bold mt-1 text-center cursor-pointer hover:text-blue-600">
                            <Calendar calanderOpen={handleLabelClick} />
                            {newDate ? (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <StaticDatePicker
                                        slotProps={{
                                            actionBar: {
                                                actions: ['today', 'accept'],
                                            },
                                        }}
                                        // showToolbar={false}
                                        value={date}
                                        onChange={(date: Date | null) => {
                                            setDate(date)
                                            setSelectHeaderDate(date)
                                        }} // Change the type of 'newDate' to Date | null
                                        orientation="landscape"
                                        onAccept={(date: Date | null) => {
                                            if (date) {
                                                setFormattedDate(dayjs(date).format("DD/MM/YYYY"));
                                                setShowDatePicker(false);
                                                setSelectHeaderCurrDate(dayjs(date).format("DD/MM/YYYY"))
                                            }
                                        }}
                                        onClose={() => setNewDate(false)}
                                        disableFuture={true}

                                    // disablePast={true}
                                    />
                                </LocalizationProvider>
                            ) : ''}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
