"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  capitalize,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import FormPropsTextFields from "@/app/_common/input";
import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import { ClassNames } from "@emotion/react";
import services from "@/app/utilities/services";
import {
  collectSampleCollection,
  getBarCodeByAccessionNumber,
  unCollectSampleCollection,
} from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import Image from "next/image";
import moment from "moment";
import { jsonParse } from "@/app/utilities/local";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
interface ContainerCollectionFormprops {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  getOrderDetails: any;
  popup: any;
  setPopup: any;
  patDetails: any;
  [key: string]: any;
}

const ContainerCollectionForm: React.FC<ContainerCollectionFormprops> = ({
  formData,
  setFormData,
  getOrderDetails,
  popup,
  setPopup,
  patDetails,
  ...props
}) => {
  const routeList: any = [
    {
      value: "RT001",
      label: "Veins",
    },
  ];
  const siteList: any = [
    {
      value: "ST0012",
      label: "Venipuncture",
    },
  ];
  const onCollect = () => {
    let arr: any = [];
    formData.gridData.map((item: any) => {
      let obj = {
        //   collectionId: null,
        labOrderId: item.labOrderId,
        orderId: item.orderId,
        serviceCode: item.serviceCode,
        serviceDesc: item.serviceDesc,
        deptCode: item.department,
        deptDesc: item.departmentDesc,
        specialityCode: item.specialityCode,
        specialityDesc: item.specialityDesc,
        specimen: item.specimen,
        specimenCode: item.specimenCode,
        containerCode: item.containerCode,
        containerName: item.containerName,
        collectionStatus: "collected",
        volume: formData.volume,
        site: formData.site.label,
        route: formData.route.label,
        mrn: item.mrn,
        encounterId: item.opdEncounterId,
        patientId: item?.patientId,
        isCultureSensitive: item?.isCultureSensitive,
        practionerName: item.doctor,
        statusFlag: 1,
        orderDateTime: item.generatedDate,
        generatedBy: jsonParse("loginResponse").employeename,
        patientName: item.fullName,
      };
      arr.push(obj);
    });

    services
      .create(collectSampleCollection, arr)
      .then((response) => {
        toast.success(capitalize(response.data.statusMessage));
        setPopup({ ...popup, activeInactive: false });
        getOrderDetails();
      })
      .catch((error) => {
        if (error.response.data.statusMessage) {
          toast.error(capitalize(error?.response?.data.statusMessage));
        } else {
          toast.error("Techinal Error");
        }
      });
  };
  const onUnCollect = () => {
    let postArr: any = [];
    console.log(formData.gridData);
    formData.gridData.map((item: any) => {
      postArr.push(item.orderId);
    });
    services
      .create(unCollectSampleCollection, postArr)
      .then((response) => {
        toast.success("Uncollected successfully");
        setPopup({ ...popup, activeInactive: false });
        getOrderDetails();
      })
      .catch((error) => {
        toast.error("Technical Error");
      });
  };
  const [barCode, setBarCode] = useState<any>("");
  const generateBarCode = () => {
    services
      .get(getBarCodeByAccessionNumber + formData.accessionNum)
      .then((response) => {
        setBarCode(response.data.barCode);
        setTimeout(() => {
          PrintRecord();
        }, 1000);
      })
      .catch((error) => {
        toast.error("Technical Error");
      });
  };
  const PrintRecord = () => {
    const printContent: any = document.getElementById("divToPrint");
    if (printContent) {
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=600,scrollbars=yes, toolbar=no,location=no,status=no,menubar=no"
      );

      if (printWindow) {
        printWindow.document.write(
          "<html><head><title>Print</title></head><body>"
        );
        printWindow.document.write(printContent?.innerHTML);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  useEffect(() => {
    console.log("first", formData)
  }, [])

  const getAge = (ageOfPatient: any) => {
    if (ageOfPatient?.match(/\d+ Years,\d+ Months and \d+ Days/)) {
      const text = ageOfPatient;
      const numberRegex = /\d+ Years/;
      const monthRegex = /\d+ Months/;
      const dayRegex = /\d+ Days/;
      const dayMatch = text?.match(dayRegex);
      const monthMatch = text?.match(monthRegex);
      const matches = text?.match(numberRegex);
      let extractedNumber: any;
      if (matches && matches.length > 0 && parseInt(matches[0]) > 0) {
        extractedNumber = parseInt(matches[0]);
        let constCate = `${extractedNumber} Years`;
        return constCate;
      } else if (
        monthMatch &&
        matches.length > 0 &&
        parseInt(matches[0]) == 0 &&
        parseInt(monthMatch[0]) > 0
      ) {
        extractedNumber = parseInt(monthMatch[0]);
        let constCate = `${extractedNumber} Months`;
        return constCate;
      } else if (parseInt(monthMatch[0]) == 0 && parseInt(matches[0]) == 0) {
        extractedNumber = parseInt(dayMatch[0]);
        let constCate = `${extractedNumber} Days`;
        return constCate;
      }
    } else if (ageOfPatient == "") {
      return "";
    } else {
      return ageOfPatient + "Years";
    }
  };
  return (
    <>
      <div className="w-full data-grid-newThem">
        {/* <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
          <Table aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell width={400}>Container Name</TableCell>
                <TableCell>Valume</TableCell>
                <TableCell width={500}>Site</TableCell>
                <TableCell width={500}>Route</TableCell>
                <TableCell component="th" scope="row" width={150}>
                  Accession No.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell className="!text-left">
                  {formData.containerName}
                </TableCell>
                <TableCell className="!text-left w-[160px]">
                  <FormPropsTextFields
                    label="Volume"
                    name="volume"
                    value={formData.volume}
                    type="text"
                    handleChange={(e: any) =>
                      setFormData({ ...formData, volume: e.target.value })
                    }
                    containerProps={{
                      className: "!min-w-[0px]",
                    }}
                  />
                </TableCell>
                <TableCell className="!text-left">
                  <div className="relative">
                    <ReactSelectBox
                      value={formData.site}
                      options={siteList}
                      onChange={(e: any) => setFormData({ ...formData, site: e })}
                      label={"Site"}
                    />
                  </div>
                </TableCell>
                <TableCell className="!text-left">
                  <div className="relative">
                    <ReactSelectBox
                      value={formData.route}
                      options={routeList}
                      onChange={(e: any) =>
                        setFormData({ ...formData, route: e })
                      }
                      label={"Route"}
                    />
                  </div>
                </TableCell>
                <TableCell className="!text-left">
                  <FormPropsTextFields
                    label="Accession No"
                    name="accessionNo"
                    value={formData.accessionNum}
                    handleChange={(e: any) =>
                      setFormData({ ...formData, accessionNum: e.target.value })
                    }
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> */}
        <table className="text-base w-full table-fixed border-collapse border border-slate-400">
          <tr className="bg-[#2196f3] rounded-t-md">
            <th className="p-2 text-white">Container Name</th>
            <th className="p-2 text-white">Volume</th>
            <th className="p-2 text-white">Site</th>
            <th className="p-2 text-white">Route</th>
            <th className="p-2 text-white">Accession No</th>
          </tr>
          <tbody>
            <tr>
              <td className="border border-slate-300 p-2 pt-3 ">
                {formData.gridData[0].containerName}
              </td>
              <td className="border border-slate-300  p-2 pt-3 ">
                <FormPropsTextFields
                  label="Volume"
                  name="volume"
                  value={formData.byId?.volume}
                  type="text"
                  handleChange={(e: any) =>
                    setFormData({ ...formData, volume: e.target.value })
                  }
                  containerProps={{
                    className: "!min-w-[0px]",
                  }}
                />
              </td>
              <td className="border border-slate-300  p-2 pt-3 ">
                <ReactSelectBox
                  value={formData.byId?.site ? formData.byId?.site : formData.site}
                  options={siteList}
                  onChange={(e: any) => setFormData({ ...formData, site: e })}
                  label={"Site"}
                />
              </td>
              <td className="border border-slate-300 p-2 pt-3  ">
                <ReactSelectBox
                  value={formData.byId?.route ? formData.byId?.route : formData.route}
                  options={routeList}
                  onChange={(e: any) => setFormData({ ...formData, route: e })}
                  label={"Route"}
                />
              </td>
              <td className="border border-slate-300  p-2 pt-3 ">
                <FormPropsTextFields
                  label="Accession No"
                  name="accessionNo"
                  value={formData.byId?.accessionNum}
                  // handleChange={(e: any) =>
                  //   setFormData({ ...formData, accessionNum: e.target.value })
                  // }
                  containerProps={{
                    className: "!min-w-[0px]",
                  }}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div className="w-full flex justify-end gap-4 mt-4">
          <div className="mt-4">
            {barCode ? (
              <div className="flex gap-4">
                <div id="divToPrint" className="hidden font-bold w-full">
                  {/* className not applied so used style */}
                  <div
                    style={{
                      border: "2px solid grey ",
                      height: "200px",
                      width: "550px",
                      borderRadius: "10px",
                    }}
                  >
                    <div style={{ marginLeft: "20px", marginTop: "20px" }}>
                      <div
                        style={{
                          display: "flex",
                          paddingLeft: "5px",
                          justifyContent: "space-between",
                          width: "490px",
                        }}
                      >
                        <div>
                          <div>{patDetails.fullName}</div>
                          <div>{formData?.gridData[0].accessionNum}</div>
                        </div>
                        <div>
                          {getAge(patDetails.ageOfPatient)}{" "}
                          {patDetails.genderDesc[0]}
                        </div>
                      </div>
                      <div>
                        <Image
                          height={100}
                          width={500}
                          src={`data:image/png;base64,${barCode}`}
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          marginTop: "5px",
                          paddingLeft: "5px",
                          justifyContent: "space-between",
                          width: "490px",
                        }}
                      >
                        <div>
                          {"Col : "}
                          {moment(formData?.generatedDate).format("YYYY-MM-DD")}
                        </div>
                        <div className="">
                          {"Specimen : "} {formData?.gridData[0].specimen}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          <div className="w-full flex justify-end gap-4 mt-4">
            <div className="w-full flex justify-end gap-4">
              {props?.screenData?.Save === 1 &&
                <ActionButton
                  buttonText="Collect"
                  handleSubmit={onCollect}
                  width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  disabled={
                    formData.gridData.every(
                      (x: any) => x.accessionNum !== null && x.accessionNum !== ""
                    )
                      ? true
                      : false
                  }
                />
              }
              {props?.screenData?.Delete === 1 &&
                <ActionButton
                  buttonText="UnCollect"
                  handleSubmit={onUnCollect}
                  width="w-[120px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  // disabled={formData.gridData?.some((item:any)=>item.accessionNum==))? false : true}
                  disabled={
                    formData.gridData.every(
                      (x: any) => x.accessionNum !== null && x.accessionNum !== ""
                    )
                      ? false
                      : true
                  }
                />
              }

              {props?.screenData?.Print === 1 &&
                <ActionButton
                  buttonText="Barcode Print"
                  handleSubmit={generateBarCode}
                  disabled={
                    formData.gridData.every(
                      (x: any) => x.accessionNum !== null && x.accessionNum !== ""
                    )
                      ? false
                      : true
                  }
                  width="w-[140px] text-white text-[14px] py-3 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default roleInfoScreenData(ContainerCollectionForm, "SC")