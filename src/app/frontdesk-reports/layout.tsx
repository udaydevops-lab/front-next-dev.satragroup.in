"use client";
import React, { useEffect, useLayoutEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/app/_components/header";
import FrontDeskAuth from "@/app/_commonfeatures/protectedRoute/FrontDeskAuth";

const MenuBarFrontDesk = dynamic(() => import('../frontdesk/_components/menu-bar-frontdesk'))
function frontdeskReportsLayout({ children }: { children: React.ReactNode }) {

    return (
        <section>
            <div className="min-h-full">
                <div>
                    <Header />
                    <MenuBarFrontDesk />
                    {children}
                </div>
            </div>
        </section>
    );
}

export default frontdeskReportsLayout;
