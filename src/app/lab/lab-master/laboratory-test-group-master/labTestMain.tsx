"use client";
import {
  DelTestGroup,
  getAllGridTestGroupMasters,
  getEditIdTestGroup, 
  getLabServiceName,
  saveTestGroup,
  updateTestGroup,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import React, { useEffect, useState } from "react";
import { TabPageTitle } from "../../_component";
import ActionButton from "@/app/_common/button";
import LabTestGrid from "./_components/labTestGrid";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import LabTestPopup from "./_components/labTestPopup";
import { v4 as uuidv4 } from "uuid";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { toast } from "react-toastify";
import { getLocalItem } from "@/app/utilities/local";

const LaboratoryTestGroupMasterMainPage = () => {
  const storedLoginResponse = getLocalItem("loginResponse");
  let empName: any;
  try {
    empName = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeename
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empName = "";
  }

  const [gridData, setGridData] = useState<any>([]);
  const [Popup, setPopup] = useState<any>(false);
  const [fields, setFields] = useState<any>({
    servicename: { label: "Test Group Service Name" },
    laboratoryServices: "",
    servicecode: "",
    department: "",
    speciality: "",
    labTestgroupHeaderId: "",
  });
  const [laboratoryServicesGrid, setLaboratoryServicesGrid] = useState<any>([]);
  const [key1, setkey1] = useState(0);
  const [laboratoryServices, setLaboratoryServices] = useState<any>({
    label: "Laboratory Services",
  });
  const [serviceList, setServiceList] = useState<any>([]);
  let headers = getHeaderResponse();

  //Adding laboratory Services to Grid function
  const handleLabServiceAdd = (row: any) => {
    if(!row.serviceDesc) {
      toast.error("Service Name is required");
      return;
    }
    if(laboratoryServicesGrid.some((item:any)=>item.serviceDesc==row.serviceDesc)){
      toast.error("Duplicate entry");
      return;
    }
    let labServiceInfo = { ...row, rowid: uuidv4() };
    setLaboratoryServicesGrid([...laboratoryServicesGrid, labServiceInfo]);
    setLaboratoryServices({
      label: "Laboratory Services",
      // sequenceOrderIdUi: laboratoryServicesGrid.length + 1,
    });
    console.log(fields);
    // const newService = {
    //   serviceName: row.serviceName, // Example field, replace with actual field names
    //   serviceCode: row.serviceCode, // Example field, replace with actual field names
    //   departmentCode: row.departmentCode, // Example field, replace with actual field names
    //   specialityCode: row.specalityCode, // Example field, replace with actual field names
    //   sequenceOrderIdUi: laboratoryServicesGrid.length + 1,
    //   serviceDesc: row.serviceDesc,
    //   // Set sequence order
    //   statusFlag: 1,
    //   rowid: uuidv4(),
    // };

    // setLaboratoryServicesGrid([...laboratoryServicesGrid, newService]);
  };

  //before save delete lab services item function
  const handlelaboratoryServicesItemRemove = (row: any) => {
    const data = laboratoryServicesGrid.filter(
      (list: any) => list.rowid !== row.rowid
    );
    setLaboratoryServicesGrid(data);
  };

  //after save delete lab services item function
  const handlelaboratoryServicesItemDelete = (row: any, id: any) => {
    const postObj = {
      labgroupHeaderId: id,
      labTestGroupItemId: row.labTestGroupItemId,
    };
    services
      .create(DelTestGroup, postObj, headers)
      .then((res) => {
        toast.success("Successfully deleted lab test group item.");
        //laboratoryServicesGrid, setLaboratoryServicesGrid
        const laboratorygridInfo = laboratoryServicesGrid.filter(
          (list: any) => list.labTestGroupItemId !== row.labTestGroupItemId
        );
        setLaboratoryServicesGrid(laboratorygridInfo);
      })
      .catch((err: any) => {
        toast.error(err.message);
      });
  };

  //getAllGridTestGroupMasters
  const getAllgridData = async () => {
    try {
      const res = await services.get(getAllGridTestGroupMasters);
      setGridData(res.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //onclick New Button  to open popup function
  const handleNewMapping = () => {
    setPopup(true);
    handleClear();
  };

  //getting Lab Service Name from api function
  const getTestgroupServiceData = async () => {
    try {
      const res = await services.get(getLabServiceName);
      const result = res.data.map((list: any) => ({
        ...list,
        label: list.serviceDesc,
        value: list.serviceDesc,
      }));
      setServiceList(result);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  //handle clear
  const handleClear = () => {
    setLaboratoryServicesGrid([]);
    setLaboratoryServices({
      label: "Laboratory Services",
    });
    setFields({
      ...fields,
      servicename: { label: "Test Group Service Name" },
      servicecode: "",
      department: "",
      speciality: "",
      labTestgroupHeaderId: "",
    });
  };



  //update API
  const onUpdateSubmit = () => {
    let labTestGroupItemInfo = laboratoryServicesGrid.map(
      (list: any, index: number) => ({
        labTestGroupItemId: list.labTestGroupItemId
          ? list.labTestGroupItemId
          : null,
        serviceName: list.serviceDesc,
        serviceCode: list.serviceCode,
        departmentCode: list.department,
        sequenceOrderIdUi: list?.sequenceOrderIdUi,
        department: list.departmentDesc,
        specality: list.superSpecialityDesc,
        specalityCode: list.superSpeciality,
        statusFlag: 1,
      })
    );

    let postObj = {
      labgroupHeaderId: fields.labTestgroupHeaderId
        ? fields.labTestgroupHeaderId
        : null,
      testGroupServiceName: fields.servicename.label,
      testGroupServiceCode: fields.servicecode,
      testGroupDepartment: fields.department,
      testGroupSpecality: fields.speciality,
      updatedBy: empName,
      statusFlag: 1,
      labTestGroupItemSet: labTestGroupItemInfo,
    };
    services
    .create(updateTestGroup, postObj, headers)
    .then((res) => {
      toast.success("Updated successfully");
      // getAllgridData();
      handleClear();
      setPopup(false);
    })
    .catch((err) => {
      toast.error("Error creating test group");
    });


   }
  // save API service  function
  const handleSave = () => {
    const selectedServiceName = fields.servicename.label;
    if (!Array.isArray(gridData)) {
      return null;
    }
    const isDuplicate = gridData.some(
      (item: any) => item.serviceDesc === selectedServiceName
    );
    if (isDuplicate) {
      toast.error(
        "You have entered the same values present in Table, Please be aware..."
      );
      return null;
    }
    let labTestGroupItemInfo = laboratoryServicesGrid.map(
      (list: any, index: number) => ({
        labTestGroupItemId: list.labTestGroupItemId
          ? list.labTestGroupItemId
          : null,
        serviceName: list.serviceDesc,
        serviceCode: list.serviceCode,
        departmentCode: list.department,
        sequenceOrderIdUi: list?.sequenceOrderIdUi,
        department: list.departmentDesc,
        specality: list.superSpecialityDesc,
        specalityCode: list.superSpeciality,
        statusFlag: 1,
      })
    );

    let postObj = {
      labgroupHeaderId: fields.labTestgroupHeaderId
        ? fields.labTestgroupHeaderId
        : null,
      testGroupServiceName: fields.servicename.label,
      testGroupServiceCode: fields.servicecode,
      testGroupDepartment: fields.department,
      testGroupSpecality: fields.speciality,
      updatedBy: empName,
      statusFlag: 1,
      labTestGroupItemSet: labTestGroupItemInfo,
    };

    console.log(postObj);
    const message = fields.labTestgroupHeaderId
      ? "Updated Successfully"
      : "Saved Successfully";
    // const url = fields.labTestgroupHeaderId ? updateTestGroup : saveTestGroup;
    services
      .create(saveTestGroup, postObj, headers)
      .then((res) => {
        toast.success(message);
        getAllgridData();
        handleClear();
        setPopup(false);
      })
      .catch((err) => {
        toast.error("Error creating test group");
      });
  };

  // Edit id function
  // const testGroupEditById = (row: any) => {
  //   services
  //     .get(`${getEditIdTestGroup}${row.labTestgroupHeaderId}`)
  //     .then((res) => {
  //       const sortedArray = res.data.labTestGroupItemSet.sort(
  //         (a: any, b: any) => a.sequenceOrderIdUi - b.sequenceOrderIdUi
  //       );
  //       console.log(sortedArray);
  //       const result = res.data.labTestGroupItemSet.map((list: any) => ({
  //         ...list,
  //         serviceDesc: list.serviceName,

  //       }));
  //       setLaboratoryServicesGrid(result);
  //       setPopup(true);
  //       setFields({
  //         ...fields,
  //         servicename: { label: row.testGroupServiceName },
  //         servicecode: row.testGroupServiceCode,
  //         department: row.testGroupDepartment,
  //         serviceName:row.serviceName,
  //         speciality: row.testGroupSpecality,
  //         sequenceOrderIdUi: sortedArray,
  //         labTestgroupHeaderId: row.labTestgroupHeaderId,
  //       });
  //       let data: any = res.data.labTestGroupItemSet.map(
  //         (list: any, index: number) => ({
  //           ...list,
  //           sequenceOrderIdUi: index,
  //         })
  //       );
  //       setLaboratoryServicesGrid(data);
  //     })
  //     .catch((err) => {
  //       toast.error("Error creating test group");
  //     });
  // };
  const testGroupEditById = (row: any) => {
    services
      .get(`${getEditIdTestGroup}${row.labTestgroupHeaderId}`)
      .then((res) => {
        // Sort the array
        const sortedArray = res.data.labTestGroupItemSet.sort(
          (a: any, b: any) => a.sequenceOrderIdUi - b.sequenceOrderIdUi
        );
        console.log(sortedArray);
        setFields({
          ...fields,
          servicename: { label: row.testGroupServiceName },
          servicecode: row.testGroupServiceCode,
          department: row.testGroupDepartment,
          serviceName: row.serviceName,
          speciality: row.testGroupSpecality,
          sequenceOrderIdUi: sortedArray,
          labTestgroupHeaderId: row.labTestgroupHeaderId
            ? row.labTestgroupHeaderId
            : [],
        });
    
        const data = res.data.labTestGroupItemSet.map((list: any, index: number) => ({
          ...list,
          serviceDesc: list.serviceName,
          sequenceOrderIdUi: index,
        }));

        setLaboratoryServicesGrid(data);
        console.log(data);
        // Open the popup
        setPopup(true);
      })
      .catch((err) => {
        toast.error("Error creating test group");
      });
  };

  useEffect(() => {
    getAllgridData();
    getTestgroupServiceData();
  }, []);
  return (
    <>
      <div className="flex w-full gap-4 mt-3 justify-between items-center">
        <TabPageTitle title={"Laboratory Test Group Master"} />
        <ActionButton
          buttonText="New"
          handleSubmit={handleNewMapping}
          width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
        />
      </div>

      <div className="w-full mt-4 ">
        <LabTestGrid
          gridData={gridData}
          testGroupEditById={testGroupEditById}
          getAllgridData={getAllgridData}
        />
      </div>

      <div>
        <ReactCommonDialog
          dialogtitle={"Laboratory Test Group"}
          size={"xl"}
          open={Popup}
          handler={() => {
            // setPopup(false);
          }}
          popupClose={() => {
            setPopup(false);
          }}
          Content={
            <LabTestPopup
              fields={fields}
              setFields={setFields}
              serviceList={serviceList}
              onUpdateSubmit={onUpdateSubmit}
              laboratoryServices={laboratoryServices}
              setLaboratoryServices={setLaboratoryServices}
              handleLabServiceAdd={handleLabServiceAdd}
              key1={key1}
              setkey1={setkey1}
              laboratoryServicesGrid={laboratoryServicesGrid}
              setLaboratoryServicesGrid={setLaboratoryServicesGrid}
              handlelaboratoryServicesItemRemove={
                handlelaboratoryServicesItemRemove
              }
              handlelaboratoryServicesItemDelete={
                handlelaboratoryServicesItemDelete
              }
              handleSave={handleSave}
              handleClear={handleClear}
            />
          }
        />
      </div>
    </>
  );
};

export default LaboratoryTestGroupMasterMainPage;
