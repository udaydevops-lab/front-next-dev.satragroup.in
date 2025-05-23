"use client";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Input,
} from "@material-tailwind/react";
import {
  EyeIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import RadiologyView from "./radiologyView";
import RadiologyEntry from "./radiologyEntrty";
import ActionButton from "@/app/_common/button";
import DateInput from "@/app/_common/date-input";
import services from "@/app/utilities/services";
import { newgetCPOE } from "@/app/utilities/api-urls";
import { useParams, useRouter } from "next/navigation";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

function Radiology(props: any) {
  const [data, setData] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState("All Orders");
  const [fromDate, setFromDate] = useState<any>(moment());
  const [toDate, setToDate] = useState<any>(moment());
  const [mrn, setMrn] = useState<any>("");
  const [key, setKey] = useState(33);
  const [patientName, setPatientName] = useState<any>("");
  const [modaloc, setModaloc] = useState<any>({
    popup: false,
    view: false,
    rowData: {},
  });
  const router = useRouter();
  const { patientid } = useParams();
  const columns2: GridColDef[] = [
    {
      field: "sno",
      headerName: "S No",
      width: 70,
      renderCell: (params) => {
        const rowNumber = data.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "mrn",
      headerName: "Patient MRN",
      width: 180,
    },
    {
      field: "patientName",
      headerName: "Patient Name",
      width: 200,
    },
    {
      field: "orderId",
      headerName: "Order Id",
      width: 160,
    },
    {
      field: "generatedDate",
      headerName: "Order Date Time",
      width: 180,
      renderCell: (params: any) => (
        <>{moment(params.row.generatedDate).format("DD-MM-YYYY HH:mm")}</>
      ),
    },
    {
      field: "serviceDesc",
      headerName: "Service Name",
      width: 220,
    },
    {
      field: "specialty",
      headerName: "Speciality",
      width: 150,
    },
    {
      field: "billNumber",
      headerName: "Bill No ",
      width: 200,
    },

    {
      field: "recordedBy",
      headerName: "Order By Physician",
      width: 180,
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
    },

    {
      field: "ResultEntry",
      headerName: "Entry",
      width: 100,
      renderCell: (params: any) => (
        <PencilIcon
          className="cursor-pointer w-5 h-5 text-blue-500 "
          onClick={(e: any) => {
            setModaloc({ ...modaloc, popup: true, rowData: params.row });
          }}
        />
      ),
    },
    {
      field: "View",
      headerName: "View",
      width: 100,
      renderCell: (params: any) => (
        <div
          className="cursor-pointer"
          onClick={(e: any) => {
            setModaloc({ ...modaloc, view: true, rowData: params.row });
          }}
        >
          <EyeIcon className="w-5 h-5 text-blue-500 " />
        </div>
      ),
    },
  ];
  const getRowId = (row: any) => row.opdEncounterSerId;
  const handleOrdersChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handleSubmit = () => {
    getOrders();
  };
  const handelReset = () => {
    setToDate(moment());
    setFromDate(moment());
    setPatientName("");
    setMrn("");
    setSelectedOption("All Orders");
  };

  const handleToDateChange = (e: any) => {
    setToDate(e);
  };
  const handleFromDateChange = (e: any) => {
    setFromDate(e);
  };
  // geting data
  const getOrders = async () => {
    try {
      const OrdersType =
        selectedOption === "All Orders" ? "" : "&orderStatus= Result Verified";
      const response = await services.get(
        newgetCPOE +
        `fromDate=${moment(fromDate).format("YYYY-MM-DD")}&toDate=${moment(
          toDate
        ).format("YYYY-MM-DD")}&cpoeType=Radiology${OrdersType}`
      );

      const responseMain = response.data;
      if (patientName) {
        const filteredData = responseMain
          .filter((item: any) => item.patientName)
          .filter((list: any) =>
            list?.patientName.toLowerCase().includes(patientName?.toLowerCase())
          );
        setData(filteredData);
      } else if (mrn) {
        const filteredDataMrn = responseMain
          .filter((item: any) => item.mrn)
          .filter((list: any) =>
            list?.mrn.toLowerCase().includes(mrn?.toLowerCase())
          );
        setData(filteredDataMrn);
      } else {
        setData(responseMain);
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getOrders();
  }, []);
  return (
    <div>
      <div className={`${props?.screenData?.View === 1 ? "" : "pointer-events-none"}`}>
        <div className="grid grid-cols-4 gap-4 mb-5">
          <div className="flex items-center w-full">
            <input
              type="radio"
              id="allOrdersr"
              value="All Orders"
              checked={selectedOption === "All Orders"}
              onChange={handleOrdersChange}
              style={{ color: "black" }}
              className="border-0 w-6 h-6 mr-2 focus:ring-black"
            />
            <label htmlFor="allOrdersr" className="text-sm cursor-pointer">
              All Orders
            </label>
          </div>
          <div className="flex items-center w-full">
            <input
              type="radio"
              id="verifiedOrdersr"
              value="Results Verified Orders"
              checked={selectedOption === "Results Verified Orders"}
              onChange={handleOrdersChange}
              style={{ color: "black" }}
              className="border-0 w-6 h-6 mr-2 focus:ring-black"
            />
            <label htmlFor="verifiedOrdersr" className="text-sm cursor-pointer">
              Results Verified Orders
            </label>
          </div>

          <div className="w-full">
            <DateInput
              disableFuture={true}
              onChange={handleFromDateChange}
              value={fromDate}
              label="From Date"
            />
          </div>
          <div className="w-full">
            <DateInput
              disableFuture={true}
              onChange={handleToDateChange}
              value={toDate}
              label="To Date"
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              type="text"
              label="Patient Name"
              color="blue"
              required={false}
              value={patientName}
              onChange={(e: any) => {
                setPatientName(e.target.value);
              }}
            />
          </div>
          <div className="w-full">
            <Input
              crossOrigin
              type="text"
              color="blue"
              label="Patient MRN"
              required={false}
              value={mrn}
              onChange={(e: any) => {
                setMrn(e.target.value);
              }}
            />
          </div>
          <div className="flex w-2/4 gap-4">
            <div className="w-auto ">
              <ActionButton
                width="w-[120px] py-3"
                buttonText="VIEW ORDERS"
                handleSubmit={handleSubmit}
              />
            </div>
            <div className="w-auto">
              <ActionButton
                width="w-[120px] py-3 bg-red-500 hover:bg-red-600 border-red-500"
                buttonText="RESET"
                handleSubmit={handelReset}
              />
            </div>
          </div>
        </div>
        <div className="" key={key}>
          <DataGrid
            rows={data}
            columns={columns2}
            getRowId={getRowId}
            autoHeight
            pageSizeOptions={[10, 20]}
            checkboxSelection={false}
            slots={{ toolbar: null }}
            density="compact"
          />
        </div>

        {/* Radiology Entry */}
        <Dialog
          open={modaloc.popup}
          handler={() => setModaloc({ ...modaloc, view: false })}
          size={"xl"}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="py-5"
        >
          <DialogHeader className="w-full flex justify-beetween pb-2">
            <div className="w-full text-[20px] text-blue-500">
              Radiology Entry
            </div>
            <div className="text-right">
              <XMarkIcon
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900"
                onClick={() => setModaloc({ ...modaloc, popup: false })}
              />
            </div>
          </DialogHeader>
          <DialogBody className=" text-left text-black text-[15px] justify-center pt-0">
            <RadiologyEntry
              setModaloc={setModaloc}
              modaloc={modaloc}
              odaloc={modaloc}
              setKey={setKey}
              getOrders={getOrders}
            />
          </DialogBody>
        </Dialog>

        {/* Radiology view */}
        <Dialog
          open={modaloc.view}
          handler={() => setModaloc({ ...modaloc, view: false })}
          size={"xl"}
          animate={{
            mount: { scale: 1, y: 0 },
            unmount: { scale: 0.9, y: -100 },
          }}
          className="py-5"
        >
          <DialogHeader className="w-full flex justify-beetween pb-2">
            <div className="w-full text-[20px] text-blue-500">Radiology View</div>
            <div className="text-right">
              <XMarkIcon
                className="cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900"
                onClick={() => setModaloc({ ...modaloc, view: false })}
              />
            </div>
          </DialogHeader>
          <DialogBody className=" text-left text-black text-[15px] justify-center pt-0">
            <RadiologyView setModaloc={setModaloc} modaloc={modaloc} />
          </DialogBody>
        </Dialog>
      </div>
    </div>
  );
}

export default roleInfoScreenData(Radiology, "Re");