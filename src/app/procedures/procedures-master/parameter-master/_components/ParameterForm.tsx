import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import Textarea from "@/app/_common/text-area";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import {
  getConfigData,
  ParamterUnits,
  saveProcedureParameter,
  snomedLoincSearch,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { TrashIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import { getFormColumns, resultTypeList } from "./Utils";
import { toast } from "react-toastify";
import { jsonParse } from "@/app/utilities/local";

export default function ParameterForm({
  formData,
  setFormData,
  getAllData,
}: any) {
  const [unitList, setUnitList] = useState<any>([]);
  const [termminologyType, setTermminologyType] = useState<any>([]);
  const [snomedList, setSnomedList] = useState<any>([]);
  const getUnitList = () => {
    services.get(ParamterUnits).then((response) => {
      let arr: any = [];
      response.data.configData.map((item: any) => {
        let obj = {
          value: item.label,
          label: item.desc,
        };
        arr.push(obj);
      });
      setUnitList(arr);
    });
  };
  const getTerminologyType = () => {
    services.get(getConfigData + "TerminologyType/0").then((response) => {
      setTermminologyType(response.data.configData);
    });
  };
  const onInputSearch = (e: any) => {
    if (e.target.value.length > 2) {
      let apiUrl = `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=1000&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${e.target.value}&timing=ALL`;
      services.get(apiUrl).then((response) => {
        response.data.map((item: any) => {
          item.label = item.DisplayName;
          item.value = item.LOINC_NUMBER;
        });
        setSnomedList(response.data);
      });
    }
  };
  const handleAdd = () => {
    if (!formData.terminologyType)
      return toast.error("Please select terminology type");
    if (!formData.terminologyDesc)
      return toast.error("Please select terminology description");
    if (
      formData.parameterTerminologySet.some(
        (item: any) => item.terminologyCode == formData.terminologyDesc.value
      )
    ) {
      return toast.error("Duplicate record");
    }
    let arr = [...formData.parameterTerminologySet];
    let obj = {
      terminologyId: null,
      terminologyType: formData.terminologyType.label,
      terminologyCode: formData.terminologyDesc.value,
      terminologyDesc: formData.terminologyDesc.label,
      generatedBy:
        formData.action == "new"
          ? jsonParse("loginResponse").employeename
          : null,
      updatedBy:
        formData.action == "update"
          ? jsonParse("loginResponse").employeename
          : null,
    };
    arr.push(obj);
    setFormData({
      ...formData,
      parameterTerminologySet: arr,
      terminologyDesc: "",
      terminologyType: "",
    });
  };
  const deleteRow = (data: any) => {
    let filtered = formData.parameterTerminologySet.filter(
      (item: any) => item.terminologyCode !== data.terminologyCode
    );
    setFormData({ ...formData, parameterTerminologySet: filtered });
  };
  const handleAddList = () => {
    setFormData({
      ...formData,
      valueList: [
        ...formData.valueList,
        { id: formData.valueList.length + 1, value: formData.addValue },
      ],
      addValue: ""
    });
  };
  const deleteValue = (id: any) => {
    let filtered = formData.valueList.filter((item: any) => item.id !== id);
    setFormData({ ...formData, valueList: filtered });
  };
  const onSave = () => {
    let arr: any = [];
    formData.valueList.map((item: any) => {
      arr.push(item.value);
    });
    let postObj = {
      procedureParameterId: formData.procedureParameterId,
      procedureParameterDescription: formData.procedureParameterDescription,
      procedureParameterCode: formData.procedureParameterCode,
      resultType: formData.resultType.value,
      units: formData.units?.value,
      parameterTerminologySet: formData.parameterTerminologySet,
      comments: formData.comments,
      valueList: arr,
      statusFlag: 1,
    };
    services
      .create(saveProcedureParameter, postObj)
      .then((response) => {
        setTimeout(() => {
          toast.success(
            `${formData.action == "new" ? "Saved" : "Updated"} Successfully`
          );
          setFormData({ ...formData, loader: false, popUp: false });
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
  const handleClear=() => {
    setFormData({
     ...formData,
      procedureParameterDescription: "",
      procedureParameterCode: "",
      resultType: "",
      units: "",
      parameterTerminologySet: [],
      comments: "",
      terminologyType:"",
      terminologyDesc:"",
      valueList: [],
    });
  }
  useEffect(() => {
    getUnitList();
    getTerminologyType();
  }, []);
  return (
    <>
      <div className="w-full flex gap-4 mt-4">
        <div className="w-2/5 newInputField">
          <FormPropsTextFields
            label="Parameter Name *"
            type="text"
            name="parameterDescription"
            value={formData.procedureParameterDescription}
            handleChange={(e: any) => {
              setFormData({
                ...formData,
                procedureParameterDescription: e.target.value,
              });
            }}
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
            value={formData.procedureParameterCode}
            handleChange={(e: any) => {
              setFormData({
                ...formData,
                procedureParameterCode: e.target.value,
              });
            }}
            containerProps={{
              className: "!min-w-0 h-[43px]",
            }}
          />
        </div>
        <div className="w-1/5 newSelect">
          <ReactSelectBox
            value={formData.units}
            options={unitList}
            isSearchable={true}
            onChange={(e) => {
              setFormData({ ...formData, units: e });
            }}
            label="Result Units"
            height={150}
          />
        </div>
        <div className="w-1/5 newSelect">
          <ReactSelectBox
            value={formData.resultType}
            options={resultTypeList}
            onChange={(e) => setFormData({ ...formData, resultType: e })}
            label={"Result Type *"}
          />
        </div>
      </div>
      {/* Radiology Terminology Form */}
      <div
        className={`${
          formData.resultType.value === "list" ? "gap-4 flex" : ""
        } w-full mt-4`}
      >
        <div
          className={`${
            formData.resultType.value === "list" ? "w-3/4" : "w-full "
          }`}
        >
          <div className="w-full flex gap-4">
            <div className="w-1/5 newSelect my-select">
              <ReactSelectBox
                value={formData.terminologyType}
                options={termminologyType}
                onChange={(e: any) => {
                  setFormData({ ...formData, terminologyType: e });
                }}
                label="Terminology Type *"
                isMultiple={false}
                isSearchable={false}
              />
            </div>
            <div className="w-3/5 newSelect my-select">
              <ReactSelectBox
                value={formData.terminologyDesc}
                options={snomedList}
                onChange={(e) => {
                  setFormData({ ...formData, terminologyDesc: e });
                }}
                onSearchInputChange={(e: any) => {
                  onInputSearch(e);
                }}
                label="Terminology code / Desc Search *"
                isMultiple={false}
                isSearchable={true}
                height={200}
              />
            </div>
            <div className="w-1/5 newBtn-theme">
              <ActionButton
                buttonText="Add"
                width="w-full text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                handleSubmit={handleAdd}
                disabled={false}
              />
            </div>
          </div>
          {/* Radiology Terminology grid */}
          <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
            <ReactDatagrid
              rows={formData.parameterTerminologySet}
              columns={getFormColumns(deleteRow)}
            />
          </div>
          <div className="w-full mt-4 newInputField">
            <Textarea
              label="Comments"
              value={formData.comments}
              name="referenceComments"
              minRows={2}
              onChange={(e: any) => {
                setFormData({ ...formData, comments: e.target.value });
              }}
              containerProps={{
                className: "!min-w-0",
              }}
            />
          </div>
        </div>
        {formData.resultType.value === "list" && (
          <div className="w-1/4">
            <div className="w-full flex gap-4 newInputField newBtn-theme">
              <div className="w-2/3">
                <FormPropsTextFields
                  label={`Enter List Value`}
                  value={formData.addValue}
                  handleChange={(e: any) =>
                    setFormData({ ...formData, addValue: e.target.value })
                  }
                  containerProps={{
                    className: "!min-w-0 rounded-lg  rounded-r-none",
                  }}
                />
              </div>
              <ActionButton
                buttonText="Add"
                handleSubmit={handleAddList}
                width="w-[80px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                disabled={!formData.addValue}
              />
            </div>
            <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
              <div className="w-full mt-3">
                <div
                  className="w-full bg-gray-200 
                                                font-bold text-center text-black 
                                                 px-3"
                >
                  List Value
                </div>
                <div className="w-full bg-white">
                  <ul className=" list-none m-0 p-0 divide-y">
                    {formData.valueList.map((item: any, index: any) => (
                      <>
                        <li className="py-1 px-2 text-sm flex justify-between items-center">
                          {item.value}
                          <div
                            className="cursor-pointer"
                            onClick={() => {
                              deleteValue(item.id);
                            }}
                          >
                            <TrashIcon className="w-3 h-3 text-red-500" />
                          </div>
                        </li>
                      </>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4">
        <ActionButton
          buttonText={
            formData.loader ? (
              <div className="w-full flex justify-center items-center">
                <div className="innerBtnloader"></div>
              </div>
            ) : formData.action == "update" ? (
              "Update"
            ) : (
              "Save"
            )
          }
          handleSubmit={onSave}
          width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          disabled={
            formData.procedureParameterCode &&
            formData.procedureParameterDescription &&
            formData.resultType &&
            formData.parameterTerminologySet.length > 0
              ? false
              : true
          }
        />
        {formData.action == "update" ? null : (
          <ActionButton
            buttonText="Clear"
            handleSubmit={handleClear}
            width="w-[120px] text-white  text-[14px] h-[43px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          />
        )}
      </div>
    </>
  );
}
