"use client";
import {
    activeInactiveEtityData,
    deleteServiceEntityData,
    getLocation,
    getLocationDDByServiceEntity,
    getLocationsByServiceEntity,
    getServiceEntity,
    isUserExistByLocation,
    serviceEntitytoLocation,
    updateServiceEtnityData,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import {
    Dialog,
    DialogFooter,
    DialogHeader,
    Button,
} from "@material-tailwind/react";
import { ServiceEntityForm } from "./components";
import ActionButton from "@/app/_common/button";
import { useRouter } from "next/navigation";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
const AssignServiceEntityLocation = (props: any) => {
    // loader states here
    const [loader, setLoader] = useState<any>(false);

    // modal popup for open and close and set the fields
    const [modaloc, setModaloc] = useState<any>({
        open: false,
    });

    // set the field key from below states
    const [fields, setFields] = useState<any>({
        service_entity: {
            label: "Service Entity",
        },
        service_location: null,
        serviceEntityAssignId: null,
    });

    const [serviceEntity, setServiceEntity] = useState<any>([]); // get the service entity from api
    const [serviceLocation, setServiceLocation] = useState<any>([]); // get the service Location from api

    const [serviceStore, setServiceStore] = useState<any>([]); // get the saved service entity from api
    const router = useRouter()
    // grid section here
    const columns: GridColDef[] = [
        {
            field: "id",
            headerName: "Sno",
            width: 80,
            // renderCell: (params) => {
            //     const rowNumber = serviceStore.indexOf(params.row) + 1;
            //     return rowNumber;
            // },
        },
        {
            field: "serviceEntityCode",
            headerName: "Service Entity Code",
            width: 140,
        },
        {
            field: "serviceEntityDesc",
            headerName: "Service Entity Description",
            width: 250,
        },
        { field: "locationDesc", headerName: "Service Location", width: 220 },
        {
            field: "status",
            headerName: "Status",
            width: 80,
            renderCell: (params: any) => (
                <>
                    <div
                        className={`${params.row.statusFlag === 0 ? "text-red-600" : "text-green-600"
                            }`}
                    >
                        {params.row.status}
                    </div>
                </>
            ),
        },

        {
            field: "actions",
            headerName: "Actions",
            width: 110,
            renderCell: (params: any) => (
                <>
                    <div className="flex gap-2 items-center justify-center">
                        <div className="w-5 h-5 text-blue-400 cursor-pointer">
                            {params.row.statusFlag === 0 ? null : (
                                <PencilIcon
                                    onClick={() => {
                                        EditService(params.row);
                                    }}
                                />
                            )}
                        </div>
                        <div
                            className="cursor-pointer"
                            onClick={() => {
                                inActiveMark(params.row);
                            }}
                        >
                            {params.row.statusFlag === 0 ? (
                                <InactiveIcon className="w-3 h-3" />
                            ) : (
                                <ActiveIcon className="w-3 h-3" />
                            )}
                        </div>
                    </div>
                </>
            ),
        },
        {
            field: "delete",
            headerName: "Delete",
            width: 80,
            renderCell: (params: any) => (
                <>
                    <div className="flex gap-2">
                        <TrashIcon
                            className="w-5 h-5 text-red-400 cursor-pointer"
                            onClick={() => { handleDelete(params.row) }

                            }
                        />
                    </div>
                </>
            ),
        },
    ];
    const handleDelete = (data: any) => {
        console.log("Data", data);
        services
            .get(isUserExistByLocation + data.masterHospitalLocationTbl.locationId)
            .then((response) => {
                if (response.data == true) {
                    toast.error(
                        "Cannot delete this location as it is assigned to user(s)"
                    );
                } else {
                    setModaloc({
                        ...modaloc,
                        open: true,
                        data: data,
                    });
                }
            })
            .catch((err) => {
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                }
            });
    };
    // toast Error Message common Function
    const ToasErrorMessage = (err: any) => {
        switch (err.response.status) {
            case 500:
                setTimeout(() => {
                    setLoader(false);
                    getAllServicesSavedData();
                    toast.error(err.response.data.statusMessage);
                    setFields({
                        service_entity: {
                            label: "Service Entity",
                        },
                        service_location: null,
                        serviceEntityAssignId: null,
                    });
                }, 2000);
                break;
            default:
                toast.error("Something went wrong");
                break;
        }
    };

    // save Service Entity Location
    const saveServiceEntityLocation = () => {
        setLoader(true);
        let locationIdservie: any[] = fields.service_location.map((list: any) => {
            return {
                locationId: list.value,
            };
        });
        let postObj = {
            serviceEntityAssignId: null,
            masterHospitalLocationTblSet: locationIdservie,
            masterHospServiceEntityTbl: {
                serviceEntityId: fields.service_entity.value,
            },
            statusFlag: 1,
        };
        services
            .create(serviceEntitytoLocation, postObj)
            .then((response) => {
                setTimeout(() => {
                    setLoader(false);
                    toast.success("Successfully Added Service Entity Location");
                    getAllServicesSavedData();
                    setFields({
                        service_entity: {
                            label: "Service Entity",
                        },
                        service_location: null,
                        serviceEntityAssignId: null,
                    });
                }, 2000);
            })
            .catch((err: any) => {
                setLoader(false);
                console.log(err);
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                } else {
                    ToasErrorMessage(err);
                }

            });
    };

    // add keys value and label with this mthod
    const MethodsKeys = (resultsMap: any) => {
        return resultsMap.map((item: any) => ({
            ...item,
            value: item.id,
            label: item.desc,
        }));
    };

    // get all services data
    const getAllServicesApi = () => {
        const fetchServiceEntity = services.get(getServiceEntity);
        const fetchLocation = services.get(getLocation);

        Promise.allSettled([fetchServiceEntity, fetchLocation])
            .then((results: any) => {
                results.forEach((result: any, index: number) => {
                    if (result.status === "fulfilled") {
                        switch (index) {
                            case 0:
                                const mappedServiceEntityData = MethodsKeys(result.value.data);
                                setServiceEntity(mappedServiceEntityData);
                                break;

                            case 1:
                                const mappedLocationData = MethodsKeys(result.value.data);
                                // setServiceLocation(mappedLocationData);
                                break;
                            default:
                                break;
                        }
                    } else {
                        console.error(
                            `API at index ${index} failed with error:`,
                            result.reason
                        );
                    }
                });
            })
            .catch((error) => {
                console.error("Error occurred during Promise.allSettled:", error);
            });
    };

    // service fields clear for this method
    const serviceFieldsClear = () => {
        setFields({
            service_entity: {
                label: getHeaderResponse().serviceEntityDesc,
                value:getHeaderResponse().serviceEntityId

            },
            service_location:  null,
            serviceEntityAssignId: null,
        });
    };

    // get all save service entity data from below api
    const getAllServicesSavedData = () => {
        services
            .get(serviceEntitytoLocation)
            .then((res: any) => {
                let actualData: any = res.data
                    .map((list: any) => {
                        return {
                            ...list,
                            serviceEntityCode:
                                list.masterHospServiceEntityTbl.serviceEntityCode,
                            serviceEntityDesc:
                                list.masterHospServiceEntityTbl.serviceEntityDesc,
                            status: list.statusFlag === 0 ? "InActive" : "Active",
                            locationDesc: list.masterHospitalLocationTbl.locationDesc,
                        };
                    })
                    .reverse();
                setServiceStore(actualData);
            })
            .catch((err: any) => {
                console.log(err);
            });
    };

    // active and inactive recors
    const inActiveMark = (data: any) => {
        const statusFlagStatus =
            data.statusFlag === 1 || data.statusFlag === null ? 0 : 1;
        services
            .get(
                `${activeInactiveEtityData}${data.serviceEntityAssignId}/${statusFlagStatus}`
            )
            .then((res: any) => {
                toast.success(
                    `Successfully ${data.statusFlag === 1 ? "InActive" : "Active"} of ${data.masterHospServiceEntityTbl.serviceEntityDesc
                    } Record`
                );
                getAllServicesSavedData();
            })
            .catch((err: any) => {
                console.log(err);
                ToasErrorMessage(err);
            });
    };

    // delete the Record
    const deleteServiceEntity = () => {
        setLoader(true);
        services
            .create(`${deleteServiceEntityData}`, {
                serviceEntityAssignId: modaloc.data.serviceEntityAssignId
            })
            .then((res) => {
                setLoader(false);
                toast.success("Successfully Deleted Service Entity");
                getAllServicesSavedData();
                setModaloc({ ...modaloc, open: false });

            })
            .catch((err) => {
                console.log(err);
                ToasErrorMessage(err);
            });
    };

    // Edit the service
    const EditService = (data: any) => {
        setFields({
            service_entity: {
                label: data.masterHospServiceEntityTbl.serviceEntityDesc,
                value: data.masterHospServiceEntityTbl.serviceEntityId,
            },
            service_location: {
                label: data.locationDesc,
                value: data.masterHospitalLocationTbl.locationId,
            },
            serviceEntityAssignId: data.serviceEntityAssignId,
        });
    };

    // update Service Entity Location
    const updateServiceEntityLocation = () => {
        if(!fields.service_location?.value){
            toast.error("Location is required");
            return;
        }
        if(!fields.service_entity?.value){
            toast.error("Location is required");
            return;
        }
        let postObj = {
            serviceEntityAssignId: fields.serviceEntityAssignId,
            masterHospitalLocationTblSet: [{
                locationId: fields.service_location.value,
            }],
            masterHospServiceEntityTbl: {
                serviceEntityId: fields.service_entity.value,
            },
        };
        setLoader(true);
        services
            .create(serviceEntitytoLocation, postObj)
            .then((res) => {
                setTimeout(() => {
                    setLoader(false);
                    toast.success("Successfully Updated Service Entity Location...");
                    getAllServicesSavedData();
                    setFields({
                        service_entity: {
                            label: "Service Entity",
                        },
                        service_location: null,
                        serviceEntityAssignId: null,
                    });
                }, 2000);
            })
            .catch((err: any) => {
                setTimeout(() => {
                    setLoader(false);
                    ToasErrorMessage(err);
                    getAllServicesSavedData();
                    setFields({
                        service_entity: {
                            label: "Service Entity",
                        },
                        service_location: null,
                        serviceEntityAssignId: null,
                    });
                }, 2000);
            });
    };
    const gotoLocationScreen = () => {
        props.handleTabClick("location", "")
    }
    const handleServiceEntity=(data:any) => {
        services
          .get(getLocationDDByServiceEntity + data.value)
          .then((response) => {
            response.data.map((item: any) => {
              item.value = item.locationId;
              item.label = item.locationDesc;
            });
            setServiceLocation(response.data);
            setFields({
              ...fields,
              service_entity: data,
              service_location:null,
            });
          })
          .catch((error) => {
            setServiceLocation([]);
          });
    }
    useEffect(() => {
        getAllServicesApi();
        getAllServicesSavedData();
        handleServiceEntity({
          value: getHeaderResponse().serviceEntityId,
          label: getHeaderResponse().serviceEntityDesc,
        });
    }, []);
    return (
        <>
            <div className="w-full">
                <div className="px-3 bg-white rounded-curve py-3 rounded-curve mx-auto w-full border border-stroke">
                    <div className="font-bold mb-4 w-full ">
                        <h1 className="w-full">Assign Service Entity Location</h1>
                    </div>
                    {/* 
                    <ServiceEntityForm
                        fields={fields}
                        setFields={setFields}
                        serviceEntity={serviceEntity}
                        serviceLocation={serviceLocation}
                        serviceFieldsClear={serviceFieldsClear}
                        saveServiceEntityLocation={saveServiceEntityLocation}
                        loader={loader}
                        updateServiceEntityLocation={updateServiceEntityLocation}
                        gotoLocationScreen={gotoLocationScreen}
                    /> */}
                    <div className="w-full flex gap-4  mb-4">
                        <div className="w-1/4 relative">
                            <ReactSelectBox
                                value={fields.service_entity}
                                options={serviceEntity}
                                isSearchable={true}
                                isMultiple={false}
                                onChange={(e: any) => {
                                    handleServiceEntity(e)
                                }}
                                isDisabled={getHeaderResponse().serviceEntityId}
                                label="Service Entity"
                                optionListWidtsize={true}
                            />
                        </div>

                        <div className="w-1/4 relative">
                            <ReactSelectBox
                                value={fields.service_location}
                                options={serviceLocation}
                                isSearchable={true}
                                isMultiple={fields.serviceEntityAssignId !== null ? false : true}
                                onChange={(e: any) => {
                                    setFields({
                                        ...fields,
                                        service_location: e,
                                    });
                                }}
                                label="Location"
                                optionListWidtsize={true}
                            />

                        </div>

                        <div className="w-2/4 flex gap-4">
                            {fields.serviceEntityAssignId !== null ? (
                                <>
                                    <Button
                                        className="
                                    bg-blue-500
                                    hover:bg-blue-600
                                    text-white
                                    !h-[40px] 
                                    w-[120px] py-3 text-center flex justify-center
                                "
                                        onClick={updateServiceEntityLocation}
                                        disabled={
                                            fields.service_entity?.label !== "Service Entity" &&
                                                (fields?.service_location?.length > 0 ||
                                                    fields?.service_location?.label !== "Location")
                                                ? false
                                                : true
                                        }
                                    >
                                        {loader ? (
                                            <>
                                                <div className="innerBtnloader"></div>
                                            </>
                                        ) : (
                                            "UPDATE"
                                        )}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        className="
                                    bg-blue-500
                                    hover:bg-blue-600
                                    text-white !h-[40px] 
                                    w-[120px] py-3 text-center flex justify-center
                                "
                                        onClick={saveServiceEntityLocation}
                                        disabled={
                                            fields.service_entity?.label !== "Service Entity" &&
                                                fields?.service_location?.length > 0
                                                ? false
                                                : true
                                        }
                                    >
                                        {loader ? (
                                            <>
                                                <div className="innerBtnloader"></div>
                                            </>
                                        ) : (
                                            "SAVE"
                                        )}
                                    </Button>
                                </>
                            )}

                            <ActionButton
                                buttonText="RESET"
                                handleSubmit={serviceFieldsClear}
                                width="w-[120px] !h-[40px]  py-3 bg-blue-500 hover:bg-blue-600 border-blue-500 uppercase"
                            />
                            <button
                                className="mr-2 !h-[40px]   bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md text-[14px]"
                                onClick={(e) => props.handleTabClick("location", e)}
                            >
                                Add New Location
                            </button>
                        </div>
                    </div>
                    <div className="data-grid-newThem">
                        <ReactDatagrid
                            rows={serviceStore}
                            toolsRequired
                            columns={columns}
                        />
                    </div>

                    {/* <DataGrid
                        rows={serviceStore}
                        columns={columns}
                        getRowId={() => uuidv4()}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 10,
                                },
                            },
                        }}
                        pageSizeOptions={[15]}
                        density="compact"
                    /> */}
                    <div className="w-full pt-4 flex justify-end">

                    </div>
                </div>
            </div>

            {/*
                ========= Delete Section Alert Popup ==========
            */}

            <Dialog
                open={modaloc.open}
                handler={() => setModaloc({ ...modaloc, open: false })}
                size={"xs"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5 max-w-[430px]"
            >
                <DialogHeader className=" justify-center">
                    <div className="w-100">
                        <div className="text-center text-[20px] text-blue-500">
                            Are you sure,
                        </div>
                        <div className="text-center text-[20px] text-blue-500">
                            Do you want to Delete this Service?
                        </div>
                    </div>
                </DialogHeader>
                <DialogFooter className="text-center justify-center">
                    <Button
                        variant="gradient"
                        color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600"
                        onClick={deleteServiceEntity}
                    >
                        <span>Yes</span>
                    </Button>
                    <Button
                        variant="gradient"
                        className="bg-red-500 hover:bg-red-600"
                        color="red"
                        onClick={() => setModaloc({ ...modaloc, open: false })}
                    >
                        <span>No</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
};

export default AssignServiceEntityLocation;