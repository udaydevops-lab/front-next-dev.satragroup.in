"use client";
import React, { useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/app/_components/header";
import FrontDeskAuth from "@/app/_commonfeatures/protectedRoute/FrontDeskAuth";
import MenuBarFrontDesk from "../frontdesk/_components/menu-bar-frontdesk";


function DashboardLayout({ children }: { children: React.ReactNode }) {

    return (
        <section>
            <div className="min-h-full">
                <div>
                    <Header
                        heading={"Front Desk Office"} />
                    <MenuBarFrontDesk />
                    {children}
                </div>
            </div>
        </section>
    );
}

export default FrontDeskAuth(DashboardLayout);
