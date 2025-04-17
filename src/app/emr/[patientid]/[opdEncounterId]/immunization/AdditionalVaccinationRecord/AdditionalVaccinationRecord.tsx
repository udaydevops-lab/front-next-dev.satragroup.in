"use client"

import ActionButton from '@/app/_common/button';
import DateInput from '@/app/_common/date-input';
import { clearAddtionalVaccinationRecord, saveAdditionalVaccination } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { Input } from '@material-tailwind/react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
import dayjs from 'dayjs';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';
import PrintGrid from './PrintGrid';
import Printlayout from '@/app/_common/PrintLayout/printlayout';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import { ReactSelectBox } from '@/app/_commonfeatures';

const AdditionalVaccinationRecord = ({
    storeDoctor,
    recordField,
    setRecordField,
    patientid,
    vaccinationname,
    loggedDetalls,
    getAdditionalVccinationRecordData,
    AdditionVacciSaveData,
    setAdditionVacciSaveData,
    opdEncounterId,
    ...props
}: any) => {

    const [addFields, setAddFields] = useState<any>({
        sel: {
            label: "Please Search Vaccination"
        }
    })
    const [id, setId] = useState<any>()


    //get the single record when click on check box on the table
    const [valueSave, setValueSave] = useState<any>([])

    const administrated_options: any = [
        { value: "Yes", label: "Yes" },
        { value: "No", label: "No" }
    ];


    // add additional vaccination
    const addAdditionalVaccination = () => {
        if (addFields.vaccineName === '') {
            toast.error('Please fill the Vaccination Fields..')
        }
        else {
            let index = AdditionVacciSaveData.length > 0 ? AdditionVacciSaveData.length : 0
            setId(index)
            setAdditionVacciSaveData([...AdditionVacciSaveData, { ...addFields, id: index }])
            setAddFields({
                ...addFields, sel: {
                    label: "Please Search Vaccination",
                    value: "Please Search Vaccination"
                },
            })
            setRecordField({
                ...recordField,
                [`additionalsel${index}`]: {
                    label: '----',
                    value: ''
                },
                [`additionaldoctor${index}`]: {
                    label: loggedDetalls.employeename,
                    value: loggedDetalls.employeename
                }
            })
        }
    }

    const tableGridHandler = (e: any, index: any) => {
        setAdditionVacciSaveData(
            AdditionVacciSaveData.map((list: any, innerIndex: any) => {
                if (innerIndex === index) {
                    return {
                        ...list,
                        [e.target.name]: e.target.value
                    }
                }
                return list
            })
        )
    }

    const tableGridSelectHandler = (e: any, index: any, data: any) => {
        setAdditionVacciSaveData(
            AdditionVacciSaveData.map((list: any, innerIndex: any) => {
                if (innerIndex === index) {
                    return {
                        ...list,
                        administred: recordField[`additionalsel${index}`] != '' ? e.label : recordField[`additionalsel${index}`],
                        administeredByDoctor: recordField[`additionaldoctor${index}`].label,
                        administeredDate: moment().format("YYYY-MM-DD"),
                        expiryDate: moment().format("YYYY-MM-DD"),
                        nextDueDate: moment().format("YYYY-MM-DD"),
                        isActive: false,
                    }
                }
                return list
            })
        )

        if (e.label === 'No') {
            setValueSave(valueSave.map((list: any) => {
                if (list.id === data.id) {
                    return {
                        ...list,
                        isActive: false,
                        isSave: false,
                    }
                }
                return list
            }))
        }

        setRecordField({
            ...recordField,
            [`additionalsel${index}`]: e,
        });
    }

    let saveBtnShow = AdditionVacciSaveData.filter((list: any) => list.isActive === false && list.administred === 'Yes');

    // Save 
    const saveImmunizationRecordData = () => {
        const filterMainData = AdditionVacciSaveData.filter((list: any) => list.isActive === false && list.administred === 'Yes')
        if (filterMainData.length === 0) {
            toast.error('Please select Administered to "Yes" fill the other data for store')
        }
        else {
            const filterMainObject = filterMainData.map((list: any) => {
                return {
                    vaccineName: list.vaccineName,
                    doseUnit: list.doseUnit,
                    administred: list.administred,
                    administeredDate: list.administeredDate,
                    administeredByDoctor: list.administeredByDoctor,
                    manufacturer: list.manufacturer,
                    batchNumber: list.batchNumber,
                    expiryDate: list.expiryDate,
                    nextDueDate: list.nextDueDate,
                    patientId: patientid,
                    opdEncounterId: opdEncounterId,
                    isActive: true,
                    statusFlag: 1
                }
            })
            services.create(saveAdditionalVaccination, filterMainObject)
                .then((res) => {
                    toast.success(`Successfully completed Addictional Vaccination Record`)
                    getAdditionalVccinationRecordData();
                })
                .catch((err) => {
                    console.log(err)
                    toast.error("Getting error, Please try again!")
                })
        }
    }

    const PrintRecord = () => {
        const printContent = document.getElementById('divToPrint');

        if (printContent) {
            const printWindow = window.open('', '_blank', 'width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no');

            if (printWindow) {
                printWindow.document.write('<html><head><title>Print</title></head><body>');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }
    };

    useEffect(() => { }, [valueSave])
    console.log(props?.screenData)
    return (
        <>


            <div id="divToPrint" className='hidden w-full'>
                <Printlayout
                    content={
                        <PrintGrid
                            AdditionVacciSaveData={AdditionVacciSaveData}
                        />
                    }
                />
            </div>

            <div className='w-full mt-5'>
                <div className='px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke'>
                    <div className="font-bold md:pt-3 mx-auto w-full ">
                        <h2>Additional Vaccination</h2>
                    </div>


                    {/* Add vaccination form */}
                    <div className='w-full my-5'>
                        <div className='flex gap-5'>
                            <div className='w-full md:w-1/2'>
                                <ReactSelectBox
                                    value={addFields.sel}
                                    options={vaccinationname}
                                    label={"Please Search Vaccination"}
                                    onChange={(e: any) => {
                                        setAddFields({
                                            ...addFields,
                                            vaccineName: e.label,
                                            sel: e,
                                        });
                                    }}
                                    isSearchable={true}
                                />
                            </div>
                            <div className='w-full md:w-1/2'>
                                <ActionButton
                                    buttonText={'Add'}
                                    handleSubmit={addAdditionalVaccination}
                                    height="h-10"
                                    width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    disabled={addFields.sel.label !== "Please Search Vaccination" ? false : true}
                                />
                            </div>
                        </div>
                    </div>
                    {/* End Add vaccination form */}

                    {/* Immunization Record Table */}
                    <TableContainer
                        className='mostly-customized-scrollbar mt-5 h-[700px]'
                        component={Paper} sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='w-[300px]'>S.No</TableCell>
                                    <TableCell className='w-[300px]'>Vaccine Name</TableCell>
                                    <TableCell className='w-[300px]'>Dose Unit</TableCell>
                                    <TableCell className='w-[300px]'>Administered</TableCell>
                                    <TableCell component="th" scope="row" width={150}>Administered Date</TableCell>
                                    <TableCell className='w-[300px]'>Administered By Doctor</TableCell>
                                    <TableCell className='w-[300px]'>Manufacturer</TableCell>
                                    <TableCell className='w-[300px]'>Batch Number</TableCell>
                                    <TableCell className='w-[300px]'>Expiry Date</TableCell>
                                    <TableCell className='w-[300px]'>Next Due Date</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody className='min-h-[400px]'>
                                {AdditionVacciSaveData && AdditionVacciSaveData.map((list: any, index: any) => (
                                    <>
                                        <TableRow
                                            key={index}
                                            // disable={list.active}
                                            sx={{ opacity: list.isActive === true ? 0.5 : 1 }}
                                            className={`${list.isActive === true ? 'disable-row' : ''}`}
                                        >
                                            <TableCell className='w-[300px]'>{index + 1}</TableCell>
                                            <TableCell className='w-[300px]'>
                                                <div className='w-[250px]'>
                                                    {list.vaccineName}
                                                </div>
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <div className='does_Unit w-[full]'>
                                                    <Input
                                                        crossOrigin={true}
                                                        name='doseUnit'
                                                        label='---------'
                                                        containerProps={{
                                                            className: "!min-w-0 !w-[70px]",
                                                        }}
                                                        value={AdditionVacciSaveData[index].doseUnit}
                                                        onChange={(e: any) => tableGridHandler(e, index)}
                                                        color='blue'
                                                        className='focus:border-t-0'
                                                    />
                                                </div>
                                            </TableCell>

                                            <TableCell className='w-[300px]'>
                                                <div className='nax-w-[100px] does_Unit'>
                                                    <ReactSelectBox
                                                        value={recordField[`additionalsel${index}`]}
                                                        options={administrated_options}
                                                        label={"---"}
                                                        onChange={(e: any) => tableGridSelectHandler(e, index, list)}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell component="th" scope="row" width={150}>
                                                <div className='w-[150px]'>
                                                    <DateInput
                                                        labl="------"
                                                        value={AdditionVacciSaveData[index].administred === 'Yes' ? moment(AdditionVacciSaveData[index].administeredDate) : null}
                                                        name="administeredDate"
                                                        onChange={(e: any) => {
                                                            setRecordField({
                                                                ...recordField,
                                                                [`administeredDate${index}`]: e,
                                                            });

                                                            setAdditionVacciSaveData(AdditionVacciSaveData.map((innerList: any, index: any) => {
                                                                if (list.id === innerList.id) {
                                                                    return {
                                                                        ...innerList,
                                                                        administeredDate: dayjs(e._d).format("YYYY-MM-DD"),
                                                                        [`administeredDate${index}`]: e
                                                                    }

                                                                }
                                                                return innerList
                                                            }))
                                                        }}
                                                        disabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}

                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <div className='nax-w-[100px] does_Unit'>
                                                    <ReactSelectBox
                                                        value={AdditionVacciSaveData[index].administred === 'Yes' ? recordField[`additionaldoctor${index}`] : ''}
                                                        options={storeDoctor}
                                                        onChange={(e: any) => {
                                                            setAdditionVacciSaveData(AdditionVacciSaveData.map((innerList: any, index: any) => {

                                                                if (list.id === innerList.id) {
                                                                    return {
                                                                        ...innerList,
                                                                        administeredByDoctor: recordField[`additionaldoctor${index}`] != '' ? e.label : recordField[`additionaldoctor${index}`],
                                                                    }

                                                                }
                                                                return innerList
                                                            }))
                                                            setRecordField({
                                                                ...recordField,
                                                                [`additionaldoctor${index}`]: e,
                                                            });
                                                        }
                                                        }
                                                        label={"---"}
                                                        isDisabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}
                                                    />

                                                </div>
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <Input
                                                    crossOrigin={false}
                                                    name='manufacturer'
                                                    onChange={(e: any) => tableGridHandler(e, index)}
                                                    value={AdditionVacciSaveData[index].administred === 'Yes' ? AdditionVacciSaveData[index].manufacturer : ''}
                                                    className='!w-[130px] focus:border-t-0'
                                                    containerProps={{
                                                        className: "!min-w-0 !w-[130px]",
                                                    }}
                                                    color='blue'
                                                    disabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}
                                                />
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <Input
                                                    crossOrigin={false}
                                                    name='batchNumber'
                                                    value={AdditionVacciSaveData[index].administred === 'Yes' ? AdditionVacciSaveData[index].batchNumber : ''}
                                                    onChange={(e: any) => tableGridHandler(e, index)}
                                                    className='!w-[130px] focus:border-t-0'
                                                    containerProps={{
                                                        className: "!min-w-0 !w-[130px]",
                                                    }}
                                                    color='blue'
                                                    disabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}
                                                />
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <div className='w-[150px]'>

                                                    <DateInput
                                                        value={AdditionVacciSaveData[index].administred === 'Yes' ? moment(AdditionVacciSaveData[index].expiryDate) : null}
                                                        onChange={(e: any) => {
                                                            {

                                                                setAdditionVacciSaveData(AdditionVacciSaveData.map((innerList: any, index: any) => {
                                                                    if (list.id === innerList.id) {
                                                                        return {
                                                                            ...innerList,
                                                                            expiryDate: dayjs(e._d).format("YYYY-MM-DD"),
                                                                            [`expiryDate${index}`]: e
                                                                        }

                                                                    }
                                                                    return innerList
                                                                }))

                                                                let getExprDate = list
                                                                setValueSave([...valueSave, getExprDate].map((saveList: any) => {
                                                                    if (list.id === saveList.id) {
                                                                        return {
                                                                            ...saveList,
                                                                            expiryDate: dayjs(e._d).format("YYYY-MM-DD")
                                                                        }
                                                                    }
                                                                    return saveList
                                                                }))
                                                            }
                                                        }}

                                                        disabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell className='w-[300px]'>
                                                <div className='w-[150px]'>
                                                    <DateInput
                                                        label="Next Due Date"
                                                        value={AdditionVacciSaveData[index].administred === 'Yes' ? moment(AdditionVacciSaveData[index].nextDueDate) : null}
                                                        onChange={(e: any) => {

                                                            setAdditionVacciSaveData(AdditionVacciSaveData.map((innerList: any, index: any) => {
                                                                if (list.id === innerList.id) {
                                                                    return {
                                                                        ...innerList,
                                                                        nextDueDate: dayjs(e._d).format("YYYY-MM-DD"),
                                                                        [`nextDueDate${index}`]: e
                                                                    }

                                                                }
                                                                return innerList
                                                            }))

                                                            let getExprDate = list
                                                            setValueSave([...valueSave, getExprDate].map((saveList: any) => {
                                                                if (list.id === saveList.id) {
                                                                    return {
                                                                        ...saveList,
                                                                        nextDueDate: dayjs(e._d).format("YYYY-MM-DD")
                                                                    }
                                                                }
                                                                return saveList
                                                            }))
                                                        }}
                                                        disabled={AdditionVacciSaveData[index].administred === 'Yes' ? false : true}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </>
                                ))}

                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* End Immunization Record Table */}

                    <div className='w-full flex gap-4 justify-end my-5'>
                        {props?.screenData?.Save === 1 &&
                            <ActionButton
                                buttonText={'Save'}
                                handleSubmit={saveImmunizationRecordData}
                                height="h-10"
                                width='w-[120px] py-2 px-2'
                                disabled={saveBtnShow.length > 0 ? false : true}
                            />
                        }
                        <ActionButton
                            buttonText={'Clear'}
                            height="h-10"
                            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            disabled={AdditionVacciSaveData.length > 0 ? false : true}
                        />
                        {props?.screenData?.Print === 1 &&
                            <ActionButton
                                buttonText={'Print'}
                                handleSubmit={PrintRecord}
                                height="h-10"
                                width='w-[120px] py-2 px-2'
                                disabled={AdditionVacciSaveData.length > 0 ? false : true}
                            />
                        }
                    </div>

                </div>
            </div>
        </>
    )
}

export default roleInfoScreenData(AdditionalVaccinationRecord, "IMM")