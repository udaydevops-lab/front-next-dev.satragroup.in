"use client";
import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
    deleteParameterCpoe,
    getAllParameterByService,
    getProcudersCpoeData,
    labParamerterList,
    saveCpoeLabmaster,
    updateCPOEParameter,
} from "@/app/utilities/api-urls";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RadiologoyMaster = () => {
    const [assignLabParameterHeaderID, setAssignLabParameterHeaderID] =
        useState<any>(null);

    const [modaloc, setModaloc] = useState<any>({});

    const [fields, setFields] = useState<any>({
        prty: {
            label: "Procuders Service *",
        },
        specimen: {
            label: "Specimen Type",
        },
        labParameter: {
            label: "Procuders Parameter",
        },
        assignLabParameterItemId: null,
        assignLabParameterHeaderId: null,
    });

    const [store, setStore] = useState<any>([]);
    const [saveItem, setSaveItem] = useState<any>([]);

    // get Procuders Saved Records store
    const [serviceItmes, setServiceItmes] = useState<any>([]);

    const [radioParameter, setRadioParameter] = useState<any>([]);

    const columns2: GridColDef[] = [
        {
            field: "rowid",
            headerName: "S.No.",
            width: 80,
            renderCell: (params) => {
                const rowNumber = store.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        { field: "parameter", headerName: "Parameter Name", width: 350 },
        { field: "parameterCode", headerName: "Code", width: 180 },
        { field: "tcd", headerName: "Terminology Code - Desc", width: 410 },
        { field: "seq", headerName: "Seq.", width: 80 },
        {
            field: "actions",
            headerName: "Actions.",
            width: 80,
            renderCell: (params: any) => (
                <>
                    {params.row.assignLabParameterItemId !== null ? (
                        <>
                            <PencilIcon
                                className="w-5 h-5 text-blue-400 cursor-pointer me-2"
                                onClick={() => {
                                    setFields({
                                        ...fields,
                                        labParameter: {
                                            label: params.row.parameter,
                                            value: "",
                                        },
                                        eidtData: params.row,

                                        parameter: params.row.parameter,
                                        parameterCode: params.row.parameterCode,
                                        assignLabParameterItemId:
                                            params.row.assignLabParameterItemId,
                                    });

                                    const section = document.getElementById('sectionRef');
                                    if (section) {
                                        section.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            />
                            <TrashIcon
                                className="w-5 h-5 text-red-400 cursor-pointer"
                                onClick={() =>
                                    setModaloc({ ...modaloc, open: true, data: params.row })
                                }
                            />
                        </>
                    ) : (
                        <>
                            <TrashIcon
                                className="w-5 h-5 text-red-400 cursor-pointer"
                                onClick={() =>
                                    setModaloc({ ...modaloc, open: true, data: params.row })
                                }
                            />
                        </>
                    )}
                </>
            ),
        },
    ];

    const [loader, setLoader] = useState<any>(false)
    const [saveUpdateloader, setSaveUpdateloader] = useState<any>(false)
    const [deleteLoader, setDeleteLoader] = useState<any>(false)

    const onselectPrority = (data: any) => {
        setFields({
            ...fields,
            prty: data,
            serviceCode: data.serviceCode,
            serviceDesc: data.serviceDesc,
            department: data.departmentDesc,
            specialty: data.superSpecialityDesc,
            terminologyCode: data.masterTerminologyDto[0].terminologyCode,
            terminologyDesc: data.masterTerminologyDto[0].terminologyDesc,
            tcd: `${data.masterTerminologyDto[0].terminologyCode} - ${data.masterTerminologyDto[0].terminologyDesc}`,
        });

        getServiceParameter(data.serviceCode, data.departmentDesc);
    };

    const fieldOnchange = (e: any) => {
        setFields({ ...fields, [e.target.name]: sanitizeInput(e.target.value) });
    };

    const onlabParameter = (data: any) => {
        setFields({
            ...fields,
            labParameter: data,
            parameter: data.parameterDescription,
            parameterCode: data.parameterCode,
            parameterterminologyCode: data.terminologyCode,
            parameterterminologyDesc: data.terminologyDesc,
        });
    };

    const addService = () => {
        if (fields?.labParameter?.label !== "Procuders Parameter") {
            let obj: any = {
                id: Math.random(),
                parameter: fields.parameter,
                parameterCode: fields?.parameterCode,
                terminologyCode: fields.parameterterminologyCode,
                terminologyDesc: fields.parameterterminologyDesc,
                tcd: `${fields.parameterterminologyCode} - ${fields.parameterterminologyDesc}`,
                serviceId: null,
                assignLabParameterItemId: null,
            };
            setStore(
                [...store, obj].reduce((acc: any, ccmpl: any) => {
                    let obj = acc.find((c: any) => c.parameter === ccmpl.parameter);
                    if (obj) {
                        toast.error(`You have entered same parameter again, please await`);
                        return acc;
                    } else {
                        return acc.concat([ccmpl]);
                    }
                }, [])
            );
            setSaveItem([...saveItem, obj]);
            setFields({
                ...fields,
                labParameter: {
                    label: "Procuders Parameter",
                }
            })
        } else {
            toast.error("Please don't leave blank");
        }
    };

    const saveService = () => {
        setSaveUpdateloader(true)
        let getFinal = saveItem.map((list: any) => {
            return {
                terminologyCode: list.parameterterminologyCode,
                terminologyDesc: list.parameterterminologyDesc,
                assignPrameterType: "Procedures",
                parameterCode: list.parameterCode,
                parameter: list.parameter,
                statusFlag: 1,
            };
        });
        let Obj = {
            serviceDesc: fields.serviceDesc,
            serviceCode: fields.serviceCode,
            department: fields.department,
            speciality: fields.specialty,
            terminologyCode: fields.terminologyCode,
            terminologyDesc: fields.terminologyDesc,
            statusFlag: 1,
            assignParameterItemSet: getFinal,
        };

        services.create(saveCpoeLabmaster, Obj)
            .then((res) => {
                setTimeout(() => {
                    toast.success("Successfully added procedures parameter record...");
                    getServiceParameter(fields.serviceCode, fields.department);
                    setSaveItem([]);
                    setSaveUpdateloader(false)
                }, 2000);

            }).catch((err) => {
                setTimeout(() => {
                    setSaveUpdateloader(false)
                    toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                }, 2000);
            });
    };

    //save the service Procuders parameter
    const upDateParamerter = () => {
        setLoader(true)
        let getfinalData = store.map((list: any) => {
            if (
                list.assignLabParameterItemId ===
                fields.eidtData.assignLabParameterItemId
            ) {
                return {
                    ...list,
                    terminologyCode: fields.parameterterminologyCode,
                    terminologyDesc: fields.parameterterminologyDesc,
                    assignPrameterType: "Procedures",
                    parameterCode: fields.parameterCode,
                    parameter: fields.parameter,
                    statusFlag: 1,
                };
            }
            return list;
        });
        let Obj = {
            assignLabParameterHeaderId: assignLabParameterHeaderID,
            serviceDesc: fields.serviceDesc,
            serviceCode: fields.serviceCode,
            department: fields.department,
            speciality: fields.specialty,
            terminologyCode: fields.terminologyCode,
            terminologyDesc: fields.terminologyDesc,
            statusFlag: 1,
            assignParameterItemSet: getfinalData,
        };

        services
            .create(updateCPOEParameter, Obj)
            .then((res) => {
                setTimeout(() => {
                    toast.success(
                        `Successfully updated ${fields.eidtData.parameter} parameter on procedures`
                    );
                    getServiceParameter(fields.serviceCode, fields.department);
                    setFields({
                        ...fields, assignLabParameterItemId: null,
                        labParameter: {
                            label: "Procuders Parameter",
                        },
                    });
                    setLoader(false)
                }, 2000);
            })
            .catch((err) => {
                setTimeout(() => {
                    console.log(err);
                    setLoader(false)
                    toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                }, 2000);

            });
    };

    // delete parameter row
    const deleteRow = () => {
        setDeleteLoader(true)
        if (modaloc.data.assignLabParameterItemId !== null) {
            services
                .create(
                    deleteParameterCpoe +
                    `assignLabParameterHeaderId=${assignLabParameterHeaderID}&assignLabParameterItemId=${modaloc.data.assignLabParameterItemId}`,
                    {}
                )
                .then((res: any) => {
                    setTimeout(() => {
                        setDeleteLoader(false)
                        toast.success(
                            `Successfully deleted ${modaloc.data.parameter} from the procedures`
                        );
                        getServiceParameter(fields.serviceCode, fields.department);
                        setModaloc({ ...modaloc, open: false });
                    }, 2000);

                })
                .catch((err) => {
                    setTimeout(() => {
                        console.log(err);
                        setDeleteLoader(false)
                        toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                    }, 2000);

                });
        } else {
            let deltDate = store.filter((list: any) => list.id !== modaloc.data.id);
            let deltDatesave = saveItem.filter(
                (list: any) => list.id !== modaloc.data.id
            );
            setSaveItem(deltDatesave);
            setStore(deltDate);
            setModaloc({ ...modaloc, open: false });
            setDeleteLoader(false)
        }
    };

    const resetAll = () => {
        setFields({
            prty: {
                label: "Procuders Service *",
            },
            specimen: {
                label: "Specimen Type",
            },
            labParameter: {
                label: "Procuders Parameter",
            },
            serviceCode: "",
            department: "",
            specialty: "",
            tcd: "",
            assignLabParameterItemId: null,

        });
        setStore([]);
        setSaveItem([])
    };

    // get Procuders saved service master details
    const getProcudersMasterRecords = () => {
        services
            .get(getProcudersCpoeData + "Procedures")
            .then((res) => {
                let getFinalRecord = res.data.map((list: any) => {
                    return {
                        ...list,
                        label: list.serviceDesc,
                        value: list.serviceCode,
                    };
                });
                setServiceItmes(getFinalRecord);
            })
            .catch((err) => console.log(err));
    };

    // get Parameter saved Parameter Master details
    const parameterList = (e: any) => {
        services
            .get(labParamerterList + `Procedures&searchString=${e.target.value}`)
            .then((res: any) => {
                console.log('parameterList', res)
                let getFinal = res.data.map((list: any) => {
                    return {
                        ...list,
                        label: list.parameterDescription,
                        value: list.parameterDescription,
                    };
                }).filter((list: any) => list.module === "Procedures");
                setRadioParameter(getFinal);
            })
            .catch((err) => console.log(err));
    };

    // get parameter by Service and department
    const getServiceParameter = (serviceCode: any, department: any) => {
        services
            .get(getAllParameterByService + `serviceCode=${serviceCode}&assignPrameterType=Procedures`)
            .then((res) => {
                let getFinal = res.data.assignParameterItemSet.map((list: any) => {
                    return {
                        ...list,
                        tcd: `${list.terminologyCode} - ${list.terminologyDesc}`,
                    };
                });
                setAssignLabParameterHeaderID(res.data.assignLabParameterHeaderId);
                setStore(getFinal);
            })
            .catch((err) => {
                console.log(err);
                let result: any = err.code === "ERR_BAD_RESPONSE" ? [] : "";
                setStore(result);
                setAssignLabParameterHeaderID(null);
            });
    };

    // after save update the new parameter in the same service
    const createNewParameter = () => {
        setSaveUpdateloader(true)
        let getfinalData = store.map((list: any) => {
            return {
                assignLabParameterItemId: list.assignLabParameterItemId,
                terminologyCode: list.parameterterminologyCode,
                terminologyDesc: list.parameterterminologyDesc,
                assignPrameterType: "Procedures",
                parameterCode: list.parameterCode,
                parameter: list.parameter,
                statusFlag: 1,
            };
        });
        let Obj = {
            assignLabParameterHeaderId: assignLabParameterHeaderID,
            serviceDesc: fields.serviceDesc,
            serviceCode: fields.serviceCode,
            department: fields.department,
            speciality: fields.specialty,
            terminologyCode: fields.terminologyCode,
            terminologyDesc: fields.terminologyDesc,
            statusFlag: 1,
            assignParameterItemSet: getfinalData,
        };

        services
            .create(updateCPOEParameter, Obj)
            .then((res) => {
                setTimeout(() => {
                    setSaveUpdateloader(false)
                    toast.success(
                        `Successfully added new ${fields.parameter} parameter in procedures`
                    );
                    getServiceParameter(fields.serviceCode, fields.department);
                    setSaveItem([]);
                }, 2000);

            })
            .catch((err) => {
                console.log(err);
                setTimeout(() => {
                    setSaveUpdateloader(false)
                    toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                }, 2000);
            });
    };

    useEffect(() => {
        getProcudersMasterRecords();
    }, []);

    return (
        <>
            <div className="w-full" id="sectionRef">
                {/* form */}
                <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
                    <div className="font-bold w-full mb-4">
                        <h1 className="w-full">
                            Procuders Service Parameter Configuration
                        </h1>
                    </div>
                    <div className="w-full flex gap-4">
                        <div className="w-1/3">
                            <ReactSelectBox
                                value={fields.prty}
                                options={serviceItmes}
                                onChange={onselectPrority}
                                label="Procuders Service *"
                                isSearchable={true}
                                isMultiple={false}
                            />

                        </div>
                        <div className="w-1/3">
                            <FormPropsTextFields
                                label={`Service Code`}
                                name="serviceCode"
                                value={fields.serviceCode}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none  "
                            />
                        </div>
                        <div className="w-1/3">
                            <FormPropsTextFields
                                label={`Department`}
                                name="department"
                                value={fields.department}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none "
                            />
                        </div>
                    </div>

                    <div className="w-full flex gap-4 mt-4">
                        <div className="w-1/4">
                            <FormPropsTextFields
                                label={`Specialty`}
                                name="specialty"
                                value={fields.specialty}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none "
                            />
                        </div>
                        <div className="w-3/4">
                            <FormPropsTextFields
                                label={`Terminology Code - Description`}
                                name="tcd"
                                value={fields.tcd}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none "
                            />
                        </div>
                    </div>

                    {/* gridTable and form*/}
                    <div className="px-3 mt-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                        {/* form */}
                        <div className="w-full flex gap-4 mb-4">
                            <div className="w-2/4 relative my-select">
                                <ReactSelectBox
                                    value={fields.labParameter}
                                    options={radioParameter}
                                    onSearchInputChange={(e: any) => {
                                        parameterList(e);
                                    }}
                                    onChange={onlabParameter}
                                    label="Procuders Parameter"
                                    isSearchable={true}
                                    isMultiple={false}
                                    isDisabled={fields.prty.label !== 'Procuders Service *' ? false : true}
                                />

                            </div>
                            <div className="w-2/4 flex gap-4">
                                <ActionButton
                                    buttonText={
                                        loader ?
                                            <div className='w-full flex justify-center items-center'>
                                                <div className='innerBtnloader'></div>
                                            </div> :
                                            fields.assignLabParameterItemId !== null ? "Update" : "Add"
                                    }
                                    handleSubmit={fields.assignLabParameterItemId !== null ? upDateParamerter : addService}
                                    width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                    disabled={fields.labParameter.label !== "Procuders Parameter" ? false : true}
                                />

                            </div>
                        </div>

                        {/* {gridtable} */}
                        <div className="w-full">
                            <ReactDatagrid
                                rows={store}
                                columns={columns2}
                            />
                        </div>

                        {/* action buttons */}
                        <div className="w-full mt-4 flex justify-end gap-4">
                            <ActionButton
                                buttonText={
                                    saveUpdateloader ?
                                        <div className='w-full flex justify-center items-center'>
                                            <div className='innerBtnloader'></div>
                                        </div> :
                                        assignLabParameterHeaderID !== null ? "Update" : "Create"
                                }
                                handleSubmit={assignLabParameterHeaderID !== null ? createNewParameter : saveService}
                                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={saveItem.length > 0 ? false : true}
                            />
                            <ActionButton
                                buttonText="Reset"
                                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                handleSubmit={resetAll}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Delete Record Popup Message */}
            <ReactCommonDialog
                open={modaloc.open}
                handler={() => setModaloc({ ...modaloc, open: false })}
                popupClose={() => setModaloc({ ...modaloc, open: false })}
                Content={
                    <DeletePopupMsg
                        btnYesFun={deleteRow}
                        btnNoFun={() => setModaloc({ ...modaloc, open: false })}
                        content={"Do you want to Delete this record?"}
                        loader={deleteLoader}
                    />
                }
            />

        </>
    );
};

export default RadiologoyMaster;
