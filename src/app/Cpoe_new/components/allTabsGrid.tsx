import ActionButton from "@/app/_common/button";
import {
  InformationCircleIcon,
  PencilIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import PrintCpoeRecords from "./PrintCpoeRecords";
import services from "@/app/utilities/services";
import { delCPOE, newdeleteCPOE } from "@/app/utilities/api-urls";
import { useParams } from "next/navigation";
import {
  Tooltip,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { toast } from "react-toastify";
import Printlayout from "@/app/_common/PrintLayout/printlayout";
import ReactCommonDialog from "@/app/_commonfeatures/ReactCommonDialog";
import DeletePopupMsg from "@/app/_commonfeatures/DeletePopupMsg";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";

const AllTabsGrid = (props: any) => {
  const printSectionRef = useRef<HTMLDivElement | null>(null);

  const { patientid, opdEncounterId } = useParams();

  // modal dialog open and closed
  const [modaloc, setModaloc] = React.useState<any>({
    open: false,
  });

  const columns2: GridColDef[] = [
    {
      field: "rowid",
      headerName: "S.No.",
      width: 25,
      renderCell: (params) => {
        const rowNumber = props.getAddAllCpoe.indexOf(params.row) + 1;
        return rowNumber;
      },
    },
    {
      field: "orderdetails",
      headerName: "Order Details",
      width: 460,
      valueGetter: (params: GridValueGetterParams) => `
                ${params.row.serviceDesc ? `${params.row.serviceDesc} | ` : ""}
                ${params.row.serviceCode ? `${params.row.serviceCode} | ` : ""
        }  
                ${params.row.departmentDesc
          ? `${params.row.departmentDesc} | `
          : ""
        }  
                ${params.row.superSpecialityDes
          ? `${params.row.superSpecialityDes} | `
          : ""
        }  
                ${params.row.specimen
          ? `Specimen: ${params.row.specimen} | `
          : ""
        }  
                ${params.row.modality ? `${params.row.modality} | ` : ""}
                ${params.row.priority ? `${params.row.priority} | ` : ""}
                ${params.row.requestdate
          ? `${moment(params.row.requestdate).format(
            "DD-MM-YYYY"
          )} | `
          : ""
        }
                ${params.row.reasonForTesting
          ? `Reason:${params.row.reasonForTesting} | `
          : ""
        }
                ${params.row.comments
          ? `Comments:${params.row.comments} | `
          : ""
        }
                `,
    },
    { field: "status", headerName: "Status", width: 100 },
    {
      field: "actions",
      headerName: "Actions",
      width: 80,
      renderCell: (params: any) => (
        <>
          <div className="flex justify-center items-center w-full gap-2">
            {params.row.status === "New Order" ||
              params.row.status === "Ordered" ? (
              <>
                {params.row.opdEncounterSerId !== null ? (
                  <>
                    <PencilIcon
                      className="w-5 h-5 text-blue-400 cursor-pointer"
                      onClick={() => props.onEdit(params.row)}
                    />
                    <TrashIcon
                      className="w-5 h-5 text-red-400 cursor-pointer"
                      onClick={() =>
                        setModaloc({
                          ...modaloc,
                          open: true,
                          data: params.row,
                          opdEncounterSerId: params.row.opdEncounterSerId,
                        })
                      }
                    />
                    {/* <PencilSquareIcon className="w-6 h-6 text-green-400 cursor-pointer"
                                            onClick={() => setModaloc({ ...modaloc, entryCpoe: true })}

                                        /> */}
                  </>
                ) : (
                  <>
                    <TrashIcon
                      className="w-5 h-5 text-red-400 cursor-pointer"
                      onClick={() =>
                        // setModaloc({
                        //   ...modaloc,
                        //   open: true,
                        //   id: params.row.id,
                        //   cpoeCode: params.row.cpoeCode,
                        //   data: params.row,
                        // })
                        normalDele(params.row)
                      }
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <Tooltip
                  content="You not able to delete and modify record"
                  className="bg-blue-600"
                >
                  <InformationCircleIcon className="w-8 h-8 text-blue-500" />
                </Tooltip>
              </>
            )}
          </div>
        </>
      ),
    },
  ];


  const normalDele = (data: any) => {
    let getDelItem = props.getAddAllCpoe.filter(
      (list: any) => list.id != data.id
    );

    let storeDelItmes = props.getAddAllCpoe
      .filter((list: any) => list.id != data.id)
      .filter((list: any) => list.opdEncounterSerId === null);
    props.setStore(storeDelItmes);
    props.setGetAddAllCpoe(getDelItem);
  }

  const [delLoader, setDelLoader] = useState<any>(false)

  // delet the CPOE record
  const onDelete = () => {
    //newdeleteCPOE
    // {patientId}/{opdEncounterId}/{opdEncounterSerId}
    setDelLoader(true)
    if (modaloc.data.opdEncounterSerId != null) {
      let url =
        newdeleteCPOE +
        `${patientid}/${opdEncounterId}/${modaloc.data.opdEncounterSerId}`;

      services
        .create(url, {})
        .then((res) => {
          setTimeout(() => {
            setDelLoader(false)
            props.getCpoeData();
            toast.success("Successfully deleted cpoe recordecord...");
            setModaloc({ ...modaloc, open: false });
          }, 2000);

        })
        .catch((error) => {
          setTimeout(() => {
            setDelLoader(false)
            toast.error("Something went wrong...");
            setModaloc({ ...modaloc, open: false });
          }, 2000);
        });
    }

    // else {
    //   setModaloc({ ...modaloc, open: false });
    //   let getDelItem = props.getAddAllCpoe.filter(
    //     (list: any) => list.id != modaloc.data.id
    //   );

    //   let storeDelItmes = props.getAddAllCpoe
    //     .filter((list: any) => list.id != modaloc.data.id)
    //     .filter((list: any) => list.opdEncounterSerId === null);
    //   props.setStore(storeDelItmes);
    //   props.setGetAddAllCpoe(getDelItem);
    // }
  };

  // PrintRecord
  const PrintRecord = () => {
    const printContent: any = printSectionRef.current;

    if (printContent) {
      const printWindow = window.open(
        "",
        "_blank",
        "width=1000,height=600,scrollbars=yes,toolbar=no,location=no,status=no,menubar=no"
      );

      if (printWindow) {
        // printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(printContent.innerHTML);
        // printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  useEffect(() => { }, [props.onEdit, props.patientid]);

  return (
    <>
      {/* <div className="hidden" ref={printSectionRef}>
                <Printlayout
                    content={
                        <PrintCpoeRecords
                            getAddAllCpoe={props.getAddAllCpoe}
                            key={uuidv4()}
                        />
                    }
                />
            </div> */}

      <div id="divToPrint" className="hidden w-full" ref={printSectionRef}>
        <Printlayout
          content={
            <PrintCpoeRecords
              getAddAllCpoe={props.getAddAllCpoe}
              key={uuidv4()}
            />
          }
        />
      </div>

      <div className="w-3/4 pb-3">
        <DataGrid
          autoHeight
          rows={props.getAddAllCpoe}
          getRowId={() => uuidv4()}
          columns={columns2}
          pageSizeOptions={[10, 30, 50, 100]}
          // slots={{ toolbar: GridToolbar }}
          className="text-sm"
        />
        <div className=" mt-3 flex justify-end gap-x-3">
          {props.sendEditRecord && props.sendEditRecord.opdEncounterSerId ? (
            <></>
          ) : (
            <>
              {props?.screenData?.Save === 1 &&
                <ActionButton
                  handleSubmit={props.copeSaveSubmission}
                  buttonText={props.loader ?
                    <div className='w-full flex justify-center items-center'>
                      <div className='innerBtnloader'></div>
                    </div> : "Save"}
                  width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                  disabled={props.store.length > 0 ? false : true}
                />
              }
            </>
          )}
          {props?.screenData?.Print === 1 &&
            <ActionButton
              buttonText="Print"
              handleSubmit={PrintRecord}
              width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
              disabled={props.getAddAllCpoe.length > 0 ? false : true}
            />
          }
        </div>
      </div>

      <ReactCommonDialog
        open={modaloc.open}
        handler={() => setModaloc({ ...modaloc, open: false })}
        popupClose={() => setModaloc({ ...modaloc, open: false })}
        Content={
          <DeletePopupMsg
            btnYesFun={onDelete}
            btnNoFun={() => setModaloc({ ...modaloc, open: false })}
            content={
              <>
                Do you want to Delete this record?
                {/* <div className="w-full text-gray-500">
                  <small>
                    <strong>Note: </strong>
                    Once Status is Billed You are not be able to delete this record
                  </small>
                </div> */}
              </>
            }
            loader={delLoader}
          />
        }
        size={'md'}
      />
      {/* <Dialog
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
              you want to Delete this record?
            </div>
          </div>
        </DialogHeader>
        <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
          <strong>Note:</strong>
          Once Status is Billed You are not be able to delete this record
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
      </Dialog> */}
    </>
  );
};

export default roleInfoScreenData(AllTabsGrid, "CPOE")
