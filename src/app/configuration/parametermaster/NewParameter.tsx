"use client";
import React, { useEffect, useState } from "react";
import FormPropsTextFields from "@/app/_common/input";
import ActionButton from "@/app/_common/button";
import { Textarea } from "@material-tailwind/react";
import { toast } from "react-toastify";
import {
  getConfigData,
  saveCpoeParametermaster,
  snomedLoincSearch,
  snowmedChiefcomplaint,
} from "@/app/utilities/api-urls";
import axios from "axios";
import services from "@/app/utilities/services";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithHyphen, alphaNumWithHyphenspacedash } from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";

const NewParameter = ({
  fields,
  setFields,
  updateParameter,
  setStoreList,
  storeList,
  unitsSelct,
  loader, setLoader
}: any) => {
  const [creatbtnShow, setCreatebtnShow] = useState<any>(false);

  const moduleData: any = [
    { label: "Laboratory", value: "Laboratory" },
    { label: "Radiology", value: "Radiology" },
    { label: "Procedures", value: "Procedures" },
  ];

  const resultType: any = [
    { label: "Number", value: "number" },
    { label: "String", value: "string" },
    { label: "Multiline rich textbox", value: "textbox" },
    { label: "Images", value: "file" },
    { label: "List", value: "list" },
  ];

  const [TerminologyOptions, setTerminologyOptions] = useState<any>([]);
  const [terminologycodeDesc, setTerminologycodeDesc] = useState<any>([]);

  const fieldOnchange = (e: any) => {
    setFields({ ...fields, [e.target.name]: sanitizeInput(e.target.value) });
  };

  const addList = () => {
    if (fields.list_value !== "") {
      setStoreList([...storeList, fields.list_value]);
      setFields({ ...fields, list_value: "" });
    }
  };

  const saveService = () => {
    setLoader(true)
    let obj: any = {
      module: fields.module.label,
      parameterCode: fields.parameter_code,
      parameterDescription: fields.parameter_desc,
      units: fields.units.label === "Select Units" ? "" : fields.units.label,
      resultType: fields.result_type.value,
      terminologyType: fields.terminology_type.label,
      comments: fields.comments,
      valueList: storeList,
      terminologyDesc: fields.terminologyDesc,
      terminologyCode: fields.terminologyCode,
      statusFlag: 1,
    };

    services
      .create(saveCpoeParametermaster, obj)
      .then((res: any) => {
        setTimeout(() => {
          setLoader(false)
          toast.success("Successfully Added In to the Parameter Master");
          setFields({
            module: {
              label: "Module *",
            },

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
            parameter_desc: "",
            parameterId: null,
            modalOpen: true,
          });
        }, 2000)

      })
      .catch((err: any) => {
        console.log(err);
        setTimeout(() => {
          setLoader(false)
          toast.error(`${err.response.data ? err.response.data.statusMessage : err.message}`);
        }, 2000)
      });


  };

  // get terminology type
  const getTerminologyType = () => {
    services
      .get(getConfigData + "TerminologyType" + "/0")
      .then((response) => {
        setTerminologyOptions(response.data.configData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // enter the value into the Terminilogy Desc
  const handleDescription = async (e: any) => {
    const searchString = e.target.value;
    if (searchString.length > 0) {
      services
        .get(
          `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=1000&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${e.target.value}&timing=ALL`
        )
        .then((res) => {
          const transformedData = res.data.map((item: any) => {
            return {
              ...item,
              value: item.DisplayName,
              label: item.ShortName,
              terminologyDesc: item.LONG_COMMON_NAME,
              terminologyCode: item.LOINC_NUMBER,
            };
          });
          setTerminologycodeDesc(transformedData);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    getTerminologyType();
    if (
      fields.module.label === "Module *" ||
      fields.parameter_desc === "" ||
      fields.result_type.label === "Result Type *" ||
      fields.terminology_type.label === "Terminology Type *" ||
      fields.parameter_code === "" ||
      fields.terminology_code_desc.label === "Terminology code / Desc Search *"
    ) {
      setCreatebtnShow(false);
    } else {
      setCreatebtnShow(true);
    }
  }, [fields]);

  return (
    <>
      <div className="w-full mx-auto max-w-7xl pb-4 md:pb-6 2xl:pb-6">
        <div className="px-3 bg-white rounded-curve md:pt-4 pb-4 rounded-curve mx-auto w-full border border-stroke">
          <div className="w-full flex gap-4 relative mb-4">
            <div className="w-1/6">
              <div className="relative my-select ">
                <ReactSelectBox
                  value={fields.module}
                  options={moduleData}
                  onChange={(e: any) => {
                    setFields({
                      ...fields,
                      module: e,
                    });
                  }}
                  label="Module *"
                  isMultiple={false}
                  isSearchable={false}
                />
              </div>
            </div>
            <div className="w-2/6">
              <FormPropsTextFields
                label={`Parameter Description *`}
                name="parameter_desc"
                value={fields.parameter_desc}
                handleChange={fieldOnchange}
              />
              {fields.parameter_desc &&
                !alphaNumWithHyphenspacedash.test(fields.parameter_desc) && (
                  <div className="absolute text-xs mt-1 ml-1 text-red-500">
                    Please do not enter special characters !
                  </div>
                )}
            </div>
            <div className="w-1/6">
              <FormPropsTextFields
                label={`Parameter Code *`}
                name="parameter_code"
                value={fields.parameter_code}
                handleChange={fieldOnchange}
                containerProps={{
                  className: "!min-w-0 rounded-lg  rounded-r-none",
                }}
              />

              {fields.parameter_code &&
                !alphaNumWithHyphenspacedash.test(fields.parameter_code) && (
                  <div className="absolute text-xs mt-1 ml-1 text-red-500">
                    Please do not enter special characters !
                  </div>
                )}
            </div>
            <div className="w-1/6">
              <div className="w-full">
                <ReactSelectBox
                  value={fields.units}
                  options={unitsSelct}
                  isSearchable={true}
                  onChange={(e: any) => {
                    setFields({
                      ...fields,
                      units: e,
                    });
                  }}
                  label="Select Units"
                  isMultiple={false}
                />
              </div>
            </div>
            <div className="w-1/6 ">
              <div className="w-full">
                <ReactSelectBox
                  value={fields.result_type}
                  options={resultType}
                  onChange={(e: any) => {
                    setFields({
                      ...fields,
                      result_type: e,
                    });
                  }}
                  label="Result Type *"
                  isMultiple={false}
                  isSearchable={false}
                />
              </div>
            </div>
          </div>

          <div className="px-3 bg-white rounded-curve  md:pt-3 pb-2 rounded-curve mx-auto w-full border border-stroke">
            <div className="w-full flex gap-4 ">
              <div
                className={`${fields.result_type.label === "List" ? "w-3/4" : "w-full"
                  }`}
              >
                <div className="w-full flex gap-4">
                  <div className="w-1/3 my-select relative">
                    <ReactSelectBox
                      value={fields.terminology_type}
                      options={TerminologyOptions}
                      onChange={(e: any) => {
                        setFields({
                          ...fields,
                          terminology_type: e,
                        });
                      }}
                      label="Terminology Type *"
                      isMultiple={false}
                      isSearchable={false}
                    />
                  </div>
                  <div className="w-2/3 ">
                    <div className="w-full">
                      <ReactSelectBox
                        value={fields.terminology_code_desc}
                        options={terminologycodeDesc}
                        isSearchable={true}
                        onSearchInputChange={(e: any) => {
                          handleDescription(e);
                        }}
                        onChange={(e: any) => {
                          setFields({
                            ...fields,
                            terminology_code_desc: e,
                            terminologyCode: e.terminologyCode,
                            terminologyDesc: e.terminologyDesc,
                          });
                        }}
                        label="Terminology code / Desc Search *"
                        isMultiple={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full mt-4">
                  <Textarea
                    label="Comments"
                    name="comments"
                    value={fields.comments}
                    onChange={fieldOnchange}
                    className="mb-0 focus:border-t-0"
                    color="blue"
                  />
                </div>
              </div>
              <div
                className={`${fields.result_type.label === "List" ? "w-1/4" : "hidden"
                  }`}
              >
                <div className="w-full flex gap-4">
                  <FormPropsTextFields
                    label={`Enter List Value`}
                    name="list_value"
                    value={fields.list_value}
                    handleChange={fieldOnchange}
                    containerProps={{
                      className: "!min-w-0 rounded-lg  rounded-r-none",
                    }}
                  />
                  <ActionButton
                    buttonText="Add"
                    handleSubmit={addList}
                    width="w-[80px] h-[40px] py-3 inline"
                  />
                </div>
                <div className="w-full mt-2">
                  {storeList.length > 0 ? (
                    <>
                      <div className="w-full">
                        <div
                          className="w-full bg-gray-200 
                                            font-bold text-center text-black 
                                            py-1 px-3"
                        >
                          List Value
                        </div>
                        <div className="w-full">
                          <ul className=" list-none m-0 p-0">
                            {storeList.map((list: any) => (
                              <>
                                <li className="py-1 px-2 text-sm">{list}</li>
                              </>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>No List for now</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-4 flex justify-end gap-4">

            <ActionButton
              buttonText={
                loader ?
                  <div className='w-full flex justify-center items-center'>
                    <div className='innerBtnloader'></div>
                  </div> :
                  fields.parameterId !== null ? "Update" : "Create"
              }
              handleSubmit={fields.parameterId !== null ? updateParameter : saveService}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={creatbtnShow ? false : true}
            />

            <ActionButton
              buttonText="Cancel"
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              handleSubmit={() => fields.parameterId !== null ? setFields({ ...fields, editOpen: false }) : setFields({ ...fields, modalOpen: false })}
            />

          </div>
        </div>
      </div>
    </>
  );
};

export default NewParameter;
