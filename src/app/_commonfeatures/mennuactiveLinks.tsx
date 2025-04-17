import React from 'react'
import Tooltip from "@mui/material/Tooltip";
import Image from 'next/image'

interface MennuactiveLinksprops {
    menuPageTitle: string,
    onButtonClick: () => void,
    menuIcon?: string,
    status: any
}


const MennuactiveLinks: React.FC<MennuactiveLinksprops> = ({
    menuPageTitle,
    onButtonClick,
    menuIcon,
    status
}) => {
    return (
        <>

            {/* <Tooltip title={menuPageTitle} color="primary" placement="top" arrow>
                <div
                    className={`img-cnfig text-white w-[50px] h-[50px] p-2 bg-slate-200 text-center inline-flex items-center justify-center  shadow-lg rounded-full bg-red-500 cursor-pointer hover:bg-blue-gray-600 transition-all ${status ? 'img-cnfig-active' : ''}`}
                    onClick={onButtonClick}
                >
                    {menuIcon ? (
                        // <Image src={menuIcon} alt="icon" width={30} height={30} />
                        menuIcon
                    ) : "icon"}
                </div>
            </Tooltip> */}

            <Tooltip
                title={menuPageTitle}
                color="primary"
                placement="top" arrow>
                <div
                    className=
                    {`
                       labIcons icon-config-active text-white 
                        p-3 bg-slate-200 text-center 
                        inline-flex items-center 
                        justify-center 
                        rounded-full bg-[#f2f3fe] 
                        cursor-pointer hover:bg-[#2196F3]                        
                        transition-all 
                        w-[45px] h-[45px]
                        ${status ? 'img-cnfig-active' : ''}
                    `}

                    onClick={onButtonClick}
                >
                    {menuIcon ? (
                        menuIcon
                    ) : "icon"}

                </div>
            </Tooltip>

        </>
    )
}

export default MennuactiveLinks


