import React, { useState } from "react";
import Bookmarkfillicon from "@/app/_common/common_icons/Bookmarkfillicon";
import DateInput from "@/app/_common/date-input";
import FormPropsTextFields from "@/app/_common/input";
import {
  BookmarkIcon,
  BookmarkSlashIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import moment from "moment";
import Select from "react-tailwindcss-select";
import ActiveIcon from "../../../../../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../../../../../public/icons/wellness-record/inactive-icon";

import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Tooltip,
} from "@material-tailwind/react";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";


const DiagnosisSearchTable = ({
  dataa,
  diagnosisType,
  diagnosisTypeData,
  handleDiagnosisType,
  setDiagnosisType,
  setDataa,
  handleCommentsChange,
  handleDateChange,
  handleAddtoFixed,
  setKey1,
  handlefavstore,
  handleOpen,
  handelActive,
  delLoader,
  savingData,
  onDelete,
  key1,
}: any) => {
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const [isDateInputDisabled, setIsDateInputDisabled] = useState(false);

  return (
    <>
      <div className="">
        <TableContainer component={Paper}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Code</TableCell>
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
              </TableRow>

              {dataa &&
                dataa?.map((row: any, rowIndex: number, params: any) => (
                  <>
                    <TableRow
                      key={rowIndex}
                      sx={{
                        opacity:
                          row.isActive === 0 && row.diagnosisId ? 0.5 : 1,
                      }}
                      className={`${
                        row.isActive === 0 && row.diagnosisId
                          ? "disable-row"
                          : ""
                      }`}
                    >
                      <TableCell className="px-1 py-0">
                        {rowIndex + 1}
                      </TableCell>
                      <TableCell className="px-1 py-0">
                        {row.diagnosisCode}
                      </TableCell>
                      <TableCell className="px-1 py-0">
                        {row.diagnosisDescriptrion}
                      </TableCell>
                      <TableCell className="diag-type relative p-1 custdropadjust ">
                        <div className="relative">
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
                                } text-left`,
                            }}
                            placeholder="Diagnosis Type "
                            primaryColor="blue"
                            value={diagnosisType[`sel${rowIndex}`]}
                            options={diagnosisTypeData}
                            isSearchable={true}
                            onSearchInputChange={handleDiagnosisType}
                            onChange={(e: any) => {
                              // Assuming `dataa` is an array and `rowIndex` is the index of the row to update
                              if (e && e.label) {
                                const updatedData = [...dataa];
                                updatedData[rowIndex] = {
                                  ...updatedData[rowIndex],
                                  diagnosisType: e.label,
                                };
                                setDiagnosisType({
                                  ...diagnosisType,
                                  [`sel${rowIndex}`]: e,
                                });
                                setDataa(
                                  dataa.map((list: any, index: number) => {
                                    if (
                                      list.opdEncounterId ===
                                      (row && row.opdEncounterId)
                                    ) {
                                      return {
                                        ...list,
                                        diagnosisType: e.label,
                                      };
                                    }
                                    return list;
                                  })
                                );
                              } else {
                                // If no option is selected, you can show an error message or handle it accordingly
                                alert(
                                  "Diagnosis type is mandatory. Please select a valid option."
                                );
                              }
                            }}
                          />
                          <label
                            style={{
                              fontSize: "11px",
                              color: "rgba(0, 0, 0, 0.6)",
                            }}
                            className={`${
                              diagnosisType[`sel${rowIndex}`] !== undefined &&
                              diagnosisType[`sel${rowIndex}`] !==
                                "Diagnosis Type"
                                ? " bg-white py-[1px] px-[2px] opacity-100 -top-[11px] left-[10px]"
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
                          className="focus:border-t-0"
                          name="comments"
                          value={dataa[rowIndex].comments}
                          handleChange={(e: any) =>
                            setDataa(
                              dataa.map((list: any) => {
                                return {
                                  ...list,
                                  [e.target.name]: e.target.value,
                                };
                              })
                            )
                          }
                        />
                      </TableCell>

                      {row.diagnosisId ? (
                        <TableCell className="date-inputt">
                          <DateInput
                            disableFuture={true}
                            value={
                              dataa[rowIndex]?.onSetDate
                                ? moment(dataa[rowIndex]?.onSetDate)
                                : moment()
                            }
                            onChange={(e: any) =>
                              handleDateChange(e, row.id, "onSetDate")
                            }
                            label="On SetDate"
                            format="DD-MM-YYYY"
                          />
                        </TableCell>
                      ) : (
                        <TableCell className="date-inputt disabled">
                          <DateInput
                            disableFuture={true}
                            value={
                              dataa[rowIndex]?.onSetDate
                                ? moment(dataa[rowIndex]?.onSetDate)
                                : moment()
                            }
                            onChange={(e: any) =>
                              handleDateChange(e, row.id, "onSetDate")
                            }
                            label="On SetDate"
                            disabled={isDateInputDisabled}
                            format="DD-MM-YYYY"
                          />
                        </TableCell>
                      )}

                      <TableCell className="!w-[150px] min-w-[150px] disabled ">
                        {moment().format("DD-MM-YYYY")}
                      </TableCell>

                      <TableCell>
                        {row.diagnosisId ? (
                          <div className="py-2 px-4 cursor-pointer ">
                            <PlusIcon
                              onClick={() => handleAddtoFixed(row, rowIndex)}
                              className={`${
                                row.isAdded === 0
                                  ? "text-red-900"
                                  : "text-green-900"
                              }`}
                            />
                            {row.isAdded === 0 ? "Added" : "Add"}
                          </div>
                        ) : null}
                      </TableCell>

                      <TableCell
                        key={key1}
                        className="textAlign-center cursor-pointer"
                      >
                        {row.diagnosisId ? (
                          <>
                            {row.favourite == true ? (
                              <div
                                onClick={() => handlefavstore(row, rowIndex)}
                                className="cursor-pointer"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div
                                onClick={() => handlefavstore(row, rowIndex)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                                  />
                                </svg>
                              </div>
                            )}
                          </>
                        ) : null}
                      </TableCell>

                      <TableCell>
                        <div>
                          {row.diagnosisId ? (
                            row.isActive === 1 ? (
                              <>
                                <div
                                  onClick={() => {
                                    setModaloc({
                                      ...modaloc,
                                      open: true,
                                      rowIndex: rowIndex,
                                      row: row,
                                    });
                                  }}
                                >
                                  <ActiveIcon className="cursor-pointer" />
                                </div>
                              </>
                            ) : (
                              <>
                                <div title="Inactive">
                                  <InactiveIcon className="cursor-pointer" />
                                </div>
                              </>
                            )
                          ) : (
                            <>
                              <div>
                                <button onClick={() => onDelete(row)}>
                                  <TrashIcon className="text-red-500 w-5 h-5" />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  </>
                ))}

              {diagnosisTypeData ? (
                <div className="sssssssssssssssssss">
                  <div style={{ height: "200px" }}></div>
                </div>
              ) : (
                ""
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <div>

          <ReactCommonDialog
               open={modaloc.open}
            handler={() => setModaloc({ ...modaloc, open: false })}
            popupClose={() => setModaloc({ ...modaloc, open: false })}
            Content={
              <DeletePopupMsg
                btnYesFun={handelActive}
                btnNoFun={() => setModaloc({ ...modaloc, open: false })}
                content={<>
                  you want to Inactive this record?
                  <div className="w-full text-gray-500">
                    <small>
                    <strong>Note:</strong>
                    Once you Inactive this record, you cannot rollback
                    </small>
                  </div>
                  </>
              }
              loader={delLoader} 
              />
            }
          />
        

          {/* This modal popup is used for Added fixed diagnosis statement */}
          <Dialog
            open={modaloc.diaPopup}
            handler={() => setModaloc({ ...modaloc, diaPopup: false })}
            size={"sm"}
            animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0.9, y: -100 },
            }}
            className="py-5"
          >
            <DialogHeader className=" justify-center">
              <div className="w-100">
                <div className="text-center text-[20px] text-blue-500">
                  Are you sure,
                </div>
                <div className="text-center text-[20px] text-blue-500">
                  you want to Inactive this record?
                </div>
              </div>
            </DialogHeader>
            <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
              <strong>Note:</strong>
              Once you Inactive this record, you cannot rollback
            </DialogBody>
            <DialogFooter className="text-center justify-center">
              <Button
                variant="gradient"
                color="blue"
                value={"Yes"}
                className="mr-2 bg-blue-500 hover:bg-blue-600"
                onClick={(e: any) => {
                  let rowIndex = modaloc.rowIndex;
                  let row = modaloc.row;
                  handelActive(rowIndex, row);
                  setModaloc({ ...modaloc, diaPopup: false });
                  toast.success("Successfully inactivated the record");
                }}
              >
                <span>Yes</span>
              </Button>
              <Button
                variant="gradient"
                className="bg-red-500 hover:bg-red-600"
                color="red"
                onClick={() => setModaloc({ ...modaloc, open: false })}
              >
                <span>No</span>
              </Button>
            </DialogFooter>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default DiagnosisSearchTable;
