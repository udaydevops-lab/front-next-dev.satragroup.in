import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import React from "react";
import FormPopUp from "./FormPopUp";
import { LabMasterGridProps } from "./interfaces/lab-interfaces";

function MasterGrid({
  data,
  columns,
  handleClear,
  handleOpen,
  open,
  title,
  editData,
  setEditData,
  inputDetails,
  api,
  getAll
}: LabMasterGridProps) {
  return (
    <div className=" data-grid-newThem">
      <ReactDatagrid rows={data} columns={columns} />
      <FormPopUp
        handleClear={handleClear}
        setData={setEditData}
        data={editData}
        type="Update"
        getAll={getAll}
        handleOpen={handleOpen}
        open={open}
        api={api}
        title={title}
        inputDetails={inputDetails}
      />
    </div>
  );
}

export default MasterGrid;
