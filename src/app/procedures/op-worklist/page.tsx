'use client'
import services from '@/app/utilities/services';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { initialProcedureWorkList } from './_components/ProcedureWorkListInterfaces';
import { proceduresWorkListSearch } from '@/app/utilities/api-urls';
import ProcedureGridField from './_components/ProcedureWorkListGrid';
import ProcedureWorkListForm from './_components/ProcedureWorkListForm';
import { TabPageTitle } from '@/app/lab/_component';
import roleInfoScreenData from '@/app/_commonfeatures/ScreenDataHoc';
import NoScreenData from '@/app/_common/NoScreenData';

const ProceduresOpWorklist = (props: any) => {
  const [formData, setFormData] = useState(initialProcedureWorkList);
  const [gridData, setGridData] = useState<any>([]);

  const onSearch = () => {
    let str = "";
    formData.department?.map((item: any) => {
      str += item.value.toString() + "$";
    });
    let str1 = str.substring(0, str.length - 1);
    //Dollor separated multiple specialities
    //when laborderId or patientMrn value is there dont pass dates
    services
      .get(
        `${proceduresWorkListSearch}orderId=${formData.orderId}&department=${str1}&fromDate=${!formData.orderId && !formData.patientMrn
          ? moment(formData.fromDate).format("YYYY-MM-DD")
          : ""
        }&toDate=${!formData.orderId && !formData.patientMrn
          ? moment(formData.toDate).endOf("day").format("YYYY-MM-DD")
          : ""
        }&PatienMrn=${formData.patientMrn}&status=${formData.filter == "All Status" ? '' : formData.filter}`
      )
      .then((response) => {
        setGridData(response.data);
      })
      .catch((error) => {
        setGridData([]);
        // toast.error(capitalize(error.response?.data) || "No data found");
      });
  };


  useEffect(() => {
    onSearch()
  }, []);
  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <>
      <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
        <TabPageTitle title="Procedures OP worklist" />
        <ProcedureWorkListForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSearch}
        />
        <ProcedureGridField data={gridData} />
      </div>
    </>
  );
}

export default roleInfoScreenData(ProceduresOpWorklist, "Row")