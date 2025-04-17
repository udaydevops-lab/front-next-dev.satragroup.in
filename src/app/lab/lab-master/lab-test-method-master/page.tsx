"use client";
import React, { useEffect, useState } from "react";
import { LabPagetitle } from "../../_component";
import MasterGrid from "../_components/MasterGrid";
import MasterForm from "../_components/MasterForm";
import EditIcon from "@/app/_common/common_icons/EditIcon";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import { GridColDef } from "@mui/x-data-grid";
import {
  getLabTestInputdetails,
  handleLabTestStatus,
  initialLabTestData,
} from "./_components/utils";
import { LabData } from "../_components/interfaces/lab-interfaces";
import services from "@/app/utilities/services";
import { getAllLabtestData, saveLabTestData } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { PencilIcon } from "@heroicons/react/24/solid";
import moment from "moment";

const LabTestMethodMasterPage = () => {
  const title = "Lab Test Method Master";
  const [labTestMethodDesc, setLabTestMethodDesc] = useState<string>("");
  const [gridData, setGridData] = useState<any>([]);
  const [openNew, setNewOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [formData, setFormData] = useState<LabData>(initialLabTestData);
  const onSubmit = () => {
    services
      .get(getAllLabtestData)
      .then((response) => {
        const filteredData = response.data.filter((item: any) =>
          item.labTestMethodDesc.toLowerCase().includes(labTestMethodDesc.toLowerCase())
        );
        setGridData(filteredData);
      })
      .catch((error) => {
        toast.error("Technical error");
      });

  };
  const handleNewOpen = () => {
    setFormData(initialLabTestData);
    setNewOpen(!openNew);
  };
  const handleUpdateOpen = () => {
    setOpenUpdate(!openUpdate);
  };
  const handleNewClear = () => {
    setFormData(initialLabTestData);
  };
  const handleUpdateClear = () => {
    setFormData({
      labTestMethodCode: formData.labTestMethodCode,
      labTestMethodDesc: "",
    });
  };
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 10,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "labTestMethodCode",
      headerName: "Test Method Code",
      width: 130,
    },
    {
      field: "labTestMethodDesc",
      headerName: "Test Method Description",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      width: 80,
      renderCell: (params: any) => (
        <div>
          {params.row.statusFlag ? (
            <div className="text-green-600">Active</div>
          ) : (
            <div className="text-red-600">Inactive</div>
          )}
        </div>
      ),
    },
    {
      field: "generatedDate",
      headerName: "Created Date",
      width: 100,
      renderCell: (params: any) => (
        <>
          {params.row.generatedDate
            ? moment(params.row.generatedDate).format("DD/MM/YYYY")
            : ""}
        </>
      ),
    },
    {
      field: "updatedDate",
      headerName: "Modified Date",
      width: 100,
      renderCell: (params: any) => (
        <>
          {params.row.updatedDate
            ? moment(params.row.updatedDate).format("DD/MM/YYYY")
            : ""}
        </>
      ),
    },
    {
      field: "updatedBy",
      headerName: "Last Modified By",
      width: 140,
    },
    {
      field: "Edit",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <div className="w-full flex gap-4 items-center">
          {params.row.statusFlag == 1 ?
            <div className="flex justify-center">
              <PencilIcon
                onClick={(e: any) => handleEdit(params.row)}
                className="w-5 h-5 cursor-pointer text-blue-500"
              />
            </div> : <div className="ml-5"></div>}
          <div className="cursor-pointer" onClick={(e: any) => handleLabTestStatus(params.row, onSubmit)}>
            {params.row.statusFlag ? <ActiveIcon /> : <InactiveIcon />}
          </div>
        </div>
      ),
    },
  ];
  const handleEdit = (data: any) => {
    setFormData({
      labTestMethodId: data.labTestMethodId,
      labTestMethodCode: data.labTestMethodCode,
      labTestMethodDesc: data.labTestMethodDesc,
      statusFlag: data.statusFlag,
    });
    handleUpdateOpen();
  };
  const getAllLabTest = () => {
    services.get(getAllLabtestData).then((response) => {
      setGridData(response.data)
    })
  };
  useEffect(() => {
    getAllLabTest();
  }, []);
  return (
    <div>
      <MasterForm
        title={title}
        api={saveLabTestData}
        inputLabel="Lab Test Method Type Description"
        formData={formData}
        setFormData={setFormData}
        handleOpen={handleNewOpen}
        open={openNew}
        handleClear={handleNewClear}
        onSubmit={onSubmit}
        state={labTestMethodDesc}
        setState={setLabTestMethodDesc}
        inputDetails={getLabTestInputdetails(formData)}
        getAll={getAllLabTest}
      />
      <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
        <MasterGrid
          open={openUpdate}
          title={title}
          handleOpen={handleUpdateOpen}
          columns={columns}
          handleClear={handleUpdateClear}
          data={gridData}
          api={saveLabTestData}
          editData={formData}
          setEditData={setFormData}
          inputDetails={getLabTestInputdetails(formData)}
          getAll={getAllLabTest}
        />
      </div>
    </div>
  );
};

export default LabTestMethodMasterPage;
