import { getLocalItem } from '@/app/utilities/local'
import React, { useState } from 'react'

interface propsData {
    FormPropsTextFields: any,
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    register: any,
    Radio: any,
    Button: any,
    handleSubmit: any,
    onGenerateOTP: any,
    generate: any,
    showOTPField: any,
    OtpField: any,
    handleResend: any,
    setOtpFromChild: any,
    otpStatus: any,
    ActionButton: any,
    onSubmitOTP: any,
    clearForm: any,
    getValues: any,
    key: any,
    aadhaarSeconds: any,
    setAadhaarSeconds: any,
    aadhaarResend: any,
    setAadhaarResend: any
    aadhaarsendBtn: any
}

const AadhaarLogin: React.FC<propsData> = ({
    FormPropsTextFields,
    handleInputChange,
    register,
    Radio,
    Button,
    handleSubmit,
    onGenerateOTP,
    generate,
    showOTPField,
    OtpField,
    handleResend,
    setOtpFromChild,
    otpStatus,
    ActionButton,
    onSubmitOTP,
    clearForm,
    getValues,
    key,
    aadhaarSeconds,
    setAadhaarSeconds,
    aadhaarResend,
    setAadhaarResend,
    aadhaarsendBtn,
}) => {
    const [healthId, setHealthId] = useState(false)
    const numericRegex = /^[0-9]+$/;
    const mixedAlphaNumericRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9]+$/;
    const alphabeticRegex = /^[a-zA-Z]+$/;
    const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
    const newInputchange = (e: any) => {
        handleInputChange(e)
        let inputVal = `${e.target.value}`
        if (numericRegex.test(inputVal)) {
            return setHealthId(false);
        } else if (mixedAlphaNumericRegex.test(inputVal)) {
            return setHealthId(true);

        } else if (alphabeticRegex.test(inputVal)) {
            return setHealthId(true);
        }
    }

    return (
        <div className='w-[90%] mx-auto' key={key}>
            <form method="POST" className="block max-w-lg p-6 bg-white border border-gray-200 rounded-lg shadow">
                <div className="w-full card mx-auto bg-white dark:bg-slate-850 py-3 rounded-2xl">
                    <div className="relative input-width">
                        <FormPropsTextFields
                            crossOrigin={undefined}
                            type="text"
                            handleChange={newInputchange}
                            label="ABHA Number / ABHA Address"
                            {...register("healthId")}
                            required={true}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-blue-200 rounded-lg focus:outline-blue-200 focus:border-blue-500"
                        // handleKeyPress={(e: any) => {
                        //     if (!isNaN(e.target.value)) {
                        //         if (e.key === "Backspace" || e.key === "Delete") return;

                        //         if (/^[0-9-]$/.test(e.key)) {
                        //             if (
                        //                 e.target.value.length === 2 ||
                        //                 e.target.value.length === 7 ||
                        //                 e.target.value.length === 12
                        //             ) {
                        //                 e.target.value = e.target.value + "-";
                        //             }
                        //             if (e.target.value.length > 16) {
                        //                 e.preventDefault();
                        //             }
                        //         }
                        //     }
                        // }
                        // }
                        />

                        {healthId &&
                            <span className="demo text-blue-gray-700 absolute right-5 inset-y-1/4 flex items-center">
                                @{loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}
                            </span>
                        }

                    </div>

                    <div className="mx-auto grid mt-6">
                        <label className="block tracking-wide text-grey-darker text-xs font-bold mb-2">
                            Authorization Type :
                        </label>
                    </div>
                    <div className="-mx-3 md:flex mb-6">
                        <div className="md:w-1/2 px-3 mb-6 md:mb-0">
                            <Radio
                                crossOrigin={undefined}
                                {...register("auth")}
                                label="Mobile"
                                value={"MOBILE_OTP"}
                            />
                        </div>
                        <div className="md:w-1/2 px-3">
                            <Radio
                                crossOrigin={undefined}
                                {...register("auth")}
                                name="auth"
                                label="Aadhaar"
                                value={"AADHAAR_OTP"}
                            />
                        </div>
                    </div>
                    <div className="mx-auto grid ">
                        {aadhaarsendBtn ?
                            <Button
                                onClick={handleSubmit(onGenerateOTP)}
                                type="submit"
                                disabled={generate}
                                className="full lg cursor-pointer  px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            >
                                Send OTP
                            </Button>
                            :
                            <Button
                                type="submit"
                                disabled={true}
                                className="full lg cursor-not-allowed  px-4 block mb-4 transition w-full text-center rounded !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                            >
                                Send OTP
                            </Button>
                        }
                    </div>
                    {showOTPField ? (
                        <div className="flex flex-col space-y-16">
                            <div className="w-[80%] mx-auto">
                                <OtpField
                                    onResendOTP={handleSubmit(handleResend)}
                                    setOtpFromChild={setOtpFromChild}
                                    otpStatus={otpStatus}
                                    resendotp={aadhaarResend}
                                    seconds={aadhaarSeconds}
                                    setSeconds={setAadhaarSeconds}
                                    setResendOtp={(flag: any) => setAadhaarResend(flag)}
                                />
                            </div>
                        </div>
                    ) : null}
                    {showOTPField ? (
                        <div className="mt-4">
                            <div className="flex gap-4 w-full">
                                <ActionButton
                                    buttonText="submit"
                                    handleSubmit={onSubmitOTP}
                                    width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />
                                <ActionButton
                                    buttonText="Reset"
                                    handleSubmit={clearForm}
                                    width="w-full text-white  text-[12px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />
                            </div>
                        </div>
                    ) : null}
                </div>
            </form>
        </div>
    )
}

export default AadhaarLogin
