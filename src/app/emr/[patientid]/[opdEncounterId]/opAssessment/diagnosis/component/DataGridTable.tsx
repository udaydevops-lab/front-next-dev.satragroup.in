import ActionButton from "@/app/_common/button";
import FormPropsTextFields from "@/app/_common/input";
import { Tooltip } from "@material-tailwind/react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import React from "react";
import Select from "react-tailwindcss-select";

const DataGridTable = (props: any) => {
  const handleDiagnosisType = (e: any) => {};
  const diagnosticDataSave = (data: any, rowIndex: any) => {
    props.setFields({
      ...props.fields,
      [`sel${rowIndex}`]: data,
    });

    props.setResult(
      props.result.map((list: any, index: any) => {
        if (index === rowIndex) {
          return {
            ...list,
            daignosticType: data.label,
          };
        }
        return list;
      })
    );
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className="rounded-[7px]">
          <TableBody>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Code</TableCell>

              {props.tabSel === "Diagnosis" ? (
                <>
                  <TableCell>Description</TableCell>
                  <TableCell>Diagnosis Type</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell style={{ width: "90px" }}> onSet Date</TableCell>
                  <TableCell>Document Date</TableCell>

                  <Tooltip content="Add to Fixed">
                    <TableCell>Fixed</TableCell>
                  </Tooltip>
                  <Tooltip content="Add to Favourite">
                    <TableCell style={{ width: "90px" }}> Fav</TableCell>
                  </Tooltip>
                  <TableCell>Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell>Description</TableCell>
                  <TableCell>Comments</TableCell>
                  <TableCell style={{ width: "90px" }}> onSet Date</TableCell>
                  <TableCell>Document Date</TableCell>
                  <TableCell>Add To Diagnosis</TableCell>
                </>
              )}
            </TableRow>
          </TableBody>
          <TableBody>
            {props.result &&
              props.result.map((list: any, rowIndex: any) => (
                <>
                  <TableRow
                    key={rowIndex}
                    sx={{
                      opacity:
                        list.isActive === 0 && list.diagnosisId ? 0.5 : 1,
                    }}
                    className={`${
                      list.isActive === 0 && list.diagnosisId
                        ? "disable-row"
                        : ""
                    }`}
                  >
                    <TableCell className="px-1 py-0">{rowIndex + 1}</TableCell>
                    <TableCell className="px-1 py-0">
                      {list.diagnosisCode}
                    </TableCell>
                    <TableCell className="px-1 py-0">
                      {list.diagnosisDescriptrion}
                    </TableCell>
                    <TableCell className="diag-type relative p-1 custdropadjust">
                      <div className="my-select w-full relative">
                        <Select
                          classNames={{
                            menuButton: ({ isDisabled }: any) =>
                              `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                              duration-300 focus:outline-none  
                             
                              ${
                                isDisabled
                                  ? "bg-blue-gray-200"
                                  : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                              }`,
                            menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                            listItem: ({ isSelected }: any) =>
                              `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${
                                isSelected
                                  ? `text-white bg-blue-500`
                                  : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                              }`,
                          }}
                          placeholder=" Diagnosis Type "
                          primaryColor="blue"
                          value={props.fields[`sel${rowIndex}`]}
                          options={props.diagnosisTypeData}
                          // isClearable={true}
                          isSearchable={true}
                          onSearchInputChange={handleDiagnosisType}
                          onChange={(e: any) =>
                            diagnosticDataSave(list, rowIndex)
                          }
                          //   onChange={(e: any) => {
                          //     // Assuming `dataa` is an array and `rowIndex` is the index of the row to update
                          //     const updatedData = [...dataa];
                          //     updatedData[rowIndex] = {
                          //       ...updatedData[rowIndex],
                          //       diagnosisType: e.label,
                          //     };
                          //     setDiagnosisType({
                          //       ...diagnosisType,
                          //       [`sel${rowIndex}`]: e,
                          //     });
                          //     setDataa(
                          //       dataa.map((list: any, index: number) => {
                          //         if (
                          //           list.opdEncounterId === row.opdEncounterId
                          //         ) {
                          //           return {
                          //             ...list,
                          //             diagnosisType: e.label,
                          //           };
                          //         }
                          //         return list;
                          //       })
                          //     );
                          //   }}
                        />

                        <label
                          style={{
                            fontSize: "10px",
                            color: "rgba(0, 0, 0, 0.6)",
                          }}
                          className={`${
                            props.fields[`sel${rowIndex}`]?.label !== undefined
                              ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                              : "text-sm opacity-0 top-10"
                          } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
                        >
                          Diagnosis Type
                        </label>
                      </div>
                    </TableCell>
                    <TableCell style={{ width: "10px" }}>
                      <FormPropsTextFields
                        style={{ width: "10px" }}
                        label="comments"
                        name="comments"
                        value={props.result[rowIndex].comments}
                        handleChange={(e: any) =>
                          // handleCommentsChange(
                          //   e.target.value,
                          //   row.id,
                          //   "comments"
                          // )
                          props.setResult(
                            props.result.map((list: any, index: any) => {
                              if (rowIndex === index) {
                                return {
                                  ...list,
                                  [e.target.name]: e.target.value,
                                };
                              }
                              return list;
                            })
                          )
                        }
                      />
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      {props.tabSel === "Diagnosis" ? (
        <>
          <div className="w-full flex gap-4 justify-end mt-4">
            <ActionButton
              buttonText="SAVE"
              handleSubmit={props.saveDiagnosisData}
              width="w-[120px] py-3"
            />
            <ActionButton
              buttonText="SIGN"
              //   handleSubmit={handleAddDiagnosis}
              width="w-[120px] py-3"
            />
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default DataGridTable;
