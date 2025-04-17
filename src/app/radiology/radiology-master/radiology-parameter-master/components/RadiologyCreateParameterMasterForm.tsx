import FormPropsTextFields from "@/app/_common/input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { sanitizeObject } from "@/app/utilities/sanitizeObject";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
} from "react";
import RadiologyTerminologyGridandForm from "./RadiologyTerminologyGridandForm";
import ActionButton from "@/app/_common/button";
import { toast } from "react-toastify";
import services from "@/app/utilities/services";
import { radiologyParameterMasterSave } from "@/app/utilities/api-urls";

interface RadiologyCreateParameterMasterFormprops {
  state: any;
  dispatch: Dispatch<SetStateAction<any>>;
  getSavedRadiologyParameterData: () => void;
}

const RadiologyCreateParameterMasterForm: FC<
  RadiologyCreateParameterMasterFormprops
> = ({ state, dispatch, getSavedRadiologyParameterData }) => {
  // result type values here

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "fieldVal",
      payload: {
        [e.target.name]: e.target.value,
      },
    });
  };

  // from this selecthandler we have to add the select values
  const selectHandler = (selectKey: string, data: any) => {
    if (state.field.result_type.label !== "List") {
      dispatch({
        type: "fieldVal",
        payload: {
          addListValues: [],
        },
      });
    }

    dispatch({
      type: "fieldVal",
      payload: {
        [`${selectKey}`]: data,
      },
    });
  };

  const saveRadilogyParameter = () => {
    dispatch({
      type: "loaderSec",
      payload: {
        btnLoader: true,
      },
    });
    let str = "";
    state.field.addListValues?.map((item: any) => {
      str += item.list_value + ",";
    });
    let str1 = str.substring(0, str.length - 1);
    let postObj: any =
      // {
      //     parameterDescription: state.field.parameterDescription,
      //     parameterCode: state.field.parameterCode,
      //     department: 'Radiology',
      //     units: state.field.units.label,
      //     resultType: state.field.result_type.value,
      //     parameterTerminologySet: state.field.addTerminologyDatagrid,
      //     listValue: state.field.addListValues,
      //     comments:state.field.comments,
      //     statusFlag: 1
      // }
      {
        radiologyParameterId: state.field.radiologyParameterId,
        radiologyParameterDescription: state.field.parameterDescription,
        radiologyParameterCode: state.field.parameterCode,
        resultType: state.field.result_type.value,
        units: state.field.units.label,
        parameterTerminologySet: state.field.addTerminologyDatagrid,
        comments: state.field.referenceComments,
        listValue: str1,
        statusFlag: 1,
      };
    services
      .create(radiologyParameterMasterSave, postObj)
      .then((response) => {
        setTimeout(() => {
          toast.success("Successfully added new radilolgy parameter");
          getSavedRadiologyParameterData();
          dispatch({
            type: "loaderSec",
            payload: {
              btnLoader: false,
            },
          });
          dispatch({
            type: "popupSec",
            payload: {
              popupOpenclose: !state.popup.popupOpenclose,
            },
          });
          dispatch({
            type: "getApies",
            payload: {
              radiologyParameterSavedData: [
                ...state.getApi.radiologyParameterSavedData,
                {
                  ...postObj,
                  updateRadiologyId: Math.random(),
                },
              ],
            },
          });
        }, 2000);
      })
      .catch((error) => {
        if (error.response.data.statusMessage) {
          toast.error(error.response.data.statusMessage);
        } else {
          toast.error("Technical error");
        }
        dispatch({
          type: "loaderSec",
          payload: {
            btnLoader: false,
          },
        });
      });
  };

  const updateRadiologyParameter = () => {
    dispatch({
      type: "loaderSec",
      payload: {
        btnLoader: true,
      },
    });
    setTimeout(() => {
      toast.success("Successfully Updated radilolgy parameter");
      getSavedRadiologyParameterData();
      dispatch({
        type: "loaderSec",
        payload: {
          btnLoader: false,
        },
      });
      dispatch({
        type: "popupSec",
        payload: {
          popupOpenclose: false,
        },
      });
    }, 2000);
    getSavedRadiologyParameterData();
  };

  const ClearAll = () => {
    dispatch({
      type: "fieldVal",
      payload: {
        radiologyParameterId: null,
        parameterDescription: "",
        parameterCode: "",
        units: { label: "Result Units" },
        result_type: { label: "Result Type *" },
        terminology_type: { label: "Terminology Type *" },
        terminology_code_desc: { label: "Terminology code / Desc Search *" },
        addListValues: [],
        referenceComments: "",
        terminologycodeDesc: [],
        addTerminologyDatagrid: [],
      },
    });
  };

  return (
    <>
      {/* Radilogy Parameter form */}
      <div className="w-full flex gap-4 mt-4">
        <div className="w-2/5 newInputField">
          <FormPropsTextFields
            label="Parameter Name *"
            type="text"
            name="parameterDescription"
            value={state.field.parameterDescription}
            handleChange={inputHandler}
            containerProps={{
              className: "!min-w-0 h-[43px]",
            }}
          />
        </div>
        <div className="w-1/5 newInputField">
          <FormPropsTextFields
            label="Parameter Code *"
            type="text"
            name="parameterCode"
            value={state.field.parameterCode}
            handleChange={inputHandler}
            containerProps={{
              className: "!min-w-0 h-[43px]",
            }}
          />
        </div>
        <div className="w-1/5 newSelect">
          <ReactSelectBox
            value={state.field.units}
            options={state.field.unitsSelct}
            isSearchable={true}
            onChange={(data: any) => selectHandler("units", data)}
            label="Result Units"
          />
        </div>
        <div className="w-1/5 newSelect">
          <ReactSelectBox
            value={state.field.result_type}
            options={state.field.resultTypeData}
            onChange={(data: any) => selectHandler("result_type", data)}
            label={"Result Type *"}
          />
        </div>
      </div>

      {/* Radiology Terminology and Terminology grid */}
      <RadiologyTerminologyGridandForm state={state} dispatch={dispatch} />

      {/* Actions button funtionlity here */}
      <div className="w-full flex justify-end gap-4">
        <ActionButton
          buttonText={
            state.loader.btnLoader ? (
              <div className="w-full flex justify-center items-center">
                <div className="innerBtnloader"></div>
              </div>
            ) : state.field.radiologyParameterId ? (
              "Update"
            ) : (
              "Save"
            )
          }
          handleSubmit={saveRadilogyParameter}
          width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={
            state.field.parameterDescription &&
            state.field.parameterCode &&
            state.field.result_type.label !== "Result Type *" &&
            state.field.addTerminologyDatagrid.length > 0
              ? false
              : true
          }
        />
        {state.field.radiologyParameterId ? null : (
          <ActionButton
            buttonText="Clear"
            handleSubmit={ClearAll}
            width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        )}
      </div>
    </>
  );
};

export default RadiologyCreateParameterMasterForm;
