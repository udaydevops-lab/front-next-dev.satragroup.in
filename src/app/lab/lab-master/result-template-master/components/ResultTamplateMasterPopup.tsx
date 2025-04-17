"use client"
import ActionButton from '@/app/_common/button';
import FormPropsTextFields from '@/app/_common/input';
import { ReactSelectBox } from '@/app/_commonfeatures';
import QuillRichEditer from '@/app/_commonfeatures/QuillRichEditer';
import { getHeaderResponse } from '@/app/_commonfeatures/header';
import { getAllLabAssignServicesData, getAllLabAssignServicesNames, resultTamplateSave } from '@/app/utilities/api-urls';
import { getLocalItem } from '@/app/utilities/local';
import services from '@/app/utilities/services';
import { Input } from '@material-tailwind/react';
import React, { Dispatch, FC, SetStateAction, useState, useEffect } from 'react';
import Select from 'react-tailwindcss-select';
import { toast } from 'react-toastify';
import { setTimeout } from 'timers';

interface ResultTemplateMasterPopupProps {
  feildsData: any,
  setFeildsData: Dispatch<SetStateAction<any>>,
  listSel: any,
  setListSel: Dispatch<SetStateAction<any>>,
  labServiceNameData: any,
  labfeilds: any,
  setLabFeilds: Dispatch<SetStateAction<any>>,
  setLabServiceNameData: Dispatch<SetStateAction<any>>,
  labServiceFeilsInfo: any,
  setlabServiceFeilsInfo: Dispatch<SetStateAction<any>>,
  btnType: any,
  getgridData: any,
  setPopup: any,

}

const ResultTemplateMasterPopup: FC<ResultTemplateMasterPopupProps> = ({
  feildsData, setFeildsData, listSel, setListSel, labfeilds, setLabFeilds, labServiceNameData, setLabServiceNameData, labServiceFeilsInfo, setlabServiceFeilsInfo, btnType, getgridData, setPopup
}) => {

  //state
  const [loader, setLoader] = useState(false);
  const [empName, setEmpName] = useState("");

  // convert base 64 function
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => reader.result ? resolve(reader.result.toString()) : reject(new Error("Failed to convert image to base64."));
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // base 64 set the value respectied feilds function
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
        // setlabServiceFeilsInfo((prevData: any) => ({
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

  // onchange function
  const handleChange = (index: number, value: any, key = "result") => {

    // setlabServiceFeilsInfo((prevData: any) => ({
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

  // lab service onchange get data function
  const handelLabServiceName = async (e: any) => {
    const searchData = e.target.value;
    if (searchData.length >= 1) {
      try {
        const response = await services.get(`${getAllLabAssignServicesNames}${searchData}`);
        let result = response.data.map((list: any) => ({
          ...list,
          label: list.serviceDesc,
          value: list.serviceCode
        }))
        setLabServiceNameData(result);
      } catch (error) {
        console.error("Error fetching lab service names:", error);
      }
    }
  };

  // select onchange function
  const handelSetLabServiceName = (e: any) => {
    setLabFeilds({ ...labfeilds, labServiceName: e });
    setlabServiceFeilsInfo((prevData: any) => ({
      ...prevData,
      speciality: e.speciality
    }))
    //labServiceFeilsInfo.speciality
    handelLabServicefeilds(e);
  };
  //input onchange function
  const handelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabFeilds({ ...labfeilds, labResultName: e.target.value });

  };

  // lab info by id function
  const handelLabServicefeilds = async (row: any) => {
    const id = row.assignLabParameterHeaderId;
    try {
      const response = await services.get(`${getAllLabAssignServicesData}${id}`);
      // let result = await response.data.assignParameterItemSet?.
      let result = response.data.assignParameterItemSet.map((mainList: any, index: any) => {
        if (mainList.resultType === "list") {
          // If valueList is null, return the object with an empty array for valueList
          if (mainList.listValue === null || mainList.listValue === "") {
            return {
              ...mainList,
              options: []
            };
          } else {
            // Otherwise, map over the valueList to create the desired structure
            let getData = mainList?.listValue?.split(",").map((innerList: any) => {
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
      setFeildsData(result)
      setlabServiceFeilsInfo(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching lab service fields:", error);
    }
  };

  // save function
  const handelSave = () => {
    setLoader(true);
    let message = btnType === "save" ? "successfully Saved " : "successfully Updated "
    const assignParameterItemSetData = feildsData.map((list: any) => ({
      ...list,
      resultTemplateItemId: btnType === "save" ? "" : list.resultTemplateItemId,
      assignLabParameterItemId: btnType === "save" ? "" : list.assignLabParameterItemId,
      terminologyCode: list.terminologyCode,
      terminologyDesc: list.terminologyDesc,
      result: list.result,
      parameterCode: list.parameterCode,
      parameterDesc: list.parameter,
      normalRange: list.normalRange,
      statusFlag: list.statusFlag,
      resultType: list.resultType,
      parameter: list.parameter,
      referenceRangeDto: list.referenceRangeDto,
    }));
    const postObj = {
      resultTemplateHeaderId: btnType === "save" ? "" : labServiceFeilsInfo.resultTemplateHeaderId,
      serviceCode: labServiceFeilsInfo.serviceCode,
      serviceDesc: labServiceFeilsInfo.serviceDesc,
      resultTemplateName: labfeilds.labResultName,
      department: labServiceFeilsInfo.department,
      speciality: labServiceFeilsInfo.speciality,
      terminalogyCode: labServiceFeilsInfo.terminalogyCode,
      terminalogyDesc: labServiceFeilsInfo.terminalogyDesc,
      specimenType: labServiceFeilsInfo.specimenType,
      statusFlag: btnType === "save" ? 1 : labServiceFeilsInfo.statusFlag,
      generatedDate: labServiceFeilsInfo.generatedDate,
      generatedBy: btnType === "save" ? empName : labServiceFeilsInfo.generatedBy,
      updatedBy: btnType === "save" ? "" : empName,
      labResultTemplateItemDto: assignParameterItemSetData,
    };
    const headers = getHeaderResponse();

    services.create(resultTamplateSave, postObj, headers).then((response) => {
      setTimeout(() => {
        toast.success(message);
        getgridData()
        setPopup({ open: false })
        setLoader(false);
      }, 1000);

    })
      .catch((err) => {
        console.log(err.message);
        setLoader(false);
      });

  };

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
  console.log(labfeilds.labServiceName)
  return (
    <>
      <div className='flex w-full gap-4'>
        <div className='w-1/3 newSelect'>
          <ReactSelectBox
            value={labfeilds.labServiceName}
            options={labServiceNameData}
            label="Lab Service Name"
            isSearchable={true}
            onChange={handelSetLabServiceName}
            onSearchInputChange={handelLabServiceName}
            height="150"
          />
        </div>

        <div className='w-1/3 mt-1'>
          <Input
            crossOrigin
            name="labResultName"
            value={labfeilds.labResultName}
            onChange={handelInput}
            label="Result Template Name"
            color='blue'
          />
        </div>
      </div>

      <div className='w-full mt-6 mb-2'>
        <strong>Service Name</strong>:<span>{labfeilds.labServiceName.label}</span>{" " + "|" + " "}
        <strong>Department</strong>:<span>Laboratory</span>{" " + "|" + " "}
        <strong>Speciality</strong>:<span>{labServiceFeilsInfo.speciality}</span>{" "}
      </div>

      <div className="w-full border mt-6 p-2">
        <div className="w-full flex gap-4">
          <div className="w-1/3 mb-2">Parameter</div>
          <div className="w-2/3 mb-2">Result</div>
        </div>
        {feildsData.length > 0 ? feildsData?.map((field: any, index: number) => (
          <div className="w-full flex gap-4" key={index}>
            <div className="w-1/3 mb-2">{field?.parameter}</div>
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
          buttonText={
            loader ?
              <div className='w-full flex justify-center items-center'>
                <div className='innerBtnloader'></div>
              </div> :
              btnType === "save" ? "Save" : "Update"
          }
          width="w-[120px] text-white text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          handleSubmit={handelSave}
        />
      </div>
    </>
  );
};

export default ResultTemplateMasterPopup;