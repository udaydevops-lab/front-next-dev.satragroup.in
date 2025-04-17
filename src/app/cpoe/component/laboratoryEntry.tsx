import ActionButton from '@/app/_common/button'
import DateInput from '@/app/_common/date-input'
import DateTime from '@/app/_common/date-time-picker'
import Textarea from '@/app/_common/text-area'
import { Input } from '@material-tailwind/react'
import moment from 'moment'
import React, { useState } from 'react'
import Select from 'react-tailwindcss-select'

function LaboratoryEntry() {
    const [feilds, setFeilds] = useState<any>({
        // resultEnterdDate: moment()
    })
    const handelProceduresEntry = () => { }
    const handelVerify = () => { }
    const handelPrint = () => { }
    const performedByDoctorList: any = [
        { label: "mahesh", value: "mahesh" },
        { label: "raja", value: "raja" },
        { label: "kranthi", value: "kranthi" },
        { label: "karthik", value: "karthik" },
    ]
    const specimenTypeList: any = [
        { label: "test 1", value: "test 1" },
        { label: "test 2", value: "test 2" },
        { label: "test 3", value: "test 3" },
        { label: "test 4", value: "test 4" },
    ]
    return (
        <>
            <div className='w-full overflow-auto'>
                <div className='w-full flex flex-wrap justify-end mb-4'>
                    <div className='w-2/6 relative p-2 '>
                        <DateTime
                            name="ResultEnterdDate"
                            label="Sample Collection Date Time"
                            onChange={(e: any) => setFeilds({ ...feilds, ResultEnterdDate: e })}
                            value={feilds.ResultEnterdDate}
                            slotProps={{
                                actionBar: {
                                    actions: ["today"],
                                },
                            }}
                        />
                    </div>
                    <div className='w-2/6 relative p-2 '>
                        <DateTime
                            name="ResultEnterdDate"
                            label="Sample Acknowledgment Date Time"
                            onChange={(e: any) => setFeilds({ ...feilds, ResultEnterdDate: e })}
                            value={feilds.ResultEnterdDate}
                            slotProps={{
                                actionBar: {
                                    actions: ["today"],
                                },
                            }}
                        />
                    </div>
                    <div className='w-2/6 relative mt-2 p-2 '>
                        <Select
                            placeholder="Referral Priority"
                            primaryColor="blue"
                            value={feilds.specimenType}
                            options={specimenTypeList}
                            onChange={(e: any) => setFeilds({ ...feilds, specimenType: e })}
                        />
                    </div>

                    <div className='w-2/6 relative p-2 '>
                        <DateTime
                            name="ResultEnterdDate"
                            label="Result Enterd Date Time"
                            onChange={(e: any) => setFeilds({ ...feilds, ResultEnterdDate: e })}
                            value={feilds.ResultEnterdDate}
                            slotProps={{
                                actionBar: {
                                    actions: ["today"],
                                },
                            }}
                        />
                    </div>
                    <div className='w-2/6 relative p-2 '>

                        <DateTime
                            name="resultVerifyedDate"
                            label="Result Verifyed Date Time"
                            onChange={(e: any) => setFeilds({ ...feilds, resultVerifyedDate: e })}
                            value={feilds.ResultEnterdDate}
                            slotProps={{
                                actionBar: {
                                    actions: ["today"],
                                },
                            }}
                        />
                    </div>
                </div>
                <div className='w-full mb-3 flex flex-wrap'>
                    <div className="w-auto pe-2"><span className='font-samibold'>Service Name: </span><span>Airway Endoscopy Report</span></div>{" | "}
                    <div className="w-auto ps-2 pe-2"><span className='font-samibold'>Deportment: </span><span>Procedures</span></div>{" | "}
                    <div className="w-auto ps-2 pe-2"><span>Speciality: </span><span>test</span></div>{" | "}
                    <div className="w-auto ps-2"><span>SNOMED Code: </span><span>1111111111</span></div>
                </div>
                <div className='w-full mb-2 p-2 border'>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>Parameter</div>
                        <div className='w-1/5 mb-2'>Result</div>
                        <div className='w-1/5 mb-2'>Units</div>
                        <div className='w-1/5 mb-2'>Reference Range</div>
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>WBC</div>
                        <div className='w-1/5 mb-2'><Input className='' placeholder='Enter Result' crossOrigin value={feilds.wbc} onChange={(e: any) => setFeilds({ ...feilds, wbc: e.target.value })} /></div>
                        <div className='w-1/5 mb-2'>10<sup>9</sup> / L</div>
                        <div className='w-1/5 mb-2'>4.0 - 10.0</div>
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>RBC</div>
                        <div className='w-1/5 mb-2'><Input className='' placeholder='Enter Result' crossOrigin value={feilds.rbc} onChange={(e: any) => setFeilds({ ...feilds, rbc: e.target.value })} /></div>
                        <div className='w-1/5 mb-2'>10<sup>12</sup> / L</div>
                        <div className='w-1/5 mb-2'>4.5 - 6-5</div>
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>HGB</div>
                        <div className='w-1/5 mb-2'><Input className='' placeholder='Enter Result' crossOrigin value={feilds.hgb} onChange={(e: any) => setFeilds({ ...feilds, hgb: e.target.value })} /></div>
                        <div className='w-1/5 mb-2'>9 / L</div>
                        <div className='w-1/5 mb-2'>12.1 - 20.3</div>
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>Lab Param 4</div>
                        <div className='w-1/5 mb-2'><Input className='' placeholder='Enter Result' crossOrigin value={feilds.Lab_4} onChange={(e: any) => setFeilds({ ...feilds, Lab_4: e.target.value })} /></div>
                        <div className='w-1/5 mb-2'>9 / L</div>
                        <div className='w-1/5 mb-2'>12.1 - 20.3</div>
                    </div>
                    <div className='w-full flex gap-4'>
                        <div className='w-2/5 mb-2'>Lab Param 5</div>
                        <div className='w-1/5 mb-2'><Input className='' placeholder='Enter Result' crossOrigin value={feilds.Lab_5} onChange={(e: any) => setFeilds({ ...feilds, Lab_5: e.target.value })} /></div>
                        <div className='w-1/5 mb-2'>9 / L</div>
                        <div className='w-1/5 mb-2'>12.1 - 20.3</div>
                    </div>
                </div>
                <div className="w-full flex mt-2">
                    <div className='w-1/4'>
                        <Select placeholder="Performed By Doctor *" primaryColor="blue" value={feilds.performedByDoctor} options={performedByDoctorList} onChange={(e: any) => setFeilds({ ...feilds, performedByDoctor: e })} />
                    </div>
                    <div className='w-3/4 flex justify-end gap-4'>{["SAVE", "VERIFY", "PRINT"].map((text, index) => <ActionButton key={index} buttonText={text} handleSubmit={index === 0 ? handelProceduresEntry : (index === 1 ? handelVerify : handelPrint)} width="w-[120px] py-3" />)}
                    </div>
                </div>
            </div>
        </>
    )
}

export default LaboratoryEntry