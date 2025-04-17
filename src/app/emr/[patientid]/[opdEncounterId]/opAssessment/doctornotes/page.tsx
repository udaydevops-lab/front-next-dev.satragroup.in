"use client"
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useParams } from "next/navigation";
import services from "@/app/utilities/services";
import { getDoctorNote, saveDoctorNotes } from "@/app/utilities/api-urls";
import { toast } from "react-toastify";
import { getLocalItem } from "@/app/utilities/local";
import ActionButton from "@/app/_common/button";
import Textarea from "@/app/_common/text-area";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import roleInfoScreenData from "@/app/_commonfeatures/ScreenDataHoc";
import NoScreenData from "@/app/_common/NoScreenData";

function DoctorNotes(props: any) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm();
    const [doctorNote, setDoctorNote] = useState("");
    const [oldNote, setOldNote] = useState(false);
    const [oldNoteId, setOldNoteId] = useState('');
    const [key, setKey] = useState(33);
    const [oldOpAssementHeaderId, setOldOpAssementHeaderId] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const router = useRouter();
    const { patientid, opdEncounterId } = useParams();

    const handleDoctorNote = (e: any) => {
        setDoctorNote(sanitizeInput(e.target.value));
    };

    const storedLoginResponse = getLocalItem("loginResponse");
    let empName;

    try {
        empName = storedLoginResponse ? JSON.parse(storedLoginResponse).employeename : "";
    } catch (error) {
        console.error("Error parsing JSON:", error);
        empName = "";
    }

    const doctor = empName;

    const handleSave = async () => {
        if (!doctorNote) {
            toast.error("Please Add Doctor Note.");
        } else {
            const postObj = {
                patientId: patientid,
                opdEncounterId: opdEncounterId,
                statusFlag: 1,
                recordedBy: doctor,
                opAssessmentDoctorNotesDto: {
                    doctorNotes: doctorNote,
                    statusFlag: 1,
                },
            };
            await services.create(saveDoctorNotes, postObj);
            toast.success('Success');
            setOldNote(true);
        }
    };

    const handleUpdate = async () => {
        const postObj = {
            patientId: patientid,
            opdEncounterId: opdEncounterId,
            statusFlag: 1,
            opAssementHeaderId: oldOpAssementHeaderId,
            opAssessmentDoctorNotesDto: {
                id: oldNoteId,
                doctorNotes: doctorNote,
                statusFlag: 1,
            },
        };

        try {
            const response = await services.create(saveDoctorNotes, postObj);
            toast.success('Successfully Updated Doctor Note');
            getDoctorNoteData();
            setOldNote(true);
        } catch (error) {
            console.error("Error updating doctor note:", error);
            toast.error("Error updating doctor note. Please try again!");
        }
    };

    const getDoctorNoteData = async () => {
        try {
            const data = await services.get(getDoctorNote + patientid + "/" + opdEncounterId);

            if (data.data.length > 0) {
                setOldNote(true);
                setDoctorNote(data.data[0].doctorNotes);
                setOldNoteId(data.data[0].id);
                setOldOpAssementHeaderId(data.data[0].opAssementHeaderId);
            } else {
                setOldNote(false);
            }
        } catch (error) {
            console.error("Error fetching doctor note data:", error);
        }
    };

    useEffect(() => {
        getDoctorNoteData();
    }, []);
    useEffect(() => {
        const isValid = !!doctorNote;
        setIsFormValid(isValid);
    }, [doctorNote]);
    if (!props?.screenData || props?.screenData?.View !== 1) {
        return <NoScreenData />;
    }
    return (
        <div key={key}>
            <div className={props?.screenData?.Save === 0 ? "pointer-events-none button-disabled" : "pointer-events-auto"}>
                <div className="md:w-full my-2">
                    <Textarea label="Doctor Notes" onChange={handleDoctorNote} value={doctorNote} minRows="15" height="300px" />
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    <div className={`md:w-1/4 gap-3 justify-end flex my-2`}>
                        {/* {oldNote ? (
                        <ActionButton buttonText="UPDATE" handleSubmit={handleUpdate} width="py-3 w-full" disabled={!isFormValid} />
                    ) : (
                        <ActionButton buttonText="SAVE" handleSubmit={handleSave} width="py-3 w-full" disabled={!isFormValid} />
                    )} */}

                        {oldNote && props?.screenData?.Update === 1 ? (
                            <ActionButton
                                buttonText="UPDATE"
                                handleSubmit={handleUpdate}
                                width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={!isFormValid || props?.screenData?.Update === 0}
                            />
                        ) : !oldNote && props?.screenData?.Save === 1 ? (
                            <ActionButton
                                buttonText="SAVE"
                                handleSubmit={handleSave}
                                width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={!isFormValid || props?.screenData?.Save === 0}
                            />
                        ) : oldNote && props?.screenData?.Update === 0 && props?.screenData?.Save === 1 ? (
                            <ActionButton
                                buttonText="SAVE"
                                width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                disabled={true}
                            />
                        ) : null
                        }

                        <ActionButton buttonText="SIGN" disabled={true} width="w-[120px] text-white text-[14px] py-2 !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]" />

                    </div>
                </div>
            </div>
        </div >
    );
}


export default roleInfoScreenData(DoctorNotes, "DN")