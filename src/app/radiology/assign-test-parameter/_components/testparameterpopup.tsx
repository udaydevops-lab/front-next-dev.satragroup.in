import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { getHeaderResponse } from "@/app/_commonfeatures/header";
import {
  getEditID,
  getLabServiceName,
  getSearchLabParam,
  saveAssignParameter,
  updatelab,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Input } from "@material-tailwind/react";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Dataparam {
  closePopup: any;
  editData: any;
  handleEdit: any;
  setEditData: Dispatch<SetStateAction<any>>;
  btntxt: any;
}
const Testparameterpopup: React.FC<Dataparam> = ({
  closePopup,
  editData,
  setEditData,
  handleEdit,
  btntxt,
}) => {
  const [data1, setData1] = useState<any>([]);
  const [fields, setFields] = useState<any>(editData);
  const [radservicelist, setRadServiceList] = useState<any>([]);
  const [radparamList, setLabParamList] = useState<any>([]);

  // popup table
  const columns1: GridColDef[] = [
    { field: "id", headerName: "SNo", width: 230 },
    { field: "parameter", headerName: "Parameter", width: 230 },
    { field: "order", headerName: "Order ", width: 230 },
    {
      field: "actions",
      headerName: "Actions ",
      width: 230,
      renderCell: (params: any) => (
        <div>
          <button onClick={() => handleDelete(params.row.id)}>
            <TrashIcon className="text-red-500 w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  // Delete function in popup grid
  const handleDelete = (id: number) => {
    setData1(data1.filter((item: any) => item.id !== id));
  };


  
  //Popup  Grid save api Submit
  const onSubmit = () => {
    let id = editData.assignLabParameterHeaderId;
    let postObj = {
      serviceDesc: fields.RadServicename.label,
      serviceCode: fields.servicecode,
      department: fields.department,
      speciality: fields.speciality,
      terminalogyCode: fields.terminalogyCode,
      terminalogyDesc: fields.terminalogyDesc,
      statusFlag: fields.statusFlag,
      assignParameterItemSet: fields.assignParameterItemSet[0],
    };

    
    let postObj1 = {
      assignLabParameterHeaderId: editData.assignLabParameterHeaderId,
      serviceDesc: editData.RadServicename.label,
      serviceCode: editData.servicecode,
      department: editData.department,
      speciality: editData.speciality,
      terminalogyCode: editData.terminalogyCode,
      terminalogyDesc: editData.terminalogyDesc,
      specimenType: "",
      assignPrameterType: "",
      assignParameterItemSet: [
        {
          assignLabParameterItemId: editData.assignLabParameterItemId,
          terminalogyCode: editData.terminalogyCode,
          terminalogyDesc: editData.terminalogyDesc,
          parameter: editData.parameter,
          parameterCode: editData.parameterCode,
          noramalRange: "",
          assignPrameterType: "",
          assignLabParameterHeaderId:editData.assignLabParameterHeaderId,
          assignLabServiceParameterHeaderTbl: "",
          generatedDate: "",
          updatedDate: "",
          generatedId: "",
          generatedBy: "",
          updatedBy: "",
          serviceEntityId: "",
          locationId: "",
          ipAddress: "",
          statusFlag: "",
          units: "",
        },
        {
          assignLabParameterItemId: "",
          terminalogyCode: editData.terminalogyCode,
          terminalogyDesc: editData.terminalogyDesc,
          parameter: editData.parameter,
          parameterCode: editData.parameterCode,
          noramalRange: "",
          assignPrameterType: "",
          assignLabParameterHeaderId:editData.assignLabParameterHeaderId,
          assignLabServiceParameterHeaderTbl: "",
          generatedDate: "",
          updatedDate: "",
          generatedId: "",
          generatedBy: "",
          updatedBy: "",
          serviceEntityId: "",
          locationId: "",
          ipAddress: "",
          statusFlag: "",
          units: "",
        },
      ],
      generatedDate: "",
      updatedDate: "",
      generatedId: "",
      generatedBy: "",
      updatedBy: "",
      serviceEntityId: "",
      locationId: "",
      ipAddress: "",
      statusFlag: 1,
    };
  
    if (!id) {
    services
      .create(saveAssignParameter, postObj)
      .then((response) => {
        setData1(response.data);
        toast.success("Saved Successfully!");
      })
      .catch((err) => {
        console.log(err.message);
      });
    } else {
      services
        .create(`${updatelab}`, postObj1)
        .then((response) => {
          setEditData(response.data);
          toast.success("Updated Successfully!");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

  //handle clear
  const handleClear = () => {
    setFields({
      // RadServicename: type == "Update" ? fields.RadServicename : "",
      radParamname: "",
      RadServicename: "",
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
  const handleAdd = () => {
    const nextId =
      data1.length > 0 ? Math.max(...data1.map((item: any) => item.id)) + 1 : 1;
    setData1([
      ...data1,
      {
        id: nextId,
        parameter: fields.radParamname.label,
        order: "",
        actions: "",
      },
    ]);
  };

  const getLabServiceNameData = async () => {
    // try {
    //   await services
    //     .get(getLabServiceName, getHeaderResponse())
    //     .then((response: any) => {
    //       const result = response.data.map((list: any) => ({
    //         ...list,
    //         value: list.masterTerminologyDto[0].terminologyDesc,
    //         label: list.masterTerminologyDto[0].terminologyDesc,
    //       }));
    //       setRadServiceList(result);
    //       let userInfo = response.data;

    //       setEditData({
    //         ...editData,
    //         speciality: userInfo.superSpecialityDesc,
    //         servicecode: userInfo.serviceCode,
    //         department: userInfo.departmentDesc,
    //         terminologyId:userInfo.terminologyId
    //       });
    //     });
    // } catch (err: any) {
    //   console.log(err.message);
    // }
  };

  const handleRadServiceNameChange = (selectedOption: any) => {
    const selectedData = radservicelist.find(
      (service: any) => service.value === selectedOption.value
    );
    if (selectedData) {
      setFields({
        ...fields,
        RadServicename: {
          label: selectedData.label,
          value: selectedData.value,
        },
        speciality: selectedData.superSpecialityDesc,
        servicecode: selectedData.serviceCode,
        department: selectedData.departmentDesc,
        //assignParameterItemSet: selectedData.masterTerminologyDto,
        assignParameterItemSet: [selectedData.masterTerminology],
      });
    }
  };

  const handleSearchInputChange = async (e: any) => {
    // let searchData = e.target.value;
    // try {
    //   const response = await services.get(
    //     `${getSearchLabParam}ModuleType=Laboratory&searchString=${searchData}`
    //   );
    //   const keyChange = response.data.map((list: any) => {
    //     return {
    //       terminologyCode: list.terminologyCode,
    //       terminologyDesc: list.terminologyDesc,
    //       terminologyType: list.terminologyType,
    //       parameterCode: list.parameterCode,
    //       parameterDescription: list.parameterDescription,
    //       parameterId: list.parameterId,
    //       resultType: list.resultType,
    //       referenceRangeDto: list.referenceRangeSet,
    //       // label: list.parameterDescription,
    //       // value: list.parameterDescription,
    //     };
    //   });

    //   const result = response.data.map((list: any) => ({
    //     ...list,
    //     label: list.parameterDescription,
    //     value: list.parameterDescription,
    //   }));
    //   setFields({
    //     ...fields,
    //     assignParameterItemSet: [keyChange],
    //   });
    //   setLabParamList(result);
    // } catch (error: any) {
    //   console.log(error.message);
    // }
  };

  useEffect(() => {
    getLabServiceNameData();
    // getLabParamData();
  }, []);
  return (
    <div>
      <div className="flex flex-wrap">
        <div className="w-1/2 p-2 newSelect">
          <ReactSelectBox
            options={radservicelist}
            label="Radiology Service Name*"
            value={fields?.RadServicename}
            onChange={handleRadServiceNameChange}
            isSearchable={true}
          />
        </div>
        <div className="w-1/2 p-2">
          <Input
            label="Service Code"
            name="servicecode"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            // onChange={handleChange}
            value={fields?.servicecode}
          />
        </div>
        <div className="w-1/2 p-2">
          <Input
            label="Department"
            name="department"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            // onChange={handleChange}
            value={fields?.department}
          />
        </div>

        <div className="w-1/2 p-2">
          <Input
            label="Speciality"
            name="speciality"
            color="blue"
            disabled={true}
            crossOrigin={undefined}
            // onChange={handleChange}
            value={fields?.speciality}
          />
        </div>
        <div className="w-1/2 p-2 newSelect">
          <ReactSelectBox
            options={radparamList}
            label="Radiology Parameter Name*"
            value={fields?.radParamname}
            onSearchInputChange={(e: any) => handleSearchInputChange(e)}
            onChange={(e: any) => {
              setFields({
                ...fields,
                radParamname: e,
              });
            }}
            isSearchable={true}
          />
        </div>

        <div className="w-1/2 p-2">
          <ActionButton
            width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            buttonText={"ADD"}
            handleSubmit={handleAdd}
          />
        </div>
      </div>
      <div className="data-grid-newThem mt-6">
        <ReactDatagrid rows={data1} columns={columns1} />
      </div>
      <div className="px-2 flex items-center justify-end gap-2">
        <ActionButton
          width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          buttonText={btntxt}
          handleSubmit={onSubmit}
          disabled={
            fields?.RadServicename && fields?.radParamname ? false : true
          }
        />

        <ActionButton
          width="w-[120px] text-white  text-[14px] h-[42px] bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
          buttonText={"CLEAR"}
          handleSubmit={handleClear}
        />
      </div>
    </div>
  );
};

export default Testparameterpopup;
