"use client";
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ActionButton from "@/app/_common/button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useRef, useState } from "react";
import LocationPop from "./LocationPop";
import {
  ActiveStatuslocationByService,
  DeletelocationByService,
  EditLocationsByid,
  getAllLocationData,
  getEntity,
  isUserExistByLocation,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import moment from "moment";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ParameterHeading from "../component/ParameterHeading";
function Location() {
  const topScroll: any = useRef();
  const [feilds, setFeilds] = useState<any>({
    locationCode: "",
    locationDesc: "",
    licenseNum: "",
    pincodeId: "",
    country: "",
    mobile: "",
    district: "",
    state: "",
    organiZation: getHeaderResponse().serviceEntityId? {
      label: getHeaderResponse().serviceEntityDesc,
      value: getHeaderResponse().serviceEntityId,
    }:{label:"Organization*"},
    locationType: { label: "Location Type" },
    locationSubType: { label: "Location Sub Type" },
    referalLocation: { label: "Referal Location" },
  });
  const [dataa, setDataa] = useState<any>([]);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [modaloc, setModaloc] = useState<any>({
    active: false,
    delete: false,
  });
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
      // renderCell: (params: any) => {
      //   const rowNumber = dataa.indexOf(params.row) + 1;
      //   return rowNumber;
      // },
    },
    { field: "locationCode", headerName: "Location code", width: 150 },
    { field: "locationDesc", headerName: "Location Discription", width: 200 },
    {
      field: "generatedDate",
      headerName: "Generated Date",
      width: 130,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "updatedDate",
      headerName: "Updated Date",
      width: 130,
      renderCell: (params: any) => (
        <>
          {params.row.updatedDate && params.row.updatedDate ? (
            <>{moment(params.row.updatedDate).format("DD-MM-YYYY")}</>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag === 1 ? (
            <div className="text-green-700">Active</div>
          ) : (
            <div className="text-red-700">InActive</div>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: any) => (
        <>
          <div className="w-5 h-5 me-4 cursor-pointer">
            {params.row.statusFlag === 1 && (
              <PencilIcon
                className="text-blue-500 w-5 h-5 cursor-pointer me-2"
                onClick={() => handleEdit(params.row)}
              />
            )}
          </div>

          <div
            onClick={(e: any) => {
              handelActive(params.row)
            }}
            className="cursor-pointer"
          >
            {params.row.statusFlag === 0 ? (
              <InactiveIcon className="w-5 h-5 cursor-pointer" />
            ) : (
              <ActiveIcon className="w-5 h-5 cursor-pointer" />
            )}
          </div>
        </>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 60,
      renderCell: (params: any) => (
        <>
          <TrashIcon
            className="text-red-500 w-5 h-5 cursor-pointer"
            onClick={(e: any) => {
              // onDelete(params.row)
              handleDelete(params.row);
              // setModaloc({
              //   ...modaloc,
              //   delete: true,
              //   id: params.row.locationId,
              // });
              // setModaloc({ ...modaloc, open: true, id: params.row.id });
            }}
          />
        </>
      ),
    },
  ];



  // Active button functionality
  const handelActive = (rowData: any) => {
    // let rowData: any = activeInactivepop.dataStore
    try {
      const id = rowData.locationId;
      const StatusFlagStatus = rowData.statusFlag === 1 ? 0 : 1;
      const message =
        rowData.statusFlag === 0
          ? "Successfully Activated the record"
          : "Successfully InActivated the record";

      services
        .get(`${ActiveStatuslocationByService}${id}/${StatusFlagStatus}`)
        .then((response: any) => {
          toast.success(message);
          getGridData();

        })
        .catch((err: any) => {
          console.log(err.message);
          toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)

        });
    } catch (err: any) {
      console.log(err.message);
      setTimeout(() => {
        console.log(err.message);
        toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)

      }, 2000);
    }
  };

  // edit button functionality
  const handleEdit = (rowData: any) => {
    topScroll.current.scrollIntoView({
      behavior: "smooth",
    });

    const url = `${EditLocationsByid}${rowData.locationId}`;
    // Assuming `services.get` returns a promise
    services
      .get(url)
      .then((res: any) => {
        if (res.data) {
          setIsLocationLimitReached(false)
          const data = res.data;
          let obj = {
            locationId: data.locationId,
            locationImage: data.locationImage,
            locationCode: data.locationCode,
            locationDesc: data.locationDesc,
            licenseNum: data.licenseNum,
            locationWebsite: data.locationWebsite,
            pincodeId: data.pincodeId,
            houseNo: data.houseNo, 
            location: data.location,
            city: data.city,
            mandal: data.mandal,
            district: data.district,
            state: data.state,
            country: data.country,
            mobile: data.mobile,
            //   organiZation: data.organiZation,
            //  referalLocation: data.referalLocation,
            locationSubType: { label: data.locationSubType },
            locationType: { label: data.locationType },
            organiZation: { label: data.organiZation,value:data.serviceEntityId },
            referalLocation: { label: data.referalLocation },
          };
          setFeilds(obj);
        } else {
          console.error("Invalid response:", res);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };
  const [isLocationLimitReached,setIsLocationLimitReached]=useState(false)
  // data getting functionality
  const getGridData = async () => {
    try {
      const res = await services.get(getAllLocationData);
      setDataa(res.data.data);
      setIsLocationLimitReached(res.data.isLocationLimitReached)
      if(res.data.isLocationLimitReached){
        toast.error("Location limit reached can't add more locations");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const handleDelete = (data:any) => {
    services
        .get(isUserExistByLocation + data.locationId)
        .then((response) => {
            if (response.data == true) {
                toast.error(
                    "Cannot delete this location as it is assigned to user(s)"
                );
            } else {
              setModaloc({
                ...modaloc,
                delete: true,
                id: data.locationId,
              });
            }
        })
        .catch((err) => {
            if (err.response.data.statusMessage) {
                toast.error(err.response.data.statusMessage);
            }
        });
  }
  const [delLoader, setDelLoader] = useState<any>(false)

  // Delete button functionality
  const onDelete = () => {
    setDelLoader(true)
    const id = modaloc.id;
    try {
      services
        .create(`${DeletelocationByService}`,{
          locationId:id
      })
        .then((response: any) => {
          setDelLoader(false)
          if(response.data.statusMessage){
            toast.success(response.data.statusMessage);
          }else{
            toast.success("Successfully Deleted the record");
          }
          getGridData();
          setModaloc({ ...modaloc, delete: false });
        })
        .catch((err: any) => {
          setDelLoader(false)
          if(err.response.data.statusMessage){
            toast.error(err.response.data.statusMessage);
          }else{
            toast.error("Failed to delete the record");
          }
        });
    } catch (error: any) {
      setDelLoader(false)
      console.log(error.message);
    }
  };

  useEffect(() => {
    getGridData();
  }, []);
  return (
    <>
      {/* <div>configuration/location</div> */}
      <div className="px-3 bg-white rounded-curve py-3 mx-auto w-full border border-stroke">
        <div className="px-4 md:pt-3 pb-2 mx-auto w-full flex justify-between">
          <ParameterHeading
            title="Location"
          />

          {/* <h1 className="w-full flex justify-between">
                        <span className="w-3/4 text-xl">Location</span> */}
          {/* <span className="cursor-pointer"
                        >
                            <ActionButton buttonText="+ New Location" handleSubmit={showLocation} />
                           
                        </span> */}
          {/* </h1> */}
        </div>

        <div className={`w-full py-2 border-b-2 mb-5 ${isLocationLimitReached?"pointer-events-none":""}`}>
          <LocationPop
            feilds={feilds}
            setFeilds={setFeilds}
            selectedRowId={selectedRowId}
            getGridData={getGridData}
            topScroll={topScroll}
          />
        </div>
        <div className="data-grid-newThem">
        <ReactDatagrid rows={dataa} toolsRequired columns={columns}/>
        </div>
       
        {/* <DataGrid
          autoHeight
          rows={dataa}
          columns={columns}
          // getRowId={(row) => uuidv4()}
          getRowId={(row) => row.locationId}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[15]}
        /> */}
      </div>

      {/*  Dailog Delete message popup box  */}
      <ReactCommonDialog
        open={modaloc.delete}
        handler={() => setModaloc({ ...modaloc, delete: false })}
        popupClose={() => setModaloc({ ...modaloc, delete: false })}
        Content={
          <DeletePopupMsg
            btnYesFun={onDelete}
            btnNoFun={() => setModaloc({ ...modaloc, delete: false })}
            content={<>
              you want to Delete this record?
              <div className="w-full text-black">
                <small>
                  <strong>Note:</strong>
                  Once you Delete this record, you cannot rollback
                </small>
              </div>

            </>}
            loader={delLoader}
          />
        }
      />

    </>
  );
}

export default Location;
