import ActionButton from "@/app/_common/button";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { deleteRadiologyParameter } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { capitalize } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, FC, SetStateAction } from "react";
import { toast } from "react-toastify";

interface RadiologyParameterGridprops {
  state: any;
  dispatch: Dispatch<SetStateAction<any>>;
  getSavedRadiologyParameterData: any;
}

const RadiologyParameterGrid: FC<RadiologyParameterGridprops> = ({
  state,
  dispatch,
  getSavedRadiologyParameterData,
}) => {
  const columns1: GridColDef[] = [
    {
      field: "id",
      headerName: "S.no",
      width: 70,
      // renderCell: (params: any) => {
      //     const number = state.getApi.radiologyParameterSavedData.indexOf(params.row) + 1
      //     return number
      // }
    },
    {
      field: "radiologyParameterDescription",
      headerName: "Parameter Name",
      width: 400,
    },
    {
      field: "radiologyParameterCode",
      headerName: "Parameter Code",
      width: 250,
    },
    // {
    //     field: "value", headerName: "Terminology code - Desc", width: 450,
    //     renderCell: (params: any) => (
    //         <>
    //             {params.row.addTerminologyDatagrid && params.row.addTerminologyDatagrid.map((list: any) => (
    //                 <div className='flex gap-4'>
    //                     {list.terminologyCode} - {list.terminologyDesc}
    //                 </div>
    //             ))}

    //         </>
    //     )
    // },

    {
      field: "orderingDr",
      headerName: "Actions",
      width: 90,
      renderCell: (params: any) => (
        <>
          <div className="cursor-pointer flex justify-center gap-3">
            <div
              className="cursor-pointer"
              onClick={() => editSavedParameterGrid(params.row)}
            >
              <PencilIcon className="w-5 h-5 text-blue-500" />
            </div>
            <div
              className="cursor-pointer"
              onClick={() => {
                dispatch({
                  type: "fieldVal",
                  payload: {
                    radiologyParameterId: params.row.radiologyParameterId,
                  },
                });
                dispatch({
                  type: "popupSec",
                  payload: {
                    deletePopup: true,
                    // dataId: params.row.id,
                  },
                });

                // delSavedParameterGrid(params.row.id)
              }}
            >
              <TrashIcon className="w-5 h-5 text-red-500" />
            </div>
          </div>
        </>
      ),
    },
  ];

  // edit and store data in the fields
  const editSavedParameterGrid = (data: any) => {
    dispatch({
      type: "popupSec",
      payload: {
        popupOpenclose: !state.popup.popupOpenclose,
      },
    });
    let filtered = state.field.resultTypeData.filter(
      (item: any) => item.value == data.resultType
    )[0];
    let addList = data.valueList?.map((item: any) => {
      let obj: any = {};
      obj.list_value = item;
      return obj;
    });
    dispatch({
      type: "fieldVal",
      payload: {
        radiologyParameterId: data.radiologyParameterId,
        parameterDescription: data.radiologyParameterDescription,
        parameterCode: data.radiologyParameterCode,
        units: { label: data.units },
        result_type: filtered,
        addListValues: addList,
        referenceComments: data.comments,
        addTerminologyDatagrid: data.parameterTerminologySet,
      },
    });
  };
  const onDelete = (id: any) => {
    services
      .create(deleteRadiologyParameter, { radiologyParameterId: id })
      .then((response) => {
        toast.success(capitalize(response.data.statusMessage));
        getSavedRadiologyParameterData();
        dispatch({
          type: "popupSec",
          payload: {
            deletePopup: false,
          },
        });
      })
      .catch((error) => {
        toast.error("Technical error");
        dispatch({
          type: "popupSec",
          payload: {
            deletePopup: false,
          },
        });
      });
  };
  return (
    <>
      <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
        <ReactDatagrid
          rows={state.getApi.radiologyParameterSavedData}
          columns={columns1}
        />
      </div>
      <ReactCommonDialog
        open={state.popup.deletePopup}
        handler={() => {
          dispatch({
            type: "popupSec",
            payload: {
              deletePopup: false,
            },
          });
        }}
        popupClose={() => {
          dispatch({
            type: "popupSec",
            payload: {
              deletePopup: false,
            },
          });
        }}
        Content={
          <>
            <div className="font-semibold flex justify-center">
              Are you sure you want to delete this parameter?
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div>
                <ActionButton
                  buttonText={"Yes"}
                  width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={() =>
                    onDelete(state.field.radiologyParameterId)
                  }
                />
              </div>
              <div>
                <ActionButton
                  buttonText={"No"}
                  width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={() =>
                    dispatch({
                      type: "popupSec",
                      payload: {
                        deletePopup: false,
                      },
                    })
                  }
                />
              </div>
            </div>
          </>
          // <RadiologyCreateParameterMasterForm
          //     state={state}
          //     dispatch={dispatch}
          //     getSavedRadiologyParameterData={getSavedRadiologyParameterData}
          // />
        }
        size={"md"}
        dialogtitle="Confirm"
      />
    </>
  );
};

export default RadiologyParameterGrid;
