import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  deleteProceduresDoctormapping,
  getAllDepartments,
  getAllProcedureDoctors,
  getDoctorData,
  saveProceduresDoctorMapping,
} from "@/app/utilities/api-urls";
import { jsonParse } from "@/app/utilities/local";
import services from "@/app/utilities/services";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Options } from "react-tailwindcss-select/dist/components/type";
import { toast } from "react-toastify";

export default function DoctorMappingForm({
  formData,
  setFormData,
  getAllData,
}: any) {
  const [departmentList, setDepartmentList] = useState<any>([]);
  const [doctorsList, setDoctorList] = useState<any>([]);
  const getAllDepartment = () => {
    services.get(getAllDepartments).then((response) => {
      response.data.map((item: any) => {
        item.value = item.departmentCode;
        item.label = item.departmentDescription;
      });
      setDepartmentList(response.data);
    });
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 90 },
    {
      field: "departmentDesc",
      headerName: "Department",
      width: 300,
    },
    { field: "doctorName", headerName: "Department Doctor", width: 250 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params: any) => (
        <>
          <div
            className="cursor-pointer"
            onClick={() => {
              deleteList(params.row);
            }}
          >
            <TrashIcon className="w-5 h-5 text-red-500" />
          </div>
        </>
      ),
    },
  ];
  const handleAdd = async () => {
    if (!formData.department) return toast.error("Please select department");
    if (!formData.doctors) return toast.error("Please select doctor(s)");
    let arr: any = [...formData.formGrid];
    formData.doctors.map((item: any) => {
      let obj = {
        id: arr.length + 1,
        proceDocMapId: null,
        doctorName: item.label,
        empId: item.value,
        status: 1,
        generatedBy:
          formData.action == "new"
            ? jsonParse("loginResponse").employeename
            : null,
        updatedBy:
          formData.action == "update"
            ? jsonParse("loginResponse").employeename
            : null,
        departmentCode: formData.department.value,
        departmentDesc: formData.department.label,
      };
      if (
        !arr.some((item1: any) => {
          return item1.empId == item.value;
        })
      ) {
        arr.push(obj);
      }
    });
    setFormData({ ...formData, formGrid: arr });
  };
  const deleteList = (data: any) => {
    if (data.proceDocMapId) {
      services
        .create(deleteProceduresDoctormapping + data.proceDocMapId, {})
        .then((response) => {
          toast.success("Record deleted successfully");
          getAllData();
          let newList = formData.formGrid.filter(
            (item: any) => item.empId !== data.empId
          );
          newList.map((item: any, index: number) => {
            item.id = index + 1;
            item.label = item.doctorName;
            item.value = item.empId;
          });
          setFormData({ ...formData, doctors: newList, formGrid: newList });
        })
        .catch((error) => {
          if (error.response.data.statusMessage) {
            toast.error(error.response.data.statusMessage);
          } else {
            toast.error("Technical Error");
          }
        });
    } else {
      let newList = formData.formGrid.filter(
        (item: any) => item.id !== data.id
      );
      newList.map((item: any, index: number) => {
        if (item.id !== data.id) {
          item.id = index + 1;
          item.label = item.doctorName;
          item.value = item.empId;
          return item;
        }
        return;
      });
      setFormData({ ...formData, doctors: newList, formGrid: newList });
    }
  };
  const onDepartmentChange = (data: any) => {
    services.get(getAllProcedureDoctors +'?departmentCode='+data.value).then((response) => {
      response.data.map((item: any) => {
        item.value = item.employeeId;
        item.label = item.firstName;
      });
      if (formData.doctors) {
        response.data.map((item: any) => {
          formData.doctors.map((item1: any) => {
            if (item1.label == item.label) {
              return;
            }
          });
        });
      }
      setFormData({ ...formData, department: data });
      setDoctorList(response.data);
    });
  };
  const handleClear = () => {
    setFormData({ ...formData, department: "", doctors: null, formGrid: [] });
  };
  const onSave = () => {
    setFormData({ ...formData, loader: true });
    services
      .create(saveProceduresDoctorMapping, formData.formGrid)
      .then((response) => {
        setTimeout(() => {
          toast.success(
            `${formData.action == "new" ? "Saved" : "Updated"} Successfully`
          );
          setFormData({ ...formData, loader: false });
          setFormData({ ...formData, popUp: false });
        }, 1000);
        getAllData();
      })
      .catch((error) => {
        setTimeout(() => {
          setFormData({ ...formData, loader: false });
          if (error.response.data.statusMessage) {
            toast.error(error.response.data.statusMessage);
          } else {
            toast.error("Technical Error");
          }
        }, 1000);
      });
  };
  useEffect(() => {
    getAllDepartment();
    if (formData.action == "update") {
      //Loading Department List after binding department
      onDepartmentChange(formData.department);
    }
  }, []);
  return (
    <>
      <div className="flex gap-4 newSelect newInputField">
        <div className="w-2/5">
          <ReactSelectBox
            value={formData.department}
            options={departmentList}
            onChange={(data: any) => {
              setFormData({ ...formData, department: data });
              onDepartmentChange(data);
            }}
            label={"Department *"}
            isSearchable={true}
            height={200}
            isDisabled={formData.action == "update" ? true : false}
          />
        </div>
      </div>
      <div className="flex gap-4 newMultiSelect newInputField mt-4">
        <div className="w-full">
          <ReactSelectBox
            value={formData.doctors}
            options={doctorsList}
            onChange={(data: any) => {
              setFormData({ ...formData, doctors: data });
            }}
            label={"Procedures Department Doctors *"}
            isSearchable={true}
            isMultiple={true}
            height={150}
          />
        </div>
        <div className="w-[120px] flex items-end">
          <ActionButton
            buttonText={"Add"}
            handleSubmit={handleAdd}
            width="w-full text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          />
        </div>
      </div>
      <div className="mt-4 w-full data-grid-newThem">
        <ReactDatagrid rows={formData.formGrid} columns={columns} />
      </div>
      <div className="flex gap-4 mt-4 justify-end ">
        <ActionButton
          buttonText={
            formData.loader ? (
              <div className="w-full flex justify-center items-center">
                <div className="innerBtnloader"></div>
              </div>
            ) : formData.action == "new" ? (
              "Save"
            ) : (
              "Update"
            )
          }
          disabled={formData.formGrid.length > 0 ? false : true}
          width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          handleSubmit={onSave}
        />
        {formData.action == "new" ? (
          <ActionButton
            buttonText="Clear"
            handleSubmit={() => {
              handleClear();
            }}
            width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          />
        ) : null}
      </div>
    </>
  );
}
