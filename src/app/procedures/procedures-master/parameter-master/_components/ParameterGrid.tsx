import React from 'react'
import ParameterForm from './ParameterForm';
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog';
import ReactDatagrid from '@/app/_commonfeatures/ReactDatagrid';

export default function ParameterGrid({gridData,columns,formData,setFormData,getAllData}:any) {
    return (
        <div>
          <div className="w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem">
            <ReactDatagrid rows={gridData} columns={columns} />
          </div>
            <ReactCommonDialog
              dialogtitle={"Parameter Master"}
              open={formData.popUp}
              size={"xl"}
              handler={() => {}}
              popupClose={() => {
                setFormData({ ...formData, popUp: false });
              }}
              Content={
                <ParameterForm
                  formData={formData}
                  setFormData={setFormData}
                  getAllData={getAllData}
                />
              }
            />
        </div>
      );
}
