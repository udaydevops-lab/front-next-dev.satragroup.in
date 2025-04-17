"use client";
import React, { useState } from "react";
import Testparametergrid from "./_components/testparametergrid";
import Testparameterform from "./_components/testparameterForm";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import Testparameterpopup from "./_components/testparameterpopup";
import services from "@/app/utilities/services";
import { getEditID, getLabServiceGridName } from "@/app/utilities/api-urls";


const TestRadiologyParamterMain = () => {
 
  const [editData, setEditData] = useState<any>({
    RadServicename: "",
    radParamname:"",
    department: "",
    speciality: "",
    terminalogyCode: "",
    terminalogyDesc: "",
    statusFlag: "",
    servicecode:"",
    assignParameterItemSet: "",
    RadServiceSearchname: "",
    parameter: "",
    parameterCode: "",
    assignLabParameterHeaderId: "",
    assignLabParameterItemId: "",
    terminologyId:"",
  }
   
  );
  const [fields, setFields] = useState<any>(editData);
  const [griddata, setGridData] = useState<any>([]);
  const [btntxt, setbtntxt] = useState("SAVE")

  // when user search filtering the grid
  const handleSearch = (e: any) => {
    // let searchData = e.target.value;
    // services
    //   .get(`${getLabServiceGridName}serviceName=${searchData}`)
    //   .then((response) => {
    //     const result = response.data.filter((list: any) =>
    //       list?.serviceDesc
    //         .toLowerCase()
    //         .includes(fields.LabServiceSearchname?.toLowerCase())
    //     );
    //     setGridData(result);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching data:", err.message);
    //   });
  };

  const [radparameter, setRadParameter] = useState("");
  const [formData, setFormData] = useState({});
  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [popup, setPopup] = useState<any>({
    open: false,
  });

  const [radserviceSearchlist, setRadserviceSearchlist] = useState<any>([]);

  const paramFieldsClear = () => {};

  const closePopup = () => {
    setPopup({ ...popup, open: false });
  };
  const openPopup = () => {
    setFields("")
    setPopup({ ...popup, open: true });
  };


  const updateopenPopup = () => {
    setPopup({ ...popup, open: true });
  }

  const handleEdit = async (row: any) => {
    setbtntxt("UPDATE")
    let result: any;
    // let id = row.assignLabParameterHeaderId;
    // await services
    //   .get(`${getEditID}assignLabParameterHeaderId=${id}`)
    //   .then((response) => {
    //     result = response.data;
    //     setEditData({
    //       ...editData,
    //       RadServicename: {
    //         label: result?.serviceDesc,
    //         value: result?.serviceDesc,
    //       },
    //       radParamname: {
    //         label: result?.assignParameterItemSet[0].parameter,
    //         value: result?.assignParameterItemSet[0].parameter,
    //       },
    //       servicecode: result?.serviceCode,
    //       department: result?.department,
    //       speciality: result?.speciality,
    //       parameterCode: result?.parameterCode,
    //       parameter: result?.parameter,
    //       assignLabParameterHeaderId: result?.assignLabParameterHeaderId,
    //       assignParameterItemSet:result.assignParameterItemSet[0],
    //     });
    //   })
    //   .catch((err: any) => {
    //     console.log(err.message);
    //   });
    //   updateopenPopup();
  };

  return (
    <>
      <Testparameterform
        fields={fields}
        radserviceSearchlist={radserviceSearchlist}
        setFields={setFields}
        openPopup={openPopup}
        setRadserviceSearchlist={setRadserviceSearchlist}
        handleChange={handleChange}
        handleSearch={handleSearch}
        radparameter={radparameter}
        setRadParameter={setRadParameter}
      />

      <Testparametergrid
        paramFieldsClear={paramFieldsClear}
        griddata={griddata}
        setGridData={setGridData}
        handleSearch={handleSearch}
        fields={fields}
        btntxt={btntxt}
        setbtntxt={setbtntxt}
        handleEdit={handleEdit}
        openPopup={openPopup}
        handleChange={handleChange}
        setFields={setFields}
      />

      <ReactCommonDialog
        dialogtitle={"Assign Test Parameter"}
        open={popup.open}
        size={"xl"}
        handler={() => {
          closePopup;
        }}
        popupClose={closePopup}
        Content={<Testparameterpopup closePopup={closePopup}
          editData={editData}
          btntxt={btntxt}
          handleEdit={handleEdit}
         setEditData = {setEditData}
        />}
      />
    </>
  );
};

export default TestRadiologyParamterMain;
