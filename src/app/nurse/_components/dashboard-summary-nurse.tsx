import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import VerticalComponent from "../../frontdesk/dashboard/_components/vertical-line";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import eventBus from "@/app/utilities/eventbus";
import { DASHBOARD_SUMMARY } from "@/app/utilities/constants";

export default function DashboardSummaryNurseComponent(props: any) {
  const [myData, setMyData] = useState({
    total: 0,
    consultationcompleted: 0,
    waiting: 0,
  });

  useEffect(() => {
    eventBus.on(DASHBOARD_SUMMARY, (data) => {
      setMyData(data);
    });
    return () => {
      // Anything in here is fired on component unmount.
      eventBus.remove(DASHBOARD_SUMMARY, () => { });
    };
  }, []);
  return (
    <div className="flex-auto datestyle">
      {/* <label className="block text-blueGray-500 text-xs font-bold mb-2 text-center cursor-pointer hover:text-blue-600">
        Consultation
      </label> */}

      <div className="items-center flex cut-border">
        <div className="min-h-[2em] self-stretch flex flex-wrap flex-1 flex-col items-center">
          <div className="text-tiny">{props.getLanData?.topheader && props.getLanData.topheader?.total}</div>
          <div className="flex-1"></div>
          <div className="text-40px text-cyan-400  leading-none font-extralight mb-1">
            {myData.total}
          </div>
        </div>

        <div className="min-h-[2em] self-stretch flex items-center">
          <div className="flex flex-wrap items-center">
            <VerticalComponent />
          </div>
        </div>

        <div className="min-h-[2em] self-stretch flex flex-wrap flex-1 flex-col items-center">
          <div className="text-tiny">{props.getLanData?.topheader && props.getLanData.topheader?.waiting}</div>
          <div className="flex-1"></div>
          <div className="text-40px text-red-900  leading-none font-extralight mb-1">
            {myData.waiting}
          </div>
        </div>
      </div>
    </div>
  );
}
