"use client";
import ActionButton from "@/app/_common/button";
import Textarea from "@/app/_common/text-area";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { getEmpDetailsbyUserIds } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { Input } from "@material-tailwind/react";
import { Divider } from "@mui/material";
import React, {Dispatch, FC, SetStateAction} from "react";

interface DataBlockUser {
  fields: any;
  setFields: Dispatch<SetStateAction<any>>;
  EmpuserList: any;
  remarks: any;
  reason: any;
  setReason: Dispatch<SetStateAction<any>>;
  setRemarks: Dispatch<SetStateAction<any>>;
  statusList: any;
  setStatusList: Dispatch<SetStateAction<any>>;
  setReasonList:Dispatch<SetStateAction<any>>;
  reasonList: any;
  onSubmitblock: any;
  getTableData: any;
  
 }
const BlockUserForm: FC<DataBlockUser> = ({getTableData,fields,setFields,onSubmitblock,setStatusList, EmpuserList,statusList,reasonList}) => {


  //GET For Input fields based on User Id
  const getuserInfo = async(userID: any) => {
   
   await services.get(`${getEmpDetailsbyUserIds}${userID}`)
     .then((response: any) => {
    
     let userInfo = response.data[0]
        setFields({
          ...fields,
          username:{ label: userInfo.userName,value: userInfo.userName},
          employeecode: userInfo.employeCode,
          employeename: userInfo.fullName,
          employeedept: userInfo.departmentDescription,
          employeeprimloc: userInfo.locationDesc,
          employeeprofile: userInfo.employeType,
          employeeorg: userInfo.serviceEntityDesc,
          statusFlag: userInfo.statusFlag,
          userId: userInfo.userId,
        })
        if(userInfo.statusFlag==1){
          setStatusList([
          {
            value: "Block",
            label: "Block",
          }])
        }else if(userInfo.statusFlag==0){
          setStatusList([
            {
              value: "UnBlock",
              label: "Unblock",
            }])
        }
      })
      .catch((err) => {
        console.log(err.message);
      });    
  };
  

  return (
    <>
      <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="my-3 flex justify-between items-center">
          <div>
            <h1 className="font-bold ms-2">Block/Unblock User</h1>
          </div>
        </div>

        <div className=" grid grid-cols-3 gap-3 space-10">
          <div className="w-full ">
            <ReactSelectBox
              label="User Name"
              value={fields?.username}
              options={EmpuserList}
              onChange={(e: any) => {
                getuserInfo(e.userId)
                getTableData(e.userId)
              }}
              isSearchable={true}
              optionListWidtsize={true}
              isMultiple={false}
            />
          </div>

          <div className="w-full ">
            <Input
              crossOrigin
              value={fields?.employeename}
              type="text"
              label="Employee Name"
              name="employeename"
              color="blue"
              disabled={true}
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              value={fields?.employeecode}
              type="text"
              label="Employee Code"
              name="employeecode"
              color="blue"
              disabled={true}
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 my-6 w-4/3">
          <div className="relative ">
            <Input
              crossOrigin
              value={fields?.employeeorg}
              type="text"
              label="Employee Organization"
              name="employeeorg"
              disabled={true}
              color="blue"
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
          <div className="relative">
            <Input
              crossOrigin
              value={fields?.employeeprimloc}
              type="text"
              label="Employee Primary Location"
              name="employeeprimloc"
              disabled={true}
              color="blue"
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
          <div className="relative">
            <Input
              crossOrigin
              value={fields?.employeeprofile}
              type="text"
              label="Employee Profile Type"
              name="employeeprofile"
              disabled={true}
              color="blue"
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
          <div className="relative">
            <Input
              crossOrigin
              value={fields?.employeedept}
              type="text"
              label="Employee Department"
              name="employeedept"
              disabled={true}
              color="blue"
              containerProps={{
                className: "!min-w-[0]",
              }}
            />
          </div>
        </div>

        <Divider className="my-3" />
        <div className="flex flex-wrap">
          <div className="w-1/3 p-4">Current Status:{fields.statusFlag === 0 ? "InActive" :"Active"}</div>
          <div className="w-1/3 p-4">
            <ReactSelectBox
              label="New Status"
              value={fields?.status}
              options={statusList}
              onChange={(e: any) => {
                setFields({
                  ...fields,
                  status: e, 
                });
              }}
            />
          </div>
          <div className="w-1/3 p-4">
            <ReactSelectBox
              value={fields?.reason }
              options={reasonList}
              onChange={(e) => {
                setFields({
                  ...fields,
                  reason: e
                })
              }}
              label="Reason"
              isSearchable={true}
            />
          </div>
       
          <div className="w-2/3 p-4">
            <Textarea
              value={fields.remarks}
              onChange={(e:any) => {
                setFields({
                  ...fields,
                  remarks: e.target.value
                })
              }}
          
              label="Remarks"
            />
          </div>

          <div className="w-1/3 p-4">
            {fields.statusFlag === 1 ? (
              <ActionButton
                buttonText="Block"
                handleSubmit={onSubmitblock}
                disabled={fields.status.label ==="Block" && fields.reason  ? false : true}
                width="w-[120px] py-3"
              />
            ) : (
              <ActionButton
                buttonText="UnBlock"
                handleSubmit={onSubmitblock}
                disabled={fields.status.label ==="Unblock" && fields.reason ? false : true}
                width="w-[120px] py-3"
              />
            )}
           
          </div>
        </div>

      </div>
    </>
  );
};

export default BlockUserForm;
