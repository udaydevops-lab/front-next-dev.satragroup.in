"use client"
import FrontDeskAuth from '@/app/_commonfeatures/protectedRoute/FrontDeskAuth'
import Header from '@/app/_components/header'
import dynamic from 'next/dynamic'
const MenuBarFrontDesk = dynamic(() => import('@/app/frontdesk/_components/menu-bar-frontdesk'))
import React from 'react'

const CpoeMasterLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <section>
                <div className="min-h-full">
                    <div>
                        <Header
                            heading={"Front Desk Office"} />
                        <MenuBarFrontDesk />
                        <div className="w-full mx-auto max-w-7xl py-4 md:py-6 2xl:py-6 position-relative">
                            {children}
                        </div>

                    </div>
                </div>
            </section>
        </>
    )
}

export default FrontDeskAuth(CpoeMasterLayout)
