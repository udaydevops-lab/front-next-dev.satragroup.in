"use client"
import ActionButton from '@/app/_common/button'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { TabPageTitle } from '@/app/lab/_component'
import React, { useEffect, useState } from 'react'
import { getLocalItem } from '@/app/utilities/local'
import services from '@/app/utilities/services'
import { assignProcedureParameterHeaderId, assignRadiologyParameterHeaderId, getAllProcedureAssignParameter, getAllRadiologyAssignServices, saveProcedureAssignParameter, saveRadiologyAssignParameter, updateProcedureAssignParameter, updateRadiologyAssignParameter } from '@/app/utilities/api-urls'
import { toast } from 'react-toastify'
import AssignTestParameterForm from './components/AssignTestParameterForm'
import AssignTestParameterGrid from './components/AssignTestParameterGrid'

const AssignTestParameterMain = () => {
    const [loder, setLoder] = useState(false)
    const [btnStatus, setBtnStatus] = useState("save")
    const [fields, setFields] = useState<any>({
        serviceName: { label: "Service Name" },
        serviceParameterName: { label: "Service Parameter Name" },
        serviceCode: "",
        deportment: "",
        specialty: "",
    })
    const [parameterGrid, setParameterGrid] = useState<any>([])
    const [serviceGrid, setServiceGrid] = useState<any>([])
    const [popup, setPopup] = useState<any>({
        open: false
    })

    // geting employee name
    const storedLoginResponse = getLocalItem("loginResponse");
    let empName: any;
    try {
        empName = storedLoginResponse
            ? JSON.parse(storedLoginResponse).employeename
            : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = "";
    }

    const handleNew = () => {
        handleClear()
        setPopup({
            open: true
        })
    }

    // parameter save function
    const handleSave = () => {
        let url = btnStatus === "save" ? saveProcedureAssignParameter : updateProcedureAssignParameter;
        let message = btnStatus === "save" ? "Successfully added Procedures Assign Parameter" : "Successfully Updated Procedures Assign Parameter";
        //updateRadiologyAssignParameter
        const parameterData: any = parameterGrid.map((list: any) => ({
            ...list,
            assignProcedureParameterItemId: btnStatus === "save" ? null : list.assignProcedureParameterItemId || null,
            terminalogyCode: list.terminologyCode,
            terminologyDesc: list.terminologyDesc,
            procedureParameterCode: list.procedureParameterCode,
            assignPrameterType: "Procedure",
            procedureParameterDesc: list.procedureParameterDescription,
            resultType: list.resultType,
            statusFlag: 1,
            sequenceOrderIdUi: list.sequenceOrderIdUi,
        }))
        const postObj = {
            assignProcedureParameterHeaderId: btnStatus === "save" ? null : fields.serviceName.assignProcedureParameterHeaderId,
            serviceDesc: fields.serviceName.serviceDesc,
            serviceCode: fields.serviceName.serviceCode,
            department: fields.serviceName.departmentDesc,
            speciality: fields.serviceName.superSpecialityDesc,
            departmentCode: fields.serviceName.department,
            specialityCode: fields.serviceName.superSpeciality,
            terminalogyCode: fields.serviceName.terminalogyCode,
            terminalogyDesc: fields.serviceName.terminalogyDesc,
            statusFlag: 1,
            generatedBy: btnStatus === "save" ? empName : fields.serviceName.generatedBy,
            updatedBy: btnStatus === "save" ? null : empName,
            assignProcedureParameterItemSet: parameterData,
        }
        //  console.log(url, postObj)
        services
            .create(url, postObj)
            .then((res) => {
                toast.success(message);
                getAllAssignServicesData();
                setPopup({ open: false });
            })
            .catch((err) => {
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                } else {
                    toast.error("Something went wrong please try again");
                }
            });
    }

    //add parameterGrid data function 
    const handleAdd = () => {
        const isDuplicateUser = parameterGrid?.some(
            (list: any) => list.procedureParameterDescription === fields.serviceParameterName.procedureParameterDescription
        );

        if (isDuplicateUser) {
            return toast.error(`This ${fields?.serviceName?.serviceDesc?.label} parameter name already listed on the grid, please update parameter name.`);
        }

        let data = fields.serviceParameterName;

        setParameterGrid((prev: any) => {
            // Determine the next sequenceOrderIdUi
            const nextSequenceOrderIdUi = prev.length > 0
                ? (parseInt(prev[prev.length - 1].sequenceOrderIdUi) + 1)
                : "1";

            const newItem = { ...data, sequenceOrderIdUi: nextSequenceOrderIdUi };

            return [...prev, newItem];
        });


        setFields({ ...fields, serviceParameterName: { label: "Service Parameter Name" } });

    }

    //clear the form function
    const handleClear = () => {
        setBtnStatus("save")
        setFields({
            serviceName: { label: "Service Name" },
            serviceParameterName: { label: "Service Parameter Name" },
            serviceCode: "",
            deportment: "",
            specialty: "",
        })
        setParameterGrid([])
    }
    //edit function
    const handleEdit = async (row: any) => {
        console.log(row)
        let id = row.assignProcedureParameterHeaderId
        try {
            const res = await services.get(`${assignProcedureParameterHeaderId}${id}`)
            setBtnStatus("update")
            console.log(res.data)
            const parameterGridData1: any = res.data.assignProcedureParameterItemSet.map((list: any) => ({
                ...list,
                procedureParameterDescription: list.procedureParameterDesc,
                procedureParameterCode: list.procedureParameterCode,
            }))
            const parameterGridData: any = parameterGridData1.sort((a: any, b: any) => parseInt(a.sequenceOrderIdUi) - parseInt(b.sequenceOrderIdUi));

            const serviceData: any = {
                ...res.data,
                label: res.data.serviceDesc,
                value: res.data.serviceDesc,
                department: res.data.departmentCode,
                departmentDesc: res.data.department,
                serviceCode: res.data.serviceCode,
                serviceDesc: res.data.serviceDesc,
                superSpeciality: res.data.speciality,
                superSpecialityDesc: res.data.speciality,
                terminalogyCode: res.data.terminalogyCode,
                terminalogyDesc: res.data.terminalogyDesc,
                departmentCode: res.data.departmentCode,
                specialityCode: res.data.specialityCode,
            }

            setParameterGrid(parameterGridData)
            setFields({
                serviceName: serviceData,
                serviceParameterName: { label: "Service Parameter Name" },
                serviceCode: res.data.serviceCode,
                deportment: res.data.department,
                specialty: res.data.speciality,
            })
            setPopup({
                open: true
            })

        } catch (error) {

        }
    }

    const getAllAssignServicesData = async () => {
        try {
            const res = await services.get(getAllProcedureAssignParameter)
            // console.log(res.data)
            setServiceGrid(res.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        getAllAssignServicesData()
    }, [])
    return (
        <>
            <div className='flex w-full justify-between gap-4 mt-3'>

                <div className=''>
                    <TabPageTitle
                        title='Assign Test Parameter '
                    />
                </div>
                <ActionButton
                    buttonText="New"
                    width="w-[120px] text-white  text-[14px] py-2 bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    handleSubmit={handleNew}
                />
            </div>
            <div className='w-full p-3 bg-white rounded-[12px] mt-5  shadow-[0_3px_6px_#00000029] data-grid-newThem'>
                <AssignTestParameterGrid
                    sampleGridData={serviceGrid}
                    getAllAssignServicesData={getAllAssignServicesData}
                    handleEdit={handleEdit} />

            </div>
            <div>
                <ReactCommonDialog
                    dialogtitle={"New Assign Test Parameter Master"}
                    open={popup.open}
                    size={'xl'}
                    handler={() => {
                        // setPopup({
                        //     open: false
                        // })
                    }}
                    popupClose={() => {
                        setPopup({
                            open: false
                        })
                    }}
                    Content={<AssignTestParameterForm
                        fields={fields}
                        setFields={setFields}
                        parameterGrid={parameterGrid}
                        setParameterGrid={setParameterGrid}
                        handleAdd={handleAdd}
                        loder={loder}
                        handleSave={handleSave}
                        handleClear={handleClear}
                        btnStatus={btnStatus}
                    />}
                />
            </div>

        </>
    )
}

export default AssignTestParameterMain