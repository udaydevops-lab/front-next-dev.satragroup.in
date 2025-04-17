"use client";
import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import ActionButton from "@/app/_common/button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Textarea from "@/app/_common/text-area";
import services from "@/app/utilities/services";
import { getLocalItem } from "@/app/utilities/local";
import {
  getConfigData,
  getPFSH,
  inActivePFSH,
  savePfsh,
  snowmedData,
} from "../../../../../utilities/api-urls";
import axios from "axios";
import Select from "react-tailwindcss-select";
import Loader from "@/app/_common/loader";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { TrashIcon } from "@heroicons/react/24/solid";
import InactiveIcon from "../../../../../../../public/icons/wellness-record/inactive-icon";
import ActiveIcon from "../../../../../../../public/icons/wellness-record/active-icon";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function Pfsh(props: any) {
  const [modaloc, setModaloc] = useState<any>({
    open: false,
  });
  const headers = {
    serviceEntityId: getLocalItem("serviceEntityId"),
    locationId: getLocalItem("locationId"),
    "Access-Control-Allow-Origin": "*",
  };
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [hxType, setHxType] = useState<any>("");
  const [hxTypeFamily, setHxTypeFamily] = useState(false);
  const [hxtypeList, setHxTypeList] = useState<any>([]);
  const [description, setDescription] = useState<any>("");
  const [descriptionList, setDescriptionList] = useState([]);
  const [descriptionMain, setDescriptionMain] = useState<any>([]);
  const [relationship, setRelationship] = useState<any>("");
  const [relationshipList, setRelationshipList] = useState<any>([]);
  const [gender, setGender] = useState<any>("");
  const [genderList, setGenderList] = useState<any>([]);
  const [status, setStatus] = useState<any>("");
  const [statuslist, setStatusList] = useState<any>([]);
  const [Checkhxabsent, setCheckHxAbsent] = useState(false);
  const [hxabsentList, setHxAbsentList] = useState<any>([]);
  const [dataa, setDataa] = useState<any>([]);
  const [newdataa, setNewDataa] = useState<any>([]);
  const [snomedData, setSnomedData] = useState([]);
  const [conceptId, setConceptId] = useState("");
  const [comments, setComments] = useState("");
  const [hxabsent, setHxAbsent] = useState<any>("");
  const [hxAbsentCheck, setHxAbsentCheck] = useState(false);
  const [pushState, setPushState] = useState<any>(true);
  const [gridKey, setGridKey] = useState(33);
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

  const { patientid, opdEncounterId } = useParams();
  const columns: GridColDef[] = [
    {
      field: "sno",
      headerName: "S No",
      width: 50,
      renderCell: (params) => {
        const rowNumber = dataa.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    { field: "hxType", headerName: "HX Type", width: 200 },
    { field: "conditionDesc", headerName: "Condition", width: 320 },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "details",
      headerName: "Details",
      width: 150,
      renderCell: (params: any) =>
        params.row.hxType === " Family Member History" ? (
          <>
            <span className="me-1">{params.row.relationship}</span>
            {" /"}
            <span className="ms-1">{params.row.gender}</span>
          </>
        ) : null,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      renderCell: (params: any) => (
        <>
          {!params.row.opAssessmentPfshId ? (
            <>
              <button onClick={() => onRemove(dataa.indexOf(params.row))}>
                <TrashIcon className="text-red-500 w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              {params.row.isActive === 0 ? (
                <InactiveIcon />
              ) : (
                <ActiveIcon
                  className
                  onClick={(e: any) => {
                    setModaloc({ ...modaloc, open: true, id: params.row.id });
                  }}
                />
              )}
            </>
          )}
        </>
      ),
    },
  ];

  const getPFSHOldData = async () => {
    try {
      const response = await services.get(
        `${getPFSH}?patientId=${patientid}&opdEncounterId=${opdEncounterId}`
      );
      const newData = response.data.map((item: any) => {
        return { ...item, id: item.opAssessmentPfshId };
      });
      const uniqValue: any = newData.reduce((acc: any, crr: any) => {
        let obj = acc.find(
          (list: any) =>
            list.snomedData.fullySpecifiedName ===
            crr.snomedData.fullySpecifiedName
        );
        if (obj) {
          return acc;
        } else {
          return acc.concat([crr]);
        }
      }, []);

      setDataa(uniqValue);
    } catch (error) {
      console.log(error);
    }
  };
  // when click on check box for mark in Reason for visit class added
  const getRowClassName = (params: any) => {
    return params.row.isActive === 0 ? "disabled-row" : "";
  };

  const onRemove = (index: any) => {
    const newGridData = [...dataa];
    newGridData.splice(index, 1);
    setDataa(newGridData);
    setNewDataa(newGridData.filter((list: any) => !list.opAssessmentPfshId));
  };
  const onDelete = async () => {
    const id = modaloc.id;

    const updateObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      opAssessmentPfshId: id,
      isActive: 0,
      status: "Entered in Error",
    };

    try {
      services
        .create(inActivePFSH, updateObj)
        .then((response) => {
          getPFSHOldData();
          setGridKey(gridKey + gridKey);
          setModaloc({ ...modaloc, open: false });
          toast.success("Successfully inactivated the record");
        })
        .catch((e) => {
          console.log(e.message);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getRowId = (row: any) => row.id;

  const getPFSHData = async () => {
    try {
      const [
        HxType,
        HxAbsentReason,
        FamilyHistoryStatus,
        PatientRelationship,
        description,
        gender,
      ] = await Promise.all([
        services.get(getConfigData + "HxType" + "/0", headers),
        services.get(getConfigData + "HxAbsentReason" + "/0", headers),
        services.get(getConfigData + "FamilyHistoryStatus" + "/0", headers),
        services.get(getConfigData + "PatientRelationship" + "/0", headers),
        services.get(snowmedData + "404684003"),
        services.get(getConfigData + "Gender" + "/0", headers),
      ]);
      const HxTypeData = HxType.data.configData;
      const HxAbsentReasonData = HxAbsentReason.data.configData;
      const FamilyHistoryStatusData = FamilyHistoryStatus.data.configData;
      const PatientRelationshipData = PatientRelationship.data.configData;
      const descriptionData = description.data;
      const genderData = gender.data.configData;
      const GDresult = genderData.map((item: any) => ({
        value: item.code,
        label: item.desc,
      }));
      const PRresult = PatientRelationshipData.map((item: any) => ({
        value: item.code,
        label: item.display,
      }));
      const DLresult = descriptionData.map((item: any) => ({
        value: item.id,
        label: item.fullySpecifiedName,
        activeStatus: 1,
        definitionStatusId: item.definitionStatusId,
        effectiveTime: item.effectiveTime,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        moduleId: item.moduleId,
      }));

      setDescriptionList(DLresult);
      setHxTypeList(HxTypeData);
      setRelationshipList(PRresult);
      setStatusList(FamilyHistoryStatusData);
      setHxAbsentList(HxAbsentReasonData);
      setGenderList(GDresult);
      setLoading(false);
    } catch (error) {
      console.error("getApiData", error);
    }
  };
  console.log(descriptionList);
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    var result: any;
    const inputValue = e.target.value;

    if (inputValue.length >= 3) {
      setTimeout(() => {
        // const result = await axios.get(snowmedData + "404684003")
        result = descriptionList.filter((item: any) =>
          item.label.includes(inputValue)
        );
        setDescriptionMain(result);
      }, 1000);
    }
  };
  const handleChange = (e: any) => {
    setCheckHxAbsent(!Checkhxabsent);
    if (e.target.checked === true) {
      setHxAbsentCheck(true);
      const result: any = hxtypeList
        .map((item: any) => {
          if (item.id === 1001) {
            return;
          }
          return item;
        })
        .filter((item: any) => item);
      setHxTypeList(result);
    } else {
      setHxAbsentCheck(false);
      services
        .get(getConfigData + "HxType" + "/0", headers)
        .then((res) => setHxTypeList(res.data.configData));
    }
  };

  // add functionality
  const handleAdd = () => {
    if (!hxType) {
      toast.error("Please Add HxType.");
    } else if (!description) {
      toast.error("Please Add Description.");
    } else {
      let objData: any = {
        id: uuidv4(),
        conditionDesc: description.label,
        hxType: hxType.label,
        relationship: relationship.label,
        gender: gender.label,
        status: status.label,
        conceptId: conceptId,
        recordedBy: doctor,
        recordedtime: new Date().toISOString().replace("T", " ").split(".")[0],
        statusFlag: 1,
        isActive: 1,
        snomedData: snomedData,
        isPfshAbsent: Checkhxabsent ? 1 : 0,
        comments: comments,
        hxAbsent: hxabsent,
      };
      const examNew: any = [...newdataa, objData];

      const uniqValue: any = examNew.reduce((acc: any, crr: any) => {
        let obj = acc.find(
          (list: any) =>
            list.snomedData.fullySpecifiedName ===
            crr.snomedData.fullySpecifiedName
        );
        if (obj) {
          return acc;
        } else {
          return acc.concat([crr]);
        }
      }, []);

      setNewDataa(uniqValue);

      const finalMerge: any = [...dataa, objData].reduce(
        (acc: any, curr: any) => {
          let obj = acc.find(
            (list: any) =>
              list.snomedData.fullySpecifiedName ===
              curr.snomedData.fullySpecifiedName
          );
          if (obj) {
            toast.error("You have entered same values again, Please awair....");
            return acc;
          } else {
            return acc.concat([curr]);
          }
        },
        []
      );

      setDataa(finalMerge);

      setHxType("");
      setDescription("");
      setRelationship("");
      setGender("");
      setStatus("");
      setHxTypeFamily(false);
    }
  };

  // save function
  const handleSavePFSH = () => {
    var result = newdataa.map(function (obj: any) {
      return {
        hxType: hxType.label,
        relationship: relationship.label,
        gender: gender.label,
        status: status.label,
        conceptId: conceptId,
        statusFlag: 1,
        snomedData: snomedData,
      };
    });
    const postObj = {
      patientId: patientid,
      opdEncounterId: opdEncounterId,
      statusFlag: 1,
      recordedBy: doctor,
      isPfshAbsent: hxAbsentCheck === true ? 1 : 0,
      comments: comments,
      pfshAbsentReason: hxabsent.label,
      opAssessmentPfshSet: newdataa,
    };
    services
      .create(savePfsh, postObj, headers)
      .then((response) => {
        toast.success("success");
        getPFSHOldData();
        setNewDataa("");
        setGridKey(gridKey + gridKey);
      })
      .catch((e) => {
        toast.error("Getting error, Please try again!");
      });
  };

  const onPush = () => { };

  const handelHxType = (e: any) => {
    setHxType(e);
    if (e.id == 1001) {
      setHxTypeFamily(true);
    } else {
      setHxTypeFamily(false);
    }
  };
  var isHXFamily = dataa.find(
    (dataa: any) =>
      dataa.hxType.trim(" ") === "Family Member History" &&
      (dataa.isActive === 1 || dataa.isActive === null)
  );
  useEffect(() => {
    getPFSHData();
    getPFSHOldData();
  }, []);

  if (!props?.screenData || props?.screenData?.View !== 1) {
    return <NoScreenData />;
  }
  return (
    <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
      <div>
        {loading ? <Loader /> : ""}

        <div className="mb-4  gap-3 md:flex py-2">
          <div className="md:w-2/12 my-2 text-black">
            <ReactSelectBox
              value={hxType}
              options={hxtypeList}
              isSearchable={false}
              isMultiple={false}
              label="Hx Type"
              onChange={(e: any) => {
                handelHxType(e);
              }}
            />
          </div>
          <div className="md:w-3/12 my-2 ">
            <ReactSelectBox
              value={description}
              options={descriptionMain}
              onSearchInputChange={(e: any) => handleInputChange(e)}
              isSearchable={true}
              isMultiple={false}
              label="Conditional Description"
              onChange={(e: any) => {
                setDescription(e);
                setSnomedData(e);
                setConceptId(e.id);
              }}
              optionListWidtsize={true}
            />
          </div>
          {hxTypeFamily ? (
            <>
              <div className="md:w-2/12 my-2">
                <ReactSelectBox
                  value={relationship}
                  options={relationshipList}
                  isSearchable={false}
                  isMultiple={false}
                  label="Relationship"
                  onChange={(e: any) => {
                    setRelationship(e);
                  }}
                />
              </div>

              <div className="md:w-2/12 my-2 ">
                <ReactSelectBox
                  isSearchable={false}
                  isMultiple={false}
                  value={gender}
                  options={genderList}
                  onChange={(e: any) => {
                    setGender(e);
                  }}
                  label="Gender"
                />
              </div>
            </>
          ) : null}
          <div className="md:w-2/12 my-2">
            <ReactSelectBox
              isSearchable={false}
              isMultiple={false}
              value={status}
              options={statuslist}
              onChange={(e: any) => {
                setStatus(e);
              }}
              label="Status"
            />
          </div>

          <div className="md:w-1/12 my-2">
            <ActionButton
              buttonText="ADD"
              handleSubmit={handleAdd}
              width="w-full py-3"
            />
          </div>
        </div>

        <div
          key={gridKey}
          className="px-4  bg-white rounded-curve md:pt-3 pb-3 rounded-curve w-full border border-stroke"
        >
          <DataGrid
            rows={dataa}
            columns={columns}
            getRowId={getRowId}
            pageSizeOptions={[10, 20]}
            getRowClassName={getRowClassName}
            className="px-0"
          />
        </div>

        <div className="mb-3 md:flex py-2 gap-3 justify-between items-start">
          {isHXFamily === undefined ? (
            <>
              <Checkbox
                crossOrigin
                label="Family History Absent"
                onChange={handleChange}
                checked={Checkhxabsent}
              />

              {Checkhxabsent ? (
                <>
                  <div className="md:w-1/4  my-2 ">
                    <ReactSelectBox
                      isSearchable={false}
                      isMultiple={false}
                      value={hxabsent}
                      options={hxabsentList}
                      onChange={(e: any) => {
                        setHxAbsent(e);
                      }}
                      label="Family Hx Absent Reason"
                    />
                  </div>
                  <div className="md:w-2/4  my-2">
                    <Textarea
                      minRows={3}
                      value={comments}
                      label="Comments"
                      name="comments"
                      onChange={(e: any) => {
                        setComments(sanitizeInput(e.target.value));
                      }}
                    ></Textarea>
                  </div>
                </>
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="w-full pt-4 pb-4 text-right flex justify-end gap-4">
          <div>
            {props?.screenData?.Save === 1 &&
              <ActionButton
                buttonText="SAVE"
                handleSubmit={handleSavePFSH}
                width="w-[120px] py-3"
                disabled={newdataa.length > 0 || hxAbsentCheck ? false : true}
              />
            }
          </div>
          <div title="ABDM context push">
            <ActionButton
              buttonText="Push"
              handleSubmit={onPush}
              disabled={pushState}
              width="w-[120px] py-3"
            />
          </div>
        </div>

        {/*  Dailog box  */}

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


export default roleInfoScreenData(Pfsh, "PFHS")