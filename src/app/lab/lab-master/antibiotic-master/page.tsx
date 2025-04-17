"use client";
import React, { useEffect, useState } from "react";
import MasterForm from "../_components/MasterForm";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import {
  getAntibioticInputdetails,
  handleAntibioStatus,
  initialAntibioticData,
} from "./_components/utils";
import { GridColDef } from "@mui/x-data-grid";
import MasterGrid from "../_components/MasterGrid";
import { LabData } from "../_components/interfaces/lab-interfaces";
import services from "@/app/utilities/services";
import { getAllAntibioticData, saveAntiBioticData } from "@/app/utilities/api-urls";
import { PencilIcon } from "@heroicons/react/24/solid";
import moment from "moment";
import { toast } from "react-toastify";

const AntibioticMasterPage = () => {
  const title = "Antibiotic Master";
  const [antibioticDesc, setAntibioticDesc] = useState<string>("");
  const [gridData, setGridData] = useState<any>([]);
  const [openNew, setNewOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [formData, setFormData] = useState<LabData>(initialAntibioticData);
  const onSubmit = () => {
    services
      .get(getAllAntibioticData)
      .then((response) => {
        const filteredData = response.data.filter((item: any) =>
          item.antibioticDesc.toLowerCase().includes(antibioticDesc.toLowerCase())
        );
        setGridData(filteredData);
      })
      .catch((error) => {
        toast.error("Technical error");
      });
  };
  const handleNewOpen = () => {
    setFormData(initialAntibioticData);
    setNewOpen(!openNew);
  };
  const handleUpdateOpen = () => {
    setOpenUpdate(!openUpdate);
  };
  const handleNewClear = () => {
    setFormData(initialAntibioticData);
  };
  const handleUpdateClear = () => {
    setFormData({
      antibioticCode: formData.antibioticCode,
      antibioticDesc: "",
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
      field: "antibioticCode",
      headerName: "Antibiotic Code",
      width: 120,
    },
    {
      field: "antibioticDesc",
      headerName: "Antibiotic Description",
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
      width: 130,
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
          <div className="cursor-pointer" onClick={(e: any) => handleAntibioStatus(params.row, onSubmit)}>
            {params.row.statusFlag ? <ActiveIcon /> : <InactiveIcon />}
          </div>
        </div>
      ),
    },
  ];
  const handleEdit = (data: any) => {
    setFormData({
      antibioticCode: data.antibioticCode,
      antibioticDesc: data.antibioticDesc,
      antibioticId: data.antibioticId,
      statusFlag: data.statusFlag,
    });
    handleUpdateOpen();
  };
  const getAllAntibiotic = () => {
    services.get(getAllAntibioticData).then((response) => {
      setGridData(response.data);
    });
  }
  useEffect(() => {
    getAllAntibiotic();
  }, [])
  return (
    <div>
      <MasterForm
        title={title}
        api={saveAntiBioticData}
        inputLabel={"Antibiotic Description"}
        formData={formData}
        setFormData={setFormData}
        handleOpen={handleNewOpen}
        open={openNew}
        handleClear={handleNewClear}
        onSubmit={onSubmit}
        state={antibioticDesc}
        setState={setAntibioticDesc}
        inputDetails={getAntibioticInputdetails(formData)}
        getAll={getAllAntibiotic}
      />
      <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
        <MasterGrid
          api={saveAntiBioticData}
          open={openUpdate}
          title={title}
          handleOpen={handleUpdateOpen}
          columns={columns}
          handleClear={handleUpdateClear}
          data={gridData}
          editData={formData}
          setEditData={setFormData}
          inputDetails={getAntibioticInputdetails(formData)}
          getAll={getAllAntibiotic}
        />
      </div>
    </div>
  );
};

export default AntibioticMasterPage;
