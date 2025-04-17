import ActionButton from "@/app/_common/button";
import { ReactSelectBox } from "@/app/_commonfeatures";
import { Button } from "@material-tailwind/react";
import React, { Dispatch, SetStateAction } from "react";

interface DataService {
    fields: any;
    setFields: Dispatch<SetStateAction<any>>;
    serviceEntity: [];
    serviceLocation: [];
    saveServiceEntityLocation: any;
    serviceFieldsClear: any;
    loader: any;
    updateServiceEntityLocation: any;
}

const ServiceEntityForm: React.FC<DataService> = ({
    fields,
    setFields,
    serviceEntity,
    serviceLocation,
    saveServiceEntityLocation,
    serviceFieldsClear,
    loader,
    updateServiceEntityLocation,
}) => {
    return (
        <>
            <div className="w-full flex h-8 gap-4  mb-4">
                <div className="w-1/4 relative">
                    <ReactSelectBox
                        value={fields.service_entity}
                        options={serviceEntity}
                        isSearchable={true}
                        isMultiple={false}
                        onChange={(e: any) => {
                            setFields({
                                ...fields,
                                service_entity: e,
                            });
                        }}
                        label="Service Entity"
                        optionListWidtsize={true}
                    />
                </div>

                <div className="w-2/4 relative">
                    <ReactSelectBox
                        value={fields.service_location}
                        options={serviceLocation}
                        isSearchable={true}
                        isMultiple={fields.serviceEntityAssignId !== null ? false : true}
                        onChange={(e: any) => {
                            setFields({
                                ...fields,
                                service_location: e,
                            });
                        }}
                        label="Location"
                        optionListWidtsize={true}
                    />

                </div>

                <div className="w-1/4 flex gap-4">
                    <ActionButton
                        buttonText={
                            loader ?
                                <div className='w-full flex justify-center items-center'>
                                    <div className='innerBtnloader'></div>
                                </div> :
                                fields.serviceEntityAssignId !== null ? "Update" : "Save"
                        }
                        handleSubmit={fields.serviceEntityAssignId !== null ? updateServiceEntityLocation : saveServiceEntityLocation}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                        disabled={
                            fields.serviceEntityAssignId !== null ?
                                fields.service_entity?.label !== "Service Entity" &&
                                    (fields?.service_location?.length > 0 ||
                                        fields?.service_location?.label !== "Location")
                                    ? false
                                    : true :
                                fields.service_entity?.label !== "Service Entity" &&
                                    fields?.service_location?.length > 0
                                    ? false
                                    : true
                        }
                    />

                    <ActionButton
                        buttonText="Reset"
                        handleSubmit={serviceFieldsClear}
                        width="w-[120px] text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                    />
                </div>
            </div>
        </>
    );
};

export default ServiceEntityForm;
