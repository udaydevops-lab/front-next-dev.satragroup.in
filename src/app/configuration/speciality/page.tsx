"use client";
import React, { useEffect, useState } from "react";
import ActionButton from "@/app/_common/button";
import { Input } from "@material-tailwind/react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {
  createSpeciality,
  getAllDepartment,
  getAllSpeciality,
  getStatusFlagSpeciality,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import { PencilIcon } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { ReactSelectBox } from "@/app/_commonfeatures";
import {
  allowspacepattern,
  alphaNumWithHyphen,
} from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { sanitizeObject } from "@/app/utilities/sanitizeObject";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ParameterHeading from "../component/ParameterHeading";

const Speciality = (props: any) => {
  const [specialityId, setSpecialityId] = useState("");
  const [specialityCode, setSpecialityCode] = useState("");
  const [specialityDesc, setSpecialityDesc] = useState("");
  const [depttype, setDeptType] = useState<any>({
    label: "Select Department*",
  });
  const [deptList, setDeptList] = useState<any>([]);
  const [specialityData, setSpecialityData] = useState<any>("");
  const [btntxt, setBtntxt] = useState("Save");
  const [statusFlagStatus, setStatusFlagStatus] = useState("");

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.No", width: 30 },
    {
      field: "specialityCode",
      headerName: "Speciality code",
      width: 150,
    },
    {
      field: "specialityDescription",
      headerName: "Speciality Description",
      width: 250,
    },
    {
      field: "departmentDescription",
      headerName: "Department",
      width: 200,
      renderCell: (params: any) => (
        <>
          {deptList
            .filter(
              (item: any) => item.departmentId === params.row.departmentId
            )
            .map((item: any) => {
              return item.departmentDescription;
            })}
        </>
      ),
    },
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
      renderCell: (params: any) => (
        <>
          <div className="w-5 h-5 me-5">
            {params.row.statusFlag === 1 && (
              <PencilIcon
                className="text-blue-500 w-10 h-5 cursor-pointer"
                onClick={() => handleEdit(params.row)}
              />
            )}
          </div>

          <div className="cursor-pointer" onClick={() => onActiveInactive(params.row)}>
            {params.row.statusFlag === 0 ? (
              <InactiveIcon className="cursor-pointer" />
            ) : (
              <ActiveIcon className="cursor-pointer" />
            )}
          </div>
        </>
      ),
    },
  ];

  //Active and Inactive
  const onActiveInactive = async (row: any) => {
    const flag = row.statusFlag === 0 ? 1 : 0;
    await services
      .get(getStatusFlagSpeciality + row.specialityId + "/" + flag)
      .then((response) => {
        getAllSpecialityData();
        toast.success(
          `Successfully ${row.statusFlag === 1 ? "InActive" : "Active"
          } this Record`
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleSpecialityChange = (e: any) => {
    setSpecialityCode(sanitizeInput(e.target.value));
  };

  const handleSpecialityDescChange = (e: any) => {
    setSpecialityDesc(sanitizeInput(e.target.value));
  };

  //Edit
  const handleEdit = async (rowData: any) => {
    setSpecialityCode(rowData.specialityCode);
    setSpecialityId(rowData.specialityId);
    setSpecialityDesc(rowData.specialityDescription);
    setStatusFlagStatus(rowData.statusFlag);
    setBtntxt("Update");

    const departmentId = rowData.departmentId;
    const DeptTypeqq: any = await services.get(getAllDepartment);
    const filterDeptType = DeptTypeqq.data.filter(
      (item: any) => item.departmentId === departmentId
    );
    setDeptType({
      label: filterDeptType[0].departmentDescription,
      value: filterDeptType[0].departmentId,
    });
  };

  const [loader, setLoader] = useState<any>(false)

  // Save speciality
  const handleSave = () => {
    setLoader(true)
    let postObj = {
      departmentId: depttype.value,
      specialityCode: specialityCode,
      specialityDescription: specialityDesc,
      specialityId: specialityId,
      statusFlag: statusFlagStatus ? statusFlagStatus : 1,
    };


    if (specialityId === "" || specialityId === null) {
      services
        .create(createSpeciality, postObj)
        .then((response) => {
          setSpecialityData(response);
          toast.success("Saved Successfully!");
          setSpecialityCode("");
          setSpecialityDesc("");
          setStatusFlagStatus("");
          setDeptType({
            label: "Select Department*",
          });
          setSpecialityId("");
          getAllSpecialityData();
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
        .create(createSpeciality, postObj)
        .then((response) => {
          setSpecialityData(response);
          toast.success("Updated Successfully!");
          setSpecialityCode("");
          setSpecialityDesc("");
          setStatusFlagStatus("");
          setDeptType({
          label: "Select Department*",
          });
          setSpecialityId("");
          getAllSpecialityData();
        })
        .catch((errors) => {
          if(errors.response.data.statusMessage){
            toast.error(errors.response.data.statusMessage)
          }else{
            toast.error("Technical Error")
          }
          console.log(errors.message);
        });
    }
  };

  //Get All Speciality Table Data
  const getAllSpecialityData = async () => {
    await services
      .get(getAllSpeciality)
      .then((response) => {
        let getData = response.data.map((list: any) => {
          return {
            ...list,
            status: list.statusFlag === 0 ? "InActive" : "Active",
          };
        });
        setSpecialityData(getData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Get Department Data
  const getAllDepartmentData = async () => {
    try {
      const response = await services.get(getAllDepartment);
      const result = response.data.map((list: any) => {
        console.log(response.data)
        return {
          ...list,
          label: list.departmentDescription,
          value: list.departmentId,
        };
      });

      setDeptList(result.filter((item:any) => item.statusFlag==1));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDepartmentData();
    getAllSpecialityData();
  }, []);

  const handleCancel = () => {
    setSpecialityCode("");
    setSpecialityDesc("");
    setDeptType({
    label: "Select Department*",
  });
    setBtntxt("SAVE");
  };
  return (
    <div className="px-4 bg-white rounded-curve md:pt-3 pb-0 rounded-curve mx-auto w-full border border-stroke">
      <ParameterHeading
        title="Speciality"
      />

      <div className=" grid grid-cols-4 gap-4 space-10">
        <div className="w-full ">
          <Input
            label="Speciality Code*"
            color="blue"
            crossOrigin={undefined}
            onChange={handleSpecialityChange}
            value={specialityCode}
          />
          {specialityCode &&
            typeof specialityCode === "string" &&
            !alphaNumWithHyphen.test(specialityCode) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please do not enter special characters!
              </div>
            )}
        </div>
        <div className="w-full">
          <Input
            label="Speciality Description*"
            color="blue"
            crossOrigin={undefined}
            onChange={handleSpecialityDescChange}
            value={specialityDesc}
            onKeyPress={(e: any) => {
              if (/^[^a-zA-Z0-9 ]$/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          {/* {specialityDesc &&
            typeof specialityDesc === "string" &&
            !allowspacepattern.test(specialityDesc) && (
              <div className="absolute text-xs ml-1 text-red-500">
                Please do not enter special characters!
              </div>
            )} */}
        </div>
        <div className="w-full">
          <div className="relative">
            <ReactSelectBox
              label="Select Department*"
              onChange={(e: any) => {
                setDeptType(e);
              }}
              options={deptList}
              isSearchable={true}
              value={depttype}
              isMultiple={false}
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
                specialityCode &&
                  alphaNumWithHyphen.test(specialityCode) &&
                  specialityDesc &&
                  // alphaNumWithHyphen.test(specialityDesc) &&
                  depttype?.label !== "Select Department*"
                  ? // isClinical?.label !== "Is Clinical" &&
                  // departmentCode !== "" &&
                  // departmentDescription !== ""
                  false
                  : true
              }
            //   disabled={
            //     depttype?.label !== "Select Department" &&
            //     specialityCode !== "" &&
            //     specialityDesc !== ""
            //       ? false
            //       : true
            //   }
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
        <ReactDatagrid rows={specialityData} toolsRequired={true} columns={columns}/>
        </div>
      {/* <div className="my-3">
        <DataGrid
          autoHeight
          rows={specialityData}
          columns={columns}
          getRowId={(row) => row.specialityId}
          checkboxSelection={false}
          density="compact"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[15]}
          // className="mostly-customized-scrollbar"
        />
      </div> */}
    </div>
  );
};

export default Speciality;
