"use client";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { ChartOptions } from "chart.js";
import { Pie } from "react-chartjs-2";
import eventBus from "../../../utilities/eventbus";
import React, { useEffect, useState } from "react";
import { DASHBOARD_PIE_CHART } from "../../../utilities/constants";

ChartJS.register(ArcElement, Tooltip, Legend);

interface pieChartProps {
  horizontal?: boolean;
  graphData: any;
}

const Piechart: React.FC<pieChartProps> = ({ graphData }) => {
  const [myData, setMyData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: []
    }],
  });

  useEffect(() => {
    // eventBus.on(DASHBOARD_PIE_CHART, (data) => {
    setMyData(graphData);
    // });
    // return () => {
    //   // Anything in here is fired on component unmount.
    //   eventBus.remove(DASHBOARD_PIE_CHART, () => { });
    // }
  }, [graphData])

  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        // position: "bottom",
        display: false
      }
    }
  };

  return (
    <div className="items-center justify-center">
      <Pie data={myData} options={options}></Pie>
    </div>
  );
}

export default Piechart;
