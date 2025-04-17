import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import { ReactSelectBox } from "@/app/_commonfeatures";
import moment from "moment";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Filters, filters } from "./components/filterButton";
import { Input } from "@material-tailwind/react";
import services from "@/app/utilities/services";
import {
  getLabSpeciality,
  phleboPatSearch,
} from "@/app/utilities/api-urls";
import {
  addLabelAndValue,
} from "../laboratory-worklist/_components/utils";
import { initialState } from "./PhlebotomyReducerfun";

interface PhlebotomyWorklistFormprops {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  onSearch: () => void;
}

const PhlebotomyWorklistForm: React.FC<PhlebotomyWorklistFormprops> = ({
  formData,
  setFormData,
  onSearch,
}) => {
  // const selectLabOrderid = (data: any) => {
  //   dispatch({
  //     type: "fieldVal",
  //     payload: {
  //       LabOrderId: data,
  //     },
  //   });
  // };

  const data = [
    { sno: 1, accessionNo: "1001" },
    { sno: 2, accessionNo: "1982" },
  ];

  const [status, setStatus] = useState<Filters[]>(filters());
  const handleFilter = (text: string, flag: boolean) => {
    let arr: Filters[] = filters().map((item: any) => {
      item.isActive = false;
      return item;
    });
    let index: number = arr.findIndex((item: Filters) => item.text == text);
    arr[index].isActive = flag;
    setFormData({ ...formData, filter: text == "All Status" ? "All" : text });
    setStatus(arr);
  };
  const [patientMrns, setPatientMrns] = useState<any>([]);
  const [specialityList, setSpecialityList] = useState<any>([]);
  const handlePatMrn = (e: any) => {
    services.get(phleboPatSearch + e.target.value).then((response) => {
      response.data.map((item: any) => {
        item.value = item.mrn;
        item.label = item.mrn;
      });
      setPatientMrns(response.data);
    });
  };
  const getSpecialityList = () => {
    services.get(getLabSpeciality).then((response) => {
      console.log()
      setSpecialityList(addLabelAndValue(response.data));
    });
  };
  const handleSearch = () => {
    onSearch();
  };
  useEffect(() => {
    getSpecialityList();
  }, []);
  const onclear = () => {
    setFormData(initialState);
  };

  return (
    <>
      <div className="px-4 mt-2 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="m-2 grid grid-cols-1 gap-6">
          <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-6">
            <div>
              <Input
                color="blue"
                name="labOrderId"
                label="Lab Order ID"
                value={formData.labOrderId}
                crossOrigin={undefined}
                onChange={(e) => {
                  console.log('formData', formData)
                  setFormData({ ...formData, labOrderId: e.target.value })
                }

                }
              ></Input>
            </div>
            <div>
              <ReactSelectBox
                options={patientMrns}
                label="Patient MRN"
                value={formData.patientMrn}
                onSearchInputChange={(e) => handlePatMrn(e)}
                isSearchable={true}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    patientMrn: e,
                  });
                }}
              />
            </div>
            <div>
              <ReactSelectBox
                options={specialityList}
                label="Speciality"
                value={formData.speciality}
                isMultiple={true}
                isSearchable={true}
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
                label="From Date"
                disableFuture={true}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    fromDate: e,
                  });
                }}
              />
            </div>
            <div>
              <DateInput
                value={moment(formData.toDate)}
                label="To Date"
                disableFuture={true}
                onChange={(e: any) => {
                  setFormData({
                    ...formData,
                    toDate: e,
                  });
                }}
              />
            </div>
          </div>
          <div className="grid xl:grid-cols-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2 gap-6">
            <div className="col-span-3">
              <div className="grid gap-4 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-2">
                {status.map((item: any, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => handleFilter(item.text, !item.isActive)}
                      className={`${item.isActive
                        ? "bg-blue-900 !border-none !text-white"
                        : "bg-white !text-blue-500"
                        } h-[40px] text-light-blue-800 border-b-2 border-s-[1px] border-e-[1px] border-t-[1px] rounded-lg shadow-lg hover:shadow-xl active:shadow-none active:translate-x-1 flex justify-center items-center text-sm `}
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
                    width="w-[230px] py-3"
                    buttonText={"Search"}
                    // disabled={true}
                    handleSubmit={handleSearch}
                  />
                </div>
                <div className="ps-10">
                  <ActionButton
                    width="w-[230px] py-3"
                    buttonText={"Clear"}
                    handleSubmit={onclear}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PhlebotomyWorklistForm;
