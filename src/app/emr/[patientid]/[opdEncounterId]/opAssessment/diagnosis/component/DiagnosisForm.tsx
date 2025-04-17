import React, { useEffect, useState } from "react";
import { DataGridTable, MyFavarioutList } from ".";
import Select from "react-tailwindcss-select";
import ActionButton from "@/app/_common/button";
import axios from "axios";
import {
  snomedSearchByTermAndSemanticTag,
  snowmedData,
} from "@/app/utilities/api-urls";
import services from "@/app/utilities/services";

const DiagnosisForm = (props: any) => {
  const [fields, setFields] = useState<any>({});
  const handleSearchInputChange = (e: any) => {
    console.log(e.target.value);
    setFields({ ...fields, srchVal: e.target.value });
    getDiagonisOptions();
  };
  const [consentId, setConsentId] = useState<any>("");

  const [open, setOpen] = useState<any>(false);
  const [searchListMain, setSearchListMain] = useState<any>([]);
  const [diagnosticType, setdiagnosticType] = useState<any>([]);

  const getSelVal = (data: any) => {
    setFields({ ...fields, search: data });
  };

  //get value from enter the value more than 3 entered characters
  const getDiagonisOptions = async () => {
    if (fields.srchVal.length > 2) {
      await axios
        .get(
          `${snomedSearchByTermAndSemanticTag}term=${fields.srchVal}&state=both&semantictag=disorder&acceptability=all&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
        )
        .then((res: any) => {
          const modifyforSelc = res.data.map((item: any) => {
            return {
              label: item.conceptFsn,
              value: item.conceptFsn,
              hierarchy: item.hierarchy,
              isPreferredTerm: 1,
              conceptState: item.conceptState,
              diagnosisDescriptrion: item.conceptFsn,
              definitionStatus: item.definitionStatus,
              diagnosisCode: item.conceptId,
              languageCode: item.languageCode,
              typeId: item.typeId,
              term: item.term,
              caseSignificanceId: item.caseSignificanceId,
              id: item.id,
              effectiveTime: item.effectiveTime,
              activeStatus: 0,
              moduleId: item.moduleId,
              isActive: 1,
              isAdded: 1,
              opdEncounterId: null,
            };
          });
          setSearchListMain(modifyforSelc);
        })
        .catch((err: any) => console.log(err));
    } else {
    }
  };

  // getting snomed data for Diagnosis Type
  const getDiagnosisType = async () => {
    try {
      const data = await services.get(snowmedData + 106229004);
      const results = data.data.map((item: any) => ({
        value: item.id,
        label: item.fullySpecifiedName
          .replace(/\(qualifier value\)/g, "")
          .trim(),
        definitionStatusId: item.definitionStatusId,
        fullySpecifiedName: item.fullySpecifiedName,
        id: item.id,
        effectiveTime: item.effectiveTime,
        activeStatus: 1,
        moduleId: item.moduleId,
      }));

      setdiagnosticType(results);

    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDiagnosis = () => {
    let getDataselect = fields.search;
    props.setResult([...props.result, getDataselect]);
  };

  const saveDiagnosisData = () => {
    let forSaveData = props.result.filter(
      (list: any) => list.opdEncounterId === null
    );
  };

  useEffect(() => {
    getDiagnosisType();
  }, [props.result]);

  return (
    <>
      <div className="w-full flex gap-4 my-4">
        <div className="w-2/3">
          <div className="w-full my-select relative">
            <Select
              classNames={{
                menuButton: ({ isDisabled }: any) =>
                  `flex text-sm text-blue-gray-700 !h-[40px] border border-blue-gray-200 rounded-[7px] shadow-sm transition-all 
                    duration-300 focus:outline-none 
                   
                    ${isDisabled
                    ? "bg-blue-gray-200"
                    : "bg-white hover:border-blue-gray-400 focus:border-blue-500 focus:ring focus:ring-blue-500/20"
                  }`,
                menu: "absolute z-10 !max-w-lg  bg-white shadow-lg border rounded-[7px] py-1 mt-1.5 text-sm text-gray-700",
                listItem: ({ isSelected }: any) =>
                  `block transition duration-200 px-2 py-2 cursor-pointer select-none truncate rounded-[7px] ${isSelected
                    ? `text-white bg-blue-500`
                    : `text-blue-gray-700 hover:bg-blue-100 hover:text-blue-500`
                  }`,
              }}
              placeholder=" Diagnosis Search "
              primaryColor="blue"
              value={fields.search}
              options={searchListMain}
              isSearchable={true}
              onSearchInputChange={(e: any) => handleSearchInputChange(e)}
              onChange={getSelVal}
            />
            <label
              style={{ fontSize: "10px", color: "rgba(0, 0, 0, 0.6)" }}
              className={`${fields.search?.label !== undefined
                ? " bg-white py-[1px] px-[2px] opacity-100 -top-[9px] left-[10px]"
                : "text-sm opacity-0 top-10"
                } 
                                                      truncate 
                                                      cursor-default 
                                                      select-none  
                                                      absolute transition-all
                                                     `}
            >
              Diagnosis Search
            </label>
          </div>
        </div>
        <div className="md:w-1/3 flex gap-4">
          <ActionButton
            buttonText="ADD"
            handleSubmit={handleAddDiagnosis}
            width="w-full py-3"
          />
          <ActionButton
            buttonText="My Favourites"
            // handleSubmit={() => {
            //   getFavouriteDiagnosisData();
            //   setSearchPopup(true);
            //   handleOpen();
            // }}
            width="w-full py-1"
          />
        </div>
      </div>
      <div className="px-3 bg-white rounded-curve md:pt-3 pb-3 rounded-curve mx-auto w-full border border-stroke">
        <DataGridTable
          tabSel={props.tabSel}
          result={props.result}
          setResult={props.setResult}
          diagnosisTypeData={diagnosticType}
          fields={fields}
          setFields={setFields}
          saveDiagnosisData={saveDiagnosisData}
        />
      </div>

      <MyFavarioutList open={open} setOpen={setOpen} />
    </>
  );
};

export default DiagnosisForm;
