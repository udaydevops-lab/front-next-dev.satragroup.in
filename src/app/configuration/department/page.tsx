"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "@/app/_common/button";
import { Input } from "@material-tailwind/react";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import Select from "react-tailwindcss-select";
import {
  createDepartment,
  getAllDepartment,
  getDeparmentById,
  getStatusFlagDepartment,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { PencilIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import { ReactSelectBox } from "@/app/_commonfeatures";
import {
  allowspacepattern,
  alphaNumWithHyphen,
} from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ParameterHeading from "../component/ParameterHeading";

const Department = () => {
  
  const [departmentCode, setDepartmentCode] = useState("");
  const [versiondata, setVersionData] = useState("");
  const [departmentDescription, setDepartmentDescription] = useState("");
  const [departmentId, setDepartmentId] = useState<any>("");
  const [statusFlagStatus, setStatusFlagStatus] = useState("");
  const [departmentData, setDepartmentData] = useState<any>([]);
  const [btntxt, setBtntxt] = useState("SAVE");

  const [isclinicalList, setIsClinicalList] = useState<any>([
    { value: "yes", label: "YES" },
    { value: "No", label: "NO" },
  ]);
  const [isClinical, setIsClinical] = useState<any>({
    label: "Is Clinical",
  });
  const [loader, setLoader] = useState<any>(false)
  const columns: GridColDef[] = [
    { field: "departmentId", headerName: "S.No", width: 30 },
    {
      field: "departmentCode",
      headerName: "Department code",
      width: 150,
    },
    {
      field: "departmentDescription",
      headerName: "Department Description",
      width: 250,
    },
    { field: "isClinical", headerName: "is Clinical", width: 150 },
    { field: "version", headerName: "Version", width: 120 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <>
          {params.row.statusFlag === 0 ? (
            <div className="text-red-700">InActive</div>
          ) : (
            <div className="text-green-700">Active</div>
          )}
        </>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <div className="w-5 h-5 me-5 cursor-pointer">
            {params.row.statusFlag === 1 && (
              <PencilIcon
                className="text-blue-500 w-10 h-5 cursor-pointer"
                onClick={() => {
                  handleEdit(params.row)
                  const section = document.getElementById('sectionRef');
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />
            )}
          </div>
          <div onClick={() => onDelete(params.row)} className="cursor-pointer">
            {params.row.statusFlag === 0 ? (
              <InactiveIcon className="text-red-700 cursor-pointer" />
            ) : (
              <ActiveIcon className="'text-green-700 cursor-pointer" />
            )}
          </div>
        </>
      ),
    },
  ];

  //Active and inactive
  const onDelete = async (row: any) => {
    const flag = row.statusFlag === 0 ? 1 : 0;
    await services
      .get(getStatusFlagDepartment + row.departmentId + "/" + flag)
      .then((response) => {
        getAllDept();
        toast.success(
          `Successfully ${row.statusFlag === 1 ? "InActive" : "Active"
          } this Record`
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //Edit
  const handleEdit = async (row: any) => {
    setDepartmentCode(row.departmentCode),
      setDepartmentDescription(row.departmentDescription),
      setDepartmentId(row.departmentId),
      setStatusFlagStatus(row.statusFlag);
    setBtntxt("Update");
    setIsClinical({
      label: row.isClinical,
      value: row.isClinical,
    });
  };
  const handleDepartmentChange = (e: any) => {
    setDepartmentCode(sanitizeInput(e.target.value));
  };

  const handleDepartmentDescChange = (e: any) => {
    setDepartmentDescription(sanitizeInput(e.target.value));
  };

  //Save  and Update Department
  const handleSave = () => {
    setLoader(true)
    let postObj = {
      departmentId: departmentId ? departmentId : "",
      departmentCode: departmentCode,
      departmentDescription: departmentDescription,
      isClinical: isClinical.label,
      version: versiondata,
      statusFlag: statusFlagStatus ? statusFlagStatus : 1,
    };
    if (departmentId === "" || departmentId === null) {
      services
        .create(createDepartment, postObj)
        .then((response) => {
          setTimeout(() => {
            setDepartmentData(response.data);
            toast.success("Saved Successfully!");
            setDepartmentCode("");
            setDepartmentDescription("");
            setDepartmentId("");
            setStatusFlagStatus("");
            setIsClinical("");
            getAllDept();
            setLoader(false)
          }, 2000);

        })
        .catch((errors) => {
          if(errors.response.data.statusMessage){
            toast.error(errors.response.data.statusMessage)
          }else{
            toast.error("Technical Error")
          }
          console.log(errors.message);
        });
    } else {
      services
        .create(createDepartment, postObj)
        .then((response) => {

          setTimeout(() => {
            setDepartmentData(response.data);
            toast.success("Updated Successfully!");
            setDepartmentCode("");
            setDepartmentDescription("");
            setDepartmentId("");
            setStatusFlagStatus("");
            setIsClinical("");
            getAllDept();
            setLoader(false)
            setBtntxt("Save");
          }, 2000);
        })
        .catch((err) => {
          setTimeout(() => {
            console.log(err.message);
            setLoader(false)
            toast.error(`${err.response.data.statusMessage ? err.response.data.statusMessage : err.message}`)
          }, 2000);
        });
    }
  };

  //Get All   Department for table Data
  const getAllDept = async () => {
    await services
      .get(getAllDepartment)
      .then((response) => {
        let getData = response.data.map((list: any) => {
          return {
            ...list,
            status: list.statusFlag === 0 ? "Inactive" : "Active",
          };
        });
        setDepartmentData(getData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getAllDept();
  }, []);

  const handleVersionChange = () => { };

  const handleCancel = () => {
    setDepartmentCode("");
    setDepartmentDescription("");
    setIsClinical("");
    setBtntxt("Save");
  };

  return (
    <div id="sectionRef" className="px-4 bg-white rounded-curve md:pt-3 pb-0 rounded-curve mx-auto w-full border border-stroke">
      <ParameterHeading
        title="Department"
      />

      <div className=" grid grid-cols-4 space-10">
        <div className="w-full pe-3">
          <Input
            label="Department Code*"
            crossOrigin={undefined}
            color="blue"
            onChange={handleDepartmentChange}
            value={departmentCode}
          ></Input>
          {departmentCode &&
            typeof departmentCode === "string" &&
            !alphaNumWithHyphen.test(departmentCode) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please do not enter special characters!
              </div>
            )}
        </div>
        <div className="w-full pe-3">
          <Input
            label="Department Description*"
            crossOrigin={undefined}
            color="blue"
            onChange={handleDepartmentDescChange}
            value={departmentDescription}
            onKeyPress={(e: any) => {
              if (/^[^a-zA-Z0-9 ]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          ></Input>
          {/* {departmentDescription &&
            typeof departmentDescription === "string" &&
            !allowspacepattern.test(departmentDescription) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please do not enter special characters!
              </div>
            )} */}
        </div>

        <div className="w-full pe-3">
          <div className="relative">
            <ReactSelectBox
              label="Is Clinical"
              onChange={(e: any) => {
                setIsClinical(e);
              }}
              options={isclinicalList}
              value={isClinical}
              isMultiple={false}
              isSearchable={false}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="flex gap-4 ">
            <ActionButton
              buttonText={
                loader ?
                  <div className='w-full flex justify-center items-center'>
                    <div className='innerBtnloader'></div>
                  </div> :
                  btntxt
              }
              handleSubmit={() => handleSave()}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={
                departmentCode &&
                  alphaNumWithHyphen.test(departmentCode) &&
                  departmentDescription &&
                  // alphaNumWithHyphen.test(departmentDescription) &&
                  isClinical?.label !== "Is Clinical"
                  ? // isClinical?.label !== "Is Clinical" &&
                  // departmentCode !== "" &&
                  // departmentDescription !== ""
                  false
                  : true
              }
            />
            <ActionButton
              buttonText="Reset"
              handleSubmit={handleCancel}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        </div>
      </div>
      <div className="data-grid-newThem my-3">
              <ReactDatagrid
                rows={departmentData}
                toolsRequired={true}
                columns={columns}
              />
            </div>
      {/* <div className="my-3">
        <DataGrid
          autoHeight
          rows={departmentData}
          columns={columns}
          density={false}
        />
      </div> */}
      {/* <div className="w-full pe-3">
        <Input
          label=""
          disabled={true}
          crossOrigin={undefined}
          onChange={handleVersionChange}
          value={versiondata}
        ></Input>
      </div> */}
    </div>
  );
};

export default Department;
