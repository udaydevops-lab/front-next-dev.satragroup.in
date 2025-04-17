"use client";
import React, { useEffect, useState } from "react";
import BlockUserGrid from "./_components/blockUserGrid";
import BlockUserForm from "./_components/blockUserForm";
import services from "@/app/utilities/services";
import {
  getUserNameDetails,
  getReasonForBlock,
  getEmpDetailsbyUserIds,
  userBlockUnBlock,
  getUserGridData,
} from "@/app/utilities/api-urls";
import { getLocalItem, jsonParse } from "@/app/utilities/local";
import { toast } from "react-toastify";
import { getHeaderResponse } from "@/app/_commonfeatures/header";

const BlockUserMain = () => {
  const [fields, setFields] = useState<any>({
    username: "",
    employeeorg: "",
    employeecode: "",
    employeename: "",
    employeeprimloc: "",
    employeeprofile: "",
    employeedept: "",
    reason: "",
    statusFlag: 0,
    status: "",
    remarks: "",
    userId: "",
  });
  const [EmpuserList, setEmpUserList] = useState<any>([]);
  const [reasonList, setReasonList] = useState<any>([]);
  const [reason, setReason] = useState<any>("");
  const [statusList, setStatusList] = useState<any>([
    {
      value: "Block",
      label: "Block",
    },
    {
      value: "UnBlock",
      label: "Unblock",
    },
  ]);

  const [remarks, setRemarks] = useState<any>([]);
  const [EmptableData, setEmptableData] = useState<any>([]);
  const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
  const headerObj = {
    roleId: "",
    serviceEntityId: loginResponse?.serviceEntityId,
    locationId: loginResponse?.locationId,
    userId: loginResponse?.userId,
    employeename: loginResponse?.employeename,
    employeeid: loginResponse?.employeeId,
  };

  //GET For UserName
  const getuserNameDetailsData = () => {
    const url = `${getUserNameDetails}`;
    services
      .get(url, headerObj)
      .then((response) => {
        const result: any = response.data.map((list: any) => {
          return {
            ...list,
            label: list.userName,
            value: list.userId,
          };
        });
        setEmpUserList(result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // GET API for  Reason Dropdown
  const getReasonData = () => {
    services
      .get(getReasonForBlock + 0)
      .then((response) => {
        const ResponseData = response.data.configData;
        setReasonList(ResponseData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  //Grid data
  const getTableData = (userId: any) => {
    services
      .get(`${getUserGridData}${userId}`)
      .then((response) => {
        setEmptableData(response.data);
      })
      .catch((err: any) => {
        console.log(err.message);
      });
  };

  //save API
  const onSubmitblock = () => {
    let headers:any= getHeaderResponse()
    headers.generatedBy=jsonParse("loginResponse").employeename
    let message = fields.statusFlag === 1 ? "Blocked Successfully!" :"UnBlocked Successfully!"
    const postObj = {
      userId: fields.userId,
      statusFlag: fields.statusFlag === 1 ? 0 : 1,
      resonForBlock: fields.reason.label,
      blockedRemarks: fields.remarks,
      // generatedBy:jsonParse("loginResponse").employeename
    };
    services
      .create(userBlockUnBlock, postObj,headers)
      .then((response) => {
        setEmptableData(response);
        getTableData(fields.userId);
        setFields({
          ...fields,
          reason: "",
          status: "",
          remarks: "",
        });
        toast.success(message);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getuserNameDetailsData();
    getReasonData();
  }, []);

  return (
    <div>
      <BlockUserForm
        fields={fields}
        setFields={setFields}
        onSubmitblock={onSubmitblock}
        EmpuserList={EmpuserList}
        remarks={remarks}
        setRemarks={setRemarks}
        statusList={statusList}
        reason={reason}
        setReason={setReason}
        setStatusList={setStatusList}
        reasonList={reasonList}
        setReasonList={setReasonList}
        getTableData={getTableData}
      />

      <BlockUserGrid EmptableData={EmptableData} />
    </div>
  );
};

export default BlockUserMain;
