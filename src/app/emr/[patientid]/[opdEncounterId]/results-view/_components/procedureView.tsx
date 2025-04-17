import ActionButton from '@/app/_common/button'
import { getResultEntry } from '@/app/utilities/api-urls'
import services from '@/app/utilities/services'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

function ProcedureView(props: any) {
    const [rowData, setRowData] = useState<any>({})
    const [feilds, setFeilds] = useState<any>({})
    const [resultsFeilds, setResultsFeilds] = useState<any>({})
    const [printBtn, setPrintBtn] = useState<any>(true)

    const handelOk = () => { }
    const handelCancel = () => {
        props.setModaloc({ ...props.modaloc, view: false })
    }
    const handelPrint = () => { }
    const getRowData = async () => {
        setRowData(props.modaloc.rowData)
    }
    const getServiceData = async () => {

        try {
            const response = await services.get(
                getResultEntry +
                `patientId=${props.modaloc.rowData.patientId}&opdEncouterId=${props.modaloc.rowData.opdEncounterId}&resultEntryType=Proceduers&cpoeId=${props.modaloc.rowData.id}`
            );
            setPrintBtn(response.data.resultEntryItemDto.length > 0 ? false : true)
            if (response.data.resultEntryItemDto.length > 0) {
                setResultsFeilds(response.data.resultEntryItemDto);

                setFeilds({
                    ...feilds,
                    resulEnteredDateTime: response.data.resulEnteredDateTime,
                });
            }


        } catch (err: any) {
            console.log(err.message);
        }
    }
    useEffect(() => {
        getRowData()
        getServiceData()
    }, [])
    return (
        <>
            <div className='w-full overflow-auto mt-2'>
                <div className='w-full mb-3 flex flex-wrap'>
                    <div className="w-auto pe-2"><span className='font-semibold'>Service Name: </span><span>{rowData.labServiceDesc}</span></div>{" | "}
                    <div className="w-auto ps-2 pe-2"><span className='font-semibold'>Deportment: </span><span>{rowData.cpoeType}</span></div>{" | "}
                    <div className="w-auto ps-2 pe-2"><span className='font-semibold'>Speciality: </span><span>{rowData.specialty}</span></div>{" | "}
                    <div className="w-auto ps-2"><span className='font-semibold'>SNOMED Code: </span><span>{rowData.snomedCode}</span></div>
                </div>
                <div className='w-full mb-2 p-2 border'>
                    <div className='w-full flex gap-4'>
                        <div className='w-1/3 mb-2'>Parameter</div>
                        <div className='w-2/3 mb-2'>Result</div>
                    </div>
                    {
                        resultsFeilds && resultsFeilds.length > 0 ? (
                            resultsFeilds.map((item: any, index: number) => (
                                <div className="w-full flex gap-4" key={index}>
                                    <div className="w-1/3 mb-2">{item.parameter}</div>
                                    <div className="w-2/3 mb-2">
                                        {item.result}
                                    </div>
                                </div>
                            ))
                        ) : (
                            "No Record For Now"
                        )
                    }

                </div>
                <div className="w-full flex mt-2">
                    <div className='w-1/4'>
                        Performed By Doctor: {feilds.performedByDoctor}
                    </div>
                    <div className='w-3/4 flex justify-end gap-4'>{["OK", "CANCEL", "PRINT"].map((text, index) => <ActionButton key={index} buttonText={text} disabled={text === "PRINT" ? printBtn : null} handleSubmit={index === 0 ? handelOk : (index === 1 ? handelCancel : handelPrint)} width="w-[120px] py-3" />)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProcedureView