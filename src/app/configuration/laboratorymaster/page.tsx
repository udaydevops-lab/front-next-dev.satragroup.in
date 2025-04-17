"use client";
import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
    deleteParameterCpoe,
    getAllCpeoMasterRecord,
    getAllParameterByService,
    labParamerterList,
    saveCpoeLabmaster,
    updateCPOEParameter,
} from "@/app/utilities/api-urls";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { sanitizeObject } from "@/app/utilities/sanitizeObject";
import services from "@/app/utilities/services";
import { allowOnlyNumbers } from "@/app/utilities/validations";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const LaboratoryMaster = () => {
    const [modaloc, setModaloc] = useState<any>({});
    const [assignLabParameterHeaderID, setAssignLabParameterHeaderID] =
        useState<any>(null);

    const [fields, setFields] = useState<any>({
        prty: {
            label: "Laboratory Service *",
        },
        specimen: {
            label: "Specimen Type",
        },
        labParameter: {
            label: "Laboratory Parameter",
            value: "",
        },
        max_normal_range: "",
        min_normal_range: "",
        assignLabParameterItemId: null,
        assignLabParameterHeaderId: null,
    });

    const [store, setStore] = useState<any>([]);

    const [saveItem, setSaveItem] = useState<any>([]);

    // laboratory Services
    const [serviceItmes, setServiceItmes] = useState<any>([]);

    //lab paramter list
    const [labParameterlist, setLabParameterlist] = useState<any>([]);

    const extractNumbersFromString = (rangeString: any) => {
        // Split the string by the '-' character
        const rangeArray = rangeString.split("-").map((item: any) => item.trim());

        // Parse the numbers and return them
        const minValue = parseFloat(rangeArray[0]);
        const maxValue = parseFloat(rangeArray[1]);

        return [minValue, maxValue];
    };

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
        { field: "parameter", headerName: "Parameter Name", width: 320 },
        { field: "parameterCode", headerName: "Code", width: 160 },
        { field: "tcd", headerName: "Terminology Code - Desc", width: 380 },
        {
            field: "normalRange",
            headerName: "Normal Range",
            width: 110,
        },
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
                                    const rangeString = params.row?.normalRange;
                                    const [minValue, maxValue] =
                                        extractNumbersFromString(rangeString);
                                    setFields({
                                        ...fields,
                                        labParameter: {
                                            label: params.row.parameter,
                                            value: "",
                                        },
                                        eidtData: params.row,
                                        // prty: {
                                        //     label: "Laboratory Service*",
                                        // },
                                        specimen: {
                                            label: "Specimen Type",
                                        },
                                        max_normal_range: maxValue ? maxValue : '',
                                        min_normal_range: minValue ? minValue : minValue === 0 ? 0 : '',
                                        parameter: params.row.parameter,
                                        parameterCode: params.row.parameterCode,
                                        assignLabParameterItemId:
                                            params.row.assignLabParameterItemId,
                                    });

                                    const section = document.getElementById('upDateParameter');
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

    // when we select the labarotary service
    const onselectPrority = (data: any) => {
        console.log(data)
        setFields({
            ...fields,
            prty: sanitizeObject(data),
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

    // when select normal ranges [min - max]
    const fieldOnchange = (e: any) => {
        setFields({ ...fields, [e.target.name]: sanitizeInput(e.target.value) });
    };

    // when select lab parameter
    const onlabParameter = (data: any) => {
        console.log('lab-param', data)
        setFields({
            ...fields,
            labParameter: sanitizeObject(data),
            parameterCode: data.parameterCode,
            parameter: data.parameterDescription,
            parameterterminologyCode: data.terminologyCode,
            parameterterminologyDesc: data.terminologyDesc,
        });
    };

    //when click on button add
    const addService = () => {
        if (fields?.labParameter?.label !== "Laboratory Parameter") {
            let obj: any = {
                id: Math.random(),
                parameter: fields.parameter,
                parameterCode: fields.parameterCode,
                max_normal_range: fields.max_normal_range,
                min_normal_range: fields.min_normal_range,
                terminologyCode: fields.parameterterminologyCode,
                terminologyDesc: fields.parameterterminologyDesc,
                serviceCode: fields?.serviceCode,
                normalRange: `${fields.min_normal_range} - ${fields.max_normal_range}`,
                tcd: `${fields.parameterterminologyCode} - ${fields.parameterterminologyDesc}`,
                assignLabParameterItemId: null,
            };
            setStore(
                [...store, obj].reduce((acc: any, ccmpl: any) => {
                    let obj = acc.find((c: any) => c.parameter === ccmpl.parameter);
                    if (obj) {
                        toast.error(`You have enter Same Parameter again, please be awair`);
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
                    label: "Laboratory Parameter",
                }
            })
        } else {
            toast.error("Please don not leave blank fields");
        }
    };

    const [loader, setLoader] = useState<any>(false)
    const [saveUpdateloader, setSaveUpdateloader] = useState<any>(false)

    //save the service laboratory parameter
    const saveService = () => {
        setSaveUpdateloader(true)
        let getfinalData = saveItem.map((list: any) => {
            return {
                terminologyCode: list.terminologyCode,
                terminologyDesc: list.terminologyDesc,
                assignPrameterType: "Laboratory",
                parameterCode: list.parameterCode,
                parameter: list.parameter,
                normalRange: list.normalRange,
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
            assignParameterItemSet: getfinalData,
        };

        services
            .create(saveCpoeLabmaster, Obj)
            .then((res) => {
                setTimeout(() => {
                    toast.success("succefully added Labarotary Parameter");
                    getAllCpoeMasterRecordList();
                    getServiceParameter(fields.serviceCode, fields.department);
                    setFields({
                        prty: {
                            label: "Laboratory Service*",
                        },
                        specimen: {
                            label: "Specimen Type",
                        },
                        labParameter: {
                            label: "Laboratory Parameter",
                        },
                        max_normal_range: "",
                        min_normal_range: "",
                        tcd: "",
                        serviceCode: "",
                        department: "",
                        specialty: "",
                        assignLabParameterItemId: null,
                    });
                    setSaveItem([]);
                    setSaveUpdateloader(false)
                }, 2000)

            })
            .catch((err) => {
                console.log(err)
                setTimeout(() => {
                    toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                    setSaveUpdateloader(false)
                }, 2000);
                setSaveItem([]);
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
                assignPrameterType: "Laboratory",
                parameterCode: list.parameterCode,
                parameter: list.parameter,
                normalRange: list.normalRange,
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
                        `Successfully Added New ${fields.parameter} Parameter on Laboratory`
                    );
                    getServiceParameter(fields.serviceCode, fields.department);
                    setFields({
                        prty: {
                            label: "Laboratory Service*",
                        },
                        specimen: {
                            label: "Specimen Type",
                        },
                        labParameter: {
                            label: "Laboratory Parameter",
                        },
                        max_normal_range: "",
                        min_normal_range: "",
                        tcd: "",
                        serviceCode: "",
                        department: "",
                        specialty: "",
                        assignLabParameterItemId: null,
                    });


                    setSaveItem([]);
                }, 2000)

            })
            .catch((err) => {
                console.log(err);
                setSaveUpdateloader(false)
                toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                setSaveItem([]);

            });
    };

    //save the service laboratory parameter
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
                    assignPrameterType: "Laboratory",
                    parameterCode: fields.parameterCode,
                    parameter: fields.parameter,
                    normalRange: `${fields.min_normal_range} - ${fields.max_normal_range}`,
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
            specimenType: null,
            statusFlag: 1,
            assignParameterItemSet: getfinalData,
        };

        services
            .create(updateCPOEParameter, Obj)
            .then((res) => {
                setTimeout(() => {
                    toast.success(
                        `Successfully Updated ${fields.eidtData.parameter} Parameter on Laboratory`
                    );
                    getServiceParameter(fields.serviceCode, fields.department);
                    setFields({
                        ...fields, assignLabParameterItemId: null,
                        labParameter: {
                            label: "Laboratory Parameter",
                        },
                        max_normal_range: "",
                        min_normal_range: "",
                    });
                    setLoader(false)


                }, 2000)

            })
            .catch((err) => {
                setTimeout(() => {
                    setLoader(false)
                }, 2000);
                // setFields({
                //     prty: {
                //         label: "Laboratory Service*",
                //     },
                //     specimen: {
                //         label: "Specimen Type",
                //     },
                //     labParameter: {
                //         label: "Laboratory Parameter",
                //     },
                //     max_normal_range: "",
                //     min_normal_range: "",
                //     tcd: "",
                //     serviceCode: "",
                //     department: "",
                //     specialty: "",
                //     assignLabParameterItemId: null,
                // });
            });
    };

    // get the laboratory parameter list from the below
    const parameterList = async (e: any) => {
        services
            .get(labParamerterList + `Laboratory&searchString=${e.target.value}`)
            .then((res: any) => {

                let getFinal = res.data.map((list: any) => {
                    return {
                        ...list,
                        label: list.parameterDescription,
                        value: list.parameterDescription,
                    };
                }).filter((list: any) => list.module === "Laboratory");

                setLabParameterlist(getFinal);
            })
            .catch((err) => console.log(err));
    };

    const [delLoader, setDeleteLoader] = useState<any>(false)
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
                        toast.success(
                            `Successfully Deleted ${modaloc.data.parameter} from the Laboratory`
                        );
                        getServiceParameter(fields.serviceCode, fields.department);
                        setModaloc({ ...modaloc, open: false });
                        setDeleteLoader(false)
                    }, 2000);
                })
                .catch((err) => {
                    setTimeout(() => {
                        toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
                        setDeleteLoader(false)
                        console.log(err);
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

    // get all CPOE Master records from below link
    const getAllCpoeMasterRecordList = () => {
        services
            .get(getAllCpeoMasterRecord + `Laboratory`)
            .then((res: any) => {
                setServiceItmes(
                    res.data.map((list: any) => {
                        return {
                            ...list,
                            label: list.serviceDesc,
                            value: list.serviceDesc,
                        };
                    })
                );
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    // reset functionality
    const resetAll = () => {
        setFields({
            prty: {
                label: "Laboratory Service *",
            },
            specimen: {
                label: "Specimen Type",
            },
            labParameter: {
                label: "Laboratory Parameter",
            },
            max_normal_range: "",
            min_normal_range: "",
            tcd: "",
            serviceCode: "",
            department: "",
            specialty: "",
            assignLabParameterItemId: null,
        });
        setStore([]);
        setSaveItem([])
    };

    // get parameter by Service and department
    const getServiceParameter = (serviceCode: any, department: any) => {
        // let inputString =
        //     getAllParameterByService +
        //     `serviceName=${serviceDesc}&assignPrameterType=${department}`;
        // const URL = inputString.replace(/%20/g, "");

        let URL: any = getAllParameterByService + `serviceCode=${serviceCode}&assignPrameterType=${department}`
        console.log('getAllParameterByService', URL)
        services
            .get(URL)
            .then((res) => {
                setAssignLabParameterHeaderID(res.data.assignLabParameterHeaderId);

                let getFinal = res.data.assignParameterItemSet.map((list: any) => {
                    return {
                        ...list,
                        tcd: `${list.terminologyCode} - ${list.terminologyDesc}`,
                    };
                });

                setStore(getFinal);
            })
            .catch((err) => {
                let result: any = err.code === "ERR_BAD_RESPONSE" ? [] : "";
                setStore(result);
                setAssignLabParameterHeaderID(null);
                console.log(err);
            });
    };

    useEffect(() => {
        getAllCpoeMasterRecordList();
    }, [store]);

    return (
        <>
            <div className="w-full" id="upDateParameter">
                {/* form */}
                <div className="px-3 bg-white rounded-curve py-3 rounded-curve mx-auto w-full border border-stroke">
                    <div className="font-bold mb-4 w-full ">
                        <h1 className="w-full">
                            Laboratory Service Parameter Configuration
                        </h1>
                    </div>

                    <div className="w-full flex gap-4">
                        <div className="w-1/3 ">
                            <div className="relative my-select">
                                <ReactSelectBox
                                    value={fields.prty}
                                    options={serviceItmes}
                                    onChange={onselectPrority}
                                    label="Laboratory Service *"
                                    isSearchable={true}
                                    isMultiple={false}
                                />

                            </div>
                        </div>
                        <div className="w-1/3">
                            <FormPropsTextFields
                                label={`Service Code`}
                                name="serviceCode"
                                value={fields.serviceCode}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none "
                            />
                        </div>
                        <div className="w-1/3">
                            <FormPropsTextFields
                                label={`Department`}
                                name="department"
                                value={fields.department}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none"
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
                            // className="!bg-[#eceff1] pointer-events-none"
                            />
                        </div>
                        <div className="w-3/4">
                            <FormPropsTextFields
                                label={`Terminology Code - Description`}
                                name="tcd"
                                value={fields.tcd}
                                handleChange={fieldOnchange}
                            // className="!bg-[#eceff1] pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* gridTable and form*/}
                    <div className="px-3 mt-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
                        {/* form */}
                        <div className="w-full flex gap-4 mb-4">
                            <div className="w-2/4 relative">
                                <ReactSelectBox
                                    value={fields.labParameter}
                                    options={labParameterlist}
                                    onChange={onlabParameter}
                                    label="Laboratory Parameter"
                                    isSearchable={true}
                                    onSearchInputChange={(e: any) => {
                                        parameterList(e);
                                    }}
                                    isMultiple={false}
                                    isDisabled={fields.prty.label !== 'Laboratory Service *' ? false : true}
                                />

                            </div>
                            <div className="w-2/4 flex gap-4" >
                                <div className="relative">
                                    <FormPropsTextFields
                                        label={`Min Normal Range`}
                                        name="min_normal_range"
                                        value={fields.min_normal_range}
                                        handleChange={fieldOnchange}
                                        containerProps={{
                                            className: "!min-w-0",
                                        }}
                                    />
                                    {/* {fields.min_normal_range && !allowOnlyNumbers.test(fields.min_normal_range) && (
                                        <div className="absolute text-xs ml-1 text-red-500">
                                            Please enter numbers !
                                        </div>
                                    )} */}
                                </div>
                                <div className="relative">
                                    <FormPropsTextFields
                                        label={`Max Normal Range`}
                                        name="max_normal_range"
                                        value={fields.max_normal_range}
                                        handleChange={fieldOnchange}
                                        containerProps={{
                                            className: "!min-w-0",
                                        }}
                                        type="number"
                                    />
                                    {/* {fields.max_normal_range && !allowOnlyNumbers.test(fields.max_normal_range) && (
                                        <div className="absolute text-xs ml-1 text-red-500">
                                            Please enter numbers !
                                        </div>
                                    )} */}
                                </div>
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
                                    disabled={fields.labParameter.label !== "Laboratory Parameter" ? false : true}
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

            {/** Delete record showing popup */}
            <ReactCommonDialog
                open={modaloc.open}
                handler={() => setModaloc({ ...modaloc, open: false })}
                popupClose={() => setModaloc({ ...modaloc, open: false })}
                Content={<DeletePopupMsg
                    btnYesFun={deleteRow}
                    btnNoFun={() => setModaloc({ ...modaloc, open: false })}
                    content={'Do you want to Delete this record?'}
                    loader={delLoader}
                />}
            />
        </>
    );
};

export default LaboratoryMaster;
