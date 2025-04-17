import ActionButton from "@/app/_common/button";
import {
    createServiceEntity,
    getConfigData,
    getCountryDropDown,
} from "@/app/utilities/api-urls";
import { getLocalItem } from "@/app/utilities/local";
import { sanitizeInput } from "@/app/utilities/sanitizeInput";
import services from "@/app/utilities/services";
import { Input } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import Select from "react-tailwindcss-select";

export default function ServiceEntityForm(props: any) {
    const [serviceEntityCode, setServiceEntityCode] = useState("");
    const [serviceEntityDesc, setServiceEntityDesc] = useState("");
    const [serviceEntityType, setServiceEntityType] = useState<any>("");
    const [serviceEntityTypeList, setServiceEntityTypeList] = useState<any[]>([]);
    const [pinCode, setPinCode] = useState("");
    const [hNo, setHNo] = useState("");
    const [street, setStreet] = useState("");
    const [country, setCountry] = useState("");
    const [state, setState] = useState("");
    const [district, setDistrict] = useState("");
    const [city, setCity] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [contactNo, setContactNo] = useState("");
    const [actionType, setActionType] = useState("Save");
    useEffect(() => {
        getMasterData();
    }, []);

    const getMasterData = () => {
        services
            .get(getConfigData + "serviceType/0")
            .then((response) => {
                const transformedData = response.data.configData.map((item: any) => ({
                    ...item,
                    value: item.code,
                    label: item.desc,
                }));
                setServiceEntityTypeList(transformedData);
            })
            .catch((err) => {
                console.log(err.message);
            });
    };
    const handlePinCodeChange = (e: any) => {
        setPinCode(e.target.value);
        if (e.target.value.length == 6) {
            services
                .get(getConfigData + "Pincode/0/" + e.target.value)
                .then((response) => {
                    setCountry(response.data.configData.output1[0].desc);
                    setDistrict(response.data.configData.output2[0].desc);
                    setState(response.data.configData.output3[0].desc);
                })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };
    const headers = {
        userId: getLocalItem("userId"),
        roleId: getLocalItem("roleId"),
        employeename: getLocalItem("employeeName"),
        employeeid: getLocalItem("employeeId"),
        "Access-Control-Allow-Origin": "*",
    };
    const handleSave = (actionType: string) => {
        if (actionType === "Save") {
            let postObj = {
                serviceEntityCode: serviceEntityCode,
                serviceEntityDesc: window.btoa(serviceEntityDesc),
                serviceEntityId: null,
                statusFlag: 1,
                serviceEntityType: serviceEntityType.value,
                masterAddressTbl: {
                    pincodeId: pinCode,
                    houseNo: hNo,
                    location: street,
                    city: city,
                    country: country,
                    state: state,
                    district: district,
                    mobile: mobileNo,
                    contactNum: contactNo,
                },
            };
            services
                .create(createServiceEntity, postObj, headers)
                .then((response) => { })
                .catch((err) => {
                    console.log(err.message);
                });
        }
    };
    return (
        <div>
            <div className="grid grid-cols-3 gap-10">
                <div>
                    <Input
                        label="Service Entity Code*"
                        crossOrigin={undefined}
                        value={serviceEntityCode}
                        onChange={(e: any) => setServiceEntityCode(e.target.value)}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="Service Entity Description*"
                        crossOrigin={undefined}
                        value={serviceEntityDesc}
                        onChange={(e: any) => setServiceEntityDesc(sanitizeInput(e.target.value))}
                    ></Input>
                </div>
                <div>
                    <Select
                        primaryColor="blue"
                        placeholder="Service Entity Type"
                        onChange={(e: any) => {
                            setServiceEntityType(e);
                        }}
                        options={serviceEntityTypeList}
                        isSearchable={true}
                        value={serviceEntityType}
                    />
                </div>
            </div>
            <h1 className="font-bold mt-4 mb-1 ps-2">Additional Address</h1>
            <div className="grid grid-cols-3 gap-x-10 gap-y-4">
                <div>
                    <Input
                        label="Pin Code*"
                        crossOrigin={undefined}
                        onChange={handlePinCodeChange}
                        value={pinCode}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="House No *"
                        crossOrigin={undefined}
                        value={hNo}
                        onChange={(e) => setHNo(e.target.value)}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="Street"
                        crossOrigin={undefined}
                        value={street}
                        onChange={(e) => setStreet(sanitizeInput(e.target.value))}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="City*"
                        crossOrigin={undefined}
                        value={city}
                        onChange={(e) => setCity(sanitizeInput(e.target.value))}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="Country*"
                        crossOrigin={undefined}
                        value={country}
                        onChange={(e) => setCountry(sanitizeInput(e.target.value))}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="State*"
                        crossOrigin={undefined}
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="District*"
                        crossOrigin={undefined}
                        value={district}
                        onChange={(e) => setDistrict(sanitizeInput(e.target.value))}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="Mobile Number*"
                        crossOrigin={undefined}
                        value={mobileNo}
                        onChange={(e) => setMobileNo(e.target.value)}
                    ></Input>
                </div>
                <div>
                    <Input
                        label="Contact Number / Land Line"
                        crossOrigin={undefined}
                        value={contactNo}
                        onChange={(e) => setContactNo(e.target.value)}
                    ></Input>
                </div>
            </div>
            <div className="mt-3 flex gap-6 justify-end item-end">
                <ActionButton
                    buttonText={actionType}
                    handleSubmit={() => handleSave(actionType)}
                />
                <ActionButton buttonText="Cancel" handleSubmit={props.handleOpen} />
            </div>
        </div>
    );
}
