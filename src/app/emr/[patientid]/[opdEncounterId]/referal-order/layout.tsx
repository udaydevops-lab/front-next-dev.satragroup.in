"use client"
import Header from '@/app/_components/header'
import { Inter } from 'next/font/google'
import MenuBarDoctor from '@/app/doctor/_components/menu-bar-doctor'
import WithDoctorAuth from '@/app/_commonfeatures/protectedRoute/WithDoctorAuth'

const inter = Inter({ subsets: ['latin'] })


const ReferralsLayout = ({
    children,
}: {
    children: React.ReactNode
}) => {
    return (
        <section>
            <div className="min-h-full ">
                <div>
                    <Header />
                    <MenuBarDoctor />
                    <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WithDoctorAuth(ReferralsLayout)