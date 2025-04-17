"use client";
import React, { useEffect, useState } from "react";
import Input from "../../../_common/input";
import ActionButton from "../../../_common/button";
import {
    changePassword,
    getCaptcha,
    logOutUser,
} from "../../../utilities/api-urls";
import services from "../../../utilities/services";
import { ToastContainer, toast } from "react-toastify";
import { redirect, useRouter } from "next/navigation";
import { LOGIN_ROUTE } from "../../../utilities/constants";
import axios from "axios";
import {
    clearLocalItems,
    getLocalItem,
    removeLocalItem,
} from "../../../utilities/local";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import UserContext from "@/app/utilities/user-context";
import CaptchaBox from "@/app/_common/captcha-box";
import CardLayout from "@/app/_common/card-layout";
import Loader from "@/app/_common/loader";

export default function PasswordChange() {
    const router = useRouter();
    const [forgotPass, setForgotPass] = useState({
        userId: "",
        oldPassword: "",
        newPassword: "",
        isResetPsaaword: 0,
    });
    let loginResp: any = JSON.parse(getLocalItem("loginResponse")!);
    const [txId, setTxId] = useState("");
    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<any>({
        oldPassword: "",
        newPassword: "",
    });
    const validatePassword = (password: string): string => {
        let errorMessage = "";
        const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

        if (!passwordRegex.test(password)) {
            errorMessage =
                "Use 1 special charactors,1 Capital letter, 1 number, min 8 numbers";
        }
        return errorMessage;
    };

    const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setForgotPass({ ...forgotPass, [name]: value });
    };

    const handleChangePassword = () => {
        // e.preventDefault();

        const errorMessage = validatePassword(forgotPass.newPassword);

        if (errorMessage !== "") {
            setErrMsg({
                ...errMsg,
                newPassword: errorMessage,
            });
        } else {
            setErrMsg({
                ...errMsg,
                newPassword: errorMessage,
            });
            if (forgotPass.oldPassword === forgotPass.newPassword) {
                toast.error("Should not be same as old password...");
            } else {
                let postObj = {
                    userId: loginResp.userId,
                    username: loginResp.username,
                    oldPassword: forgotPass.oldPassword,
                    password: forgotPass.newPassword,
                    isResetPsaaword: forgotPass.isResetPsaaword,
                    captchaValue: window.btoa(capthaValue),
                    txId: txId,
                };
                axios
                    .post(changePassword, postObj)
                    .then((response: any) => {
                        let postObj1 = {
                            username: loginResp.username,
                            userId: loginResp.userId,
                        };
                        if (loginResp.statusMessage === "Should create password") {
                            // axios.post(`${forceLogout}`, {
                            //     userid: loginResp.userId
                            // })
                            //     .then((response: any) => {
                            //         console.log(response)
                            //     })
                            //     .catch((err: any) => {
                            //         console.log(err.message);
                            //     })
                            clearLocalItems();
                            router.replace("/login");
                        } else {
                            services
                                .create(logOutUser, postObj1)
                                .then((response) => {
                                    removeLocalItem("loginResponse");
                                    toast.success(
                                        `"Password changed successfully, Please re-login"`
                                    );
                                    router.replace("/login");
                                })
                                .catch((err) => {
                                    console.log(err);
                                    if (err.message && err.message.includes("401")) {
                                        // Token Expired
                                        removeLocalItem("loginResponse");
                                        router.replace(LOGIN_ROUTE);
                                    }
                                });
                        }
                    })
                    .catch((error: any) => {
                        console.log(error);
                        generateCaptcha();
                        toast.error(`${error.response.data.statusMessage}`);
                    });
            }
        }
    };

    const handleCancel = () => {
        if (loginResp.rollDesc == "Front Office") {
            router.push("/frontdesk/dashboard");
        } else if (loginResp.rollDesc == "DOCTOR") {
            router.push("/doctor/dashboard");
        } else if (loginResp.rollDesc == "Nurse") {
            router.push("/nurse/dashboard");
        } else {
            router.replace("/login");
            clearLocalItems();
        }
    };
    const [showPassword, setShowPassword] = React.useState(true);
    const [showNewPassword, setShowNewPassword] = React.useState(true);
    const handleNewPasswordIcon = (data: any) => {
        setShowNewPassword(data);
    };
    const [capthaValue, setCapthaValue] = useState("");
    const [captcha, setCaptcha] = useState("");
    const handlePasswordIcon = (data: boolean) => {
        setShowPassword(data);
    };
    const generateCaptcha = () => {
        setLoading(true);
        services
            .get(getCaptcha, {}, false)
            .then((response: any) => {
                setLoading(false);
                let captchaCode = window.atob(response.data.captchBytes);
                setCaptcha(captchaCode);
                setTxId(response.data.txId);
            })
            .catch((err: any) => {
                toast.error("Error Getting Captcha");
                setLoading(false);
            });
    };
    const handleCapthaChange = (value: any) => {
        if (value == captcha) {
        }
        setCapthaValue(value);
    };
    const onSubmit = () => {
        generateCaptcha();
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <>
            {loginResp !== null && (
                <div className={` mt-6`}>
                    <div className="block max-w-xs rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.20)] dark:bg-neutral-700">
                        <CardLayout
                            cardContent={
                                <div className="forgot-card block max-w-xs rounded-lg p-2 bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                                    <div className="loginCard">
                                        <h1 className="text-center text-md font-bold pt-3">
                                            Change Password
                                        </h1>
                                        <div className="login-controls">
                                            <div className="relative input-width">
                                                <Input
                                                    type={showPassword ? "password" : "text"}
                                                    label="Old Password"
                                                    name="oldPassword"
                                                    value={forgotPass.oldPassword}
                                                    handleChange={inputHandler}
                                                    containerProps={{
                                                        className: "!min-w-0",
                                                    }}
                                                />
                                                <span className="demo cursor-pointer text-blue-gray-700 absolute right-5 bottom-3 text-sm inset-y-1/4 flex items-center">
                                                    {showPassword ? (
                                                        <VisibilityIcon
                                                            onClick={() => {
                                                                handlePasswordIcon(false);
                                                            }}
                                                            fontSize="inherit"
                                                        />
                                                    ) : (
                                                        <VisibilityOffIcon
                                                            onClick={() => {
                                                                handlePasswordIcon(true);
                                                            }}
                                                            fontSize="inherit"
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="login-controls">
                                            <div className="relative">
                                                <Input
                                                    type={showNewPassword ? "password" : "text"}
                                                    label="New Password"
                                                    name="newPassword"
                                                    // watch={watch}
                                                    value={forgotPass.newPassword}
                                                    handleChange={inputHandler}
                                                    containerProps={{
                                                        className: "!min-w-0",
                                                    }}
                                                />
                                                <span className="demo cursor-pointer text-blue-gray-700 absolute right-5 bottom-3 text-sm inset-y-1/4 flex items-center">
                                                    {showNewPassword ? (
                                                        <VisibilityIcon
                                                            onClick={() => {
                                                                handleNewPasswordIcon(false);
                                                            }}
                                                            fontSize="inherit"
                                                        />
                                                    ) : (
                                                        <VisibilityOffIcon
                                                            onClick={() => {
                                                                handleNewPasswordIcon(true);
                                                            }}
                                                            fontSize="inherit"
                                                        />
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full">
                                            <span className="text-red text-[11px] text-red-500">
                                                {errMsg.newPassword}
                                            </span>
                                        </div>
                                        <div>
                                            <CaptchaBox
                                                captchaCode={captcha}
                                                generateCaptcha={generateCaptcha}
                                                handleCapthaChange={handleCapthaChange}
                                                onSubmit={onSubmit}
                                                capthaValue={capthaValue}
                                            />
                                        </div>
                                        <div className="login-controls flex forgotlogbutton py-3 gap-2">
                                            <ActionButton
                                                buttonText={"Submit"}
                                                handleSubmit={handleChangePassword}
                                                width="fit-content"
                                            />
                                            <ActionButton
                                                buttonText={"Cancel"}
                                                color="red"
                                                handleSubmit={handleCancel}
                                                width="fit-content"
                                            />
                                        </div>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            )}
        </>
    );
}
