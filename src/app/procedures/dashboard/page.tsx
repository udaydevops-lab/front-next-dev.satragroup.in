"use client";
import {
  PROCEDURES_DASHBOARD_DEPARTMENT,
  PROCEDURES_DASHBOARD_SUMMARY,
} from "@/app/utilities/constants";
import eventBus from "@/app/utilities/eventbus";
import React, { useEffect, useState } from "react";
import ProceduresDashboard from "./_components/ProceduresDashboard";
import NoScreenData from "@/app/_common/NoScreenData";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import services from "@/app/utilities/services";
import { proceduresDashboard } from "@/app/utilities/api-urls";

const Dashboard = (props: any) => {
  const [dashboardSummary, setDashboardSummary] = useState<any>({});
  const [dashboardBarData, setDashboardBarData] = useState<any>([]);
  useEffect(() => {
    eventBus.on(PROCEDURES_DASHBOARD_SUMMARY, (data) => {
      setDashboardSummary(data?.proceduresDashBoardCount);
    });
    eventBus.on(PROCEDURES_DASHBOARD_DEPARTMENT, (data) => {
      setDashboardBarData(data);
    });
    return () => {
      // Anything in here is fired on component unmount.
      eventBus.remove(PROCEDURES_DASHBOARD_SUMMARY, () => { });
      eventBus.remove(PROCEDURES_DASHBOARD_DEPARTMENT, () => { });
    };
  }, []);
      useEffect(()=>{
        services.get(proceduresDashboard).then((response)=>{
          eventBus.dispatch(PROCEDURES_DASHBOARD_SUMMARY, response.data);
          eventBus.dispatch(PROCEDURES_DASHBOARD_DEPARTMENT, response.data.proceduresDeptCountMap);
        }).catch((err)=>{
          console.log(err)
        })
      },[])
        
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <div className="min-h-full">
        <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative">
          <div className="min-h-full rounded-curve border border-stroke bg-white p-2 mb-3">
            <ProceduresDashboard
              dashboardSummary={dashboardSummary}
              dashboardBarData={dashboardBarData}
              appointmentCounts={dashboardSummary?.AppointmentCounts}
              turnAroundTimeCount={dashboardSummary?.totalTurnAroundTimes}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default roleInfoScreenData(Dashboard, "Prd")
