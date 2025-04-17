import React, { useEffect, useState } from "react";
import {
  Filters,
  FormFieldProps,
  filters,
  initialStateWorkList,
  getDDValue,
  addLabelAndValue,
} from "./utils";
import { ReactSelectBox } from "@/app/_commonfeatures";
import DateInput from "@/app/_common/date-input";
import ActionButton from "@/app/_common/button";
import { Input } from "@material-tailwind/react";
import moment from "moment";
import services from "@/app/utilities/services";
import {
  getLabSpeciality,
  labSearchByPatMrn,
} from "@/app/utilities/api-urls";

function FormField({ formData, setFormData, onSubmit }: FormFieldProps) {
  const [status, setStatus] = useState<Filters[]>(filters());
  const [patientMrns, setPatientMrns] = useState<any>([]);
  const handleFilter = (text: string, flag: boolean) => {
    let arr: Filters[] = filters().map((item:any) => {
      item.isActive = false;
      return item;
    });
    let index: number = arr.findIndex((item: Filters) => item.text == text);
    arr[index].isActive = flag;
    setFormData({ ...formData, filter: text=="All Status"?"All":text });
    setStatus(arr);
  };
  const [specialityList, setSpecialityList] = useState<any>([]);
  const getSpecialityList = () => {
    services.get(getLabSpeciality).then((response) => {
      setSpecialityList(addLabelAndValue(response.data));
    });
  };
  const handleMrnSearch = (e: any) => {
    services
      .get(labSearchByPatMrn + "?mrn=" + e.target.value)
      .then((response) => {
        response.data.map((item: any) => {
          item.value = item.patmrn;
          item.label = item.patmrn;
        });
        setPatientMrns(response.data);
      });
  };
  const handleClear = () => {
    setFormData(initialStateWorkList);
  };
  useEffect(() => {
    getSpecialityList();
  }, []);
  return (
    <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
      <div className="m-2 grid grid-cols-1 gap-6">
        <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-6">
          <div>
            <Input
              color="blue"
              label="Lab Order ID"
              value={formData.labOrderId}
              crossOrigin={undefined}
              onChange={(e) =>
                setFormData({ ...formData, labOrderId: e.target.value })
              }
            ></Input>
          </div>
          <div>
            <ReactSelectBox
              options={patientMrns}
              label="Patient MRN"
              isSearchable={true}
              value={getDDValue(patientMrns, formData.patientMrn)}
              onSearchInputChange={(e) => handleMrnSearch(e)}
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
              options={specialityList}
              label="Lab Speciality"
              isMultiple={true}
              isSearchable={true}
              value={formData.speciality}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  speciality: e,
                });
              }}
            />
          </div>
          <div>
            <DateInput
              value={moment(formData.fromDate)}
              disableFuture={true}
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
              disableFuture={true}
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
        <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-6">
          <div className="col-span-3">
            <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
              {status.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    onClick={() => handleFilter(item.text, !item.isActive)}
                    className={`${
                      item.isActive
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
            <div className="grid grid-cols-3 gap-36">
              <div>
                <ActionButton
                  width="w-[230px] text-white  text-[14px]  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  handleSubmit={onSubmit}
                  buttonText={"Search"}
                />
              </div>
              <div className="ps-10">
                <ActionButton
                  width="w-[230px] text-white  text-[14px]  bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
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

export default FormField;
