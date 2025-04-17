"use client";
import "../../../../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBarFrontDesk from "../../../../frontdesk/_components/menu-bar-frontdesk";
import Header from "../../../../_components/header";
import MenuBarDoctor from "@/app/doctor/_components/menu-bar-doctor";
import WithDoctorAuth from "@/app/_commonfeatures/protectedRoute/WithDoctorAuth";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

const OpAssessmentLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <section>
            <div className="min-h-full ">
                <div>
                    <Header />
                    {/* <MenuBarFrontDesk /> */}
                    <MenuBarDoctor />
                    <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
export default WithDoctorAuth(OpAssessmentLayout)