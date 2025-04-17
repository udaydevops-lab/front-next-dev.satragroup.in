// "use client";
// import {
//   Chart as ChartJS,
//   BarElement,
//   CategoryScale,
//   LinearScale,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { ChartOptions } from "chart.js";
// import { Bar } from "react-chartjs-2";
// import { DASHBOARD_BAR_CHART } from "../../../utilities/constants";
// import React, { useEffect, useState } from "react";
// import eventBus from "../../../utilities/eventbus";

// ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

// interface BarchartProps {
//   horizontal?: boolean;
// }

// const Barchart: React.FC<BarchartProps> = ({ horizontal }) => {
//   const [myData, setMyData] = useState({
//     labels: [],
//     datasets: [],
//   });

//   useEffect(() => {
//     eventBus.on(DASHBOARD_BAR_CHART, (data) => {
//       setMyData(data);
//     });
//     return () => {
//       eventBus.remove(DASHBOARD_BAR_CHART, () => { });
//     };
//   }, []);

//   const options: ChartOptions<'bar'> = {
//     plugins: {
//       legend: {
//         display: false,
//       },
//     },
//     scales: {
//       x: {
//         grid: {
//           display: false,
//         },
//       },
//       y: {
//         grid: {
//           display: false,
//         },
//       },
//     },
//   };

//   if (horizontal) {
//     options.indexAxis = 'y';
//   } else {
//     options.indexAxis = 'x';
//   }

//   return (
//     <div className="w-full">
//       <div className="flex flex-wrap flex-1 items-center justify-center">
//         <Bar data={myData} options={options}></Bar>
//       </div>
//     </div>
//   );
// };

// export default Barchart;

"use client";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";
import { DASHBOARD_BAR_CHART } from "../../../utilities/constants";
import React, { useEffect, useState } from "react";
import eventBus from "../../../utilities/eventbus";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarchartProps {
  horizontal?: boolean;
  graphData: any;
}

const Barchart: React.FC<BarchartProps> = ({ horizontal, graphData }) => {
  const [myData, setMyData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
        hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
        borderRadius: 16,
        barThickness: 8,
      },
    ],
  });

  useEffect(() => {
    // eventBus.on(DASHBOARD_BAR_CHART, (data) => {
    //   // Ensure the data structure is correct
    //   if (data.labels && data.datasets) {
    setMyData(graphData);
    //   }
    // });
    // return () => {
    //   eventBus.remove(DASHBOARD_BAR_CHART, () => { });
    // };
  }, [graphData]);

  const options: ChartOptions<'bar'> = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
  };

  if (horizontal) {
    options.indexAxis = 'y';
  } else {
    options.indexAxis = 'x';
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap flex-1 items-center justify-center">
        {/* Ensure myData is passed correctly */}
        {myData.labels.length > 0 && myData.datasets[0].data.length > 0 ? (
          <Bar data={myData} options={options}></Bar>
        ) : (
          // <p>Loading data...</p>
          <Bar data={myData} options={options}></Bar>
        )}
      </div>
    </div>
  );
};

export default Barchart;

