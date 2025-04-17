"use client"
import Header from "@/app/_components/header";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import MenuBarFrontDesk from "@/app/frontdesk/_components/menu-bar-frontdesk";
import MenuBarDoctor from "@/app/doctor/_components/menu-bar-doctor";

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function HealthDocumentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div className="min-h-full">
                <div>
                    <Header />
                    <MenuBarDoctor />
                    <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
}
