"use client"
import ActionButton from '@/app/_common/button';
import { ReactSelectBox } from '@/app/_commonfeatures';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import { deleteLabSpecialtyTechnician, saveLabTechnicianMaster } from '@/app/utilities/api-urls';
import services from '@/app/utilities/services';
import { TrashIcon } from '@heroicons/react/24/solid';
import { GridColDef } from '@mui/x-data-grid';
import { stat } from 'fs';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { toast } from 'react-toastify';

interface LaboratoryTechnicianMasterFormprops {
    state: any,
    dispatch: Dispatch<SetStateAction<any>>
    getApiesData: () => void
}

const LaboratoryTechnicianCreation: React.FC<LaboratoryTechnicianMasterFormprops> = ({
    state,
    dispatch,
    getApiesData
}) => {
    const HandleAdd = () => {
        if(!state.field.labSpecialtySearch.value) {
            toast.error("Please select the specialty")
            return
        }
        if (state.field.labTechnicianSearch && state.field.labTechnicianSearch.length > 0) {
            let newArr: any[] = state.field.labTechnicianSearch.map((item: any) => {
                return {
                    sn: Math.random(),
                    labSpecialtyId: state.field.labSpecialtySearch.value,
                    labSpecialtySearch: state.field.labSpecialtySearch.label,
                    labTechnicianSearch: item.label,
                    labTechnicianId: item.employeeId || item.empId,
                    labTechMapId: item.labTechMapId
                }
            })
            dispatch({
                type: 'fieldVal',
                payload: {
                    addListValues: newArr
                }
            })
        } else {
            toast.error("Please select the Technicians")
        }
    }

    const deleteList = (data: any) => {
        if (data && data?.labTechMapId !== undefined) {
            services
                .create(`${deleteLabSpecialtyTechnician}${data?.labTechMapId}`, {})
                .then((response: any) => {
                    dispatch({
                        type: 'fieldVal',
                        payload: {
                            addListValues: state.field.addListValues.filter((item: any) => item.labTechnicianId !== data.labTechnicianId),
                            labTechnicianSearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                                ...item,
                                value: item.labTechnicianId,
                                label: item.labTechnicianSearch
                            })).filter((item: any) => item.labTechnicianId !== data.labTechnicianId) : null,
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
                    addListValues: state.field.addListValues.filter((item: any) => item.labTechnicianId !== data.labTechnicianId),
                    labTechnicianSearch: state.field.addListValues.length > 1 ? state.field.addListValues.map((item: any) => ({
                        ...item,
                        value: item.labTechnicianId,
                        label: item.labTechnicianSearch
                    })).filter((item: any) => item.labTechnicianId !== data.labTechnicianId) : null,
                }
            })
        }
    }

    const dispatchFieldVal = (submitData: any): Promise<void> => {
        return new Promise<void>((resolve) => {
            dispatch({
                type: 'fieldVal',
                payload: { submitData }
            });
            resolve();
        });
    };

    const onSubmit = async () => {
        const submitData = state.field.addListValues.map((item: any) => {
            return {
                labTechMapId: item.labTechMapId !== undefined ? item.labTechMapId : "",
                labSpecialityCode: item.labSpecialtyId,
                labSpecialityDesc: item.labSpecialtySearch,
                technicianName: item.labTechnicianSearch,
                empId: item.labTechnicianId,
                statusFlag: 1
            };
        });

        try {
            await dispatchFieldVal(submitData);
            await services.create(saveLabTechnicianMaster, submitData);
            { state.field.labTechMapId == null ? toast.success("Saved Successfully") : toast.success("Updated Successfully"); }
            dispatch({
                type: 'dialogPop',
                payload: {
                    open: false
                }
            })
            getApiesData();
        } catch (error: any) {
            console.log(error.message);
        }
    }

    const columns: GridColDef[] = [
        {
            field: "id", headerName: "S. No", width: 120, renderCell: (params: any) => {
                return <>{params.row.id}</>
            }
        },
        // { field: "labSpecialtySearch", headerName: "Specialty", width: 120 },
        { field: "labTechnicianSearch", headerName: "Technician", width: 400 },
        {
            field: "Delete",
            headerName: "Actions",
            width: 120,
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

    return (
        <>
            <div className='flex gap-4 newSelect newInputField'>
                <div className='w-2/5'>
                    <ReactSelectBox
                        value={state.field.labSpecialtySearch}
                        options={state.getAppApi.labspecDd}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labSpecialtySearch: data
                                }
                            })
                        }}
                        label={"Laboratory Specialty"}
                        isSearchable={true}
                        isDisabled={Object.keys(state.field.rowData).length > 0 ? true : false}
                    />
                </div>
            </div>
            <div className='flex gap-4 newSelect newInputField mt-4'>
                <div className='w-full'>
                    <ReactSelectBox
                        value={state.field.labTechnicianSearch}
                        options={state.getAppApi.labTechDd}
                        onChange={(data: any) => {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labTechnicianSearch: data
                                }
                            })
                        }}
                        label={"Laboratory Technician"}
                        isSearchable={true}
                        isMultiple={true}
                    />
                </div>
                <div className='w-[120px] flex items-end'>
                    {/* <div className=""> */}
                    <ActionButton
                        buttonText={'Add'}
                        handleSubmit={HandleAdd}
                        width="w-full text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
                    />
                    {/* </div> */}
                </div>
            </div>
                <div className="p-4 w-full data-grid-newThem">
                    <ReactDatagrid
                        rows={state.field.addListValues}
                        columns={columns}
                    />
                </div>
            <div className='flex gap-4 mt-6 justify-end p-4'>
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
                {Object.keys(state.field.rowData).length > 0?null:<ActionButton
                    buttonText='Clear'
                    handleSubmit={() => {
                        if (Object.keys(state.field.rowData).length > 0) {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labTechnicianSearch: null,
                                    addListValues: []
                                }
                            })
                        } else {
                            dispatch({
                                type: 'fieldVal',
                                payload: {
                                    labTechnicianSearch: null,
                                    addListValues: []
                                }
                            })
                        }
                    }}
                    width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
                />}
                
            </div>
        </>
    )

}

export default LaboratoryTechnicianCreation
