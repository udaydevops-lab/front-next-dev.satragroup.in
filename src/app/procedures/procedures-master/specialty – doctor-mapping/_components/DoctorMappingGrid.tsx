import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import React from "react";
import dynamic from "next/dynamic";
import DoctorMappingForm from "./DoctorMappingForm";

export default function DoctorMappingGrid({
  formData,
  setFormData,
  gridData,
  columns,
  getAllData,
}: any) {
  return (
    <div>
      <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
        <ReactDatagrid rows={gridData} columns={columns} />
      </div>
        <ReactCommonDialog
          dialogtitle={"Specialty - Doctor Mapping"}
          open={formData.popUp}
          size={"lg"}
          handler={() => {}}
          popupClose={() => {
            setFormData({ ...formData, popUp: false });
          }}
          Content={
            <DoctorMappingForm
              formData={formData}
              setFormData={setFormData}
              getAllData={getAllData}
            />
          }
        />
    </div>
  );
}
