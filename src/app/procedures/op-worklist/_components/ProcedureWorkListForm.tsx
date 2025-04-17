"use client"
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import React, { useEffect, useState } from "react";
import { ReactSelectBox } from "@/app/_commonfeatures";
import moment from "moment";
import services from "@/app/utilities/services";
import {  getAllDepartments, getProcedureMrnList, getProcedureOrderList, getRadOrdersOrPatientmrn } from "@/app/utilities/api-urls";
import { filters, getDDValue } from "./Utils";
import { initialProcedureWorkList, ProcedureFilters, ProcedureFormFieldProps } from "./ProcedureWorkListInterfaces";

function ProcedureWorkListForm({ formData, setFormData, onSubmit }: ProcedureFormFieldProps) {
  const [status, setStatus] = useState<ProcedureFilters[]>(filters());
  const [departmentList, setDepartmentList] = useState<any>([])
  const [mrnList, setMrnList] = useState<any>([])
  const [orderIdsList, setOrderIdsList] = useState<any>([])

  const handleFilter = (text: string, flag: boolean) => {
    let arr: ProcedureFilters[] = filters().map((item: any) => {
      item.isActive = false;
      return item;
    });
    let index: number = arr.findIndex((item: ProcedureFilters) => item.text == text);
    arr[index].isActive = flag;
    setFormData({ ...formData, filter: text });
    setStatus(arr);
  };

  const handleClear = () => {
    setFormData(initialProcedureWorkList);
  };

  //
  const getAllRadiologySpecialitiesData = async () => {
    try {
      const res = await services.get(getAllDepartments)
      const result = res.data.map((list: any) => ({
        ...list,
        label: list.departmentDescription,
        value: list.departmentCode,
      }))
      setDepartmentList(result)
    } catch (error) {

    }
  }

  // const getAllRadiologyOrdersandpationtData = async () => {
  //   try {
  //     const res = await services.get(getRadOrdersOrPatientmrn)
  //     console.log(res.data)
  //     const mrnresult = res.data.map((list: any) => ({
  //       ...list,
  //       label: list.mrn,
  //       value: list.mrn,
  //     }))
  //     setMrnList(mrnresult)
  //     const orderIdresult = res.data.map((list: any) => ({
  //       ...list,
  //       label: list.orderId,
  //       value: list.orderId,
  //     }))
  //     setOrderIdsList(orderIdresult)
  //   } catch (error) {

  //   }
  // }
  const getAllBilledRadiologyMrnList = async () => {
    try {
      const res = await services.get(getProcedureMrnList)
      console.log(res.data)
      const mrnresult = res.data.map((list: any) => ({
        ...list,
        label: list.mrn,
        value: list.mrn,
      }))
      setMrnList(mrnresult)
    } catch (error) {
      console.log("something went wrong")
    }
  }
  const getAllBilledRadiologyOrdersList = async () => {
    try {
      const res = await services.get(getProcedureOrderList)
      //console.log(res.data)
      const orderIdresult = res.data.map((list: any) => ({
        ...list,
        label: list.orderId,
        value: list.orderId,
      }))
      setOrderIdsList(orderIdresult)
    } catch (error) {
      console.log("something went wrong")
    }
  }
  useEffect(() => {
    getAllRadiologySpecialitiesData()
    getAllBilledRadiologyMrnList()
    getAllBilledRadiologyOrdersList()
    // getAllRadiologyOrdersandpationtData()
  }, [])
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="m-2 grid grid-cols-1 gap-6">
        <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-6">
          <div>
            <ReactSelectBox
              options={orderIdsList}
              label="Order ID"
              isSearchable={true}
              value={getDDValue(orderIdsList, formData.orderId)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  orderId: e.value,
                });
              }}
            />
          </div>
          <div>
            <ReactSelectBox
              options={mrnList}
              label="Patient MRN"
              isSearchable={true}
              value={getDDValue(mrnList, formData.patientMrn)}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  patientMrn: e.value,
                });
              }}
            />
          </div>
          <div>
            <ReactSelectBox
              options={departmentList}
              label="Department"
              isMultiple={true}
              isSearchable={true}
              value={formData.department}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  department: e,
                });
              }}
            />
          </div>
          <div>
            <DateInput
              value={moment(formData.fromDate)}
              onChange={(e: any) => {
                setFormData({
                  ...formData,
                  fromDate: e,
                });
              }}
              label="From Date"
            />
          </div>
          <div>
            <DateInput
              value={moment(formData.toDate)}
              onChange={(e: any) => {
                setFormData({
                  ...formData,
                  toDate: e,
                });
              }}
              label="To Date"
            />
          </div>
        </div>
        <div className="grid xl:grid-cols-6 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 gap-6">
          <div className="col-span-4">
            <div className="grid gap-4 xl:grid-cols-6 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
              {status.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleFilter(item.text, !item.isActive)}
                    className={`${item.isActive
                      ? "bg-blue-900 !border-none !text-white"
                      : "bg-white !text-blue-500"
                      } cursor-pointer h-[40px] text-light-blue-800 border-b-2 border-s-[1px] border-e-[1px] border-t-[1px] rounded-lg shadow-lg hover:shadow-xl active:shadow-none active:translate-x-1 flex justify-center items-center text-sm `}
                  >
                    {item.text}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-5 ">
              <div className="w-full">
                <ActionButton
                  width="w-full text-white  text-[14px]  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={onSubmit}
                  buttonText={"Search"}
                />
              </div>
              <div className="w-full">
                <ActionButton
                  width="w-full text-white  text-[14px]  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={handleClear}
                  buttonText={"Clear"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProcedureWorkListForm;
