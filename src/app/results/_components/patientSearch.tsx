"use client";
import React, { useState } from "react";
import {
    DataGrid,
    GridColDef,
    GridEventListener,
} from "@mui/x-data-grid";
import { PatientDatadataAuth } from "@/app/_common/context/DataStore";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import services from "@/app/utilities/services";
import { savePatientSearch } from "@/app/utilities/api-urls";
import Loader from "@/app/_common/loader";
import Input from "@/app/_common/input";
import ActionButton from "@/app/_common/button";
import { PencilIcon } from "@heroicons/react/24/solid";


export default function PatientSearch(props: any) {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm({});

    const [loading, setLoading] = useState(false);
    const [selectedDate1, setSelectedDate1] = React.useState("");
    const [searchButton, setSearchButton] = useState(false);
    const [dataa, setDataa] = useState([]);
    const [key, setKey] = useState(2);


    const columns: GridColDef[] = [
        { field: "mrn", headerName: "MRN", width: 120 },
        {
            field: "fullName",
            headerName: "Patient Name",
            width: 100,
        },
        { field: "lastName", headerName: "", width: 100 },
        { field: "aadharNo", headerName: "Aadhar Number", width: 120 },
        { field: "ageOfPatient", headerName: "Age", width: 200 },
        { field: "genderDesc", headerName: "Gender", width: 100 },
        { field: "primaryContactNum", headerName: "Phone ", width: 100 },
        {
            field: "ResultEntry",
            headerName: "Show Order",
            width: 70,
            align: "center",
            headerAlign: "center",
            renderCell: (params: any) =>
                <div>
                    <PencilIcon className="w-5 h-5 text-blue-500 " onClick={() => viewPopup(params.row.patientId)} />
                </div>
        },
    ];

    // context get intliize here

    const onSubmit = (data: any) => {
        setLoading(true);
        let postObj = {
            abhaAddress: data.abhaaddress,
            abhaId: data.abhaId,
            contactNo: data.contactNo,
            dob: "",
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            mrn: data.mrn,
            nationalIdNo: data.nationalIdNo,
        };
        services
            .create(savePatientSearch, postObj)
            .then((response) => {
                setDataa(response.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                console.log(err.message);
            });
    };

    const getRowId = (row: any) => row.patientId;
    const clearForm = () => {
        reset();
        setKey((k) => k + 1);
        setSelectedDate1("");
    };

    const router = useRouter();

    //get single data from data grid click event
    const { setPatientData, patientData } = PatientDatadataAuth();
    const [viewBtn, setViewBtn] = useState(false);
    const handleRowClick: GridEventListener<"rowClick"> = (params) => {
        setPatientData(params.row);
        setViewBtn(true);
    };

    const viewPopup = (data: any) => {
        router.replace(`/results/${data}/results-entry`);
        props.popupclose(false);
    };

    return (
        <div className="px-4">
            {loading ? <Loader /> : ""}
            <div key={key} className=" bg-white "            >
                <div className="flex gap-4">
                    <div className="my-2 w-1/4">
                        <Input
                            type="text"
                            name="firstName"
                            watch={watch}
                            label="First Name"
                            required={false}
                            inputRef={register("firstName", {
                                required: false,
                            })}
                            className="mb-6"
                        ></Input>
                    </div>
                    <div className="my-2 w-1/4">
                        <Input
                            type="text"
                            name="middleName"
                            watch={watch}
                            label="Middle Name"
                            inputRef={register("middleName", {
                                required: false,
                            })}
                            className="mb-6"
                        ></Input>
                    </div>
                    <div className="my-2 w-1/4">
                        <Input
                            type="text"
                            name="lastName"
                            watch={watch}
                            label="Last Name"
                            inputRef={register("lastName", {
                                required: false,
                            })}
                            className="mb-6"
                        ></Input>
                    </div>
                    <div className="my-2 w-1/4">
                        <Input
                            type="text"
                            name="mrn"
                            watch={watch}
                            label="MRN"
                            inputRef={register("mrn", {
                                required: false,
                            })}
                            className="mb-6"
                        ></Input>
                    </div>
                </div>

                <div className=" flex justify-end gap-4 mb-3">

                    <ActionButton
                        buttonText="SEARCH"
                        handleSubmit={handleSubmit(onSubmit)}
                        disabled={searchButton}
                        width="w-[120px] py-3"
                    />
                    <ActionButton
                        buttonText="RESET"
                        handleSubmit={clearForm}
                        disabled={searchButton}
                        color="red"
                        width="w-[120px] py-3"
                    />
                </div>
            </div>
            <div className="px-4 bg-white rounded-curve md:pt-1 pb-3 rounded-curve mx-auto w-full border border-stroke">
                <h1 className="my-3 font-semibold text-xl">Search Results</h1>
                <DataGrid
                    rows={dataa}
                    columns={columns}
                    getRowId={getRowId}
                    onRowClick={handleRowClick}
                    checkboxSelection={false}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 5,
                            },
                        },
                    }}
                    pageSizeOptions={[10]}

                />
            </div>
            {viewBtn ? (
                <>
                </>
            ) : (
                ""
            )}

        </div>
    );
}
