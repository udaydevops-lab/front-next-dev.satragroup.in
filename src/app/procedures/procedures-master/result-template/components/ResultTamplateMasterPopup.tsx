"use client"
import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import { ReactSelectBox } from '@/app/_commonfeatures';
import QuillRichEditer from '@/app/_commonfeatures/QuillRichEditer';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { assignRadiologyParameterHeaderId, getAllLabAssignServicesData, getAllLabAssignServicesNames, getAllProcedureAssignServices, getAllRadiologyAssignServices, getAllRadiologyParameters, resultTamplateSave, saveProcedureResultTemplate, saveRadiologyResultTemplate } from '@/app/utilities/api-urls';
import { getLocalItem } from '@/app/utilities/local';
import services from '@/app/utilities/services';
import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';

interface ResultTemplateMasterPopupProps {
  feildsData: any,
  setFeildsData: Dispatch<SetStateAction<any>>,
  listSel: any,
  setListSel: Dispatch<SetStateAction<any>>,
  radServiceNameData: any,
  radfeilds: any,
  setRadFeilds: Dispatch<SetStateAction<any>>,
  radServiceFeilsInfo: any,
  setRadServiceFeilsInfo: Dispatch<SetStateAction<any>>,
  btnType: any,
  getgridData: any,
  popup: any,
  setPopup: Dispatch<SetStateAction<any>>,
}

const ResultTemplateMasterPopup: FC<ResultTemplateMasterPopupProps> = ({
  feildsData, setFeildsData, listSel, setListSel, radfeilds, setRadFeilds, radServiceNameData, radServiceFeilsInfo, setRadServiceFeilsInfo, btnType, getgridData, popup, setPopup,
}) => {
  const [loader, setLoader] = useState(false);
  const [empName, setEmpName] = useState("");
  const [radServiceNameList, setRadServiceNameList] = useState<any>([]);

  useEffect(() => {
    const storedLoginResponse = getLocalItem("loginResponse");
    try {
      const empname = storedLoginResponse ? JSON.parse(storedLoginResponse).employeename : "";
      setEmpName(empname);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      setEmpName("");
    }
  }, []);

  // image convert To Base64 function
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => reader.result ? resolve(reader.result.toString()) : reject(new Error("Failed to convert image to base64."));
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // onchange image set converted base 64 value function
  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setFeildsData((prevData: any) =>
          prevData.map((item: any, i: number) =>
            i === index ? { ...item, result: base64 } : item
          )
        );
        // setRadServiceFeilsInfo((prevData: any) => ({
        //   ...prevData,
        //   assignParameterItemSet: prevData.assignParameterItemSet.map((item: any, i: number) =>
        //     i === index ? { ...item, result: base64 } : item
        //   ),
        // }));
      } catch (error) {
        console.error("Error converting image:", error);
      }
    }
  };

  // onchange input values function
  const handleChange = (index: number, value: any, key = "result") => {
    // setRadServiceFeilsInfo((prevData: any) => ({
    //   ...prevData,
    //   assignParameterItemSet: prevData.assignParameterItemSet.map((item: any, i: number) =>
    //     i === index ? { ...item, [key]: value } : item
    //   ),
    // }));
    setFeildsData((prevData: any) =>
      prevData.map((item: any, i: number) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  };


  //Set Radiology Service Name function
  const handelSetLabServiceName = (e: any) => {
    setRadFeilds({ ...radfeilds, radServiceName: e });
    handelLabServicefeilds(e);
  };

  const handelLabServicefeilds = async (row: any) => {
    try {
      const response = await services.get(`${getAllProcedureAssignServices}serviceCode=${row.serviceCode}&serviceName=${row.serviceDesc}`);

      let result = await response.data.assignProcedureParameterItemSet.map((mainList: any, index: any) => {
        if (mainList.resultType === "list") {
          // If valueList is null, return the object with an empty array for valueList
          if (mainList.result) {
            setListSel((prev: any) => {
              return {
                ...prev,
                [`sel${index}`]: {
                  label: mainList.result,
                },
              };
            });
          }
          if (mainList.valueList === null || mainList.valueList === "") {
            return {
              ...mainList,
              options: []
            };
          } else {
            // Otherwise, map over the valueList to create the desired structure
            let getData = mainList?.valueList?.map((innerList: any) => {
              return {
                label: innerList,
                value: innerList,
              };
            });
            setListSel((prev: any) => {
              return {
                ...prev,
                [`options${index}`]: getData,
              };
            });
            return {
              ...mainList,
              options: getData,
            };
          }
        }
        // If resultType is not "list", return the object as is
        return mainList;
      });
      // setFeildsData(result)
      setFeildsData(result)
      setRadServiceFeilsInfo(response.data);
    } catch (error) {
      console.error("Error fetching lab service fields:", error);
    }
  };

  // save function
  const handelSave = () => {
    setLoader(true);
    const assignParameterItemSetData = feildsData.map((list: any) => ({
      ...list,
      proceduresResultTemplateItemId: btnType === "save" ? null : list.proceduresResultTemplateItemId,
      // assignLabParameterItemId: btnType === "save" ? null : list.assignLabParameterItemId,
      terminologyCode: list.terminologyCode,
      terminologyDesc: list.terminologyDesc,
      result: list.result,
      parameterCode: list.procedureParameterCode,
      parameterDesc: list.procedureParameterDesc,
      normalRange: list.normalRange,
      statusFlag: list.statusFlag,
      resultType: list.resultType,
      parameter: list.parameter,
    }));
    const postObj = {
      proceduresResultTemplateHeaderId: btnType === "save" ? null : radServiceFeilsInfo.proceduresResultTemplateHeaderId,
      serviceCode: radServiceFeilsInfo.serviceCode,
      serviceDesc: radServiceFeilsInfo.serviceDesc,
      proceduresResultTemplateName: radfeilds.resultTemplateName,
      department: radServiceFeilsInfo.department,
      departmentCode: radServiceFeilsInfo.departmentCode,
      speciality: radServiceFeilsInfo.speciality,
      terminalogyCode: radServiceFeilsInfo.terminalogyCode,
      terminalogyDesc: radServiceFeilsInfo.terminalogyDesc,
      specimenType: radServiceFeilsInfo.specimenType,
      statusFlag: btnType === "save" ? 1 : radServiceFeilsInfo.statusFlag,
      generatedDate: radServiceFeilsInfo.generatedDate,
      generatedBy: btnType === "save" ? empName : radServiceFeilsInfo.generatedBy,
      updatedBy: btnType !== "save" ? empName : radServiceFeilsInfo.updatedBy,
      proceduresResultTemplateItemDto: assignParameterItemSetData,
    };
    const headers = getHeaderResponse();
    console.log(postObj)
    services.create(saveProcedureResultTemplate, postObj, headers).then((res: any) => {
      toast.success("Success");
      getgridData()
      setPopup({
        open: false
      })
      setLoader(false);
    }).catch((error) => {
      console.log(error)
      toast.error("Something went wrong please try again");
      setLoader(false);
    }).finally(() => {
      setLoader(false);
    })


  };

  const handelRadServiceName = (e: any) => {
    let search: any = e.target.value;
    if (search.length > 1) {
      let value = radServiceNameData.filter((item: any) =>
        item.label.toLowerCase().includes(search.toLowerCase())
      );
      setRadServiceNameList(value)
      //radServiceNameList, setRadServiceNameList
    }
  }
  return (
    <>
      <div className='flex w-full gap-4'>
        <div className='w-1/3 newSelect'>
          <ReactSelectBox
            value={radfeilds.radServiceName}
            options={radServiceNameList}
            label="Procedures Service Name"
            isSearchable={true}
            onChange={handelSetLabServiceName}
            onSearchInputChange={handelRadServiceName}
            height="150"
          />
        </div>

        <div className='w-1/3 mt-1'>
          <FormPropsTextFields
            name="resultTemplateName"
            value={radfeilds.resultTemplateName}
            handleChange={(e: any) => setRadFeilds({ ...radfeilds, resultTemplateName: e.target.value })}
            label="Result Template  Name"
          />
        </div>
      </div>

      <div className='w-full mt-6 mb-2'>
        <strong>Service Name</strong>:<span>{radfeilds?.radServiceName?.label}</span>{" " + "|" + " "}
        <strong>Department</strong>:<span>Radiology</span>{" " + "|" + " "}
        <strong>Speciality</strong>:<span>{radfeilds?.radServiceName?.speciality}</span>{" "}
      </div>

      <div className="w-full border mt-6 p-2">
        <div className="w-full flex gap-4">
          <div className="w-1/3 mb-2">Parameter</div>
          <div className="w-2/3 mb-2">Result</div>
        </div>
        {feildsData.length > 0 ? feildsData?.map((field: any, index: number) => (
          <div className="w-full flex gap-4" key={index}>
            <div className="w-1/3 mb-2">{field?.procedureParameterDesc}</div>
            <div className="w-2/3 mb-2">
              {field?.resultType === "list" ? (
                <Select
                  primaryColor="blue"
                  value={listSel[`sel${index}`]}
                  options={field?.options}
                  onChange={(e: any) => {
                    handleChange(index, e.label);
                    setListSel((prevListSel: any) => ({ ...prevListSel, [`sel${index}`]: e }));
                  }}
                  placeholder="Results"
                />
              ) : field?.resultType === "textbox" ? (
                <>
                  <QuillRichEditer
                    statValue={field?.result ? field?.result : field?.contentText}
                    onChange={(data: any) => handleChange(index, data)}
                  />

                </>
              ) : field?.resultType === "file" ? (
                <>
                  <input
                    type="file"
                    className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  {field?.result && <img src={field?.result} alt="Selected" style={{ width: "100px" }} />}
                </>
              ) : (
                field?.resultType === "link" ? (
                  <>
                    <input
                      type="file"
                      className="border-gray-300 border text-sm w-full focus:border-blue-300 py-2 px-4 rounded-[7px]"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                  </>

                ) : (
                  <input
                    placeholder="Result"
                    value={field?.result}
                    type={field?.resultType}
                    className="flex py-2 px-3 w-full text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all duration-300 focus:outline-none"
                    onChange={(e) => handleChange(index, e.target.value)}
                  />
                ))}
            </div>

          </div>
        ))
          : "No Data Available Please contact Admin"}
      </div>
      <div className='w-full flex justify-end mt-2'>
        <ActionButton
          buttonText={loader ? (
            <div className='w-full flex justify-center items-center'>
              <div className='innerBtnloader'></div>
            </div>
          ) : (
            <>
              {btnType === "save" ? "Save" : "Update"}
            </>
          )}
          width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={handelSave}
        />
      </div>
    </>
  );
};

export default ResultTemplateMasterPopup;
