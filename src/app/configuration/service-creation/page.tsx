"use client";
import {
  getConfigData,
  getAllDepartments,
  getSpecialitiesByDepartment,
  snowmedChiefcomplaint,
  serviceCreation,
  snomedLoincSearch,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";
import React, { useEffect, useState } from "react";
import Input from "@/app/_common/input";
import { useForm } from "react-hook-form";
import CheckboxMui from "@/app/check-box";
import ActionButton from "../../_common/button";
import { GridColDef } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import ActiveIcon from "../../../../public/icons/wellness-record/active-icon";
import InactiveIcon from "../../../../public/icons/wellness-record/inactive-icon";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { alphaNumWithHyphenspacedash } from "@/app/utilities/validations";
import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";

export default function ServiceCreation(props: any) {
  const { handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [serviceTypeDD, setServiceTypeDD] = useState<any>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<any>({
    label: "Service Type *",
  });
  const [diagnosticTypeDD, setDiagnosticTypeDD] = useState<any>([]);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<any>({
    label: "Diagnostic Type *",
  });
  const [selSerDesc, setSelSerDesc] = useState("");
  const [selCode, setSelCode] = useState("");
  const [departmentsDD, setDepartmentsDD] = useState<any>([]);
  const [selectedDept, setSelectedDept] = useState<any>({
    label: "Department *",
  });
  const [specialityDD, setSpecialityDD] = useState<any>([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState<any>({
    label: "Speciality *",
  });
  const [isChargeable, setIsChargeable] = useState(false);
  const [isDiscountable, setIsDiscountable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [basePriceVal, setBasePriceVal] = useState<any>("");
  const [terminologyData, setTerminologyData] = useState<any>([]);
  const [billHeadDD, setBillHeadDD] = useState<any>([]);
  const [selectedBillHead, setSelectedBillHead] = useState<any>({
    label: "Bill Head *",
  });
  const [testTypeDD, setTestTypeDD] = useState<any>([]);
  const [selectedTestType, setSelectedTestType] = useState<any>({
    label: "TestType (Test / Profile)",
  });
  const [modalityTypeDD, setModalityTypeDD] = useState<any>([]);
  const [selectedModality, setSelectedModality] = useState<any>({
    label: "Modality *",
  });
  const [descriptionDD, setDescriptionDD] = useState<any>([]);
  const [selectedDesc, setSelectedDesc] = useState<any>({
    label: "Terminology Description",
  });
  const [terminologyTypeDD, setTerminologyTypeDD] = useState<any>([]);
  const [selectedTerminology, setSelectedTerminology] = useState<any>({
    label: "Terminology Type",
  });
  const [semantic, setSemantic] = useState<string[]>([
    "procedure",
    "record artifact",
  ]);
  const [specimen, setSpecimen] = useState<any>("");
  const [container, setContainer] = useState<any>("");
  const specimenList: any = [
    {
      value: "SP001",
      label: "Blood",
    },
    {
      value: "SP002",
      label: "Urine",
    },
    {
      value: "SP003",
      label: "Saliva",
    },
    {
      value: "SP004",
      label: "Sweat",
    },
  ];
  const containerList: any = [
    { value: "CN001", label: "Purple tube" },
    { value: "CN002", label: "Yellow Tube" },
    { value: "CN003", label: "Red Tube" },
  ];
  const [isCultureSensitive,setIsCultureSensitive]=useState<boolean>(false)
  const handleDepartment = (e: any) => {
    setSelectedDept(e);
    services
      .get(getSpecialitiesByDepartment + e.departmentId)
      .then((response) => {
        setLoading(false);
        const transformedData = response.data.map((item: any) => ({
          ...item,
          value: item.specialityCode,
          label: item.specialityDescription,
        }));
        setSpecialityDD(transformedData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  const handleIsChargeable = () => {
    setIsChargeable(!isChargeable);
  };

  const handleIsDiscountable = () => {
    setIsDiscountable(!isDiscountable);
  };
const handleCultureSensitive=()=>{
  setIsCultureSensitive(!isCultureSensitive)
}
  const handleIsActive = () => {
    setIsActive(!isActive);
  };

  const onsubmit = (data: any) => {
    let postObj = {
      serviceId: props.serviceDetails ? props.serviceDetails.serviceId : "",
      serviceCode: selCode,
      serviceDesc: selSerDesc,
      serviceType: selectedServiceType.value,
      serviceTypeDesc: selectedServiceType.label,
      department: selectedDept.value,
      departmentDesc: selectedDept.label,
      superSpeciality: selectedSpeciality.value,
      superSpecialityDesc: selectedSpeciality.label,
      diagnosticType: selectedDiagnostic.value,
      diagnosticTypeDesc: selectedDiagnostic.label,
      billHeads: selectedBillHead.value,
      billHeadsDesc: selectedBillHead.label,
      isChargeble: isChargeable ? 1 : 0,
      isDiscountable: isDiscountable ? 1 : 0,
      hsnCode: "",
      hsnGroup: "",
      statusFlag: 1,
      basePrice: basePriceVal,
      sampleCllectionRequired: "",
      outsourceSample: "",
      sensativeResult: "",
      serviceEntityId: "",
      specimen:specimen.label,
      specimenCode: specimen.value,
      containerCode: container.value,
      containerName: container.label,
      isActive: isActive ? 1 : 0,
      isCultureSensitive:isCultureSensitive?1:0,
      masterTermTbl: terminologyData.length > 0 ? terminologyData : null,
    };
    services
      .create(serviceCreation, postObj)
      .then((response: any) => {
        setLoading(false);
        if (props.serviceDetails.serviceId)
          toast.success("Updated successfully!!");
        else toast.success("Created successfully!!");
        props.handleData();
      })
      .catch((err: any) => {
        toast.error("Unsuccessful!!");
        setLoading(false);
        console.log(err.message);
      });
  };

  const fetchGetApisData = () => {
    services
      .get(getConfigData + "MasterServiceType" + "/0")
      .then((response) => {
        setLoading(false);
        const transformedData = response.data.configData.map((item: any) => ({
          ...item,
          value: item.code,
          label: item.desc,
        }));
        setServiceTypeDD(transformedData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getConfigData + "DiagnosticReportType" + "/0")
      .then((response) => {
        setLoading(false);
        setDiagnosticTypeDD(response.data.configData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getConfigData + "MasterBillHeads" + "/0")
      .then((response) => {
        setLoading(false);
        setBillHeadDD(response.data.configData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getConfigData + "MasterTestType" + "/0")
      .then((response) => {

        setLoading(false);
        setTestTypeDD(response.data.configData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getConfigData + "MasterModalityType" + "/0")
      .then((response) => {
        setLoading(false);
        setModalityTypeDD(response.data.configData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getConfigData + "TerminologyType" + "/0")
      .then((response) => {
        console.log(response)
        setLoading(false);
        setTerminologyTypeDD(response.data.configData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });

    services
      .get(getAllDepartments)
      .then((response) => {
        setLoading(false);
        const transformedData = response.data.map((item: any) => ({
          ...item,
          value: item.departmentCode,
          label: item.departmentDescription,
        }));
        setDepartmentsDD(transformedData);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.message);
      });
  };

  const handleDescription = async (e: any) => {
    const searchString = e.target.value;
    if (selectedTerminology.value == "TT1001") {
      if (searchString.length > 0) {
        const response = await services.get(
          snowmedChiefcomplaint +
            `term=${searchString}&state=active&semantictag=${semantic.join(
              "++"
            )}&acceptability=synonyms&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
        );
        const transformedData = response.data.map((item: any) => ({
          ...item,
          value: item.conceptId,
          label: item.conceptFsn,
        }));
        setDescriptionDD(transformedData);
      }
    }
    // else if (selectedTerminology.value == "TT1002") {
    //   if (searchString.length > 0) {
    //     services
    //       .get(
    //         `${snomedLoincSearch}class=ALL&classType=ALL&component=ALL&exampleUnits=ALL&limit=1000&method=ALL&panelType=ALL&property=ALL&scale=ALL&sortByRank=false&status=ACTIVE&system=ALL&term=${searchString}&timing=ALL`
    //       )
    //       .then((res) => {
    //         const transformedData = res.data.map((item: any) => {
    //           return {
    //             ...item,
    //             value: item.DisplayName,
    //             label: item.ShortName,
    //             terminologyDesc: item.LONG_COMMON_NAME,
    //             terminologyCode: item.LOINC_NUMBER,
    //           };
    //         });
    //         setDescriptionDD(transformedData);
    //       })
    //       .catch((err) => console.log(err));
    //   }
    // }
    else {
      setDescriptionDD([]);
    }
  };

  const columns: GridColDef[] = [
    { field: "terminologyTypeDesc", headerName: "Terminology", width: 120 },
    { field: "terminologyCode", headerName: "Code", width: 120 },
    { field: "terminologyDesc", headerName: "Description", width: 420 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params: any) => {
        const isTerminologyActive = params.row.isTerminologyActive;
        const handleStatusClick = () => {
          const updatedData = terminologyData.map((row: any) => {
            if (row.terminologyCode === params.row.terminologyCode) {
              return {
                ...row,
                isTerminologyActive: isTerminologyActive === 1 ? 0 : 1,
              };
            }
            return row;
          });
          setTerminologyData(updatedData);
        };
        return (
          <div onClick={handleStatusClick}>
            {isTerminologyActive === 1 ? (
              <div title="Active" className="cursor-pointer">
                <ActiveIcon />
              </div>
            ) : (
              <div title="Inactive" className="cursor-pointer">
                <InactiveIcon />
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const handleTerminologyData = () => {
    let newObj = {
      terminologyType: selectedTerminology.value,
      terminologyTypeDesc: selectedTerminology.label,
      terminologyCode: selectedDesc.conceptId ? selectedDesc.conceptId : selectedDesc.terminologyCode,
      terminologyDesc: selectedDesc.conceptFsn ? selectedDesc.conceptFsn : selectedDesc.terminologyDesc,
      isTerminologyActive: 1,
    };
    setTerminologyData((prevData: any) => [...prevData, newObj]);
    setSelectedTerminology({
      label: "Terminology Type"
    });

    // setSelectedDesc({
    //   label: 'Description'
    // });
    setDescriptionDD([])
    setSelectedDesc({
      label: "Terminology Description"
    })
  };

  const handleSelectionChange = (newSelection: any) => {};

  useEffect(() => {
    if (props.serviceDetails?.serviceId) {
      let data = props.serviceDetails;
      setSelSerDesc(data?.serviceDesc);
      setSelCode(data?.serviceCode);
      setBasePriceVal(data?.basePrice);
      setIsChargeable(data?.isChargeble === 1 ? true : false);
      setIsDiscountable(data?.isDiscountable === 1 ? true : false);
      setTerminologyData(data?.masterTerminologyDto);
      setSelectedServiceType({
        ...selectedServiceType,
        value: data?.serviceType,
        label: data?.serviceTypeDesc,
      });
      setSelectedDept({
        ...selectedDept,
        value: data?.department,
        label: data?.departmentDesc,
      });
      setSelectedSpeciality({
        ...selectedSpeciality,
        value: data?.superSpeciality,
        label: data?.superSpecialityDesc,
      });
      setSelectedDiagnostic({
        ...selectedDiagnostic,
        value: data?.diagnosticType,
        label: data?.diagnosticTypeDesc,
      });
      setSelectedBillHead({
        ...selectedBillHead,
        value: data?.billHeads,
        label: data?.billHeadsDesc,
      });
    }
    fetchGetApisData();
  }, [props.serviceDetails]);

  return (
    <div>
      <div className="px-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        {/* <div className="font-bold mb-4 w-full ">
          <h1 className="w-full">Service Creation</h1>
        </div> */}
        <div className="w-full">
          <div className="relative flex gap-4 mb-3">
            <div className="w-full">
              <ReactSelectBox
                value={selectedServiceType}
                options={serviceTypeDD}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSelectedServiceType(e);
                }}
                label="Service Type *"
              />
            </div>
            <div className="w-full">
              <Input
                type="text"
                label="Service Description"
                name="serviceDescription"
                watch={watch}
                handleChange={(e: any) => {
                  setSelSerDesc(e.target.value);
                }}
                value={selSerDesc}
              />
              {selSerDesc && !alphaNumWithHyphenspacedash.test(selSerDesc) && (
                <div className="absolute text-xs mt-1 ml-1 text-red-500">
                  Please do not enter special characters !
                </div>
              )}
            </div>
            <div className="w-full">
              <Input
                type="text"
                label="Code"
                name="code"
                watch={watch}
                handleChange={(e: any) => {
                  setSelCode(e.target.value);
                }}
                value={selCode}
              />
              {selCode && !alphaNumWithHyphenspacedash.test(selCode) && (
                <div className="absolute text-xs mt-1 ml-1 text-red-500">
                  Please do not enter special characters !
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-2 mb-3">
          <div className="relative flex gap-4 p-2  px-0">
            <div className="w-full">
              <ReactSelectBox
                value={selectedDept}
                options={departmentsDD}
                isSearchable={false}
                isMultiple={false}
                onChange={handleDepartment}
                label="Department *"
              />
            </div>
            <div className="w-full">
              <ReactSelectBox
                value={selectedSpeciality}
                options={specialityDD}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSelectedSpeciality(e);
                }}
                label="Speciality *"
              />
            </div>
            <div className="w-full">
              <ReactSelectBox
                value={selectedBillHead}
                options={billHeadDD}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSelectedBillHead(e);
                }}
                label="Bill Head *"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-2 mt-2">
          <div className="relative flex gap-4  px-0">
            <div className="w-full">
              <ReactSelectBox
                value={selectedDiagnostic}
                options={diagnosticTypeDD}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSelectedDiagnostic(e);
                }}
                label="Diagnostic Type *"
              />
            </div>

            {selectedDept.value=="D014"?
            <>
            <div className="w-full">
              <ReactSelectBox
                value={specimen}
                options={specimenList}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setSpecimen(e);
                }}
                label="Specimen"
              />
            </div>
            <div className="w-full">
              <ReactSelectBox
                value={container}
                options={containerList}
                isSearchable={false}
                isMultiple={false}
                onChange={(e: any) => {
                  setContainer(e);
                }}
                label="Container"
              />
            </div>
            </>:null}
            {selectedServiceType.value === "ST1002" &&
            selectedDept.value === "D014" ? (
              <div className="w-full">
                <ReactSelectBox
                  value={selectedTestType}
                  options={testTypeDD}
                  isSearchable={false}
                  isMultiple={false}
                  onChange={(e: any) => {
                    setSelectedTestType(e);
                  }}
                  label="TestType (Test / Profile)"
                />
              </div>
            ) : (
              ""
            )}
            {selectedServiceType.value === "ST1002" &&
            selectedDept.value === "D015" ? (
              <div className="w-full">
                <ReactSelectBox
                  value={selectedModality}
                  options={modalityTypeDD}
                  isSearchable={false}
                  isMultiple={false}
                  onChange={(e: any) => {
                    setSelectedModality(e);
                  }}
                  label="Modality *"
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="grid gap-y-2 gap-x-2">
          <div className="relative flex gap-4 p-2 px-0">
            <div className="w-full flex">
              <CheckboxMui
                label="Is Chargeable"
                handleChange={handleIsChargeable}
                checked={isChargeable}
                className="inline-flex"
              />
            </div>
            <div className="w-full flex">
              <CheckboxMui
                label="Is Discountable"
                handleChange={handleIsDiscountable}
                checked={isDiscountable}
              />
            </div>
            {selectedDept.value=="D014"?
            <div className="w-full flex">
              <CheckboxMui
                label="Is Culture sensitive"
                handleChange={handleCultureSensitive}
                checked={isCultureSensitive}
              />
            </div>:null}
            <div className="w-full">
              <Input
                type="number"
                label="Base Price *"
                name="basePrice"
                watch={watch}
                handleChange={(e: any) => {
                  setBasePriceVal(e.target.value);
                }}
                value={basePriceVal}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full rounded-[20px] border border-gray-300 p-3">
            <div className="relative flex gap-4  px-0">
              <div className="w-1/5">
                <ReactSelectBox
                  value={selectedTerminology}
                  options={terminologyTypeDD}
                  isSearchable={false}
                  isMultiple={false}
                  onChange={(e: any) => {
                    console.log(e)
                    setSelectedTerminology(e);
                    if (selectedTerminology.value === "TT1001") {
                      setDescriptionDD([])
                      setSelectedDesc({
                        label: "Terminology Description"
                      })
                    }
                    else if (selectedTerminology.value === "TT1002") {
                      setDescriptionDD([])
                      setSelectedDesc({
                        label: "Terminology Description"
                      })
                    }
                  }}
                  label="Terminology Type"
                />
              </div>
              <div className="w-3/5">
                <ReactSelectBox
                  value={selectedDesc}
                  options={descriptionDD}
                  isSearchable={true}
                  isMultiple={false}
                  onSearchInputChange={(e: any) => {
                    handleDescription(e);
                  }}
                  onChange={(e: any) => {
                    setSelectedDesc(e);
                  }}
                  label="Terminology Description"
                  optionListWidtsize={true}
                />
              </div>
              <div className="w-1/5 hidden">
                <Input
                  type="text"
                  label="Code"
                  name="snomedCode"
                  watch={watch}
                  value={selectedDesc.conceptId}
                  disabled={true}
                />
              </div>
              <div className="w-1/5 text-start">
                <ActionButton
                  buttonText="Add"
                  handleSubmit={handleTerminologyData}
                  width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  disabled={
                    selectedTerminology.label !== "Terminology Type" &&
                    selectedDesc.label !== "Description"
                      ? false
                      : true
                  }
                />
              </div>
            </div>
            <div className="mt-3">
              <ReactDatagrid
                rows={terminologyData}
                columns={columns}
              />

            </div>
          </div>
        </div>
        <div className=" flex justify-between">
          <CheckboxMui
            label="Is Active ?"
            handleChange={handleIsActive}
            checked={isActive}
            className=" inline"
          />
          <div className="flex justify-end gap-3 mt-2">
            <ActionButton
              buttonText={props.serviceDetails?.serviceId ? "Update" : "Save"}
              handleSubmit={handleSubmit(onsubmit)}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
            <ActionButton
              buttonText="Cancel"
              handleSubmit={() => props.setOpen(false)}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
