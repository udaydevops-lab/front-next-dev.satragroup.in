"use client"
import React, { FC } from 'react'
interface ReactCommonDialogprops {
    dialogtitle?: string,
    open: any,
    handler: any,
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl",
    popupClose: any,
    Content: any,
    overflowY?: "auto" | "hidden"
}
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader } from '@material-tailwind/react';
import Cross_Icon from '../_common/common_icons/Cross_Icon';
const ReactCommonDialog: FC<ReactCommonDialogprops> = ({
    open,
    handler,
    size,
    popupClose,
    dialogtitle,
    Content,
    overflowY
}) => {
    return (
        <>
            <Dialog
                open={open}
                handler={handler}
                size={size ? size : 'md'}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5 pt-0"
            >
                <div
                    onClick={popupClose}
                    className='w-[25px] h-[30px] absolute  -top-4 -right-2 cursor-pointer z-10'>
                    <Cross_Icon />
                </div>
                {dialogtitle && <DialogHeader className="flex items-center shrink-0 p-4  bg  !bg-[#006AC9] text-white antialiased font-sans text-2xl font-semibold leading-snug mb-0 ">
                    <h3>{dialogtitle}</h3>
                </DialogHeader>}


                <DialogBody className={`sm:max-w[300px] ${overflowY === 'hidden' ? 'overflow-y-hidden' : 'overflow-y-auto'} overflow-x-hidden md:max-h-[450px] mostly-customized-scrollbar`}>
                    {Content}
                </DialogBody>

            </Dialog>
        </>
    )
}

export default ReactCommonDialog
