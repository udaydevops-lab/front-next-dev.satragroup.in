"use client";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React, { useEffect, useState } from "react";
import { logOut } from "./utilities/logout";
import { useParams, usePathname, useRouter } from "next/navigation";
import Timer from "./_common/timer";
import {
    DASHBOARD_BAR_CHART,
    DASHBOARD_PIE_CHART,
    DASHBOARD_SUMMARY,
    DOCTOR_DASHBOARD_ROUTE,
    FRONT_DESK_DASHBOARD_ROUTE,
    LABORATORY_DASHBOARD_SPECIALTY,
    LABORATORY_DASHBOARD_SUMMARY,
    LOGIN_ROUTE,
    NURSE_DASHBOARD_ROUTE,
    PROCEDURES_DASHBOARD_DEPARTMENT,
    PROCEDURES_DASHBOARD_SUMMARY,
    RADIOLOGY_DASHBOARD_SPECIALTY,
    RADIOLOGY_DASHBOARD_SUMMARY,
} from "./utilities/constants";
import { PatientDataStore } from "./_common/context/DataStore";
import Head from "next/head";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import eventBus from "./utilities/eventbus";
import { getLocalItem, setLocalItem } from "./utilities/local";
import useSocket from "./_common/useSocket";
import { socketIoPort } from "./utilities/api-urls";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "eArogya",
//   description: "HIMS",
// };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [loggedIn, setLoggedIn] = useState(true);
    const [eventData, setEventData] = useState<any>();

    const socket = useSocket(socketIoPort);

    const getDashboardData = () => {
        var sseForDashboard = new EventSource(
            `${process.env.NEXT_PUBLIC_KAFKA_EVENTS}/subscribe?subId=message`
        );
        // withCredentials: true,

        sseForDashboard.onopen = (e) => { };

        sseForDashboard.addEventListener("message", (event: any) => {
            let jsonData = JSON.parse(event.data);
            let data = JSON.parse(
                jsonData.message.replace(/=/g, ":").replace(/(\w+)(?=\s*[:,])/g, '"$1"')
            );
            setEventData(data);
            let total = Math.floor(Math.random() * 1000) + 1;
            let walkins = Math.floor(Math.random() * 500) + 1;
            let appointmentsVisiteds = Math.floor(Math.random() * 500) + 1;
            let noShow = Math.floor(Math.random() * 500) + 1;
            let cancelled = Math.floor(Math.random() * 500) + 1;
            let completed = Math.floor(Math.random() * 500) + 1;

            const pieData = {
                labels: ["Waiting for Consult", "Completed"],
                datasets: [
                    {
                        data: [12, 13], //[Number(walkins + appointmentsVisiteds), Number(data?.encounterCount)],
                        backgroundColor: ["#fd79a8", "#a29bfe"],
                        hoverBackgroundColor: ["#e84393", "#6c5ce7"],
                        // borderWidth: 1,
                        // borderColor: 'black',
                    },
                ],
            };
            const barData = {
                labels: ["Walkin", "Appointment Visits", "No show", "Cancelled"],
                datasets: [
                    {
                        data: [
                            Number(walkins),
                            Number(appointmentsVisiteds),
                            Number(noShow),
                            Number(cancelled),
                        ],
                        backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
                        hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
                        borderRadius: 16,
                        barThickness: 8,
                    },
                ],
            };

            eventBus.dispatch(DASHBOARD_BAR_CHART, barData);
            eventBus.dispatch(DASHBOARD_PIE_CHART, pieData);

            eventBus.dispatch(DASHBOARD_SUMMARY, {
                total: data.totalCount, //completed + Number(walkins) + Number(appointmentsVisiteds),
                consultationcompleted: data.completedCount, //completed,
                waiting: data.queuedCount, //Number(walkins) + Number(appointmentsVisiteds),
            });
            // Send to EventBus
        });

        sseForDashboard.onerror = (error) => {
            sseForDashboard.close();
        };

        setLoggedIn(true);
        if (
            getLocalItem("loginResponse") &&
            getLocalItem("loginResponse") !== null
        ) {
            if (pathname == "/") navigateToDashboard();
        } else {
            navigateToLogin();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps

        return () => {
            sseForDashboard.close();
        };
    };

    const navigateToDashboard = () => {
        // TODO:: Check Rolename and navigate to respective dashboard
        // router.replace(FRONT_DESK_DASHBOARD_ROUTE);

        let loginResp: any = JSON.parse(getLocalItem("loginResponse") ?? "");

        if (loginResp && loginResp["rollDesc"]) {
            switch (loginResp["rollDesc"].toLowerCase()) {
                case "front office":
                case "admin":
                    router.replace(FRONT_DESK_DASHBOARD_ROUTE);
                    break;
                case "nurse":
                    router.replace(NURSE_DASHBOARD_ROUTE);
                    break;
                case "doctor":
                    router.replace(DOCTOR_DASHBOARD_ROUTE);
                    break;
                default:
                    break;
            }
        }
    };

    const navigateToLogin = () => {
        router.replace(LOGIN_ROUTE);
    };

    const handleLogout = () => {
        logOut();
        setLoggedIn(false);
        router.replace(LOGIN_ROUTE);
    };
  

    useEffect(() => {

        if (socket) {
            socket.on('event', (data: any) => {
                const { topic, value } = data;
                console.log(topic, value);
                if (topic === 'radiology-dashbord-count') {
                    eventBus.dispatch(RADIOLOGY_DASHBOARD_SUMMARY, JSON.parse(value));
                }
                if (topic === 'radiology-speciality-count') {
                    let data = JSON.parse(value);
                    eventBus.dispatch(RADIOLOGY_DASHBOARD_SPECIALTY, data.RadSpecialityCountMap);
                }
                if (topic === 'lab-dashbord-count') {
                    let data = JSON.parse(value);
                    eventBus.dispatch(LABORATORY_DASHBOARD_SUMMARY, data.labordersCount);
                }
                if (topic === 'lab-speciality-Count') {
                    let data = JSON.parse(value);
                    eventBus.dispatch(LABORATORY_DASHBOARD_SPECIALTY, data.specialityCount);
                }
                if (topic === 'procedures-dashbord-count') {
                    let data = JSON.parse(value);
                    eventBus.dispatch(PROCEDURES_DASHBOARD_SUMMARY, data);
                }
                if (topic === 'procedures-department-count') {
                    let data = JSON.parse(value);
                    eventBus.dispatch(PROCEDURES_DASHBOARD_DEPARTMENT, data.proceduresDeptCountMap);
                }
            });
        }
        // disabled developer tools
        const preventRightClick = (event: MouseEvent) => {
            event.preventDefault();
        };
        const preventF12KeyPress = (event: KeyboardEvent) => {
            if (
                event.key === "F12" ||
                (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "i")
            ) {
                event.preventDefault();
            }
        };
        window.addEventListener("contextmenu", preventRightClick);
        window.addEventListener("keydown", preventF12KeyPress);
        return () => {
            window.removeEventListener("contextmenu", preventRightClick);
            window.removeEventListener("keydown", preventF12KeyPress);
            if (socket) {
                socket.off('event');
            }
        };

        // const pieData = {
        //   labels: ["Waiting for Consult", "Completed"],
        //   datasets: [
        //     {
        //       data: [Number(10), Number(7)], //[Number(walkins + appointmentsVisiteds), Number(data?.encounterCount)],
        //       backgroundColor: ["#fd79a8", "#a29bfe"],
        //       hoverBackgroundColor: ["#e84393", "#6c5ce7"],
        //       // borderWidth: 1,
        //       // borderColor: 'black',
        //     },
        //   ],
        // };
        // const barData = {
        //   labels: ["Walkin", "Appointment Visits", "No show", "Cancelled"],
        //   datasets: [
        //     {
        //       data: [Number(10), Number(7), Number(2), Number(3)],
        //       backgroundColor: ["#55efc4", "#a29bfe", "#fd79a8", "#fde9a8"],
        //       hoverBackgroundColor: ["#00b894", "#6c5ce7", "#e84393", "#e8e393"],
        //       borderRadius: 16,
        //       barThickness: 8,
        //     },
        //   ],
        // };

        // eventBus.dispatch(DASHBOARD_BAR_CHART, barData);
        // eventBus.dispatch(DASHBOARD_PIE_CHART, pieData);
        // getDashboardData();
    }, [eventData, loggedIn, socket]);

    return (
        <html lang="en">
            <Head>
                <title>eArogya</title>
            </Head>
            <body className="bg-slate-100" key={Math.random()}>
                <section>
                    <PatientDataStore>
                        <ToastContainer style={{ zIndex: "999999" }} />
                        {children}
                        {loggedIn ? (
                            <div>
                                <Timer timeout={1000 * 60 * 10} onTimeout={handleLogout} />
                            </div>
                        ) : null}
                    </PatientDataStore>
                </section>
            </body>
        </html>
    );
}
