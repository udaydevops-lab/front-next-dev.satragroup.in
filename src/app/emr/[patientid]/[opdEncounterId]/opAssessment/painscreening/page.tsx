"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../../../_common/input";
import Textarea from "@/app/_common/text-area";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Radio,
} from "@material-tailwind/react";
import ActionButton from "@/app/_common/button";
import services from "@/app/utilities/services";

import {
  deletePainScreening,
  getConfigData,
  getPainScreening,
  savePainscreening,
  snowmedData,
} from "@/app/utilities/api-urls";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
} from "@material-tailwind/react";
import InactiveIcon from "../../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../../public/icons/wellness-record/active-icon";
import { getLocalItem } from "@/app/utilities/local";
import { ReactSelectBox } from "@/app/_commonfeatures";
import {
  alphaNumWithFewSymbols,
  alphaNumWithHyphen,
} from "@/app/utilities/validations";
import UseErrorMessage from "@/app/_commonfeatures/UseErrorMessage";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function PainScreening(props: any) {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const [dataa, setDataa] = useState([]);
  const [painScore, setPainScore] = useState<any>("");
  const [durationVal, setDurationVal] = useState<any>("Period");
  const [painType, setPainType] = useState("Pain");
  const [duration, setDuration] = useState([]);
  const [location, setLocation] = useState("");
  const [frequency, setFrequency] = useState<any>("");
  const [characters, setCharacters] = useState("");
  const [psychological, setPsychological] = useState("");
  const [nutritional, setNutritional] = useState("");
  const [functional, setFunctional] = useState("");
  const [socioscreening, setSocioscreening] = useState("");
  const [otherscreening, setOtherscreening] = useState("");
  const [frequencyData, setFrequencyData] = useState([]);
  const [days, setDays] = useState<any>("");
  const [key, setkey] = useState(55);
  const [isFormValid, setIsFormValid] = useState(false);
  const { errorMsg, setErrorMessage, clearErrorMessage } = UseErrorMessage();

  const [painScoreList, setPainScoreList] = useState<any>([
    { label: "0", value: "0", icon: "😄" },
    { label: "1", value: "1", icon: "😃" },
    { label: "2", value: "2", icon: "😐" },
    { label: "3", value: "3", icon: "😕" },
    { label: "4", value: "4", icon: "😢" },
    { label: "5", value: "5", icon: "😭" },
  ]);
  const painscore: string = "/images/painscore.png";
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();
  const storedLoginResponse = getLocalItem("loginResponse");
  let empName;
  try {
    empName = storedLoginResponse
      ? JSON.parse(storedLoginResponse).employeename
      : "";
  } catch (error) {
    console.error("Error parsing JSON:", error);
    empName = ""; // Set a default value or handle the error accordingly
  }
  const doctor = empName;
  // getting painscreen data from API
  const getpainScreenData = () => {
    services
      .get(
        `${getPainScreening}?patientId=${patientid}&opdEncounterId=${opdEncounterId}`
      )
      .then((response) => {
        setDataa(response.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  // getting duriation data from API
  const getDuriation = () => {
    services
      .get(getConfigData + "Duration" + "/0")
      .then((response) => {
        const result = response.data.configData.map((item: any) => ({
          label: item.desc,
          value: item.code,
        }));
        setDuration(result);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // getting frequency data from API
  const getFrequencyData = async () => {
    try {
      const response = await services.get(snowmedData + "307438009");
      const result = response.data.map((item: any) => ({
        label: item.fullySpecifiedName,
        value: item.fullySpecifiedName,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));
      setFrequencyData(result);
    } catch (error) {
      console.error("Error while fetching data:", error);
    }
  };

  const handlePainType = (e: any) => {
    setPainType(e.target.value);
  };

  //Reset functionality
  const handleReset = () => {
    setPainScore("");
    setLocation("");
    setFrequency("");
    setCharacters("");
    setPsychological("");
    setNutritional("");
    setFunctional("");
    setSocioscreening("");
    setOtherscreening("");
    setDurationVal("Period");
    setkey(key + key);
    setPainType("No Pain");
  };
  // save functionality
  const handelSave = () => {
    if (!painScore) {
      toast.error("Please Add Pain Score");
    } else if (!location) {
      toast.error("Please Add Location");
    } else if (!days) {
      toast.error("Please Add Days");
    } else if (!durationVal) {
      toast.error("Please Add Duration");
    } else if (!frequency) {
      toast.error("Please Add Frequency");
    } else {
      const postObj = {
        patientId: patientid,
        opdEncounterId: opdEncounterId,
        statusFlag: 1,
        recordedBy: doctor,
        opAssessmentPainScreeningTbl: {
          painscore: painScore.value,
          location: location,
          duration: days + " " + durationVal,
          frequancy: frequency,
          characters: characters,
          psycologicalScreening: psychological,
          nutritionalScreening: nutritional,
          functionalScreening: functional,
          socioEconamicalScreening: socioscreening,
          otherScreening: otherscreening,
          statusFlag: 1,
        },
      };
      services
        .create(savePainscreening, postObj)
        .then((response) => {
          toast.success("Success");
          handleReset();
          getpainScreenData();
        })
        .catch((e) => {
          console.log(e.message);
          toast.error("Getting error, Please try again!");
        });
    }
  };
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "S.No",
      width: 30,
      renderCell: (params: any) => {
        const rowNumber =
          dataa.findIndex((row: any) => row.id === params.row.id) + 1;
        return <span>{rowNumber}</span>;
      },
    },
    { field: "painscore", headerName: "Pain Score", width: 100 },
    { field: "location", headerName: "Location", width: 100 },
    { field: "duration", headerName: "Duriation", width: 100 },
    { field: "frequancy", headerName: "Frequency", width: 200 },
    { field: "characters", headerName: "Characters", width: 150 },
    {
      field: "psycologicalScreening",
      headerName: "Psychological Screening",
      width: 100,
    },
    {
      field: "nutritionalScreening",
      headerName: "Nutritional Screening",
      width: 150,
    },
    {
      field: "functionalScreening",
      headerName: "Functional Screening",
      width: 150,
    },
    {
      field: "socioEconamicalScreening",
      headerName: "Socio-Economical Screening",
      width: 150,
    },
    { field: "otherScreening", headerName: "Other Screening", width: 150 },

    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params: any) => (
        <>
          {params.row.statusFlag === 0 ? (
            <InactiveIcon />
          ) : (
            <ActiveIcon
              className
              onClick={(e: any) =>
                setModaloc({ ...modaloc, open: true, row: params.row })
              }
            />
          )}
        </>
      ),
    },
  ];
  const onDelete = async () => {
    const id = modaloc.row.id;
    const deleteURL =
      deletePainScreening + patientid + "/" + opdEncounterId + "/" + id;

    try {
      services
        .create(deleteURL, modaloc.row)
        .then((response) => {
          setkey(key + key);
          getpainScreenData();
          setModaloc({
            ...modaloc,
            open: false,
          });
          toast.success("Successfully inactivated the record");
        })
        .catch((e) => {
          console.log(e.message);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // when click on check box for mark in Reason for visit class added
  const getRowClassName = (params: any) => {
    return params.row.statusFlag === 0 ? "disabled-row" : "";
  };
  useEffect(() => {
    getDuriation();
    getFrequencyData();
    getpainScreenData();
    const isValid =
      !!painScore &&
      !!location &&
      !!days &&
      !!durationVal &&
      !!frequency &&
      true;

    setIsFormValid(isValid);
  }, [painScore, location, days, durationVal, frequency]);

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
      <div className="textinputwrapp" key={key}>
        <div className="md:w-1/3 my-2">Pain Screening</div>
        <div className=" flex md:flex gap-3">
          <div className="md:w-1/2  mt-2">
            <div className="grid gap-3 md:grid-cols-1 xl:grid-cols-1">
              <div className="relative flex flex-row gap-x-3">
                <Radio
                  crossOrigin={undefined}
                  value="Pain"
                  name="updatedrugtype"
                  label="Pain"
                  checked={painType === "Pain"} // Set the checked state based on the current
                  onChange={handlePainType}
                />
                <Radio
                  crossOrigin={undefined}
                  value="No Pain"
                  name="updatedrugtype"
                  label="No Pain"
                  checked={painType === "No Pain"} // Set the checked state based on the current
                  onChange={handlePainType}
                />
              </div>
            </div>
          </div>
          <div className="md:w-1/2  mt-2">
            <img src={painscore} alt="Pain Score" className="h-20" />
          </div>
        </div>
        <div className=" flex md:flex gap-3">
          <div className="md:w-1/5  mt-2 relative">
            <ReactSelectBox
              optionListWidtsize={false}
              isSearchable={false}
              isMultiple={false}
              value={painScore}
              options={painScoreList}
              onChange={(e: any) => {
                setPainScore(e);
              }}
              label="Pain Score"
            />
          </div>
          <div className="md:w-2/5 mt-2">
            <div className="relative flex w-full">
              <Input
                crossOrigin
                type="number"
                label="Days"
                name="Days"
                watch={watch}
                className=" !rounded-[8px] !rounded-r-none "
                containerProps={{
                  className: "!min-w-0 rounded-lg  rounded-r-none",
                }}
                handleChange={(e: any) => setDays(e.target.value)}
              />

              <Menu placement="bottom-start">
                <MenuHandler>
                  <Button
                    ripple={false}
                    variant="text"
                    color="blue-gray"
                    className="flex h-10 w-[80px] items-center gap-2 rounded-l-none 
            border border-l-0 border-blue-gray-200
             bg-blue-gray-500/10 pl-3 capitalize text-sm font-normal"
                  >
                    {/* {countryCallingCode} */}
                    {durationVal}
                  </Button>
                </MenuHandler>
                <MenuList className="max-h-[20rem] max-w-[18rem]">
                  {duration.map((list: any, index: number) => {
                    return (
                      <MenuItem
                        key={index}
                        value={list.value}
                        className="flex items-center gap-2 capitalize"
                        onClick={() => {
                          setDurationVal(list.label);
                        }}
                      >
                        {list.label}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </div>
          </div>
          <div className="md:w-3/5 my-2">
            <Input
              crossOrigin
              type="text"
              label="Location"
              name="location"
              watch={watch}
              pattern="[a-zA-Z0-9]*"
              handleChange={(e: any) => setLocation(sanitizeInput(e.target.value))}
              className="!rounded-[8px]"
              containerProps={{
                className: "!min-w-0",
              }}

            />
            <div className="w-full">
              {location && !alphaNumWithFewSymbols.test(location) && (
                <div className="text-[11px] text-red-500">
                  Please do not enter special characters
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:flex gap-3">
          <div className="md:w-1/2 my-2 relative">
            <Input
              crossOrigin
              type="text"
              label="Frequency"
              name="frequency"
              pattern="[a-zA-Z0-9]*"
              watch={watch}
              handleChange={(e: any) => setFrequency(sanitizeInput(e.target.value))}
              className="!rounded-[8px]"
              containerProps={{
                className: "!min-w-0",
              }}
              value={frequency}
            />
            <div className="w-full">
              {frequency && !alphaNumWithFewSymbols.test(frequency) && (
                <div className="text-[11px] text-red-500">
                  Please do not enter special characters
                </div>
              )}
            </div>
          </div>
          <div className="md:w-1/2 mt-2">
            <Input
              crossOrigin
              type="text"
              label="Characters"
              name="Characters"
              watch={watch}
              handleChange={(e: any) => setCharacters(sanitizeInput(e.target.value))}
              className="!rounded-[8px]"
              value={characters}
            />
            <div className="w-full">
              {characters && !alphaNumWithFewSymbols.test(characters) && (
                <div className="text-[11px] text-red-500">
                  Please do not enter special characters
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:flex gap-3">
          <div className="md:w-1/2 mt-2">
            <Textarea
              minRows={2}
              label="Psychological Screening"
              name="psychological"
              value={psychological}
              onChange={(e: any) => setPsychological(sanitizeInput(e.target.value))}
            ></Textarea>
          </div>
          <div className="md:w-1/2 mt-2">
            <Textarea
              minRows={2}
              label="Nutritional Screening"
              name="nutritional"
              value={nutritional}
              onChange={(e: any) => setNutritional(sanitizeInput(e.target.value))}
            ></Textarea>
          </div>
        </div>
        <div className="flex md:flex gap-3">
          <div className="md:w-1/2 mt-2">
            <Textarea
              minRows={2}
              label="Functional Screening"
              name="functionalscreening"
              value={functional}
              onChange={(e: any) => setFunctional(sanitizeInput(e.target.value))}
            ></Textarea>
          </div>
          <div className="md:w-1/2 mt-2">
            <Textarea
              minRows={2}
              label="Socio-Economical Screening"
              name="socioscreening"
              value={socioscreening}
              onChange={(e: any) => setSocioscreening(sanitizeInput(e.target.value))}
            ></Textarea>
          </div>
        </div>
        <div className="flex md:flex gap-3">
          <div className="md:w-1/2 mt-2">
            <Textarea
              minRows={2}
              label="Other Screening"
              name="otherscreening"
              value={otherscreening}
              onChange={(e: any) => setOtherscreening(sanitizeInput(e.target.value))}
            ></Textarea>
          </div>
        </div>

        <div className=" flex items-center justify-end gap-x-6 ">
          <div className="md:w-1/4 gap-3 justify-end flex px-3 my-2">
            {props?.screenData?.Save === 1 &&
              <ActionButton
                buttonText="SAVE"
                handleSubmit={handelSave}
                width="py-3 w-full"
                disabled={!isFormValid}
              />
            }
            <ActionButton
              handleSubmit={handleReset}
              buttonText="RESET"
              width="w-full py-3 bg-red-500 hover:bg-red-600"
            // disabled={!isFormValid}
            />
          </div>
        </div>

        <div className="w-full py-4">
          <div className="border-t border-gray-300 w-full"></div>
        </div>

        <div className="w-full" key={key}>
          <DataGrid
            autoHeight
            rows={dataa}
            columns={columns}
            getRowId={(row) => row.id}
            pageSizeOptions={[10, 20]}
            getRowClassName={getRowClassName}
            className="mostly-customized-scrollbar"
          />
        </div>
        {/* {/ Dailog box /} */}

        <Dialog
          open={modaloc.open}
          handler={() => setModaloc({ ...modaloc, open: false })}
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
              className="mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={onDelete}
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
  );
}

export default roleInfoScreenData(PainScreening, "PS")
