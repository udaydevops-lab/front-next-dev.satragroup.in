import { useParams, useRouter } from "next/navigation";
// import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Allergies = (props: any) => {
  const router = useRouter();
  const { patientid, opdEncounterId } = useParams();

  const pushTo = (type: string) => {
    switch (type) {
      case "allergies":
        router.push(`/emr/${patientid}/${opdEncounterId}/triage-activity`);
        break;
      default:
        break;
    }
  };

  const foodData = props.saveallergy.filter(
    (list: any) => list.category === "Food"
  );
  const medicationData = props.saveallergy.filter(
    (list: any) => list.category === "Medication"
  );
  const environmentData = props.saveallergy.filter(
    (list: any) => list.category === "Environment"
  );

  const biologicData = props.saveallergy.filter(
    (list: any) => list.category === "Biologic"
  );

  return (
    <>
      <div className="cust-card-body flex flex-col p-2 text-xs">
        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Food</p>
            {foodData.length > 0 ? (
              <>
                {foodData
                  .map((list: any, index: any) => (
                    <>
                      <span className="text-xs text-gray-500">
                        {list.substance}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.recordedBy}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.date}
                      </span>
                    </>
                  ))
                  .reverse()
                  .slice(0, 3)}
              </>
            ) : (
              <>
                <p>No Records For Now</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Medication</p>
            {medicationData.length > 0 ? (
              <>
                {medicationData
                  .map((list: any, index: any) => (
                    <>
                      <span className="text-xs text-gray-500">
                        {list.substance}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.recordedBy}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.date}
                      </span>
                    </>
                  ))
                  .reverse()
                  .slice(0, 3)}
              </>
            ) : (
              <>
                <p>No Records For Now</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Environment</p>
            {environmentData.length > 0 ? (
              <>
                {environmentData
                  .map((list: any, index: any) => (
                    <>
                      <span className="text-xs text-gray-500">
                        {list.substance}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.recordedBy}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.date}
                      </span>
                    </>
                  ))
                  .reverse()
                  .slice(0, 3)}
              </>
            ) : (
              <>
                <p>No Records For Now</p>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center w-full my-2 -ml-1">
          <div className="w-1/12 z-10">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          </div>
          <div className="w-11/12">
            <p className="text-sm">Biologic</p>
            {biologicData.length > 0 ? (
              <>
                {biologicData
                  .map((list: any, index: any) => (
                    <>
                      <span className="text-xs text-gray-500">
                        {list.substance}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.recordedBy}
                      </span>
                      <span className="text-xs text-gray-500">
                        || {list.date}
                      </span>
                    </>
                  ))
                  .reverse()
                  .slice(0, 3)}
              </>
            ) : (
              <>
                <p>No Records For Now</p>
              </>
            )}
          </div>
        </div>
        <p>
          <a
            href="#"
            className="p-0 m-0 float-right font-semibold text-blue-900 hover:text-blue-800"
            onClick={() => {
              pushTo("allergies");
            }}
          >
            Show More
          </a>
        </p>
      </div>
    </>
  );
};

export default Allergies;
