import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';
import React from 'react'
import TechnicianMapForm from './TechnicianMapForm';

export default function TechnicianMapGrid({columns,gridData,formData,setFormData,getAllData}:any) {
    return (
        <div>
          <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
            <ReactDatagrid rows={gridData} columns={columns} />
          </div>
            <ReactCommonDialog
              dialogtitle={"Technician Mapping"}
              open={formData.popUp}
              size={"lg"}
              handler={() => {}}
              popupClose={() => {
                setFormData({ ...formData, popUp: false });
              }}
              Content={
                <TechnicianMapForm
                  formData={formData}
                  setFormData={setFormData}
                  getAllData={getAllData}
                />
              }
            />
        </div>
      );
}
