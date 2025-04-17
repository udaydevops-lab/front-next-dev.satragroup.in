"use client";
import React, { useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/app/_components/header";

const MenuBarFrontDesk = dynamic(() => import('../frontdesk/_components/menu-bar-frontdesk'))

function ReportsLayout({ children }: { children: React.ReactNode }) {

    return (
        <section>
            <div className="min-h-full">
                <div>
                    <Header
                    // heading={"Front Desk Office"}
                    />
                    <MenuBarFrontDesk />
                    {children}
                </div>
            </div>
        </section>
    );
}

export default ReportsLayout;
