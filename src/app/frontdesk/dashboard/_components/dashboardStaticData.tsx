"use client";

import React, { useEffect } from "react";
import eventBus from "../../../utilities/eventbus";
import DashboardSummaryComponent from "./dashboard-summary";
import { DASHBOARD_SUMMARY } from "../../../utilities/constants";

export default function DashboardStaticData(props: any) {
  const myData = {
    id: 1,
    total: 10,
    consultationcompleted: 7,
    waiting: 3,
  };

  useEffect(() => {
    eventBus.dispatch(DASHBOARD_SUMMARY, myData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div></div>
    // <DashboardSummaryComponent
    // data={myData}/>
  );
}
