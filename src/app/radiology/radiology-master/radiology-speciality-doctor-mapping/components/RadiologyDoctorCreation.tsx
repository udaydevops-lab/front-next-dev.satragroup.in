import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { ApiRequestMethod } from "@/app/_commonfeatures/ApiRequestFun";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  deleteRadiologyDoctor,
  saveRadiologyDoctor,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, SetStateAction } from "react";
import { toast } from "react-toastify";

interface RadiologyDoctorMasterFormprops {
  state: any;
  dispatch: Dispatch<SetStateAction<any>>;
  getAllGridData: () => void;
}

const RadiologyDoctorCreation: React.FC<RadiologyDoctorMasterFormprops> = ({
  state,
  dispatch,
  getAllGridData,
}) => {
  const HandleAdd = () => {
    if (
      state.field.radSpecialtySearch.label === "Radiology Specialty" &&
      state.field.radDeptDoctorsSearch === null
    ) {
      return toast.error("Please select Radiology Doctor and Technician");
    } else if (!state.field.radDeptDoctorsSearch) {
      return toast.error("Please select Radiology department doctor(s)");
    }
    let filterData: any = state.field.radDeptDoctorsSearch.map((list: any) => ({
      ...list,
      id: Math.random(),
      employeeId: list.value,
      firstName: list.label,
      specialityCode: state.field.radSpecialtySearch.value,
      specialityDescription: state.field.radSpecialtySearch.label,
      departmentCode: state.field.radSpecialtySearch.departmentCode,
      departmentDesc: state.field.radSpecialtySearch.departmentDescription,
    }));
    dispatch({
      type: "fieldVal",
      payload: {
        addListValues: filterData,
      },
    });
  };

  const deleteList = (data: any) => {
    if (data.radDocMapId) {
      services
        .create(`${deleteRadiologyDoctor}${data?.radDocMapId}`, {})
        .then((response: any) => {
          toast.success(`Record deleted successfully`);

          dispatch({
            type: "fieldVal",
            payload: {
              addListValues: state.field.addListValues.filter(
                (item: any) => item.empId !== data.empId
              ),
              radDeptDoctorsSearch:
                state.field.addListValues.length > 1
                  ? state.field.addListValues
                      .map((item: any) => ({
                        ...item,
                        value: item.employeeId,
                        label: item.firstName,
                      }))
                      .filter((item: any) => item.empId !== data.empId)
                  : null,
            },
          });
          getAllGridData();
          // dispatch({
          //     type: 'dialogPop',
          //     payload: {
          //         open: false
          //     }
          // })
        })
        .catch((err: any) => {
          toast.error("Something went wrong..");
        });
    } else {
      dispatch({
        type: "fieldVal",
        payload: {
          addListValues: state.field.addListValues.filter(
            (item: any) => item.employeeId !== data.employeeId
          ),
          radDeptDoctorsSearch:
            state.field.addListValues.length > 1
              ? state.field.addListValues
                  .map((item: any) => ({
                    ...item,
                    value: item.employeeId,
                    label: item.firstName,
                  }))
                  .filter((item: any) => item.employeeId !== data.employeeId)
              : null,
        },
      });
    }
  };

  const onSubmit = async () => {
    dispatch({
      type: "fieldVal",
      payload: {
        loader: true,
      },
    });
    let postObj: any = state.field.addListValues.map((list: any) => {
      return {
        ...list,
        radDocMapId: list.radDocMapId ? list.radDocMapId : null,
        radSpecialityCode: list.specialityCode,
        radSpecialityDesc: list.specialityDescription,
        doctorName: list.firstName,
        empId: list.employeeId,
        departmentCode: list.departmentCode,
        departmentDesc: list.departmentDesc,
        statusFlag: 1,
      };
    });
    const response: any = await ApiRequestMethod({
      method: "POST",
      url: saveRadiologyDoctor,
      postObj: postObj,
    });
    if (response.success) {
      setTimeout(() => {
        if (Object.keys(state.field.rowData).length > 0) {
          toast.success("Updated Successfully");
        } else {
          toast.success("Saved Successfully");
        }
        dispatch({
          type: "fieldVal",
          payload: {
            loader: false,
          },
        });
        dispatch({
          type: "dialogPop",
          payload: {
            open: false,
          },
        });
        getAllGridData();
      }, 2000);
    } else {
      setTimeout(() => {
        toast.error("An Error");
        dispatch({
          type: "fieldVal",
          payload: {
            loader: false,
          },
        });
        dispatch({
          type: "dialogPop",
          payload: {
            open: false,
          },
        });
        getAllGridData();
      }, 2000);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 90 },
    {
      field: "specialityDescription",
      headerName: "Radiology Specialty",
      width: 300,
    },
    { field: "firstName", headerName: "Department Doctor", width: 250 },
    // {
    //     field: "Delete",
    //     headerName: "Actions",
    //     width: 120,
    //     renderCell: (params: any) => (
    //         <>
    //             <div className="flex gap-2">
    //                 <TrashIcon
    //                     className="w-5 h-5 text-red-400 cursor-pointer"
    //                     onClick={() => deleteList(params.row)}
    //                 />
    //             </div>
    //         </>
    //     ),
    // },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params: any) => (
        <>
          {console.log(params.row)}
          <div
            className="cursor-pointer"
            onClick={() => deleteList(params.row)}
          >
            <TrashIcon className="w-5 h-5 text-red-500" />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      <div className="flex gap-4 newSelect newInputField">
        <div className="w-2/5">
          <ReactSelectBox
            value={state.field.radSpecialtySearch}
            options={state.getAppApi.radspecDd}
            onChange={(data: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  radSpecialtySearch: data,
                },
              });
            }}
            label={"Radiology Specialty"}
            isSearchable={true}
            isDisabled={
              Object.keys(state.field.rowData).length > 0 ? true : false
            }
          />
        </div>
      </div>
      <div className="flex gap-4 newMultiSelect newInputField mt-4">
        <div className="w-full">
          <ReactSelectBox
            value={state.field.radDeptDoctorsSearch}
            options={state.getAppApi.radDeptDocDd}
            onChange={(data: any) => {
              dispatch({
                type: "fieldVal",
                payload: {
                  radDeptDoctorsSearch: data,
                },
              });
            }}
            label={"Radiology Department Doctors"}
            isSearchable={true}
            isMultiple={true}
          />
        </div>
        <div className="w-[120px] flex items-end">
          <ActionButton
            buttonText={"Add"}
            handleSubmit={HandleAdd}
            width="w-full text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          />
        </div>
      </div>
      {/* {state.field && state.field.addListValues && state.field.addListValues.length > 0 && */}
      <div className="p-4 w-full data-grid-newThem">
        <ReactDatagrid rows={state.field.addListValues} columns={columns} />
      </div>
      {/* } */}
      <div className="flex gap-4  justify-end ">
        <ActionButton
          buttonText={
            state.field.loader ? (
              <div className="w-full flex justify-center items-center">
                <div className="innerBtnloader"></div>
              </div>
            ) : Object.keys(state.field.rowData).length > 0 ? (
              "Update"
            ) : (
              "Save"
            )
          }
          width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          disabled={state.field.addListValues.length > 0 ? false : true}
          handleSubmit={onSubmit}
        />
        {Object.keys(state.field.rowData).length > 0 ? null : (
          <ActionButton
            buttonText="Clear"
            handleSubmit={() => {
              dispatch({
                type: "fieldVal",
                payload: {
                  radDeptDoctorsSearch: null,
                },
              });
              // dispatch({
              //     type: 'fieldVal',
              //     payload: {
              //         radSpecialtySearch: ""
              //     }
              // })
              dispatch({
                type: "fieldVal",
                payload: {
                  labSpecialtySearch: {
                    label: "Laboratory Specialty",
                  },
                  labTechnicianSearch: null,
                  addListValues: [],
                },
              });
            }}
            width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#005bb5] border-[#005bb5]"
          />
        )}
      </div>
    </>
  );
};

export default RadiologyDoctorCreation;
