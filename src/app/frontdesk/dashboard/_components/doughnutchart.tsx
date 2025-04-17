"use client"
import { DASHBOARD_DOUGHNUT_CHART } from '@/app/utilities/constants';
import eventBus from '@/app/utilities/eventbus';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import { useEffect, useState } from 'react';
import { ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface doughnutChartProps {
    graphData: any;
}

const DoughnutChart: React.FC<doughnutChartProps> = ({
    graphData
}) => {
    const [myData, setMyData] = useState({
        labels: [],
        datasets: [],
    });
    useEffect(() => {
        // eventBus.on(DASHBOARD_DOUGHNUT_CHART, (data) => {
        setMyData(graphData);
        // });
        // return () => {
        //     eventBus.remove(DASHBOARD_DOUGHNUT_CHART, () => { });
        // };
    }, [graphData]);

    const options: ChartOptions<'doughnut'> = {
        plugins: {
            legend: {
                display: false,
            }
        }
    };
    return (
        <div className="items-center justify-center">
            <Doughnut data={myData} options={options} />
        </div>
    );
}

export default DoughnutChart;