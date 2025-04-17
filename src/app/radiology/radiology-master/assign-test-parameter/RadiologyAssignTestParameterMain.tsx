"use client"
import ActionButton from '@/app/_common/button'
import ReactCommonDialog from '@/app/_commonfeatures/ReactCommonDialog'
import { TabPageTitle } from '@/app/lab/_component'
import React, { useEffect, useState } from 'react'
import RadiologyAssignTestParameterGrid from './components/RadiologyAssignTestParameterGrid'
import RadiologyAssignTestParameterForm from './components/RadiologyAssignTestParameterForm'
import { getLocalItem } from '@/app/utilities/local'
import services from '@/app/utilities/services'
import { assignRadiologyParameterHeaderId, getAllRadiologyAssignServices, saveRadiologyAssignParameter, updateRadiologyAssignParameter } from '@/app/utilities/api-urls'
import { toast } from 'react-toastify'

const RadiologyAssignTestParameterMain = () => {
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
        let url = btnStatus === "save" ? saveRadiologyAssignParameter : updateRadiologyAssignParameter;
        let message = btnStatus === "save" ? "Successfully added Radiology Assign Parameter" : "Successfully Updated Radiology Assign Parameter";
        //updateRadiologyAssignParameter
        const parameterData: any = parameterGrid.map((list: any) => ({
            ...list,
            assignRadiologyParameterItemId: btnStatus === "save" ? null : list.assignRadiologyParameterItemId,
            terminalogyCode: list.terminologyCode,
            terminologyDesc: list.terminologyDesc,
            parameterCode: list.radiologyParameterCode,
            assignPrameterType: "Radiology",
            parameter: list.radiologyParameterDescription,
            resultType: list.resultType,
            statusFlag: 1,
            sequenceOrderIdUi: list.sequenceOrderIdUi,
        }))
        const postObj = {
            assignRadiologyParameterHeaderId: btnStatus === "save" ? null : fields.serviceName.assignRadiologyParameterHeaderId,
            serviceDesc: fields.serviceName.serviceDesc,
            serviceCode: fields.serviceName.serviceCode,
            department: fields.serviceName.departmentDesc,
            speciality: fields.serviceName.superSpecialityDesc,
            departmentCode: fields.serviceName.department,
            specialityCode: fields.serviceName.superSpeciality,
            terminalogyCode: fields.serviceName.terminalogyCode,
            terminalogyDesc: fields.serviceName.terminalogyDesc,
            statusFlag: 1,
            updatedBy: empName,
            assignParameterItemSet: parameterData,
        }
        //console.log(url, postObj)
        services
            .create(url, postObj)
            .then((res) => {
                toast.success(message);
                getAllRadiologyAssignServicesData();
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
            (list: any) => list.radiologyParameterDescription === fields.serviceParameterName.radiologyParameterDescription
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
        // console.log(row)
        let id = row.assignRadiologyParameterHeaderId
        try {
            const res = await services.get(`${assignRadiologyParameterHeaderId}${id}`)
            setBtnStatus("update")
            console.log(res.data)
            //radiologyParameterCode
            //radiologyParameterDescription


            const parameterGridData1: any = res.data.assignParameterItemSet.map((list: any) => ({
                ...list,
                radiologyParameterDescription: list.parameter,
                radiologyParameterCode: list.parameterCode,
            }))
            const parameterGridData: any = parameterGridData1.sort((a: any, b: any) => parseInt(a.sequenceOrderIdUi) - parseInt(b.sequenceOrderIdUi));

            const serviceData: any = {
                ...res.data,
                label: res.data.serviceDesc,
                value: res.data.serviceDesc,
                department: "D015",
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

    const getAllRadiologyAssignServicesData = async () => {
        try {
            const res = await services.get(getAllRadiologyAssignServices)
            setServiceGrid(res.data)
        } catch (error) {

        }
    }
    useEffect(() => {
        getAllRadiologyAssignServicesData()
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
                <RadiologyAssignTestParameterGrid
                    sampleGridData={serviceGrid}
                    getAllRadiologyAssignServicesData={getAllRadiologyAssignServicesData}
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
                    Content={<RadiologyAssignTestParameterForm
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

export default RadiologyAssignTestParameterMain