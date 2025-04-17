"use client";
import ActionButton from "@/app/_common/button";
import { TabPageTitle } from "@/app/lab/_component";
import React, { useEffect, useState } from "react";
import ParameterGrid from "./_components/ParameterGrid";
import services from "@/app/utilities/services";
import {
  getAllProcedureParameters,
  ParamterUnits,
  updateProcedureParameterStatus,
} from "@/app/utilities/api-urls";
import { getMainColumns, resultTypeList } from "./_components/Utils";
import { toast } from "react-toastify";

const ProceduresParameterMaster = () => {
  const [formData, setFormData] = useState({
    popUp: false,
    action: "new", ///new||update
    terminologyType: "",
    resultType: "",
    units: "",
    procedureParameterId: null,
    procedureParameterCode: "",
    procedureParameterDescription: "",
    terminologyDesc: "",
    parameterTerminologySet: [],
    comments: "",
    listValues: null,
    valueList: [],
    loader: false,
    referenceRangeSet: null,
    statusFlag: 1,
  });
  const [gridData, setGridData] = useState<any>([]);
  const getAllProceduresData = () => {
    services.get(getAllProcedureParameters).then((response) => {
      setGridData(response.data);
    });
  };
  const handleToggle = (data: any) => {
    let postObj = {
      procedureParameterId: data.procedureParameterId,
      statusFlag: data.statusFlag == 0 ? 1 : 0,
    };
    services
      .create(updateProcedureParameterStatus, postObj)
      .then((response) => {
        toast.success("Status changed successfully");
        getAllProceduresData();
      })
      .catch((error) => {
        if (error.response.data.statusMessage) {
          toast.error(error.response.data.statusMessage);
        } else {
          toast.error("Technical Error");
        }
      });
  };
  const editRow = async (data: any) => {
    let arr: any = [];
    await services.get(ParamterUnits).then((response) => {
      response.data.configData.map((item: any) => {
        let obj = {
          value: item.label,
          label: item.desc,
        };
        arr.push(obj);
      });
    });
    let valArray: any = [];
    data.valueList?.map((item: any, index: number) => {
      let obj = {
        id: index + 1,
        value: item,
      };
      valArray.push(obj);
    }),
      setFormData({
        ...formData,
        ...data,
        action: "update",
        popUp: true,
        valueList: valArray,
        units: arr.filter((item: any) => item.value == data.units)[0],
        resultType: resultTypeList.filter(
          (item: any) => item.value == data.resultType
        )[0],
        parameterTerminologySet: data.parameterTerminologySet
          ? data.parameterTerminologySet
          : [],
        terminologyDesc: "",
        terminologyType: "",
      });
  };
  useEffect(() => {
    getAllProceduresData();
  }, []);
  return (
    <div>
      <div className="w-full flex justify-between mt-2">
        <TabPageTitle title="Parameter Master" />
        <div>
          <div className="flex w-full gap-4">
            <div className="w-1/2 newSelect"></div>
            <div className="w-1/2 flex gap-4 justify-end">
              <ActionButton
                buttonText="New"
                handleSubmit={() => {
                  setFormData({
                    ...formData,
                    popUp: true,
                    action: "new", ///new||update
                    terminologyType: "",
                    resultType: "",
                    units: "",
                    procedureParameterId: null,
                    procedureParameterCode: "",
                    procedureParameterDescription: "",
                    terminologyDesc: "",
                    parameterTerminologySet: [],
                    comments: "",
                    valueList: [],
                  });
                }}
                width="w-[220px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <ParameterGrid
          columns={getMainColumns(handleToggle, editRow)}
          gridData={gridData}
          formData={formData}
          getAllData={getAllProceduresData}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
};

export default ProceduresParameterMaster;
