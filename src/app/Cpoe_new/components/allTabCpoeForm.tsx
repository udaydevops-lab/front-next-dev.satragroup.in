"use client";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import FormPropsTextFields from "@/app/_common/input";
import services from "@/app/utilities/services";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getAllCpeoMasterRecord,
  getProcudersCpoeData,
  newupdateCPOE,
} from "@/app/utilities/api-urls";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithFewSymbols } from "@/app/utilities/validations";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";

const AllTabCpoeForm = (props: any) => {
  const [fields, setFields] = useState<any>({
    snomedsrch: {},
    requestdate: "",
    conceptId: "",
    prty: {},
    loader: false
  });
  const [loader, setLoader] = useState<any>(false)
  const [selectFields, setSelectFields] = useState<any>([]);

  const handleDiagnosisSearch = (data: any) => {
    console.log('data', data)
    setFields({
      ...fields,
      snomedsrch: data,
      conceptId: sanitizeInput(data.serviceCode),
      department: sanitizeInput(data.departmentDesc),
      specialty: sanitizeInput(data.superSpecialityDesc),
      modality:
        props.tabType === "Radiology"
          ? sanitizeInput(data?.superSpecialityDesc)
          : null,
      records: data,
    });
  };

  const onselectPrority = (data: any) => {
    setFields({ ...fields, prty: data });
  };

  const onselectResonforTesting = (data: any) => {
    setFields({ ...fields, reasonForTesting: data });
  };

  const fieldOnchange = (e: any) => {
    setFields({ ...fields, [e.target.name]: sanitizeInput(e.target.value) });
  };

  // add the Cpoe records on the grid table
  const addLibararyData = () => {
    if (fields.snomedsrch.label === "Service Items Search") {
      toast.error("Please don't blank service items search field...");
    } else if (fields.prty.label === "Select Priority") {
      toast.error("Please don't blank select priority field...");
    } else {
      let postObj: any = {
        cpoeType: props.tabType,
        servicePrice: fields?.records?.basePrice?.toString(),
        serviceDesc: fields?.records?.serviceDesc,
        serviceCode: fields?.records?.serviceCode,
        departmentDesc: fields.department,
        superSpecialityDes: fields.specialty,
        specimen: fields.specimen,
        modality: fields.modality,
        priority: fields.prty?.label,
        requestdate:
          fields.requestdate !== null
            ? fields.requestdate
            : moment().format("YYYY-MM-DD"),
        status: "New Order",
        comments: fields.comments,
        reasonForTesting:
          fields?.reasonForTesting?.label === "Reason For Testing"
            ? ""
            : fields.reasonForTesting?.label,
        statusFlag: 1,
        snomedCode: fields?.records?.masterTerminologyDto[0]?.terminologyCode,
        snomedDescription:
          fields?.records?.masterTerminologyDto[0]?.terminologyDesc,
        serviceType: fields?.records?.serviceType,
        serviceTypeDesc: fields?.records?.serviceTypeDesc,
        orderFrom: "CPOE",
        opdEncounterSerId: null,
      };


      let getStoreData: any = [...props.getAddAllCpoe, postObj]
        .reduce((acc: any, ccmpl: any) => {
          let obj = acc.find(
            (c: any) =>
              c.serviceDesc === ccmpl.serviceDesc
          );
          if (obj) {
            toast.error("You have enter same service...");
            return acc;
          } else {
            return acc.concat([ccmpl]);
          }
        }, [])


      // for save records filter here
      let forSaveRecords: any = getStoreData.filter((list: any) => list.opdEncounterSerId === null);

      // this is save record
      props.setStore(forSaveRecords);

      props.setGetAddAllCpoe(
        getStoreData
          // .reduce((acc: any, ccmpl: any) => {
          //   let obj = acc.find(
          //     (c: any) =>
          //       c.serviceDesc === ccmpl.serviceDesc &&
          //       c.reasonForTesting === ccmpl.reasonForTesting &&
          //       c.comments === ccmpl.comments
          //   );
          //   if (obj) {
          //     toast.error("You have enter same value again. please wait");
          //     return acc;
          //   } else {
          //     return acc.concat([ccmpl]);
          //   }
          // }, [])
          .map((list: any, index: any) => {
            return {
              ...list,
              id: index + 1,
            };
          })
      );

      props.setSendEditRecord((prev: any) => {
        return {
          ...prev,
          serviceCode: "",
          serviceDesc: "Service Items Search",
          departmentDesc: "",
          superSpecialityDes: "",
          specimen: "",
          modality: "",
          priority: "Select Priority",
          requestdate: moment().format("YYYY-MM-DD"),
          status: "",
          comments: "",
          reasonForTesting: "Reason For Testing",
          statusFlag: "",
          id: "",
          opAssementCpoeId: "",
          opdEncounterSerId: "",
        };
      });
    }
  };

  // update the Cpoe records
  const UpDateLibararyData = () => {
    setLoader(true)
    let getobj = props.getAddAllCpoe.map((list: any) => {
      if (list.opdEncounterSerId === props.sendDataRecord.opdEncounterSerId) {
        return {
          ...list,
          cpoeType: props.tabType,
          servicePrice: fields?.records?.basePrice?.toString(),
          serviceDesc: fields.snomedsrch.label,
          serviceCode: fields.snomedsrch.value,
          departmentDesc: fields.department,
          superSpecialityDes: fields.specialty,
          specimen: fields.specimen,
          modality: fields.modality,
          priority: fields.prty?.label,
          requestdate:
            fields.requestdate !== null
              ? fields.requestdate
              : moment().format("YYYY-MM-DD"),
          // opAssementCpoeId: null,
          status: "New Order",
          comments: fields.comments,
          reasonForTesting:
            fields?.reasonForTesting?.label === "Reason For Testing"
              ? ""
              : fields.reasonForTesting?.label,
          statusFlag: 1,
          snomedCode: fields?.records?.masterTerminologyDto[0]?.terminologyCode,
          snomedDescription:
            fields?.records?.masterTerminologyDto[0]?.terminologyDesc,
          serviceType: fields?.records?.serviceType,
          serviceTypeDesc: fields?.records?.serviceTypeDesc,
          orderFrom: "CPOE",
          opdEncounterSerId: list.opdEncounterSerId,
        };
      }
      return list;
    });

    services.create(newupdateCPOE, getobj)
      .then((res: any) => {

        setTimeout(() => {
          setLoader(false)
          toast.success(`Successfully updated in ${props.tabType} record...`);
          props.getCpoeData();
          setFields({
            conceptId: "",
            department: '',
            specialty: '',
            specimen: '',
            modality: '',
            snomedsrch: {
              label: "Service Items Search",
            },
            prty: {
              label: "Select Priority",
            },
            requestdate: moment().format("YYYY-MM-DD"),
            comments: "",
            reasonForTesting: {
              label: "Reason For Testing",
            },
            opAssementCpoeId: "",
            opdEncounterSerId: "",
          });
          props.setSendEditRecord((prev: any) => {
            return {
              ...prev,
              serviceCode: "",
              serviceDesc: "Service Items Search",
              departmentDesc: "",
              superSpecialityDes: "",
              specimen: "",
              modality: "",
              priority: "Select Priority",
              requestdate: moment().format("YYYY-MM-DD"),
              status: "",
              comments: "",
              reasonForTesting: "Reason For Testing",
              statusFlag: "",
              id: "",
              opAssementCpoeId: "",
              opdEncounterSerId: "",
            };
          });
        }, 2000);

      })
      .catch((err: any) => {
        setTimeout(() => {
          setLoader(false)
        }, 2000);
      });
  };

  // get All saved service master details By CPOE TYPE
  const getAllMasterRecords = () => {
    let getPath = `${props.tabType === "Procedures"
      ? getProcudersCpoeData
      : getAllCpeoMasterRecord
      }`;
    services
      .get(getPath + props.tabType)
      .then((res) => {
        let getFinalRecord = res.data.map((list: any) => {
          return {
            ...list,
            label: list.serviceDesc,
            value: list.serviceCode,
          };
        });
        setSelectFields(getFinalRecord);
      })
      .catch((err) => console.log(err));
  };

  const ClearLibraryData = () => {
    setFields({
      conceptId: "",
      department: '',
      specialty: '',
      specimen: '',
      modality: '',
      snomedsrch: {
        label: "Service Items Search",
      },
      prty: {
        label: "Select Priority",
      },
      requestdate: moment().format("YYYY-MM-DD"),
      comments: "",
      reasonForTesting: {
        label: "Reason For Testing",
      },
      opAssementCpoeId: "",
      opdEncounterSerId: "",
    });


    props.setSendEditRecord((prev: any) => {
      return {
        ...prev,
        id: "",
        opAssementCpoeId: "",
        opdEncounterSerId: "",
        modality: '',
        serviceDesc: "Service Items Search",
        priority: "Select Priority",
        serviceCode: '',
        departmentDesc: '',
        specimen: '',
        cpoeType: '',
        reasonForTesting: "Reason For Testing",
        comments: '',
        requestdate: moment().format("YYYY-MM-DD"),
        superSpecialityDes: ''
      };
    });
  };

  useEffect(() => {
    setFields({
      opdEncounterSerId:
        props.sendDataRecord && props.sendDataRecord.opdEncounterSerId,
      id: props.sendDataRecord && props.sendDataRecord.id,
      cpoeType: props.sendDataRecord && props.sendDataRecord.cpoeType,
      conceptId: props.sendDataRecord && props.sendDataRecord.serviceCode,
      department: props.sendDataRecord && props.sendDataRecord.departmentDesc,
      specialty:
        props.sendDataRecord && props.sendDataRecord.superSpecialityDes,
      specimen: props.sendDataRecord && props.sendDataRecord.specimen,
      modality: props.sendDataRecord && props.sendDataRecord.modality,
      snomedsrch: {
        label: props.sendDataRecord
          ? props.sendDataRecord.serviceDesc
          : "Service Items Search",
        value: props.sendDataRecord
          ? props.sendDataRecord.serviceCode
          : "Service Items Search",
      },
      prty: {
        label: props.sendDataRecord
          ? props.sendDataRecord.priority
          : "Select Priority",
        value: props.sendDataRecord
          ? props.sendDataRecord.priority
          : "Select Priority",
      },
      requestdate: props.sendDataRecord
        ? props.sendDataRecord?.requestdate
        : null,
      comments: props.sendDataRecord && props.sendDataRecord.comments,
      reasonForTesting: {
        value: props.sendDataRecord && props.sendDataRecord.reasonForTesting
          ? props.sendDataRecord.reasonForTesting
          : "Reason For Testing",
        label: props.sendDataRecord && props.sendDataRecord.reasonForTesting
          ? props.sendDataRecord.reasonForTesting
          : "Reason For Testing",
      },
    });

    getAllMasterRecords();
  }, [props.sendDataRecord, props.tabType]);


  console.log('fields', fields)
  return (
    <>
      <div className="w-1/4">
        <div className="mb-3 my-select relative">
          <ReactSelectBox
            value={fields.snomedsrch}
            options={selectFields}
            onChange={handleDiagnosisSearch}
            label="Service Items Search"
            isSearchable={true}
            isMultiple={false}
          />
        </div>
        <div className="mb-3">
          <FormPropsTextFields
            label="Snomed Code"
            name="conceptId"
            value={fields.conceptId}
            handleChange={(e: any) =>
              setFields({
                ...fields,
                [e.target.name]: sanitizeInput(e.target.value),
              })
            }
          // className="pointer-events-none !bg-[#eceff1]"
          />
        </div>
        <div className="mb-3">
          <FormPropsTextFields
            label="Department"
            name="department"
            value={fields.department}
            handleChange={(e: any) =>
              setFields({
                ...fields,
                [e.target.name]: sanitizeInput(e.target.value),
              })
            }
          // className="pointer-events-none !bg-[#eceff1]"
          />
        </div>
        <div className="mb-3">
          <FormPropsTextFields
            label="Speciality"
            name="specialty"
            value={fields.specialty}
            handleChange={(e: any) =>
              setFields({
                ...fields,
                [e.target.name]: sanitizeInput(e.target.value),
              })
            }
          // className="pointer-events-none !bg-[#eceff1]"
          />
        </div>
        {props.tabType === "Laboratory" ? (
          <></>
        ) : props.tabType === "Radiology" ? (
          <>
            <div className="mb-3">
              <FormPropsTextFields
                label="Modality"
                name="modality"
                value={fields.modality}
                handleChange={(e: any) =>
                  setFields({
                    ...fields,
                    [e.target.name]: sanitizeInput(e.target.value),
                  })
                }
              // className="pointer-events-none !bg-[#eceff1]"
              />
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="mb-3 my-select relative">
          <ReactSelectBox
            value={fields.prty}
            options={props.serviceItmes}
            onChange={onselectPrority}
            label="Select Priority"
            isSearchable={false}
            isMultiple={false}
          />
        </div>

        <div className="mb-3">
          <DateInput
            disableFuture={true}
            label="Request Date"
            value={
              fields.requestdate === null
                ? moment()
                : moment(fields.requestdate)
            }
            // value={moment(fields.requestdate !== null ? fields.requestdate : fields.requestdate)}
            onChange={(e: any) =>
              setFields((prevState: any) => ({
                ...prevState,
                requestdate: moment(e).format("YYYY-MM-DD"),
              }))
            }
          />
        </div>

        <div className="mb-3 my-select relative">
          <ReactSelectBox
            value={fields.reasonForTesting}
            options={props.selectresonForTest}
            onChange={onselectResonforTesting}
            label="Reason For Testing"
            isSearchable={true}
            isMultiple={false}
          />
        </div>

        <div className="mb-3">
          <FormPropsTextFields
            label={`Comments For ${props.tabType}`}
            name="comments"
            value={fields.comments}
            handleChange={fieldOnchange}
          />
          <div className="w-full">
            {fields.comments &&
              !alphaNumWithFewSymbols.test(fields.comments) && (
                <div className="text-[11px] text-red-500">
                  Please do not enter special characters
                </div>
              )}
          </div>
        </div>
        <div className="mb-3 flex justify-end gap-x-3">

          {/* fields.snomedsrch */}
          <ActionButton
            buttonText={
              loader ?
                <div className='w-full flex justify-center items-center'>
                  <div className='innerBtnloader'></div>
                </div> :
                fields.opdEncounterSerId ? "Update" : "Add"
            }
            handleSubmit={fields.opdEncounterSerId ? UpDateLibararyData : addLibararyData}
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            disabled={fields.snomedsrch.label !== "Service Items Search" ? false : true}
          />
          {/* {fields.opdEncounterSerId ? (
            <>
              <ActionButton
                buttonText="Update"
                handleSubmit={UpDateLibararyData}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

              />
            </>
          ) : (
            <>
              <ActionButton
                buttonText="Add"
                handleSubmit={addLibararyData}
                width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

              />
            </>
          )} */}

          <ActionButton
            handleSubmit={ClearLibraryData}
            buttonText="Reset"
            width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"

          />
        </div>
      </div>
    </>
  );
};

export default AllTabCpoeForm;
