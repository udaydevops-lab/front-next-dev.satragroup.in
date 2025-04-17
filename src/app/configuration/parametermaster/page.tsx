"use client";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";
import FormPropsTextFields from "@/app/_common/input";
import ActionButton from "@/app/_common/button";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import services from "@/app/utilities/services";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import NewParameter from "./NewParameter";
import {
  ParamterUnits,
  deleteParameterMaster,
  labParamerterList,
  saveCpoeParametermaster,
} from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithHyphen } from "@/app/utilities/validations";
import UseErrorMessage from "@/app/_commonfeatures/UseErrorMessage";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import ParameterHeading from "../component/ParameterHeading";

const ParameterMaster = () => {
  const [unitsSelct, setunitsSelct] = useState<any>([]);
  const { errorMsg, setErrorMessage, clearErrorMessage } = UseErrorMessage();

  const [fields, setFields] = useState<any>({
    module: {
      label: "Module *",
    },
    parameterModule: {
      label: "Select Module *",
    },
    creatbtnShow: false,
    modalOpen: false,
    parameter_desc: "",
    units: {
      label: "Select Units",
    },
    result_type: {
      label: "Result Type *",
    },
    terminology_type: {
      label: "Terminology Type *",
    },
    terminology_code_desc: {
      label: "Terminology code / Desc Search",
    },
    comments: "",
    parameter_code: "",
    parameterDesc: "",
    parameterId: null,
    list_value: "",
  });

  const [storeList, setStoreList] = useState<any>([]);

  const [parmeterData, setParmeterData] = useState<any>([]);

  const moduleData: any = [
    { label: "Laboratory", value: "Laboratory" },
    { label: "Radiology", value: "Radiology" },
    { label: "Procedures", value: "Procedures" },
  ];

  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "Sno",
      width: 80,
      renderCell: (params) => {
        const rowNumber = parmeterData.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "paramterType", headerName: "Parameter Type", width: 150 },
    { field: "paramterDesc", headerName: "Parameter Description", width: 500 },

    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params: any) => (
        <>
          <div className="flex gap-2">
            <div className="w-5 h-5 text-blue-400 cursor-pointer">
              <PencilIcon
                onClick={() => {
                  console.log(params.row)
                  setFields({
                    ...fields,
                    editOpen: true,
                    module: {
                      label: params.row.module,
                    },
                    parameter_desc: params.row.parameterDescription,
                    parameter_code: params.row.parameterCode,
                    units: {
                      label: params.row.units,
                    },
                    result_type: {
                      label: params.row.resultType,
                    },
                    terminology_type: {
                      label: params.row.terminologyType,
                    },
                    terminology_code_desc: {
                      label: params.row.terminologyDesc,
                    },
                    parameterId: params.row.parameterId,
                    comments: params.row.comments,
                    editData: params.row,
                  });
                }}
              />
            </div>
            <TrashIcon
              className="w-5 h-5 text-red-400 cursor-pointer"
              onClick={() =>
                setFields({ ...fields, delMsgPop: true, data: params.row })
              }
            />
          </div>
        </>
      ),
    },
  ];

  const [loader, setLoader] = useState<any>(false)


  const updateParameter = () => {
    setLoader(true)
    let Obj = {
      parameterId: fields.parameterId,
      parameterCode: fields.parameter_code,
      parameterDescription: fields.parameter_desc,
      module: fields?.module?.label,
      resultType: fields?.result_type?.label,
      terminologyType: fields?.terminology_type?.label,
      comments: fields.comments,
      units: fields?.units?.label,
      listValue: "",
      valueList: fields?.result_type?.label === "List" ? storeList : [],
      version: null,
      generatedDate: null,
      pdatedDate: null,
      generatedId: null,
      generatedBy: null,
      updatedBy: null,
      statusFlag: 1,
      terminologyDesc: fields.terminologyDesc,
      terminologyCode: fields.terminologyCode,
    };

    services
      .create(saveCpoeParametermaster, Obj)
      .then((res) => {
        setTimeout(() => {
          setLoader(false)
          toast.success(
            `Successfully Updated ${fields.parameter_desc} in Paramter Master`
          );
          getServiceParameter();
          setFields({ ...fields, editOpen: false });
        }, 2000)

      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          setLoader(false)
          toast.error(`${err.response.data ? err.response.data.statusMessage : err.message}`)
        }, 2000)
      });
  };

  const inputHandler = (e: any) => {
    setFields({ ...fields, [e.target.name]: sanitizeInput(e.target.value) });
    clearErrorMessage({ ...errorMsg, parameterDesc: "" }); // Clear error message on input change
    if (
      fields.parameterDesc &&
      !alphaNumWithHyphen.test(fields.parameterDesc)
    ) {
      setErrorMessage({
        ...errorMsg,
        parameterDesc: "Please do not enter special characters!",
      });
    }
  };

  // get parameter by Service and department
  const getServiceParameter = () => {
    services
      .get(
        labParamerterList +
        `${fields.parameterModule.label}&searchString=${fields.parameterDesc}`
      )
      .then((res: any) => {
        let getFinal = res.data
          .map((list: any) => {
            return {
              ...list,
              label: list.parameterDescription,
              value: list.parameterDescription,
              paramterType: list.module,
              paramterDesc: list.parameterDescription,
              statusFlag: 1,
            };
          })
          .filter(
            (list: any) =>
              list?.module === fields.parameterModule.label &&
              list?.parameterDescription
                .toLowerCase()
                .includes(fields.parameterDesc?.toLowerCase())
          ).filter((satuFlag: any) => satuFlag.statusFlag);

        setParmeterData(getFinal);
      })
      .catch((err) => console.log(err));
  };


  // delete the Parameter List
  const deleteRow = () => {
    setLoader(true)
    services
      .create(
        deleteParameterMaster + `parameterId=${fields.data.parameterId}`,
        {}
      )
      .then((res) => {
        setTimeout(() => {
          toast.success(
            `Successfully Deleted ${fields.data.parameterDescription} from The Paramter`
          );
          // parameterId
          setFields({ ...fields, delMsgPop: false });
          setLoader(false)
          // parameterId=
          getServiceParameter();
        }, 2000)

      })
      .catch((err) => {
        setTimeout(() => {
          toast.error(
            `${err.response.data ? err.response.data.statusMessage : err.message}`
          );
          // parameterId=
          setLoader(false)
          getServiceParameter();
        }, 2000)
      });
  };

  // get units from this function
  const UnitsParamter = () => {
    services
      .get(ParamterUnits)
      .then((res) => {
        let getUnits = res.data.configData.map((list: any) => {
          return {
            ...list,
            value: list.label,
          };
        });
        setunitsSelct(getUnits);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (
      fields?.parameterModule?.label !== "Select Module *" &&
      fields?.parameterDesc !== ""
    ) {
      setFields({ ...fields, creatbtnShow: true });
    } else {
      setFields({ ...fields, creatbtnShow: false });
    }
    UnitsParamter();
  }, [fields?.parameterDesc, fields?.parameterModule]);

  return (
    <>
      <div className="w-full">
        <div className="px-3 bg-white rounded-curve py-3 rounded-curve mx-auto w-full border border-stroke">
          <ParameterHeading
            title="Parameter Master"
          />

          <div className="w-full flex gap-4 relative mb-4">
            <div className="w-1/6 relative my-select">
              <ReactSelectBox
                value={fields.parameterModule}
                options={moduleData}
                onChange={(e: any) => {
                  setFields({
                    ...fields,
                    parameterModule: e,
                  });
                }}
                label="Select Module *"
                isMultiple={false}
                isSearchable={false}
              />
            </div>
            <div className="w-2/6 relative my-select">
              <FormPropsTextFields
                label={`Parameter Description *`}
                name="parameterDesc"
                pattern="[a-zA-Z0-9]*"
                value={fields.parameterDesc}
                handleChange={inputHandler}
              />

              {/* {fields.parameterDesc &&
                !alphaNumWithHyphen.test(fields.parameterDesc) && (
                  <div className="absolute text-xs mt-1 ml-1 text-red-500">
                    Please do not enter special characters !
                  </div>
                )} */}

              {errorMsg && (
                <div className="absolute text-xs mt-1 ml-1 text-red-500">
                  {errorMsg.parameterDesc}
                </div>
              )}
            </div>

            <ActionButton
              buttonText="View"
              handleSubmit={getServiceParameter}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={
                errorMsg.parameterDesc === "" &&
                  fields.parameterDesc !== "" &&
                  fields.parameterModule.label !== "Select Module *"
                  ? false
                  : true
              }
            />

            <ActionButton
              buttonText="New"
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={() =>
                setFields({
                  ...fields,
                  modalOpen: true,
                  module: {
                    label: "Module *",
                  },
                  parameterModule: {
                    label: "Select Module *",
                  },
                  creatbtnShow: false,
                  parameter_desc: "",
                  units: {
                    label: "Select Units",
                  },
                  result_type: {
                    label: "Result Type *",
                  },
                  terminology_type: {
                    label: "Terminology Type *",
                  },
                  terminology_code_desc: {
                    label: "Terminology code / Desc Search *",
                  },
                  comments: "",
                  parameter_code: "",
                  parameterDesc: "",
                  parameterId: null,
                })
              }
            />
          </div>
          <div className="px-3 mt-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
            {/* data grid */}
            <ReactDatagrid
              rows={parmeterData}
              columns={columns}
            />
          </div>
        </div>
      </div>

      {/* New Parameter Add */}
      <ReactCommonDialog
        open={fields.modalOpen}
        handler={() => setFields({ ...fields, modalOpen: false })}
        popupClose={() => setFields({ ...fields, modalOpen: false })}
        Content={<NewParameter
          fields={fields}
          setFields={setFields}
          storeList={storeList}
          setStoreList={setStoreList}
          unitsSelct={unitsSelct}
          loader={loader}
          setLoader={setLoader}
        />}
        size={'xl'}
        dialogtitle="New Parameter Master"
      />

      {/* Edit Parameter Master */}
      <ReactCommonDialog
        open={fields.editOpen}
        handler={() => setFields({ ...fields, editOpen: false })}
        popupClose={() => setFields({ ...fields, editOpen: false })}
        Content={
          <NewParameter
            fields={fields}
            setFields={setFields}
            updateParameter={updateParameter}
            storeList={storeList}
            setStoreList={setStoreList}
            unitsSelct={unitsSelct}
            loader={loader}
          />
        }
        dialogtitle="Edit Parameter Master"
        size={'xl'}
      />


      {/* Delete Popup */}
      <ReactCommonDialog
        open={fields.delMsgPop}
        handler={() => setFields({ ...fields, delMsgPop: false })}
        popupClose={() => setFields({ ...fields, delMsgPop: false })}
        Content={
          <DeletePopupMsg
            btnYesFun={deleteRow}
            loader={loader}
            btnNoFun={() => setFields({ ...fields, delMsgPop: false })}
            content={'Do You want to Delete this record..'}
          />
        }

      />

    </>
  );
};

export default ParameterMaster;
