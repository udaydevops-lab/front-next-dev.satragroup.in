import ReactDatagrid from "@/app/_commonfeatures/ReactDatagrid";
import { GridColDef } from "@mui/x-data-grid";
import React, { Dispatch, SetStateAction, useState } from "react";
import {
  Button,
  Dialog,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import ContainerCollectionForm from "./ContainerCollectionForm";
import Cross_Icon from "@/app/_common/common_icons/Cross_Icon";
import TestTubeIcon from "../../../../../../public/icons/lab/TestTubeIcons";
import services from "@/app/utilities/services";
import { getByOrderIdLabOrderId } from "@/app/utilities/api-urls";
interface OrderDetailsprops {
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  gridData: any;
  getOrderDetails: any;
  patDetails: any;
}
const OrderDetails: React.FC<OrderDetailsprops> = ({
  formData,
  setFormData,
  gridData,
  getOrderDetails,
  patDetails,
}) => {
  const handleContainerClick = (data: any) => {
    if (data.accessionNum) {
      services
        .get(
          `${getByOrderIdLabOrderId}orderId=${data.orderId}&labOrderId=${data.labOrderId}`
        )
        .then((response) => {
          response.data.site = { label: response.data.site };
          response.data.route = { label: response.data.route };
          let filteredData = gridData.filter(
            (item: any) =>
              item.containerName.toLowerCase() ==
              data.containerName.toLowerCase()
          );
          setFormData({
            ...formData,
            gridData: filteredData,
            byId: response.data,
          });
          setPopup({ ...popup, activeInactive: true });
        });
    } else {
      let filteredData = gridData.filter(
        (item: any) =>
          item.containerName.toLowerCase() == data.containerName.toLowerCase()
      );
      setFormData({
        ...formData,
        byId: {},
        volume: null,
        site: "",
        route: "",
        accessionNo: null,
        gridData: filteredData,
      });
      setPopup({ ...popup, activeInactive: true });
    }
  };
  const [popup, setPopup] = useState<any>({
    activeInactive: false,
  });

  const columns1: GridColDef[] = [
    { field: "orderId", headerName: "Order ID", width: 140 },
    { field: "departmentDesc", headerName: "Department", width: 120 },
    { field: "specialityDesc", headerName: "Speciality", width: 140 },
    { field: "specimen", headerName: "Specimen", width: 100 },
    { field: "containerName", headerName: "Container", width: 120 },
    {
      field: "containerTupe",
      headerName: "",
      width: 100,
      renderCell: (params: any) => (
        <>
          <div
            onClick={() => {
              handleContainerClick(params.row);
              //   setPopup({ ...popup, activeInactive: true });
              //   setFormData(params.row);
            }}
            className={`text-blue-300 testTube w-[45px] h-[45px] mx-auto cursor-pointer flex justify-center items-center bg-[#f2f3fe] hover:!bg-[#2196f3]  rounded-full`}
          >
            <TestTubeIcon />
          </div>
        </>
      ),
    },
    { field: "serviceDesc", headerName: "Service Name", width: 200 },
    { field: "accessionNum", headerName: "Accession No", width: 160 },
    {
      field: "status",
      headerName: "Status",
      // width: 90,
      renderCell: (params: any) => (
        <div
          className={`${params.row.status === "Collected"
            ? "text-green-500"
            : "text-orange-500"
            }`}
        >
          {params.row.status}
        </div>
      ),
    },
  ];
  let groupedData = gridData.reduce((acc: any, item: any) => {
    acc[item.containerName] = acc[item.containerName] || [];
    acc[item.containerName].push(item);
    return acc;
  }, {});
  // let rows: any = state.patientOrderDetailsData.orderDetails
  const handleButtonClick = (containerName: any) => {
    alert(`Button clicked for container: ${containerName}`);
  };
  return (
    <>
      <div className="w-full text-[#707070] text-[18px] mb-3 font-bold place">
        Order Details
      </div>
      <div className="w-full mt-3 data-grid-newThem">
        {/* {/ {<ReactDatagrid rows={gridData} columns={columns1} />} /} */}
        <table className="text-base w-full table-auto border-collapse border border-slate-400 rounded-xl overflow-hidden relative ">
          <thead>
            <tr className="bg-[#2196f3] ">
              <th className="p-2 text-white">Order ID</th>
              <th className="p-2 text-white">Department</th>
              <th className="p-2 text-white">Specialty</th>
              <th className="p-2 text-white">Specimen</th>
              <th className="p-2 text-white">Container</th>

              <th className="p-2 text-white"> </th>
              <th className="p-2 text-white">Service Name</th>
              <th className="p-2 text-white">Accession No.</th>
              <th className="p-2 text-white">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(groupedData).map((containerName, index) => (
              <React.Fragment key={index}>
                {groupedData[containerName].map((item: any, idx: any) => (
                  <tr key={idx}>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.orderId}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3">
                      {item.departmentDesc}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.specialityDesc}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.specimen}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.containerName}
                    </td>

                    {/* {/ Render the button only for the first row of each group /} */}
                    {idx === 0 && (
                      <td
                        className="border border-slate-300 p-2 pt-3"
                        rowSpan={groupedData[containerName].length}
                      >
                        <div
                          onClick={() => {
                            handleContainerClick(item);
                            //   setPopup({ ...popup, activeInactive: true });
                            //   setFormData(params.row);
                          }}
                          className={`text-blue-300 testTube w-[45px] h-[45px] mx-auto cursor-pointer flex justify-center items-center bg-[#f2f3fe] hover:!bg-[#2196f3]  rounded-full`}
                        >
                          <TestTubeIcon />
                        </div>
                      </td>
                    )}
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.serviceDesc}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.accessionNum}
                    </td>
                    <td className="border border-slate-300 p-2 pt-3 ">
                      {item.status}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        open={popup.activeInactive}
        handler={
          () => { }
          //     setPopup({
          //     ...popup,
          //     activeInactive: false
          // })
        }
        size={"xl"}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="py-5"
      >
        <DialogHeader className=" justify-center">
          <div
            onClick={() => setPopup({ ...popup, activeInactive: false })}
            className="w-[25px] h-[30px] absolute  -top-4 -right-2 cursor-pointer"
          >
            <Cross_Icon />
          </div>
          <ContainerCollectionForm
            formData={formData}
            setFormData={setFormData}
            setPopup={setPopup}
            popup={popup}
            getOrderDetails={getOrderDetails}
            patDetails={patDetails}
          />
        </DialogHeader>
      </Dialog>
    </>
  );
};

export default OrderDetails;
