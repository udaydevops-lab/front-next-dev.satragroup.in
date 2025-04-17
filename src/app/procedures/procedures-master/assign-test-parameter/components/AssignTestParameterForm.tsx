"use client"
import ActionButton from '@/app/_common/button'
import { ReactSelectBox } from '@/app/_commonfeatures'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid'
import { Input } from '@material-tailwind/react'
import React, { FC, useEffect, useState } from 'react'
import InactiveIcon from '../../../../../../public/icons/wellness-record/inactive-icon'
import ActiveIcon from '../../../../../../public/icons/wellness-record/active-icon'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid'
import moment from 'moment'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import services from '@/app/utilities/services'
import { deleteProcedureAssignParameter, deleteRadiologyAssignParameter, getAllRadiologyParameters, getRadiologyServiceByServiceType, proceduresParameter, proceduresServiceName, saveRadiologyAssignParameter } from '@/app/utilities/api-urls'
import { toast } from 'react-toastify'
import Select from 'react-tailwindcss-select'

interface AssignTestParameterFormprops {
    fields: any,
    setFields: any,
    parameterGrid: any,
    setParameterGrid: any,
    handleAdd: any,
    loder: any,
    handleSave: any,
    handleClear: any,
    btnStatus: any,
}
const AssignTestParameterForm: FC<AssignTestParameterFormprops> = ({ fields, setFields, parameterGrid, setParameterGrid, handleAdd, loder, handleSave, handleClear, btnStatus }) => {
    console.log(parameterGrid)
    const [serviceNameList, setServiceNameList] = useState<any>([])
    const [parameterNameList, setParameterNameList] = useState<any>([])
    // const serviceNameList: any = [
    //     {
    //         label: "test 1",
    //         value: "test 1"
    //     },

    //     {
    //         label: "test 2",
    //         value: "test 2"
    //     },
    //     {
    //         label: "test 3",
    //         value: "test 3"
    //     },
    //     {
    //         label: "test 4",
    //         value: "test 4"
    //     },
    // ]
    const deleteRadiologyAssignParameterFun = (row: any) => {
        console.log(row)
        try {
            let itemId = row.assignProcedureParameterItemId
            let headerId = fields.serviceName.assignProcedureParameterHeaderId
            const emptyObj = {}
            services.create(`${deleteProcedureAssignParameter}assignProcedureParameterHeaderId=${headerId}&assignProcedureParameterItemId=${itemId}`, emptyObj).then((res) => {
                toast.success("Successfully Deleted parameter row")
                let newData = parameterGrid.filter((list: any) => list.sequenceOrderIdUi !== row.sequenceOrderIdUi)
                setParameterGrid(newData)
            })
        } catch (error) {
            toast.error("Something went wrong please try again")
        }
    }
    const deleteNewParameterFun = (row: any) => {
        console.log(row)
        let newData = parameterGrid.filter((list: any) => list.sequenceOrderIdUi !== row.sequenceOrderIdUi)
        setParameterGrid(newData)
    }
    const columns: GridColDef[] = [
        {
            field: "sequenceOrderIdUi",
            headerName: "SNO",
            width: 50,
            renderCell: (params) => {
                const rowNumber = parameterGrid.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        {
            field: "procedureParameterCode",
            headerName: "Parameter Code",
            width: 250,
        },
        {
            field: "procedureParameterDescription",
            headerName: "Parameter Description",
            width: 300,
        },

        {
            field: "status",
            headerName: "Status",
            width: 150,
            renderCell: (params: any) => (
                <>
                    {params.row.statusFlag === 1 ?
                        <div className="text-green-600">Active</div>
                        : <div className="text-red-600">Inactive</div>
                    }
                </>
            ),
        },
        {
            field: "generatedDate",
            headerName: "Created Date",
            width: 120,
            renderCell: (params: any) => (
                <>
                    {params.row.generatedDate && moment(params.row.generatedDate).format("DD-MM-YYYY")}
                </>
            ),
        },

        {
            field: "action",
            headerName: "Action",
            width: 100,
            renderCell: (params: any) => (
                <div className='flex gap-4 items-center w-[80px]'>
                    <div className='flex justify-center'>
                        {params.row.assignProcedureParameterItemId && params.row.assignProcedureParameterItemId ?
                            <TrashIcon
                                onClick={(e: any) => deleteRadiologyAssignParameterFun(params.row)}
                                className="w-5 h-5 cursor-pointer text-red-500"
                            />
                            :
                            <TrashIcon
                                onClick={(e: any) => deleteNewParameterFun(params.row)}
                                className="w-5 h-5 cursor-pointer text-red-500"
                            />
                        }
                    </div>
                </div>

            ),
        },
    ];
    const subGridData: any = [
        {
            id: 1,
            serviceCode: "1",
            serviceDesc: "test 1",
            statusFlag: 1
        },
        {
            id: 2,
            serviceCode: "1",
            serviceDesc: "test 2",
            statusFlag: 1
        },
    ]

    // get Service Name List function
    const getServiceNameList = async () => {
        try {
            const res = await services.get(proceduresServiceName)
            //console.log(res.data)
            const finalValue: any = res.data.map((list: any) => ({
                ...list,
                label: list.serviceDesc,
                value: list.serviceCode,
            }))
            setServiceNameList(finalValue)
        } catch (error) {
        }
    }
    // get Parameter Name List function
    const getserviceParameterData = async () => {
        try {
            const res = await services.get(proceduresParameter)
            console.log(res.data)
            const finalValue: any = res.data.map((list: any) => ({
                ...list,
                label: list.procedureParameterDescription,
                value: list.procedureParameterCode,
            }))
            setParameterNameList(finalValue)
        } catch (error) {

        }
    }
    const onserviceName = (e: any) => {
        setFields({
            ...fields,
            serviceName: e,
            deportment: e.departmentDesc,
            specialty: e.superSpecialityDesc,
            serviceCode: e.serviceCode,
        })
    }
    const getRowId = (row: any) => row.sequenceOrderIdUi;
    useEffect(() => {
        getServiceNameList()
        getserviceParameterData()
    }, [])
    return (
        <>
            <div className='w-full grid grid-cols-2 gap-4'>
                <div className='w-full relative'>
                    {/* <ReactSelectBox
                        isSearchable={true}
                        value={fields.serviceName}
                        options={serviceNameList}
                        label="Service Name"
                        onChange={(e: any) => onserviceName(e)}
                    /> */}
                    <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Service Name"
                        options={serviceNameList}
                        value={fields.serviceName}
                        onChange={(e: any) => onserviceName(e)}
                        classNames={{
                            menuButton: ({ isDisabled }: any) =>
                                `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                duration-300 focus:outline-none 
                ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`,
                            // No scroll or height restrictions here
                            menu: `absolute !text-start z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700 overflow-hidden`,
                            // Apply scroll to the list items container
                            list: `max-h-[200px] overflow-y-auto`,  // Scroll bar only for the options
                            listItem: ({ isSelected }: any) =>
                                `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `!text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                }`,
                        }}
                    />

                    <label
                        style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                        className={`${fields.serviceName?.label !== "Service Name"
                            ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                            : "text-sm opacity-0 top-10"
                            } 
  truncate cursor-default select-none absolute transition-all
`}
                    >   Service Name
                    </label>
                </div>
                <div className='w-full relative'>
                    <Input
                        crossOrigin
                        label="Service Code"
                        value={fields.serviceCode}
                        disabled={true}
                        className="w-full p-2 bg-gray-200 text-gray-700 border border-gray-300 rounded"
                    />
                </div>
                <div className='w-full'>
                    <Input
                        crossOrigin
                        label="Department"
                        value={fields.deportment}
                        // onChange={(e) => setFields({ ...fields, deportment: e.target.value })}
                        disabled={true}
                    />
                </div>
                <div className='w-full'>
                    <Input
                        crossOrigin
                        label="Specialty"
                        value={fields.specialty}
                        //onChange={(e) => setFields({ ...fields, specialty: e.target.value })}
                        disabled={true}
                    />
                </div>
            </div>
            <div className='w-full flex mt-4 gap-4'>
                <div className='w-2/4 relative'>
                    {/* <ReactSelectBox
                        isSearchable={true}
                        value={fields.serviceParameterName}
                        options={parameterNameList}
                        onChange={(e) => setFields({ ...fields, serviceParameterName: e })}
                        label="Service Parameter Name"
                    /> */}
                    <Select
                        isSearchable={true}
                        primaryColor="blue"
                        placeholder="Service Parameter Name"
                        value={fields.serviceParameterName}
                        options={parameterNameList}
                        onChange={(e) => setFields({ ...fields, serviceParameterName: e })}
                        classNames={{
                            menuButton: ({ isDisabled }: any) =>
                                `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                duration-300 focus:outline-none 
                ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                }`,
                            // No scroll or height restrictions here
                            menu: `absolute !text-start z-10 w-full bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700 overflow-hidden`,
                            // Apply scroll to the list items container
                            list: `max-h-[150px] overflow-y-auto`,  // Scroll bar only for the options
                            listItem: ({ isSelected }: any) =>
                                `block !text-start transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `!text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                }`,
                        }}
                    />

                    <label
                        style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
                        className={`${fields.serviceParameterName?.label !== "Service Parameter Name"
                            ? " bg-white py-[1px] px-[6px] opacity-100 -top-[9px] left-[15px]"
                            : "text-sm opacity-0 top-10"
                            } 
  truncate cursor-default select-none absolute transition-all
`}
                    >
                        Service Parameter Name
                    </label>
                </div>
                <div className='w-2/4'>
                    <ActionButton
                        buttonText="Add"
                        width="w-[140px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handleAdd}
                        disabled={fields.serviceName.label !== "Service Name" &&
                            fields.serviceParameterName.label !== "Service Parameter Name" ? false : true
                        }
                    />
                </div>
            </div>
            <div className='w-full mt-4'>
                {/* <ReactDatagrid
                    rows={parameterGrid} columns={columns}
                /> */}
                <DataGrid
                    rows={parameterGrid}
                    columns={columns}
                    getRowId={getRowId}
                    autoHeight
                    pageSizeOptions={[10, 20]}
                    checkboxSelection={false}
                    // slots={{ toolbar: null }}
                    density="compact"
                />
            </div>
            <div className='w-full mt-4 flex justify-end gap-4'>
                <ActionButton
                    buttonText={btnStatus === "save" ? "SAVE" : "UPDATE"}
                    width="w-[140px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleSave}
                    disabled={parameterGrid.length > 0 ? false : true}
                />
                {btnStatus === "save" ?
                    <ActionButton
                        buttonText="CLEAR"
                        width="w-[140px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        handleSubmit={handleClear}
                    />
                    : null}
            </div>
        </>
    )
}

export default AssignTestParameterForm