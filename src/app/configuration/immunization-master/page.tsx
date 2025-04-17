"use client";
import React, { useEffect, useState } from "react";
import Input from "@/app/_common/input";
import { useForm } from "react-hook-form";
import { Radio } from "@material-tailwind/react";
import { Table, TableBody, TableCell, TableContainer } from "@mui/material";
import Select from "react-tailwindcss-select";
import ActionButton from "../../_common/button";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import services from "@/app/utilities/services";
import {
  getConfigData,
  saveImmunizationMaster,
  snomedSearchByTermAndSemanticTag,
} from "@/app/utilities/api-urls";
export default function ImmunizationMaster(props: any) {
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [immuCode, setImmuCode] = useState<any>("");
  const [immuDesc, setImmuDesc] = useState<any>("");
  const [radioVal, setRadioVal] = useState("");
  const [vaccineCodeDD, setVaccineCodeDD] = useState<any>([]);
  const [selectedVaccCode, setSelectedVaccCode] = useState<any>("");
  const [vaccGridData, setVaccGridData] = useState<any>([]);
  const [terminologyTypeDD, setTerminologyTypeDD] = useState<any>([]);
  const [selectedTerminology, setSelectedTerminology] = useState<any>("");
  const [snomedData, setSnomedData] = useState<any>([]);

  const columns: GridColDef[] = [
    { field: "sno", headerName: "Sno", width: 120 },
    { field: "terminology", headerName: "Terminology", width: 120 },
    { field: "code", headerName: "Code", width: 120 },
    { field: "description", headerName: "Description", width: 120 },
  ];

  const saveImmunization = () => {
    let postObj = {
      immunizationCode: "",
      immunizationDesc: "",
      gender: "",
      snowmeddata: [],
    };
  };

  const handleSelectionChange = (newSelection: any) => {};

  const handleAddRow = (data: any) => {
    setSnomedData([]);
  };

  useEffect(() => {
    services
      .get(getConfigData + "TerminologyType" + "/0")
      .then((response) => {
        setTerminologyTypeDD(response.data.configData);
      })
      .catch((err) => {
        console.log(err.message);
      });

    services
      .get(
        snomedSearchByTermAndSemanticTag +
          "term=virus&state=active&semantictag=medicinal%20product&acceptability=synonyms&refsetid=null&parentid=null&fullconcept=false&semanticfilter=finding&conceptid1=836369007&conceptid2=836368004"
      )
      .then((response) => {
        setVaccineCodeDD(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  return (
    <div>
      <div className="px-4 md:pt-3 pb-3 mx-auto w-full flex justify-between">
        <h1>Immunization Master</h1>
      </div>
      <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <div className="grid gap-y-2 gap-x-2">
          <div className="relative px-2 py-2 flex gap-2">
            <div className="w-full">
              <Input
                type="text"
                label="Immunization Code"
                name="immunizationCode"
                watch={watch}
                handleChange={(e: any) => {
                  setImmuCode(e.target.value);
                }}
                value={immuCode}
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                label="Immunization Description"
                name="immunizationDesc"
                watch={watch}
                handleChange={(e: any) => {
                  setImmuDesc(e.target.value);
                }}
                value={immuDesc}
              />
            </div>
          </div>
          <div className="relative flex gap-8">
            <Radio
              crossOrigin={undefined}
              label="Both"
              name="both"
              value={"both"}
              onChange={(e) => {
                setRadioVal(e.target.value);
              }}
            />
            <Radio
              crossOrigin={undefined}
              label="Male"
              name="both"
              value={"male"}
              onChange={(e) => {
                setRadioVal(e.target.value);
              }}
            />
            <Radio
              crossOrigin={undefined}
              label="Female"
              name="both"
              value={"female"}
              onChange={(e) => {
                setRadioVal(e.target.value);
              }}
            />
          </div>
          <div>
            <TableContainer className="h-[300px] overflow-y-auto overflow-x-hidden">
              <Table>
                <TableBody>
                  <TableCell>
                    <div className="grid gap-y-2 gap-x-2">
                      <div className="relative flex gap-4 p-2">
                        <div className="w-full">
                          <Select
                            primaryColor="blue"
                            placeholder="Terminology"
                            options={terminologyTypeDD}
                            value={selectedTerminology}
                            onChange={(e: any) => {
                              setSelectedTerminology(e);
                            }}
                          />
                        </div>
                        <div className="w-full">
                          <Select
                            primaryColor="blue"
                            placeholder="Vaccine Code"
                            options={vaccineCodeDD}
                            value={selectedVaccCode}
                            onChange={(e: any) => {
                              setSelectedVaccCode(e);
                            }}
                            isSearchable={true}
                          />
                        </div>
                        <div className="w-[100px]">
                          <ActionButton
                            buttonText="Add"
                            handleSubmit={handleSubmit(handleAddRow)}
                            width="fit-content"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <DataGrid
                        rows={vaccGridData}
                        columns={columns}
                        getRowId={(row) => row.id}
                        pageSizeOptions={[10, 20]}
                        slots={{}}
                        onRowSelectionModelChange={handleSelectionChange}
                      />
                    </div>
                  </TableCell>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
        <div className="flex -mt-12 justify-end gap-x-4">
          <ActionButton
            buttonText="Create"
            handleSubmit={saveImmunization}
            width="fit-content"
          />
          <ActionButton buttonText="Cancel" width="fit-content" color="red" />
        </div>
      </div>
    </div>
  );
}
