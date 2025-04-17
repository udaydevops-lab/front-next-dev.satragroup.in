"use client";

import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { saveImmunizationRecord } from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import { Input } from "@material-tailwind/react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import dayjs from "dayjs";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-tailwindcss-select";
import { toast } from "react-toastify";

const ImmunizationRecords = ({
  imzMasterSaveData,
  setImzMasterSaveData,
  storeDoctor,
  recordField,
  setRecordField,
  patientid,
  getSaveImmunizationRecordData,
  opdEncounterId,
  headers,
  ...props
}: any) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [valueSave, setValueSave] = useState<any>([]);
  const [postion, setPosition] = useState("botP");

  const administrated_options: any = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
  ];

  const tableGridHandler = (e: any, index: any) => {
    setImzMasterSaveData(
      imzMasterSaveData.map((list: any, innerIndex: any) => {
        if (innerIndex === index) {
          return {
            ...list,
            [e.target.name]: e.target.value,
          };
        }
        return list;
      })
    );
  };

  const tableGridSelectHandler = (e: any, index: any, data: any) => {
    setImzMasterSaveData(
      imzMasterSaveData.map((list: any, innerIndex: any) => {
        if (innerIndex === index) {
          return {
            ...list,
            administred:
              recordField[`sel${index}`] != ""
                ? e.label
                : recordField[`sel${index}`],
            administeredByDoctor: recordField[`doctor${index}`].label,
            administeredDate: moment().format("YYYY-MM-DD"),
            expiryDate: moment().format("YYYY-MM-DD"),
            nextDueDate: moment().format("YYYY-MM-DD"),
          };
        }
        return list;
      })
    );

    if (e.label === "No") {
      setValueSave(
        valueSave.map((list: any) => {
          if (list.id === data.id) {
            return {
              ...list,
              isActive: false,
              isSave: false,
            };
          }
          return list;
        })
      );
    }

    setRecordField({
      ...recordField,
      [`sel${index}`]: e,
    });
  };

  let saveBtnShow = imzMasterSaveData.filter(
    (list: any) => list.isActive === false && list.administred === "Yes"
  );

  // Save
  const saveImmunizationRecordData = () => {
    const filterMainData = imzMasterSaveData.filter(
      (list: any) => list.isActive === false && list.administred === "Yes"
    );
    if (filterMainData.length === 0) {
      toast.error(
        'Please select Administered to "Yes" fill the other data for store'
      );
    } else {
      const filterMainObject = filterMainData.map((list: any) => {
        return {
          age: list.age,
          vaccineName: list.vaccineName,
          doseUnit: list.doseUnit,
          administred: list.administred,
          administeredDate: list.administeredDate,
          administeredByDoctor: list.administeredByDoctor,
          manufacturer: list.manufacturer,
          vaccineSerial: list.vaccinationId,
          batchNumber: list.batchNumber,
          expiryDate: list.expiryDate,
          nextDueDate: list.nextDueDate,
          patientId: patientid,
          opdEncounterId: opdEncounterId,
          isActive: true,
          snomedCode: list.snomedCode ? list.snomedCode : '',
          snomedDesc: list.snomedDesc ? list.snomedDesc : '',
          vaccineNum: list.vaccineNum,
          immunizationCode: list.immunizationCode,
          serviceEntityId: headers.serviceEntityId,
          locationId: headers.locationId,
        };
      });

      services
        .create(saveImmunizationRecord, filterMainObject)
        .then((res) => {
          toast.success(`Successfully Vaccinated...`);
          getSaveImmunizationRecordData();
        })
        .catch((err) => {
          console.log(err);
          toast.error("Getting error, Please try again!");
        });
    }
  };

  // const handleScroll = () => {
  //   if (dropdownRef.current) {
  //     const dropdownRect = dropdownRef.current.getBoundingClientRect();
  //     const windowHeight = window.innerHeight;
  //     const isDropdownCloseToBottom =
  //       windowHeight - dropdownRect.bottom < dropdownRect.height;

  //     if (isDropdownCloseToBottom) {
  //       setPosition("botP");
  //     } else {
  //       setPosition("topP");
  //     }
  //   }
  // };

  // const debounce = (func: () => void, delay: number) => {
  //   let timeoutId: NodeJS.Timeout;
  //   return () => {
  //     clearTimeout(timeoutId);
  //     timeoutId = setTimeout(func, delay);
  //   };
  // };

  // const handleResize = debounce(() => {
  //   handleScroll();
  // }, 200); // Adjust the debounce delay as needed

  // useEffect(() => {
  //   window.addEventListener("scroll", handleScroll);
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <>
      <div className="w-full">
        <div className="px-4 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
          <div className="font-bold px-4 md:pt-3 pb-3 mx-auto w-full ">
            <h2>Immunization Record</h2>
          </div>

          {/* Immunization Record Table */}
          <TableContainer
            className="mostly-customized-scrollbar"
            component={Paper}
            sx={{ maxHeight: 440 }}
          >
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell className="w-[300px]">S.No</TableCell>
                  <TableCell className="w-[300px]">Age</TableCell>
                  <TableCell className="w-[300px]">Vaccine Name</TableCell>
                  <TableCell className="w-[300px]">Dose Unit</TableCell>
                  <TableCell className="w-[300px]">Due Date</TableCell>
                  <TableCell className="w-[300px]">Administered</TableCell>
                  <TableCell component="th" scope="row" width={150}>
                    Administered Date
                  </TableCell>
                  <TableCell className="w-[300px]">
                    Administered By Doctor
                  </TableCell>
                  <TableCell className="w-[300px]">Manufacturer</TableCell>
                  <TableCell className="w-[300px]">Batch Number</TableCell>
                  <TableCell className="w-[300px]">Expiry Date</TableCell>
                  <TableCell className="w-[300px]">Next Due Date 1</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {imzMasterSaveData &&
                  imzMasterSaveData.map((list: any, index: any) => (
                    <>
                      <TableRow
                        key={index}
                        // disable={list.active}
                        sx={{
                          opacity:
                            list.outDate > 1
                              ? 0.5
                              : list.isActive === true
                                ? 0.5
                                : 1,
                        }}
                        className={`${list.outDate > 1
                          ? "disable-row"
                          : `${list.isActive === true ? "disable-row" : ""}`
                          } `}
                      >
                        <TableCell className="w-[300px]">{index + 1}</TableCell>

                        <TableCell className="w-[300px]">{list.age}</TableCell>

                        <TableCell className="w-[300px]">
                          <div className="w-[250px]">{list.vaccineName}</div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div className="does_Unit w-[full]">
                            <Input
                              crossOrigin={true}
                              name="doseUnit"
                              label="---------"
                              containerProps={{
                                className: "!min-w-0 !w-[70px]",
                              }}
                              value={imzMasterSaveData[index].doseUnit}
                              onChange={(e: any) => tableGridHandler(e, index)}
                              color="blue"
                              className="focus:border-t-0"
                            />
                          </div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div className="w-[80px]">
                            {list.dueDate != ""
                              ? moment(list.dueDate).format("YYYY-MM-DD")
                              : ""}
                          </div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div
                            className="nax-w-[100px] does_Unit"
                            ref={dropdownRef}
                          >
                            <ReactSelectBox
                              value={recordField[`sel${index}`]}
                              options={administrated_options}
                              onChange={(e: any) =>
                                tableGridSelectHandler(e, index, list)
                              }
                              label={"---"}
                              optionPosition={"top"}
                            />


                            {/* <Select
                              primaryColor={"indigo"}
                              value={recordField[`sel${index}`]}
                              options={administrated_options}
                              placeholder={"---"}
                              onChange={(e: any) =>
                                tableGridSelectHandler(e, index, list)
                              }
                              classNames={{
                                menuButton: ({ isDisabled }: any) =>
                                  `flex text-sm text-blue-gray-700 border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                                                        duration-300 focus:outline-none 
                                                        w-[80px]
                                                        ${isDisabled
                                    ? "bg-blue-gray-200"
                                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                                  }`,
                                menu: `absolute ${postion === "botP"
                                  ? "!top-[auto] bottom-[45px]"
                                  : ""
                                  }  z-10 w-[80px] bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700`,
                                listItem: ({ isSelected }: any) =>
                                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                                    ? `!text-white bg-blue-500`
                                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                                  }`,
                              }}
                            /> */}
                          </div>
                        </TableCell>

                        <TableCell component="th" scope="row" width={150}>
                          <div className="w-[150px]">
                            <DateInput
                              label="------"
                              value={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? moment(
                                    imzMasterSaveData[index].administeredDate
                                  )
                                  : null
                              }
                              name="administeredDate"
                              disableFuture={true}
                              onChange={(e: any) => {
                                setRecordField({
                                  ...recordField,
                                  [`administeredDate${index}`]: e,
                                });

                                setImzMasterSaveData(
                                  imzMasterSaveData.map(
                                    (innerList: any, index: any) => {
                                      if (list.id === innerList.id) {
                                        return {
                                          ...innerList,
                                          administeredDate: dayjs(e._d).format(
                                            "YYYY-MM-DD"
                                          ),
                                          [`administeredDate${index}`]: e,
                                        };
                                      }
                                      return innerList;
                                    }
                                  )
                                );
                              }}
                              disabled={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div className="nax-w-[100px] does_Unit">
                            {/* bg-blue-gray-50 border-blue-gray-200 */}


                            <ReactSelectBox
                              value={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? recordField[`doctor${index}`]
                                  : ""
                              }
                              options={storeDoctor}
                              onChange={(e: any) => {
                                setImzMasterSaveData(
                                  imzMasterSaveData.map(
                                    (innerList: any, index: any) => {
                                      if (list.id === innerList.id) {
                                        return {
                                          ...innerList,
                                          administeredByDoctor:
                                            recordField[`doctor${index}`] != ""
                                              ? e.label
                                              : recordField[`sel${index}`],
                                        };
                                      }
                                      return innerList;
                                    }
                                  )
                                );
                                setRecordField({
                                  ...recordField,
                                  [`doctor${index}`]: e,
                                });
                              }}
                              label={"---"}
                              isDisabled={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? false
                                  : true
                              }
                              optionListWidtsize={true}
                            />

                          </div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <Input
                            crossOrigin={false}
                            color="blue"
                            name="manufacturer"
                            onChange={(e: any) => tableGridHandler(e, index)}
                            value={
                              imzMasterSaveData[index].administred === "Yes"
                                ? imzMasterSaveData[index].manufacturer
                                : ""
                            }
                            className="!w-[130px] focus:border-t-0"
                            containerProps={{
                              className: "!min-w-0 !w-[130px]",
                            }}
                            disabled={
                              imzMasterSaveData[index].administred === "Yes"
                                ? false
                                : true
                            }
                          />
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <Input
                            crossOrigin={false}
                            color="blue"
                            name="batchNumber"
                            value={
                              imzMasterSaveData[index].administred === "Yes"
                                ? imzMasterSaveData[index].batchNumber
                                : ""
                            }
                            onChange={(e: any) => tableGridHandler(e, index)}
                            className="!w-[130px] focus:border-t-0"
                            containerProps={{
                              className: "!min-w-0 !w-[130px]",
                            }}
                            disabled={
                              imzMasterSaveData[index].administred === "Yes"
                                ? false
                                : true
                            }
                          />
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div className="w-[150px]">
                            <DateInput
                              label="------"
                              value={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? moment(imzMasterSaveData[index].expiryDate)
                                  : null
                              }
                              onChange={(e: any) => {
                                {
                                  setImzMasterSaveData(
                                    imzMasterSaveData.map(
                                      (innerList: any, index: any) => {
                                        if (list.id === innerList.id) {
                                          return {
                                            ...innerList,
                                            expiryDate: dayjs(e._d).format(
                                              "YYYY-MM-DD"
                                            ),
                                            [`expiryDate${index}`]: e,
                                          };
                                        }
                                        return innerList;
                                      }
                                    )
                                  );

                                  let getExprDate = list;
                                  setValueSave(
                                    [...valueSave, getExprDate].map(
                                      (saveList: any) => {
                                        if (list.id === saveList.id) {
                                          return {
                                            ...saveList,
                                            expiryDate: dayjs(e._d).format(
                                              "YYYY-MM-DD"
                                            ),
                                          };
                                        }
                                        return saveList;
                                      }
                                    )
                                  );
                                }
                              }}
                              disabled={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </TableCell>

                        <TableCell className="w-[300px]">
                          <div className="w-[150px]">
                            <DateInput
                              label="------"
                              value={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? moment(imzMasterSaveData[index].nextDueDate)
                                  : null
                              }
                              onChange={(e: any) => {
                                setImzMasterSaveData(
                                  imzMasterSaveData.map(
                                    (innerList: any, index: any) => {
                                      if (list.id === innerList.id) {
                                        return {
                                          ...innerList,
                                          nextDueDate: dayjs(e._d).format(
                                            "YYYY-MM-DD"
                                          ),
                                          [`nextDueDate${index}`]: e,
                                        };
                                      }
                                      return innerList;
                                    }
                                  )
                                );

                                let getExprDate = list;
                                setValueSave(
                                  [...valueSave, getExprDate].map(
                                    (saveList: any) => {
                                      if (list.id === saveList.id) {
                                        return {
                                          ...saveList,
                                          nextDueDate: dayjs(e._d).format(
                                            "YYYY-MM-DD"
                                          ),
                                        };
                                      }
                                      return saveList;
                                    }
                                  )
                                );
                              }}
                              disabled={
                                imzMasterSaveData[index].administred === "Yes"
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* End Immunization Record Table */}
          <div className="w-full flex justify-end my-5">
            {props?.screenData?.Save === 1 &&
              < ActionButton
                buttonText={"Save"}
                handleSubmit={saveImmunizationRecordData}
                height="h-10"
                width="w-[120px] py-2 px-2"
                disabled={saveBtnShow.length > 0 ? false : true}
              />
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default roleInfoScreenData(ImmunizationRecords, "IMM")