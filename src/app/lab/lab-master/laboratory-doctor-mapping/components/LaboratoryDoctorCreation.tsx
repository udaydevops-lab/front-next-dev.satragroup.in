import ActionButton from '@/app/_common/button';
import { ReactSelectBox } from '@/app/_commonfeatures'
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { deleteLabSpecialtyDoctor, saveLabDoctorMaster } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { TrashIcon } from '@heroicons/react/24/solid';
import { stat } from 'fs';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';

interface LaboratoryDoctorMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>,
    getApiesData: () => void
}

const LaboratoryDoctorCreation: React.FC<LaboratoryDoctorMasterFormprops> = ({
    state,
    dispatch,
    getApiesData
}) => {
    const HandleAdd = () => {
        if (state.field.labDocSearch && state.field.labDocSearch.length > 0) {
            let newArr: any[] = state.field.labDocSearch.map((item: any) => {
                return {
                    sn: Math.random(),
                    labSpecialityCode: state.field.labSpSearch.value,
                    labSpecialityDesc: state.field.labSpSearch.label,
                    doctorName: item.label,
                    empId: item.employeeId || item.empId,
                    labMappingId: item.labMappingId !== undefined ? item.labMappingId : "",
                    statusFlag: 1
                }
            })
            dispatch({
                type: 'fieldVal',
                payload: {
                    addListValues: newArr
                }
            })
        } else {
            toast.error("Please select the Doctors")
        }
    }

    const onSubmit = async () => {
        services
            .create(saveLabDoctorMaster, state.field.addListValues)
            .then((response: any) => {
                { state.field.labMappingId == null ? toast.success("Saved Successfully") : toast.success("Updated Successfully"); }
                dispatch({
                    type: 'dialogPop',
                    payload: {
                        open: false
                    }
                })
                getApiesData();
            })
            .catch((error: any) => {
                console.log(error.message);
            })
    }
    const columns = [
        {
            field: "id", headerName: "S. No", width: 120, renderCell: (params: any) => {
                return <>{params.row.id}</>
            }
        },
        { field: "doctorName", headerName: "Doctor Name", width: 520 },
        {
            field: "Delete",
            headerName: "Actions",
            width: 220,
            renderCell: (params: any) => (
                <>
                    <div className="flex gap-2">
                        <TrashIcon
                            className="w-5 h-5 text-red-400 cursor-pointer"
                            onClick={() => deleteList(params.row)}
                        />
                    </div>
                </>
            ),
        },
    ]

    const deleteList = (data: any) => {
        if (data && data?.labMappingId !== undefined) {
            services
                .create(`${deleteLabSpecialtyDoctor}${data?.labMappingId}`, {})
                .then((response: any) => {
                    dispatch({
                        type: 'fieldVal',
                        payload: {
                            addListValues: state.field.addListValues.filter((item: any) => item.empId !== data.empId),
                            labDocSearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                                ...item,
                                value: item.empId,
                                label: item.doctorName
                            })).filter((item: any) => item.empId !== data.empId) : null,
                        }
                    })
                    getApiesData();
                    toast.success(`Record deleted successfully`);
                })
                .catch((err: any) => {
                    toast.error("Something went wrong..");
                })
        } else {
            dispatch({
                type: 'fieldVal',
                payload: {
                    addListValues: state.field.addListValues.filter((item: any) => item.empId !== data.empId),
                    labDocSearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                        ...item,
                        value: item.empId,
                        label: item.doctorName
                    })).filter((item: any) => item.empId !== data.empId) : null,
                }
            })
        }
    }

    useEffect(() => {
    }, []);

    return (
        <>
            <div className='flex gap-4 newSelect newInputField'>
                <div className='w-2/5'>
                    <ReactSelectBox
                        value={state.field.labSpSearch}
                        options={state.getAppApi.labSpDd}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labSpSearch: data
                                }
                            })
                        }}
                        label={"Laboratory Specialty"}
                        isSearchable={true}
                        isDisabled={Object.keys(state.field.rowData).length > 0 ? true : false}
                    />
                </div>
                {/* {state.field && state.field.addListValues && state.field.addListValues.length > 0 &&
                    <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                        <div className="w-full mt-3">
                            <div
                                className="w-full bg-gray-200 
                                                font-bold text-center text-black 
                                                 px-3"
                            >
                                List Value
                            </div>
                            <div className="w-full bg-white">
                                <ul className=" list-none m-0 p-0 divide-y">
                                    {state.field.addListValues.map((list: any) => (
                                        <>
                                            <li key={list.id} className="py-1 px-2 text-sm flex justify-between items-center">
                                                {list.labSpSearch}
                                                <div className='cursor-pointer' onClick={() => deleteList(list.id)}>
                                                    <TrashIcon className='w-3 h-3 text-red-500' />
                                                </div>

                                            </li>
                                        </>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                } */}
            </div>
            <div className='flex gap-4 newSelect newInputField mt-4'>
                <div className='w-full'>
                    <ReactSelectBox
                        value={state.field.labDocSearch}
                        options={state.getAppApi.labDocDd}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labDocSearch: data
                                }
                            })
                        }}
                        label={"Laboratory Doctor"}
                        isSearchable={true}
                        isMultiple={true}
                    />
                </div>
                <div className='w-[120px] flex items-end'>
                    <ActionButton
                        buttonText={'Add'}
                        handleSubmit={HandleAdd}
                        // disabled={state?.field?.labDocSearch?.length > 0 ? true : false}
                        width="w-full text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
                    />
                </div>
            </div>
                <div className='data-grid-newThem mt-4 '>
                    <ReactDatagrid
                        rows={state.field.addListValues}
                        columns={columns}
                    />
                </div>
            <div className='flex gap-2 mt-4 justify-end'>
                <ActionButton
                    buttonText={
                        state.field.loader ?
                            <div className='w-full flex justify-center items-center'>
                                <div className='innerBtnloader'></div>
                            </div> :
                            Object.keys(state.field.rowData).length > 0 ? 'Update' : 'Save'
                    }
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
                    disabled={state.field.addListValues.length>0?false:true}
                    handleSubmit={onSubmit}
                />
                {Object.keys(state.field.rowData).length > 0 ?null:
                <ActionButton
                    buttonText='Clear'
                    handleSubmit={() => {
                        if (Object.keys(state.field.rowData).length > 0) {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labDocSearch: null,
                                    addListValues: []
                                }
                            })
                        } else {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labSpSearch: {
                                        label: "Laboratory Specialty"
                                    },
                                    labDocSearch: null,
                                    addListValues: []
                                }
                            })
                        }
                    }}
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />}
                
            </div>
        </>
    )
}

export default LaboratoryDoctorCreation
