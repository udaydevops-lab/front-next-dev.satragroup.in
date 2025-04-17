import React, { useEffect, useState } from "react";
import Testparametergrid from "./_components/testparametergrid";
import TestparameterForm from "./_components/testparameterForm";
import Testparameterpopup from "./_components/testparameterpopup";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import { v4 as uuidv4 } from "uuid";

import services from "@/app/utilities/services";
import {
  getEditID,
  getLabServiceGridName,
  getLabServiceName,
  getSearchLabParam,
  saveAssignParameter,
  updatelab,
} from "@/app/utilities/api-urls";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import { toast } from "react-toastify";
import { getLocalItem } from "@/app/utilities/local";

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

const TestParameterMain = () => {
  const [mainData, setMainData] = useState<any>([]);
  const [fields, setFields] = useState<any>({
    LabServicename: "",
    department: "",
    speciality: "",
    terminalogyCode: "",
    terminalogyDesc: "",
    servicecode: "",
    labParamname: "",
    sequenceOrderIdUi: "",
  });

  const [labservicelist, setLabServiceList] = useState<any>([]);
  const [key1, setkey1] = useState(0);
  const [parameterData, setParameterData] = useState<any>([]);
  const [labparamList, setLabParamList] = useState([]);
  const [btntxt, setBtntxt] = useState("SAVE");
  const [gridData, setGridData] = useState([]);
  const [newpopup, setNewPopup] = useState<any>({
    open: false,
  });

  // when user search filtering the grid
  const handleSearch = (e: any) => {
    const result = mainData.filter((list: any) =>
      list?.serviceDesc
        .toLowerCase()
        .includes(fields.LabServiceSearchname?.toLowerCase())
    );
    setGridData(result);
  };

  //close popup to close the popup window
  const closePopup = () => {
    setNewPopup({ ...newpopup, open: false });
  };

  //popup to open New popup window
  const openNewPopup = () => {
    setBtntxt("SAVE");
    setParameterData([]);
    setFields({
      LabServicename: "",
      department: "",
      speciality: "",
      servicecode: "",
      labParamname: "",
    });
    setNewPopup({ ...newpopup, open: true });
  };

  //update open popup window
  const updateopenPopup = () => {
    setNewPopup({ ...newpopup, open: true });
  };

  //Edit function
  const handleEdit = async (row: any) => {
    setBtntxt("UPDATE");
    let id = row.assignLabParameterHeaderId;
    await services
      .get(`${getEditID}assignLabParameterHeaderId=${id}`)
      .then((response) => {
        const sortedArray = response.data.assignParameterItemSet.sort(
          (a: any, b: any) => a.sequenceOrderIdUi - b.sequenceOrderIdUi
        );
        let result = response.data;
        setFields({
          ...fields,
          speciality: row.speciality,
          servicecode: row.serviceCode,
          department: row.department,
          sequenceOrderIdUi: sortedArray,
          LabServicename: { label: row.serviceDesc },
          assignLabParameterHeaderId: row.assignLabParameterHeaderId
            ? row.assignLabParameterHeaderId
            : [],
        });
        let data: any = response.data.assignParameterItemSet.map(
          (list: any, index: number) => ({
            ...list,
            sequenceOrderIdUi: index,
          })
        );
        setParameterData(data);

      })
      .catch((err: any) => {
        console.log(err.message);
      });
    updateopenPopup();
  };

  //GET API for Grid
  const getgridData = () => {
    services
      .get(`${getLabServiceGridName}serviceName=`)
      .then((response) => {
        const result = response.data.filter((list: any) =>
          list?.serviceDesc
            .toLowerCase()
            .includes(fields.LabServiceSearchname?.toLowerCase())
        );
        setGridData(response.data);
        setMainData(response.data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err.message);
      });
  };

  //handle clear
  const handleClear = () => {
    setParameterData([]);
    setFields({
      ...fields,
      labParamname: "",
      LabServicename: "",
      servicecode: "",
      department: "",
      speciality: "",
      id: "",
      parameter: "",
      order: "",
      actions: "",
    });
  };

  //handle Add
  // const handleAdd = (rowid: any) => {
  //   console.log(fields);
  //   let data: any = fields.labParamname.parameterTerminology.map(
  //     (list: any, index: number) => ({
  //       ...list,
  //       sequenceOrderIdUi: index,
  //     })
  //   );
  //   setParameterData(data)
  //   setParameterData([
  //     ...parameterData,
  //     {
  //       terminalogyCode:
  //         fields?.labParamname.parameterTerminology[0].terminologyCode,
  //       terminologyDesc:
  //         fields?.labParamname.parameterTerminology[0].terminologyDesc,
  //       parameterCode: fields?.labParamname.parameterCode,
  //       assignPrameterType: "Laboratory",
  //       sequenceOrderIdUi: data[0].sequenceOrderIdUi,
  //       parameter: fields?.labParamname.parameterDescription,
  //       resultType: fields?.labParamname.resultType,
  //       referenceRangeDto: [{ ...fields?.labParamname.referenceRangeSet }],
  //       statusFlag: 1,
  //       rowid: uuidv4(),
  //     },
  //   ]);
  // };

  const handleAdd = (rowid: any) => {
    const selectedServiceName = fields.labParamname.label;
    const isDuplicate = parameterData.some(
      (item: any) => item.parameter === selectedServiceName
    );
    if (isDuplicate) {
      toast.error(
        "Duplicate parameter"
      );
      return null;
    }
    const data = fields.labParamname.parameterTerminologySet.map(
      (list: any, index: number) => ({
        ...list,
        sequenceOrderIdUi: index,
      })
    );

    const newParameter = {
      terminalogyCode:
        fields?.labParamname.parameterTerminologySet[0].terminologyCode,
      terminologyDesc:
        fields?.labParamname.parameterTerminologySet[0].terminologyDesc,
      parameterCode: fields?.labParamname.parameterCode,
      assignPrameterType: "Laboratory",
      sequenceOrderIdUi: parameterData.length + 1, // Set sequence order
      parameter: fields?.labParamname.parameterDescription,
      resultType: fields?.labParamname.resultType,
      referenceRangeDto: fields?.labParamname.referenceRangeSet,
      listValue: fields?.labParamname.listValue,
      statusFlag: 1,
      rowid: uuidv4(),

    };
    setParameterData((prevParameterData: any) => [...prevParameterData, newParameter]);
    setFields({
      ...fields,
      labParamname: "",
    });
  };

  //lab service name get data function
  const getLabServiceNameData = async () => {
    try {
      await services
        .get(getLabServiceName, getHeaderResponse())
        .then((response: any) => {
          const result = response.data.map((list: any) => ({
            ...list,
            value: list.serviceDesc,
            label: list.serviceDesc,
          }));
          setLabServiceList(result);
          let userInfo = response.data;

          setFields({
            ...fields,
            speciality: userInfo.superSpecialityDesc,
            servicecode: userInfo.serviceCode,
            department: userInfo.departmentDesc,
            terminologyId: userInfo.terminologyId,
          });
        });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  // lab service selected set data to remaindin input feilds
  const handleLabServiceNameChange = (selectedOption: any) => {
    const selectedData = labservicelist.find(
      (service: any) => service.value === selectedOption.value
    );
    if (selectedData) {
      setFields({
        ...fields,
        LabServicename: {
          ...selectedOption,
          label: selectedData.serviceDesc,
          value: selectedData.serviceDesc,
        },
        speciality: selectedData.superSpecialityDesc,
        servicecode: selectedData.serviceCode,
        departmentCode: selectedData.department,
        specialityCode: selectedData.superSpeciality,
        department: selectedData.departmentDesc,
        assignParameterItemSet: [selectedData.masterTerminology],
      });
    }
  };

  // Laboratory Parameter Name onchange getting data
  const handleSearchInputChange: any = async (e: any) => {
    let searchData = e.target.value;
    try {
      const response = await services.get(
        `${getSearchLabParam}ModuleType=Laboratory&searchString=${searchData}`
      );
      const result = response.data.map((list: any) => ({
        ...list,
        label: list.parameterDescription,
        value: list.parameterDescription,
      }));
      setLabParamList(result);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // update api
  const onUpdateSubmit = () => {
    let assignParameterItemSetData = parameterData.map((list: any) => {
      let id = fields.assignLabParameterHeaderId;
      return {
        assignLabParameterItemId: list?.assignLabParameterItemId || null,
        terminologyCode: list?.terminologyCode || null,
        terminologyDesc: list?.terminologyDesc || null,
        listValue: list?.listValue || null,
        parameter: list?.parameter || null,
        parameterCode: list?.parameterCode || null,
        sequenceOrderIdUi: list?.sequenceOrderIdUi,
        noramalRange: null,
        assignParameterType: list?.assignParameterType || null,
        assignLabParameterHeaderId: list?.assignLabParameterHeaderId || id,
        assignLabServiceParameterHeaderTbl: null,
        generatedDate: null,
        updatedDate: null,
        generatedId: null,
        generatedBy: null,
        updatedBy: null,
        serviceEntityId: null,
        locationId: null,
        ipAddress: null,
        statusFlag: list?.statusFlag ? list?.statusFlag : null,
        units: list?.units || null,

      };
    });
    const postObj = {
      assignLabParameterHeaderId: fields.assignLabParameterHeaderId,
      serviceDesc: fields.LabServicename.label,
      serviceCode: fields.servicecode || "",
      department: fields.department || "",
      speciality: fields.speciality || "",
      departmentCode: fields.LabServicename.department || "",
      specialityCode: fields.LabServicename.superSpeciality || "",
      terminalogyCode: fields.terminalogyCode,
      terminalogyDesc: fields.terminalogyDesc,
      specimenType: fields.specimenType || "",
      assignPrameterType: "Laboratory",
      assignParameterItemSet: assignParameterItemSetData,
      generatedDate: fields.generatedData,
      updatedDate: fields.updatedData,
      generatedId: null,
      generatedBy: fields.generatedBy,
      updatedBy: fields.updatedBy,
      serviceEntityId: null,
      locationId: null,
      ipAddress: null,
      statusFlag: fields.statusFlag,
    };
    let Headers = getHeaderResponse();

    services
      .create(`${updatelab}`, postObj, Headers)
      .then((response) => {
        toast.success("Updated Successfully");
        setParameterData([]);
        setFields({
          labParamname: "",
          LabServicename: "",
          servicecode: "",
          department: "",
          speciality: "",
          parameter: "",
          order: "",
          actions: "",
        });
        getgridData();
        closePopup();
      })
      .catch((error) => {
        console.log(error.message);
      })
      .finally(() => {
        console.log(`Error on this API ${updatelab}`);
      });
  };

  console.log(fields.labParamname)
  console.log(parameterData)
  //Save API
  const onSaveSubmit = () => {
    const postObj = {
      serviceDesc: fields.LabServicename.label,
      serviceCode: fields.LabServicename.serviceCode,
      department: fields.LabServicename.department,
      speciality: fields.LabServicename.superSpecialityDesc,
      departmentCode: fields.LabServicename.department,
      specialityCode: fields.LabServicename.superSpeciality,
      terminalogyCode: fields.LabServicename?.masterTerminologyDto[0]
        ?.terminologyCode
        ? fields.LabServicename?.masterTerminologyDto[0]?.terminologyCode
        : "",
      terminalogyDesc: fields.LabServicename?.masterTerminologyDto[0]
        ?.terminologyDesc
        ? fields.LabServicename?.masterTerminologyDto[0]?.terminologyDesc
        : "",
      statusFlag: btntxt === "SAVE" ? 1 : fields.statusFlag,
      updatedBy: empName,
      assignParameterItemSet: parameterData,
    };
    let Headers = getHeaderResponse();

    console.log(postObj)
    services
      .create(saveAssignParameter, postObj, Headers)
      .then((response) => {
        toast.success("Successfully Saved");
        setParameterData([]);
        setFields({
          labParamname: "",
          LabServicename: "",
          servicecode: "",
          department: "",
          speciality: "",
          parameter: "",
          order: "",
          actions: "",
        });
        closePopup();
        getgridData();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    getgridData();
  }, []);

  return (
    <div>
      <TestparameterForm
        openNewPopup={openNewPopup}
        handleSearch={handleSearch}
      />
      <Testparametergrid
        gridData={gridData}
        handleEdit={handleEdit}
        handleSearch={handleSearch}
        getgridData={getgridData}
      />

      <ReactCommonDialog
        dialogtitle={"Assign Test Parameter"}
        open={newpopup.open}
        size={"xl"}
        handler={() => {
          closePopup;
        }}
        popupClose={closePopup}
        Content={
          <Testparameterpopup
            fields={fields}
            onSaveSubmit={onSaveSubmit}
            onUpdateSubmit={onUpdateSubmit}
            handleAdd={handleAdd}
            getLabServiceNameData={getLabServiceNameData}
            handleLabServiceNameChange={handleLabServiceNameChange}
            handleClear={handleClear}
            setFields={setFields}
            key1={key1}
            setkey1={setkey1}
            handleSearchInputChange={handleSearchInputChange}
            labparamList={labparamList}
            labservicelist={labservicelist}
            setLabServiceList={setLabServiceList}
            setParameterData={setParameterData}
            btntxt={btntxt}
            parameterData={parameterData}
            setBtntxt={setBtntxt}
          />
        }
      />
    </div>
  );
};

export default TestParameterMain;
