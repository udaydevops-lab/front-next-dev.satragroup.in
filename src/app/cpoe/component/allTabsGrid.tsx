import ActionButton from '@/app/_common/button';
import { InformationCircleIcon, PencilIcon, PencilSquareIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { DataGrid, GridColDef, GridToolbar, GridValueGetterParams } from '@mui/x-data-grid';
import moment from 'moment';
import React, { useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid';
import PrintCpoeRecords from './PrintCpoeRecords';
import services from '@/app/utilities/services';
import { delCPOE } from '@/app/utilities/api-urls';
import { useParams } from 'next/navigation';
import { Tooltip, Button, Dialog, DialogHeader, DialogBody, DialogFooter } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import Printlayout from '@/app/_common/PrintLayout/printlayout';
import Entry from './Entry';

const AllTabsGrid = (props: any) => {

    const printSectionRef = useRef<HTMLDivElement | null>(null);

    const { patientid, opdEncounterId } = useParams()

    // modal dialog open and closed
    const [modaloc, setModaloc] = React.useState<any>({
        open: false,
    })


    const columns2: GridColDef[] = [
        {
            field: 'rowid', headerName: "S.No.", width: 25,
            renderCell: (params) => {
                const rowNumber = props.getAddAllCpoe.indexOf(params.row) + 1;
                return rowNumber;
            },
        },
        {
            field: 'orderdetails',
            headerName: "Order Details",
            width: 460,
            valueGetter: (params: GridValueGetterParams) => `
                ${params.row.labServiceDesc ? `${params.row.labServiceDesc} | ` : ''}
                ${params.row.serviceCode ? `${params.row.serviceCode} | ` : ''}  
                ${params.row.department ? `${params.row.department} | ` : ''}  
                ${params.row.specimen ? `Specimen: ${params.row.specimen} | ` : ''}  
                ${params.row.modality ? `${params.row.modality} | ` : ''}
                ${params.row.priority ? `${params.row.priority} | ` : ''}
                ${params.row.requestdate ? `${moment(params.row.requestdate).format("DD-MM-YYYY")} | ` : ''}
                ${params.row.reasonForTesting ? `Reason:${params.row.reasonForTesting} | ` : ''}
                ${params.row.comments ? `Comments:${params.row.comments} | ` : ''}
                `
        },
        { field: 'status', headerName: "Status", width: 100 },
        {
            field: "actions",
            headerName: "Actions",
            width: 80,
            renderCell: (params: any) => (
                <>

                    <div className='flex justify-center items-center w-full gap-2'>
                        {params.row.status === 'New Order' || params.row.status === 'Ordered' ?
                            <>
                                {params.row.opAssementCpoeId !== null ?
                                    <>
                                        <PencilIcon className="w-5 h-5 text-blue-400 cursor-pointer"
                                            onClick={() => props.onEdit(params.row)}
                                        />
                                        <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer"
                                            onClick={() => setModaloc({ ...modaloc, open: true, id: params.row.id, opdEncounterId: params.row.opdEncounterId, })}
                                        />
                                        {/* <PencilSquareIcon className="w-6 h-6 text-green-400 cursor-pointer"
                                            onClick={() => setModaloc({ ...modaloc, entryCpoe: true })}

                                        /> */}
                                    </>
                                    :
                                    <>
                                        <TrashIcon className="w-5 h-5 text-red-400 cursor-pointer"
                                            onClick={() => setModaloc({
                                                ...modaloc,
                                                open: true,
                                                id: params.row.id,
                                                opdEncounterId: params.row.opdEncounterId,
                                                cpoeCode: params.row.cpoeCode
                                            })}
                                        />
                                    </>
                                }


                            </> :
                            <>
                                <Tooltip
                                    content="You not able to delete and modify record"
                                    className="bg-blue-600"
                                >
                                    <InformationCircleIcon
                                        className='w-8 h-8 text-blue-500'
                                    />
                                </Tooltip>
                            </>

                        }
                    </div>
                </>
            )
        }
    ];

    const onDelete = () => {
        if (modaloc.opdEncounterId != null) {
            let url = delCPOE + `${patientid}/${opdEncounterId}/${modaloc.id}`

            services.create(url, {})
                .then((res) => {

                    props.getCpoeData()
                    toast.success("Successfully Deleted Record...")
                    setModaloc({ ...modaloc, open: false })
                })
                .catch((error) => console.log(error))
        } else {
            setModaloc({ ...modaloc, open: false })
            let getDelItem = props.getAddAllCpoe.filter((list: any) => list.id != modaloc.id)


            let storeDelItmes = props.store.filter((list: any) => list.id != modaloc.id)
            props.setStore(storeDelItmes)
            props.setGetAddAllCpoe(getDelItem)
        }

    }


    // const PrintRecord = async () => {
    //     const printWindow = window.open('', '_blank');

    //     if (printWindow) {
    //         const printDocument = printWindow.document;

    //         // Create a div to hold the content to be printed
    //         const printContainer = printDocument.createElement('div');

    //         // Clone the content of the section to print
    //         const clonedContent = printSectionRef.current?.cloneNode(true);

    //         // Append the cloned content to the print container
    //         if (clonedContent) {
    //             printContainer.appendChild(clonedContent);
    //         }

    //         // Append the print container to the new document body
    //         printDocument.body.appendChild(printContainer);

    //         // Trigger the print dialog in the new window
    //         printWindow.print();

    //         // Close the new window after printing
    //         printWindow.onafterprint = () => {
    //             printWindow.close();
    //         };
    //     } else {
    //         console.error('Failed to open new window for printing');
    //     }
    // };


    const PrintRecord = () => {
        const printContent = printSectionRef.current;
        if (printContent) {
            const printWindow = window.open('', '_blank', 'width=1000,height=600,scrollbars=yes,toolbar=no,location=no,status=no,menubar=no');

            if (printWindow) {
                printWindow.document.write('<html><head><title>Print</title></head><body>');
                printWindow.document.write(printContent.innerHTML);
                printWindow.document.write('</body></html>');
                printWindow.document.close();
                printWindow.print();
                printWindow.close();
            }
        }
    };

    useEffect(() => { }, [props.onEdit, props.patientid])



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

            <div id="divToPrint" className='hidden w-full' ref={printSectionRef}>
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
                    className='text-sm'
                />
                <div className=" mt-3 flex justify-end gap-x-3">
                    {props.sendEditRecord && props.sendEditRecord.opAssementCpoeId ?
                        <>

                        </> :
                        <>
                            <ActionButton
                                handleSubmit={props.copeSaveSubmission}
                                buttonText="Save Rx"
                                width="w-[120px] py-3"
                                disabled={props.store.length > 0 ? false : true}
                            />

                        </>
                    }

                    <ActionButton buttonText="Print Rx"
                        handleSubmit={PrintRecord}
                        width="w-[120px] py-3"
                        disabled={props.getAddAllCpoe.length > 0 ? false : true}
                    />
                </div>
            </div>

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
                            you want to Delete this record?
                        </div>
                    </div>

                </DialogHeader>
                <DialogBody className=" text-center text-black text-[15px] justify-center pt-0">
                    <strong>Note:</strong>
                    Once Status is Billed You are not be able to delete this record
                </DialogBody>
                <DialogFooter className="text-center justify-center">
                    <Button variant="gradient" color="blue"
                        className="mr-2 bg-blue-500 hover:bg-blue-600" onClick={onDelete}>
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


            <Dialog
                open={modaloc.entryCpoe}
                handler={() => setModaloc({ ...modaloc, entryCpoe: false })}
                size={"xl"}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -100 },
                }}
                className="py-5"
            >
                <DialogHeader className="w-full flex justify-beetween pb-2">

                    <div className="w-full text-[20px] text-blue-500">
                        Entry For {props.tabType}

                    </div>
                    <div className='text-right'>
                        <XMarkIcon className='cursor-pointer w-5 h-5 text-gray-600 hover:text-gray-900' onClick={() => setModaloc({ ...modaloc, entryCpoe: false })} />
                    </div>

                </DialogHeader>
                <DialogBody className=" text-left text-black text-[15px] justify-center pt-0">
                    <Entry tabType={props.tabType} />
                </DialogBody>
                {/* <DialogFooter className="text-center justify-center">
                   
                   
                </DialogFooter> */}
            </Dialog>
        </>
    )
}

export default AllTabsGrid
