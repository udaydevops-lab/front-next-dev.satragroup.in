"use client";
import React, { useEffect, useState } from "react";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import services from "@/app/utilities/services";
import { getEditID, getLabServiceGridName } from "@/app/utilities/api-urls";
import RadiologyEquipmentform from "./components/radiologyEquipForm";
import RadiologyEquipgrid from "./components/radiologyEquipgrid";
import RadiologyEquippopup from "./components/radiologyEquipPopup";


const RadiologyEquipMain = () => {
 
  const [mainData, setMainData] = useState<any>([]);
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
    const result = mainData.filter((list: any) =>
      list?.serviceDesc
    .toLowerCase()
    .includes(fields.LabServiceSearchname?.toLowerCase())
    );
    setGridData(result);
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

  const getgridData = () => {
    // services
    //   .get(`${getLabServiceGridName}serviceName=`)
    //   .then((response) => {
    //     console.log(response)
    //     const result = response.data.filter((list: any) =>
    //       list?.serviceDesc
    //         .toLowerCase()
    //         .includes(fields.LabServiceSearchname?.toLowerCase())
    //     );
    //     setGridData(response.data);
    //     setMainData(response.data);
    //   })
    //   .catch((err) => {
    //     console.error("Error fetching data:", err.message);
    //   });
  };

  useEffect(() => {
    getgridData()
  }, [])

  return (
    <>
      <RadiologyEquipmentform
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

      <RadiologyEquipgrid
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
        dialogtitle={"New Radiology Equipment"}
        open={popup.open}
        size={"xl"}
        handler={() => {
          closePopup;
        }}
        popupClose={closePopup}
        Content={<RadiologyEquippopup closePopup={closePopup}
          editData={editData}
          btntxt={btntxt}
          handleEdit={handleEdit}
         setEditData = {setEditData}
        />}
      />
    </>
  );
};

export default RadiologyEquipMain;
