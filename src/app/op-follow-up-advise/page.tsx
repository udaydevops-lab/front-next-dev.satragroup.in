"use client"

import { Radio, Input, Textarea, Select, Option } from "@material-tailwind/react";
import React from 'react'
import DateInput from "../_common/date-input";
import Checkbox from "../_common/checkbox";

const OPFollowupadvice = () => {
    return (
        <>
            <div className="font-bold px-4 md:mt-3 md:pt-3 flex mx-auto w-full ">
                <h1>OP Follow-up Advice / IP Admission Order</h1>

            </div>
            <div className='px-4 md:pt-3 pb-3 flex mx-auto w-full'>
                <div className="relative w-full min-w-0 p-4 bg-white dark:bg-slate-850  rounded-2xl ">
                    <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                        <div className='w-full flex'>
                            <Radio
                                crossOrigin={undefined}
                                label="OP Follow-up"
                                name="appointmentType"
                                value={"OP Follow-up"}
                            />

                            <div className="md:w-1/4 px-3 my-2">
                                <DateInput
                                    label="Followup Appt Date"
                                    name="dob"
                                />
                            </div>
                            <div className="md:w-1/2 px-3 my-2">
                                <Input crossOrigin={true} label="Care plan type" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                                } />
                            </div>
                        </div>

                        <div className="w-full mt-3">
                            <Textarea
                                label="Follow up advice"
                            />
                        </div>
                    </div>

                    <div className="px-4 mt-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                        <div className='w-full flex'>
                            <Radio
                                crossOrigin={undefined}
                                label="Admission Order"
                                name="Admission Order"
                                value={"Admission Order"}
                            />
                            <div className="md:w-1/4 px-3 my-2">
                                <Input crossOrigin={true} label="Adm. Requested ID" disabled />
                            </div>

                        </div>

                        <div className="w-full mt-3 flex gap-4">
                            <div className="w-1/3">
                                <Select label="Physician Name">
                                    <Option>Physician Name 1</Option>
                                    <Option>Physician Name 2</Option>
                                    <Option>Physician Name 3</Option>
                                </Select>
                            </div>

                            <div className="w-1/3">
                                <DateInput
                                    label="Planned Date of Admission"
                                    name="Planned Date of Admission"
                                />
                            </div>

                            <div className="w-1/3">
                                <Select label="Priority ">
                                    <Option>Priority  1</Option>
                                    <Option>Priority  2</Option>
                                    <Option>Priority  3</Option>
                                </Select>
                            </div>

                        </div>

                        <div className="w-full mt-3 flex gap-4">
                            <div className="w-1/3">
                                <Select label="Admit to Location">
                                    <Option>Admit to Location 1</Option>
                                    <Option>Admit to Location 2</Option>
                                    <Option>Admit to Location 3</Option>
                                </Select>
                            </div>

                            <div className="w-1/3">
                                <Select label="Admit to Ward">
                                    <Option>Admit to Ward 1</Option>
                                    <Option>Admit to Ward 2</Option>
                                    <Option>Admit to Ward 3</Option>
                                </Select>
                            </div>

                            <div className="w-1/3">
                                <Input crossOrigin={true} label="Reason for Inpatient Admission" />
                            </div>

                        </div>

                        <div className="w-full mt-3 flex gap-4">
                            <div className="w-1/3">
                            </div>

                            <div className="w-1/3">
                                <Select label="Admit to Ward">
                                    <Option>Admit to Ward 1</Option>
                                    <Option>Admit to Ward 2</Option>
                                    <Option>Admit to Ward 3</Option>
                                </Select>
                            </div>

                            <div className="w-1/3">
                                <Input crossOrigin={true} label="Reason for Inpatient Admission" />
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </>
    )
}

export default OPFollowupadvice
