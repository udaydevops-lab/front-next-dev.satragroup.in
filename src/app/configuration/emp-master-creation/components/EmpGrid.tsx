"use client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import moment from "moment";
import services from "@/app/utilities/services";
import {
  changeEmpStatus,
  deleteEmployee,
  getAllEmployeeList,
  getDoctorData,
  getLocationDropDown,
} from "@/app/utilities/api-urls";
import { initialFormData } from "./initialData";
import { filteredData } from "./utils";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import { getLocalItem } from "@/app/utilities/local";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";

function EmpGrid({
  titleList,
  organizationList,
  genderList,
  bloodGroupList,
  empCatList,
  empProfileList,
  departmentList,
  designationList,
  actionsData,
  setActionsData,
  setFormData,
  myDiv,
  reRender,
  setFacilityList,
}: any) {
  const [gridData, setGridData] = useState<any>([]);
  const [paramData, setParamData] = useState({});
  const [type, setType] = useState("");
  const [popText, setPopText] = useState("");
  const columns: GridColDef[] = [
    { field: "sno", headerName: "S.No", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 270,
    },
    // {
    //   field: "roleDes",
    //   headerName: "Role",
    //   width: 180,
    // },
    {
      field: "priContactNum",
      headerName: "Mobile",
      width: 200,
    },
    {
      field: "generatedDate",
      headerName: "Created On",
      width: 130,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY")}</>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag == 1 ? (
            <button onClick={() => handleEditIcon(params.row)}>
              <PencilIcon className="text-blue-500 w-5 h-5" />
            </button>
          ) : (
            "-"
          )}
        </>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 70,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag == 1 ? (
            <div
              title="Active"
              onClick={(e: any) => handleIcons(params.row, "flag")}
              className="cursor-pointer"
            >
              <ActiveIcon />
            </div>
          ) : (
            <div
              title="Inactive"
              onClick={(e: any) => handleIcons(params.row, "flag")}
              className="cursor-pointer"
              style={{ cursor: "cursor-pointer" }}
            >
              <InactiveIcon />
            </div>
          )}
        </>
      ),
    },
    // {
    //   field: "delete",
    //   headerName: "Delete",
    //   width: 70,
    //   headerAlign: "center",
    //   align: "center",
    //   renderCell: (params: any) => (
    //     <>
    //       <div className="flex justify-center items-center">
    //         <TrashIcon
    //           className="w-5 h-5 text-red-500 cursor-pointer"
    //           onClick={() => handleIcons(params.row, "delete")}
    //         />
    //       </div>
    //     </>
    //   ),
    // },
  ];
  const getAllData = () => {
    services.get(getAllEmployeeList, headers).then((response) => {
      response.data.map((item: any, index: number) => {
        item.sno = index + 1;
      });
      setGridData(response.data);
    });
  };
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headers = {
    userId: loginResponse?.userId,
    roleId: "",
    employeename: loginResponse?.employeename,
    employeeid: loginResponse?.employeeId,
    locationId: loginResponse?.locationId,
    serviceEntityId: loginResponse?.serviceEntityId,
  };
  const handleEditIcon = (data: any) => {
    setFormData(initialFormData);
    services
      .get(getDoctorData + data.employeeId, headers)
      .then(async (response) => {
        let res = response.data[0].empData;
        let responseData = response.data[0].empData;
        responseData.employeeId = response.data[0].employeeId;
        responseData.title = filteredData(titleList, res.title);
        responseData.gender = filteredData(genderList, res.gender);
        responseData.username=response.data[0].username
        responseData.userId=response.data[0].userId
        responseData.bloodGroup = filteredData(
          bloodGroupList,
          res.bloodGroup
        );
        responseData.empCategory = filteredData(
          empCatList,
          res.empCategory
        );
        responseData.organization = filteredData(
          organizationList,
          res.serviceEntityId
        );
        services
          .get(getLocationDropDown + responseData.organization.value)
          .then((response) => {
            response.data.map((item: any) => {
              item.label = item.desc;
              item.value = item.id;
            });
            setFacilityList(response.data);
            responseData.primaryFacility = filteredData(
              response.data,
              res.locationId
            );
          });
        responseData.employeType = filteredData(
         empProfileList,
          res.employeType
        );
        responseData.designation = filteredData(
          designationList,
          res.designationCode
        );
        setActionsData({ ...actionsData, actionType: "Update" });
        myDiv.current.scrollIntoView({
          behavior: "smooth",
        });
        responseData.employeeAssignDeptSet = departmentList.filter(
          (item: any) => item.label === res.departmentDescription
        )[0];
        setFormData(responseData);
      });
  };

  const handleOpen = () =>
    setActionsData({
      ...actionsData,
      open: !actionsData.open,
    });
  const handleIcons = (data: any, type: string) => {
    handleOpen();
    setParamData(data);
    setType(type);
    if (type == "flag") {
      setPopText(data.statusFlag == 1 ? "inactive" : "active");
    } else if (type == "delete") {
      setPopText("delete");
    }
  };
  const handleYesButton = (data: any, type: string) => {
    if (type === "flag") {
      handleStatusFlag(data);
    } else if (type === "delete") {
      handleDelete(data);
    }
  };
  const handleStatusFlag = (data: any) => {
    let flag = data.statusFlag == 1 ? 0 : 1;
    services
      .get(changeEmpStatus + data.employeeId + "/" + flag)
      .then((response) => {
        toast.success(
          `Successfully ${
            data.statusFlag == 0 ? "Activated" : "Inactivated"
          } Service Entity`
        );
        handleOpen();
        getAllData();
      })
      .catch((error) => {
        handleOpen();
        toast.error("Technical Error");
      });
  };
  const handleDelete = (data: any) => {
    services
      .create(`${deleteEmployee}${data.employeeId}`, {})
      .then((res) => {
        toast.success("Employee Deleted Successfully");
        handleOpen();
        getAllData();
      })
      .catch((error) => {
        toast.error("Technical Error");
        handleOpen();
      });
  };
  useEffect(() => {
    getAllData();
  }, [reRender]);
  return (
    <div>
      <div className="data-grid-newThem my-3">
        <ReactDatagrid rows={gridData} toolsRequired={true} columns={columns} />
      </div>
      <Dialog handler={handleOpen} open={actionsData.open}>
        <DialogHeader className=" justify-center">
          <div className="w-70">
            <div className="text-center text-[20px] text-blue-500">
              Are you sure,
            </div>
            <div className="text-center text-[20px] text-blue-500">
              you want to {popText} this record?
            </div>
          </div>
        </DialogHeader>
        <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
          {""}
        </DialogBody>
        <DialogFooter className="text-center justify-center">
          <Button
            variant="gradient"
            color="blue"
            className="mr-2 bg-blue-500 hover:bg-blue-600"
            onClick={() => handleYesButton(paramData, type)}
          >
            <span>Yes</span>
          </Button>
          <Button
            variant="gradient"
            className="bg-red-500 hover:bg-red-600"
            color="red"
            onClick={handleOpen}
          >
            <span>No</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default EmpGrid;
