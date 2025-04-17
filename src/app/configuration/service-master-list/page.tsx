"use client";
import React, { useEffect, useState } from "react";
import {
  getAllServiceDetails,
  getConfigData,
  getServiceDetailsById,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import ActionButton from "../../_common/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Input from "@/app/_common/input";
import { Dialog, DialogBody } from "@material-tailwind/react";
import ServiceCreation from "../service-creation/page";
import { PencilIcon } from "@heroicons/react/24/solid";
import { v4 as uuidv4 } from "uuid";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithHyphen } from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { sanitizeObject } from "@/app/utilities/sanitizeObject";
import ParameterHeading from "../component/ParameterHeading";

export default function ServicemasterList(props: any) {
  const [serviceTypeDD, setServiceTypeDD] = useState<any>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<any>({
    label: "Service Type *",
  });
  const [open, setOpen] = useState<boolean>(false);
  const [serviceData, setServiceData] = useState<any>([]);
  const [selDescription, setSelDescription] = useState<string>("");
  const [serviceDetails, setServiceDetails] = useState<any>({});

  const columns: GridColDef[] = [
    {
      field: "sno", headerName: "Sno", width: 80, renderCell: (params: any) => {
        const number = serviceData.indexOf(params.row) + 1
        return number
      }
    },
    { field: "serviceType", headerName: "Service Type", width: 120 },
    { field: "serviceDesc", headerName: "Service Name", width: 120 },
    { field: "serviceCode", headerName: "Code", width: 120 },
    { field: "department", headerName: "Department", width: 120 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "edit",
      headerName: "Edit",
      width: 120,
      renderCell: (params: any) => (
        <div className="w-6 h-4 text-blue-600 cursor-pointer">
          <PencilIcon onClick={() => handleFetchData(params.row.serviceId)} />
        </div>
      ),
    },
  ];

  const handleFetchData = (serviceId: any) => {
    services
      .get(getServiceDetailsById + serviceId)
      .then((response) => {
        setServiceDetails(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
    setOpen(true);
  };

  const handleData = () => {
    services
      .get(
        getAllServiceDetails + selectedServiceType.value + "/" + selDescription
      )
      .then((response) => {
        let data = response.data.map((item: any, index: number) => ({
          ...item,
          sno: index,
        }));
        setServiceData(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    services
      .get(getConfigData + "MasterServiceType" + "/0")
      .then((response) => {
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setServiceTypeDD(transformedData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>


      <div className="px-3 bg-white rounded-curve py-3 rounded-curve mx-auto w-full border border-stroke">
        <ParameterHeading
          title="Service Master List"
        />
        <div className="grid gap-y-2 gap-x-2">
          <div className="relative flex gap-4 p-2 px-0">
            <div className="w-full">
              <ReactSelectBox
                value={selectedServiceType}
                options={serviceTypeDD}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSelectedServiceType(sanitizeObject(e));
                }}
                label="Service Type *"
              />
            </div>
            <div className="w-full relative">
              <Input
                type="text"
                label="Service Description *"
                name="basePrice"
                handleChange={(e: any) => {
                  setSelDescription(sanitizeInput(e.target.value));
                }}
                pattern="[a-zA-Z0-9]*"
                value={selDescription}
              />
              {selDescription && !alphaNumWithHyphen.test(selDescription) && (
                <div className="absolute text-xs mt-1 ml-1 text-red-500">
                  Please do not enter special characters !
                </div>
              )}
            </div>

            <div className="w-full flex gap-4">
              <ActionButton
                buttonText="Search"
                handleSubmit={handleData}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                disabled={
                  selDescription &&
                    alphaNumWithHyphen.test(selDescription) &&
                    selectedServiceType !== "Service Type *"
                    ? false
                    : true
                }
              />
              <ActionButton
                buttonText="New"
                handleSubmit={() => {
                  setServiceDetails({});
                  setOpen(true);
                }}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
          <div className="data-grid-newThem mt-0">
            <ReactDatagrid
              rows={serviceData}
              toolsRequired={true}
              columns={columns}
            />
          </div>
          {/* <div className="mt-0">
            <DataGrid
              rows={serviceData}
              columns={columns}
            />
          </div> */}
          <div>

            <ReactCommonDialog
              open={open}
              handler={handleOpen}
              popupClose={handleOpen}
              Content={<ServiceCreation
                setOpen={setOpen}
                serviceDetails={serviceDetails}
                handleData={handleData}
              />}
              size={'xl'}
              dialogtitle="Service Creation"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
