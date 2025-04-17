import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { ApiRequestMethod } from "@/app/_commonfeatures/ApiRequestFun";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  deleteRadiologyTechnician,
  saveRadiologyAssignTechnician,
} from "@/app/utilities/api-urls";
import { sanitizeObject } from "@/app/utilities/sanitizeObject";
import services from "@/app/utilities/services";
import { TrashIcon } from "@heroicons/react/24/solid";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-toastify";

interface NewMappingformprops {
  state: any;
  dispatch: Dispatch<SetStateAction<any>>;
  getAllorganismAntibioticDatafun: any;
}

const NewMappingform: FC<NewMappingformprops> = ({
  state,
  dispatch,
  getAllorganismAntibioticDatafun,
}) => {
  const selectRadiologyTechnicianMapppingdata = (
    data: any,
    keyName: string
  ) => {
    dispatch({
      type: "fieldVal",
      payload: {
        [`${keyName}`]: sanitizeObject(data),
      },
    });
  };

  const columns1: GridColDef[] = [
    { field: "id", headerName: "S.no", width: 90 },
    {
      field: "specialityDescription",
      headerName: "Radiology Speciality",
      width: 300,
    },
    { field: "firstName", headerName: "Recorded By", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 70,
      renderCell: (params: any) => (
        <>
          <div className="cursor-pointer" onClick={() => deleteRow(params.row)}>
            <TrashIcon className="w-5 h-5 text-red-500" />
          </div>
        </>
      ),
    },
  ];

  const AddRadiologyTechnician = () => {
    if (
      state.field.radiologyspecDesc.label === "Radiology Speciality" &&
      state.field.radiologydeptTech === null
    ) {
      return toast.error("Please select Radiology Speciality and Technician");
    } else if (!state.field.radiologydeptTech) {
      return toast.error("Please select Radiology Dept Technician(s)");
    }

    let filterData: any = state.field.radiologydeptTech.map((list: any) => ({
      ...list,
      id: Math.random(),
      employeeId: list.value,
      firstName: list.label,
      specialityCode: state.field.radiologyspecDesc.value,
      specialityDescription: state.field.radiologyspecDesc.label,
    }));

    dispatch({
      type: "fieldVal",
      payload: {
        newMappingGrid: filterData,
      },
    });
  };

  const deleteRow = (data: any) => {
    if (data.radTechMapId) {
      services
        .create(`${deleteRadiologyTechnician}${data?.radTechMapId}`, {})
        .then((response: any) => {
          toast.success(`Record deleted successfully`);
          dispatch({
            type: "fieldVal",
            payload: {
              newMappingGrid: state.field.newMappingGrid.filter(
                (item: any) => item.employeeId !== data.employeeId
              ),
              radiologydeptTech:
                state.field.newMappingGrid.length > 1
                  ? state.field.newMappingGrid
                    .map((item: any) => ({
                      ...item,
                      value: item.employeeId,
                      label: item.firstName,
                    }))
                    .filter(
                      (item: any) => item.employeeId !== data.employeeId
                    )
                  : null,
            },
          });
          getAllorganismAntibioticDatafun();
        })
        .catch((err: any) => {
          toast.error("Something went wrong..");
        });
    } else {
      dispatch({
        type: "fieldVal",
        payload: {
          newMappingGrid: state.field.newMappingGrid.filter(
            (item: any) => item.employeeId !== data.employeeId
          ),
          radiologydeptTech:
            state.field.newMappingGrid.length > 1
              ? state.field.newMappingGrid
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

  interface DataItem {
    id: number;
    radiologyspecDesc: string;
    radiologyspec: string;
    radiologydeptTechDesc: string;
    radiologydeptTechCode: string;
    statusFlag: number;
  }

  const SaveOrganisAnitibiotic = async () => {
    dispatch({
      type: "fieldVal",
      payload: {
        loader: true,
      },
    });

    let postObj: DataItem[] = state.field.newMappingGrid.map((list: any) => {
      return {
        ...list,
        radTechMapId: list.radTechMapId ? list.radTechMapId : null,
        radSpecialityCode: list.specialityCode,
        radSpecialityDesc: list.specialityDescription,
        technicianName: list.firstName,
        empId: list.employeeId,
        statusFlag: 1,
      };
    });

    const response: any = await ApiRequestMethod({
      method: "POST",
      url: saveRadiologyAssignTechnician,
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
        getAllorganismAntibioticDatafun();
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
        getAllorganismAntibioticDatafun();
      }, 2000);
    }
  };

  const ClearOrganisAnitibiotic = () => {
    dispatch({
      type: "fieldVal",
      payload: {
        newMappingGrid: [],
        radTechMapId: null,
        // radiologyspecDesc: {
        //   label: "Radiology Speciality",
        // },
        // radSpecialityDesc: null,
        radiologydeptTech: null,
        rowData: {},
      },
    });
  };

  return (
    <>
      <div className="w-full flex gap-4">
        <div className="w-2/5 newSelect">
          <ReactSelectBox
            value={state.field.radiologyspecDesc}
            options={state.field.radiologyspecSerchDesc}
            onChange={(data: any) =>
              selectRadiologyTechnicianMapppingdata(data, "radiologyspecDesc")
            }
            label={"Radiology Speciality"}
            isDisabled={
              Object.keys(state.field.rowData).length > 0 ? true : false
            }
          />
        </div>
      </div>
      <div className="w-full flex gap-4 mt-4">
        <div className="w-full newSelect">
          <ReactSelectBox
            value={state.field.radiologydeptTech}
            options={state.field.radiologydeptTechSerchDesc}
            onChange={(data: any) => {
              console.log(data);
              selectRadiologyTechnicianMapppingdata(data, "radiologydeptTech");
            }}
            label={"Radiology Dept Technician(s)"}
            isMultiple={true}
          />
        </div>
        <div className="w-[120px] ">
          <ActionButton
            buttonText="Add"
            width="w-[120px] text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={AddRadiologyTechnician}
          // disabled={
          //     state.field.organismDesc.label !== "Organism Description" &&
          //         state.field.antibioticDesc ? false : true
          // }
          />
        </div>
      </div>

      <div className="w-full my-4 data-grid-newThem ">
        <ReactDatagrid rows={state.field.newMappingGrid} columns={columns1} />
      </div>

      <div className="w-full flex justify-end gap-4 newBtn-theme">
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
          width="w-[120px] text-white h-[42px] text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={SaveOrganisAnitibiotic}
          disabled={state.field.newMappingGrid.length > 0 ? false : true}
        />
        {Object.keys(state.field.rowData).length > 0 ? null : (
          <ActionButton
            buttonText="Clear"
            width="w-[120px] text-white h-[42px]  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            handleSubmit={ClearOrganisAnitibiotic}
          />
        )}
      </div>
    </>
  );
};

export default NewMappingform;
