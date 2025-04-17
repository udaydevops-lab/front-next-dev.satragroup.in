"use client";
import React, { useEffect, useState } from "react";
import MasterGrid from "../_components/MasterGrid";
import MasterForm from "../_components/MasterForm";
import InactiveIcon from "../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../public/icons/wellness-record/active-icon";
import { GridColDef } from "@mui/x-data-grid";
import {
  getOrganismInputdetails,
  handleOrganismStatus,
  initialOrganismData,
} from "./_components/utils";
import { LabData } from "../_components/interfaces/lab-interfaces";
import services from "@/app/utilities/services";
import {
  getAllOrganismsData,
  saveOrganismData,
} from "@/app/utilities/api-urls";
import moment from "moment";
import { toast } from "react-toastify";
import { PencilIcon } from "@heroicons/react/24/solid";

const OrganismMasterPage = () => {
  const title = "Organism Master";
  const [organismDesc, setOrganismDesc] = useState<string>("");
  const [gridData, setGridData] = useState<any>([]); //api response type
  const [formData, setFormData] = useState<LabData>(initialOrganismData);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [openNew, setNewOpen] = useState<boolean>(false);
  //get All with filter by input field(Organism Descriptions)
  const onSubmit = () => {
    services
      .get(getAllOrganismsData)
      .then((response) => {
        const filteredData = response.data.filter((item: any) =>
          item.organismDesc.toLowerCase().includes(organismDesc.toLowerCase())
        );
        setGridData(filteredData);
      })
      .catch((error) => {
        toast.error("Technical error");
      });
  };
  /*FormPop up is common component but using from MasterGrid and 
  MasterForm separately for new and Updating Item */

  //New FormPopup open/close Function
  const handleNewOpen = () => {
    setFormData(initialOrganismData);
    setNewOpen(!openNew);
  };
  //Update FormPopup open/close Function
  const handleUpdateOpen = () => {
    setOpenUpdate(!openUpdate);
  };
  // New FormPopup clear feilds button
  const handleNewClear = () => {
    setFormData(initialOrganismData);
  };
  // Update FormPopup clear feilds button
  const handleUpdateClear = () => {
    setFormData({
      organismCode: formData.organismCode,
      organismDesc: "",
    });
  };
  // Edit icon click function (In Grid --> Actions header)
  const handleEdit = (data: any) => {
    setFormData({
      organismId: data.organismId,
      organismCode: data.organismCode,
      organismDesc: data.organismDesc,
      statusFlag: data.statusFlag,
    });
    handleUpdateOpen();
  };
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S.No",
      width: 10,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1,
    },
    {
      field: "organismCode",
      headerName: "Organism Code",
      width: 120,
    },
    {
      field: "organismDesc",
      headerName: "Organism Description",
      width: 180,
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
            </div> : <div className="ml-5"></div>
          }
          <div onClick={(e: any) => handleOrganismStatus(params.row, onSubmit)}>
            {params.row.statusFlag ? <ActiveIcon /> : <InactiveIcon />}
          </div>
        </div>
      ),
    },
  ];
  //To load Grid Data
  const getAllOrganisms = () => {
    services.get(getAllOrganismsData).then((response) => {
      setGridData(response.data);
    });
  };
  useEffect(() => {
    getAllOrganisms();
  }, []);
  return (
    <div className="w-full">
      <MasterForm
        title={title}
        api={saveOrganismData}
        inputLabel="Organism Description"
        formData={formData}
        setFormData={setFormData}
        handleOpen={handleNewOpen}
        open={openNew}
        handleClear={handleNewClear}
        onSubmit={onSubmit}
        state={organismDesc}
        setState={setOrganismDesc}
        inputDetails={getOrganismInputdetails(formData)}
        getAll={getAllOrganisms}
      />
      <div className='w-full p-3 pt-3 mt-3 bg-white rounded-[12px]  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
        <MasterGrid
          api={saveOrganismData}
          open={openUpdate}
          title={title}
          handleOpen={handleUpdateOpen}
          columns={columns}
          handleClear={handleUpdateClear}
          data={gridData}
          editData={formData}
          setEditData={setFormData}
          inputDetails={getOrganismInputdetails(formData)}
          getAll={getAllOrganisms}
        />
      </div>
    </div>
  );
};

export default OrganismMasterPage;
