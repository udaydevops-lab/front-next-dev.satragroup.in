"use client"
import ActionButton from '@/app/_common/button'
import DateInput from '@/app/_common/date-input'
import { ReactSelectBox } from '@/app/_commonfeatures'
import { getLabSpeciality, getRadiologySpeciality } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import React, { useEffect, useState } from 'react'

interface BulkVerifyFormProps {
    fields: any,
    setFields: any
    fromDate: any,
    setFromDate: any,
    setToDate: any,
    toDate: any,
    getAllresultVerifyGridData: any,
}
const BulkVerifyForm: React.FC<BulkVerifyFormProps> = ({ fields, setFields, fromDate, setFromDate, toDate, setToDate, getAllresultVerifyGridData }) => {

    const [specialityList, setSpecialityList] = useState<any>([]);
    const handelspecialty = () => {
    }
    const getSpecialityList = () => {
        services.get(getRadiologySpeciality).then((response: any) => {
            setSpecialityList(addLabelAndValue(response.data));
        });
    };
    const addLabelAndValue = (data: Array<any>) => {
        data.map((item: any) => {
            item.label = item.specialityDescription || item.label;
            item.value = item.specialityCode || item.value;
        });
        return data;
    };
    useEffect(() => {
        getSpecialityList()
    }, [])
    return (
        <>
            <div className='w-full'>
                <div className='w-full grid grid-cols-2 md:grid-cols-5 gap-4'>
                    <div className='w-full newSelect'>
                        <ReactSelectBox
                            value={fields.specialty}
                            options={specialityList}
                            onChange={
                                (e: any) => setFields({ ...fields, "specialty": e })
                            }
                            label={"Specialty"}
                        />
                    </div>
                    <div className='w-full newDate-theme'>
                        <DateInput
                            disableFuture={true}
                            label="From Date"
                            value={fromDate}
                            onChange={(e: any) =>
                                setFromDate(e)
                            }
                        />
                    </div>
                    <div className='w-full newDate-theme'>
                        <DateInput
                            disableFuture={true}
                            label="To Date"
                            value={toDate}
                            onChange={(e: any) =>
                                setToDate(e)
                            }
                        />
                    </div>

                    <div className='w-full newBtn-theme'>
                        <ActionButton
                            buttonText="Search"
                            handleSubmit={getAllresultVerifyGridData}
                            width="w-full text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default BulkVerifyForm