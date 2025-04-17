"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Input from "../_common/input";
import CardLayout from "../_common/card-layout";
import ErrorMessage from "../_common/error-message";
import CaptchaBox from "../_common/captcha-box";
import services from "../utilities/services";
import { useForm } from "react-hook-form";
import { emailPattern, passwordPattern } from "../utilities/validations";
import Loader from "../_common/loader";
import UserContext from "../utilities/user-context";
import {
    getCaptcha,
    login,
    getAllServiceEntity,
    getAllLocationDetails,
    sendCode,
    emailVerifySubmit,
    changePassword,
    csrfToken,
    getRoleDataById,
    forceLogout,
    getAdminRoleData,
} from "../utilities/api-urls";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ActionButton from "../_common/button";
import { useRouter } from "next/navigation";
import {
    CHANGE_PASSWORD,
    DOCTOR_DASHBOARD_ROUTE,
    FRONT_DESK_DASHBOARD_ROUTE,
    LABORATORY_DASHBOARD_ROUTE,
    LOGIN_ROUTE,
    NURSE_DASHBOARD_ROUTE,
    PROCEDURES_DASHBOARD_ROUTE,
    RADIOLOGY_DASHBOARD_ROUTE,
} from "../utilities/constants";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { Button } from "@material-tailwind/react";
import moment from "moment";
import { getLocalItem, setLocalItem } from "../utilities/local";

export default function Login() {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
        setValue,
        getValues,
    } = useForm();

    const router = useRouter();
    const [loginState, setLoginState] = useState(true);
    const [forgotState, setForgotState] = useState(false);
    const [openReset, setOpenReset] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [captcha, setCaptcha] = useState("");
    const [resetTxnId, setResetTxnId] = useState("");
    const [resetCaptcha, setResetCaptcha] = useState("");
    const [resetCaptchaValue, setResetCaptchaValue] = useState("");
    const [error, setError] = useState("");
    const [capthaValue, setCapthaValue] = useState("");
    const [txId, setTxId] = useState("");
    const [loginData, setLoginData] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfPassword, setShowConfPassword] = useState(true);
    const [confCaptcha, setConfCaptcha] = useState("");
    const [confTxnId, setConfTxnId] = useState("");
    const [confCaptchaValue, setConfCaptchaValue] = useState("");
    const [forgotPass, setForgotPass] = useState({
        username: "",
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [resp, setResp] = useState({
        statusMessage: "",
        txId: "",
        userName: "",
        userId: "",
    });
    const [userId, setUserId] = useState('');
    const [enableForceLogout, setEnableForceLogout] = useState(false);
    //Login captcha
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
    useEffect(() => {
        // Check user already logged-in
        if (
            getLocalItem("loginResponse") &&
            getLocalItem("loginResponse") !== null
        ) {
            navigateToDashboard();
        } else {
            router.replace(LOGIN_ROUTE);
            generateCaptcha();
        }
        // Auto-fill issue fix
        const inputNodes = window.document.getElementsByTagName("input");
        if (inputNodes) {
            for (let i = inputNodes.length - 1; i >= 0; i--) {
                inputNodes[i].focus();
            }
        }
    }, [isLogin]);

    const navigateToDashboard = () => {
        let loginResp: any = JSON.parse(getLocalItem("loginResponse")!);
        console.log("loginResp",loginResp)
        if (loginResp && loginResp["rollDesc"]) {
            switch (loginResp["rollDesc"].toLowerCase()) {
                case "front office":
                case "admin":
                    router.replace(FRONT_DESK_DASHBOARD_ROUTE);
                    break;
                case "nurse":
                    router.replace(NURSE_DASHBOARD_ROUTE);
                    break;
                case "doctor":
                    router.replace(DOCTOR_DASHBOARD_ROUTE);
                    break;
                case "laboratory":
                    router.replace(LABORATORY_DASHBOARD_ROUTE);
                    break;
                case "radiology":
                    router.replace(RADIOLOGY_DASHBOARD_ROUTE);
                    break;
                case "procedures":
                    router.replace(PROCEDURES_DASHBOARD_ROUTE);
                    break;
                default:
                    break;
            }
        }
    };

    //Verify Email Captcha
    const generateResetCaptcha = () => {
        setLoading(true);
        services
            .get(getCaptcha, {}, false)
            .then((response: any) => {
                setLoading(false);
                let captchaCode = window.atob(response.data.captchBytes);
                setResetCaptcha(captchaCode);
                setResetTxnId(response.data.txId);
            })
            .catch((err: any) => {
                toast.error("Error Getting Captcha");
                setLoading(false);
            });
    };
    const handleResetCapthaChange = (value: any) => {
        setResetCaptchaValue(value);
    };
    const handleCapthaChange = (value: any) => {
        if (value == captcha) {
        }
        setCapthaValue(value);
    };

    const handlePasswordIcon = (event: any) => {
        setShowPassword(event);
    };

    //data set local storage
    const handelLocalStorage = async(res: any) => {
        // const newToken = encryptToken(res.token);
        const newData = {
            ...res,
            token: res.token,
            // newtoken: newToken,
            expirationTime: res.expirationTime,
            refreshToken: res.refreshToken,
            statusMessage: res.statusMessage,
            statusFlag: res.statusFlag,
            userId: res.userId,
            employeeid: res.employeeid,
            employeename: res.employeename,
            username: res.username,
            serviceEntityId: res.serviceEntityId,
            locationId: res.locationId,
            roleId: res.roleId,
            instId: res.instId,
            serviceEntityDesc: res.serviceEntityDesc,
            locationDesc: res.locationDesc,
            storeName: res.storeName,
            empImage: res.empImage,
            employeType: res.employeType,
            rollDesc: res.rollDesc,
            licenceExpireDate: res.licenceExpireDate,
            jwtxId: res.jwtxId,
            lastLogin: res.lastLogin,
            abhaSuffix: res.abhaSuffix,
            loginTime: Date.now(),
            isSuperAdmin: res.isSuperAdmin,
            billingGstIncluded:res.billingGstIncluded
        };
         setLocalItem("loginResponse", JSON.stringify(newData));
        setIsLogin(true)
    };
    const [logResp, setLogResp] = useState({
        userId: null,
        username: "",
    });
    //login function
    const onSubmit = (data: any) => {
        let postObj = {
            username: data.userName,
            password: data.password,
            txId: txId,
            captchaValue: window.btoa(capthaValue),
        };
        if (!capthaValue) {
            toast.error("Please Enter captcha")
            return
        }
        if (capthaValue != captcha) {
            setLoading(false);
            toast.error("Invalid Captcha");
            generateCaptcha();
        } else {
            setLoading(true);
            var csrf = "";
            axios.get(csrfToken).then((response) => {
                csrf = response.data.cuti;
                axios
                    .post(login, postObj, {
                        headers: {
                            "X-CSRF-TOKEN": csrf,
                        },
                    })
                    .then((response) => {
                        setLoading(false);
                        
                        if (
                            response.data.statusMessage === "Should create password" &&
                            response.data.statusFlag === 0
                        ) {
                            setLogResp(response.data);
                            setOpenReset(true);
                            setLoginState(false);
                            setForgotState(false);
                            generateConfCaptcha();
                            // router.replace(CHANGE_PASSWORD);
                            handelLocalStorage(response.data);

                        } else if (
                            response.data.token.length > 0 &&
                            response.data.token !== null
                        ) {
                            setLoginData(response.data);
                            handelLocalStorage(response.data);
                            setTimeout(() => {
                            navigateToDashboard();
                            }, 2000);
                            // setTimeout(() => {
                                if (response.data.isSuperAdmin === false) {
                                    //     getAdminroleDataFun(response.data)
                                   getroleDataByIdFun(response.data)
                                }
                                setLoading(false);
                                toast.success('Login successful');
                            // }, 1500);
                        } else {
                            generateCaptcha();
                            setLoading(false);
                            toast.error("Invalid Credentials");
                        }
                    })
                    .catch((err) => {
                        generateCaptcha();
                        setLoading(false);
                        toast.error(err?.response?.data?.statusMessage);
                        if (err?.response?.data?.statusMessage === 'user already Logged in') {
                            setEnableForceLogout(true)
                            setUserId(err?.response?.data?.userId)
                        }
                    });
            });
        }
    };

    // getting data by using role id functionality

    const getroleDataByIdFun = async (roleData: any) => {
        try {
            // const response: any = await services.get(`${getRoleDataById}${roleId}`)
            const response: any = await services.get(`${getRoleDataById}?roleId=${roleData.roleId}&serviceEntityId=${roleData.serviceEntityId}&locationId=${roleData.locationId}`)
            setLocalItem("roleInfo", JSON.stringify(response.data))
            // console.log(response.data)
        } catch (error) {
            console.log(error)
            localStorage.removeItem("roleInfo");

        }
    }
    const getAdminroleDataFun = async (data: any) => {
        try {
            const response: any = await services.get(`${getAdminRoleData}`)
            let responseadmin: any = [
                {
                    roleDes: "satraadmin",
                    rolePrivileges: response.data,
                    roleList: data.roleList,
                }
            ]
            setLocalItem("roleInfo", JSON.stringify(responseadmin))
            // console.log(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const userForceLogout = (userId: any) => {
        axios
            .post(forceLogout, { userid: userId })
            .then((response: any) => {
                setUserId('');
                setEnableForceLogout(false)
                toast.success("Logged out successfully")
            })
            .catch((err: any) => {
                console.log(err.message)
            })

    }

    const forgotFun = () => {
        setLoginState(false);
        setForgotState(true);
        generateResetCaptcha();
        setForgotPass({
            username: "",
            otp: "",
            password: "",
            confirmPassword: "",
        });
    };
    const cancelFun = () => {
        reset({
            userName: "",
            password: "",
        });
        generateCaptcha()
        setOpenReset(false);
        setForgotState(false);
        setLoginState(true);
    };
    const pushTo = (type: string) => {
        switch (type) {
            case "gotoPrivacypage":
                router.push("/privacy-policy");
                break;
            default:
                break;
        }
    };
    //OTP generation to verify in forgot password
    const getCode = (data: any) => {
        // if (forgotPass.username.length > 0 && forgotPass.email.match(emailPattern)) {
        let postObj = {
            username: forgotPass.username,
        };
        setLoading(true);
        axios
            .post(sendCode, postObj)
            .then((response) => {
                setLoading(false);
                setResp(response.data);
                toast.success(response.data.statusMessage);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                } else {
                    toast.error("Techinal Error");
                }
            });
        // } else {
        //     toast.error("Please Enter Valid Email");
        // }
    };
    // Submit OTP after entering Captcha
    const handleOTP = () => {
        setLoading(true);
        let postObj = {
            otp: window.btoa(forgotPass.otp),
            otpTxId: resp.txId,
            captchaValue: window.btoa(resetCaptchaValue),
            txId: resetTxnId,
        };
        axios
            .post(emailVerifySubmit, postObj)
            .then((response: any) => {
                setResp(response.data);
                setLoading(false);
                setOpenReset(true);
                setForgotState(false);
                generateConfCaptcha();
                generateCaptcha()
                toast.success(response.data.statusMessage);
            })
            .catch((err: any) => {
                setLoading(false);
                generateResetCaptcha();
                if (err.response.data.statusMessage) {
                    toast.error(err.response.data.statusMessage);
                } else {
                    toast.error("Techinal Error");
                }
            });
    };
    //Change password Captcha Generation
    const generateConfCaptcha = () => {
        setLoading(true);
        services
            .get(getCaptcha, {}, false)
            .then((response: any) => {
                setLoading(false);
                let captchaCode = window.atob(response.data.captchBytes);
                setConfCaptcha(captchaCode);
                setConfTxnId(response.data.txId);
            })
            .catch((err: any) => {
                toast.error("Error Getting Captcha");
                setLoading(false);
            });
    };

    const handleConfCapthaChange = (value: any) => {
        setConfCaptchaValue(value);
    };
    //Change Password After entering Captcha
    const handleResetPassword = () => {
        if (!forgotPass.password.match(passwordPattern)) {
            toast.error(
                "Use 1 special charactors,1 Capital letter, 1 number, min 8 numbers"
            );
        } else if (confCaptchaValue == "") {
            toast.error("Please Enter Captcha Value");
        } else if (forgotPass.password === forgotPass.confirmPassword) {
            let postObj = {
                userId: resp.userId || logResp.userId,
                password: forgotPass.password,
                isResetPsaaword: 1,
                username: resp.userName || logResp.username,
                captchaValue: window.btoa(confCaptchaValue),
                txId: confTxnId,
            };
            axios
                .post(changePassword, postObj)
                .then((response) => {
                    toast.success(response.data.statusMessage);
                    setValue('password', '')
                    generateCaptcha()
                    setOpenReset(false);
                    setLoginState(true);
                })
                .catch((error) => {
                    generateConfCaptcha();
                    if (error.response.data.statusMessage) {
                        toast.error(error.response.data.statusMessage);
                    } else {
                        toast.error("Techinal Error");
                    }
                });
        } else {
            toast.error("Passwords do not Match");
        }
    };
    const handleNewPasswordIcon = (data: any) => {
        setShowNewPassword(data);
    };
    const handleConfPasswordIcon = (data: any) => {
        setShowConfPassword(data);
    };
    return (
        <main className="bg-slate-200">
            {loading ? <Loader /> : ""}
            <div className="absolute top-3 right-3 z-10">
                <ActionButton
                    buttonText={"Privacy Policy"}
                    handleSubmit={() => {
                        pushTo("gotoPrivacypage");
                    }}
                    width="w-auto text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                />
            </div>
            <div className="login loginWrappbg">
                {loginState ? (
                    <div className="block max-w-xs rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                        <CardLayout
                            cardContent={
                                <div className="loginCard">
                                    <div>
                                        <div className="">
                                            <Image
                                                src={"/images/login/logo.png"}
                                                alt="logo"
                                                width="100"
                                                height="50"
                                            />
                                        </div>
                                        <div className="login-controls">
                                            <Input
                                                type="text"
                                                label="User Name"
                                                name="userName"
                                                required={true}
                                                watch={watch}
                                                inputRef={register("userName", { required: true })}
                                            />
                                            {errors.userName &&
                                                errors.userName.type === "required" && (
                                                    <ErrorMessage message="Please Enter Username!" />
                                                )}
                                        </div>
                                        <div className="login-controls">
                                            <Input
                                                type={showPassword ? "text" : "password"}
                                                label="Password"
                                                name="password"
                                                required={true}
                                                watch={watch}
                                                visibilityIcon
                                                handlePasswordIcon={handlePasswordIcon}
                                                inputRef={register("password", {
                                                    required: true,
                                                    // pattern: {
                                                    //   value: passwordPattern,
                                                    //   message:
                                                    //     "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one digit",
                                                    // },
                                                })}
                                                id="password"
                                                autoComplete="new-password"
                                            />
                                            <div
                                                className=" cursor-pointer absolute top-[133px] right-10"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <VisibilityIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                ) : (
                                                    <VisibilityOffIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                )}
                                            </div>
                                            <div>
                                                {errors.password &&
                                                    errors.password.type === "required" && (
                                                        <ErrorMessage message="Please Enter Password!" />
                                                    )}
                                                {errors.password &&
                                                    errors.password.type === "pattern" && (
                                                        <ErrorMessage message={errors.password.message} />
                                                    )}
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <CaptchaBox
                                                captchaCode={captcha}
                                                generateCaptcha={generateCaptcha}
                                                handleCapthaChange={handleCapthaChange}
                                                onSubmit={handleSubmit(onSubmit)}
                                                capthaValue={capthaValue}
                                            />
                                        </div>
                                        <div className="login-controls">
                                            <ActionButton
                                                buttonText="SIGN IN"
                                                handleSubmit={handleSubmit(onSubmit)}
                                                width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                            />
                                        </div>
                                        <div>
                                            <Link href="/reset-password"></Link>
                                        </div>
                                        <div className="flex justify-between gap-2  mt-2">
                                            <div>
                                                {userId !== "" &&
                                                    <div
                                                        className=" text-cyan-500 py-1 px-2 text-[13px]"
                                                        onClick={() => userForceLogout(userId)}
                                                    >
                                                        <u style={{ cursor: "pointer" }}>End Previous session</u>
                                                    </div>
                                                }
                                            </div>
                                            <div
                                                className=" text-cyan-500 py-1 px-2 text-[13px]"
                                                onClick={forgotFun}
                                            >
                                                <u style={{ cursor: "pointer" }}>Forgot Password?</u>
                                            </div>
                                        </div>
                                        {loginData !== null ? (
                                            <UserContext.Provider
                                                value={loginData}
                                            ></UserContext.Provider>
                                        ) : null}
                                    </div>
                                </div>
                            }
                        />
                    </div>
                ) : null}
                {forgotState ? (
                    <div className="forgot-card block max-w-xs rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                        <div className="loginCard">
                            <h1 className="text-center text-md font-bold pt-3">
                                Verify Your Email
                            </h1>
                            <div className="login-controls">
                                <div className="relative flex gap-2">
                                    <Input
                                        type="text"
                                        label="Username"
                                        name="username"
                                        required={true}
                                        watch={watch}
                                        value={forgotPass.username}
                                        handleChange={(e: any) =>
                                            setForgotPass({ ...forgotPass, username: e.target.value })
                                        }
                                    />

                                    <Button
                                        color="blue"
                                        className="mx-2"
                                        size="sm"
                                        onClick={handleSubmit(getCode)}
                                    >
                                        Generate
                                    </Button>
                                    {/* <ActionButton width="mx-2 h-[42px] text-sm" buttonText={'Generate'}/> */}
                                </div>
                                <div className="block">
                                    {errors.username && errors.username.type === "required" && (
                                        <ErrorMessage message="Please Enter Username!" />
                                    )}
                                </div>
                            </div>

                            <div className="login-controls ">
                                <div className="relative ">
                                    <Input
                                        type="text"
                                        label="Enter OTP"
                                        name="otp"
                                        watch={watch}
                                        value={forgotPass.otp}
                                        handleChange={(e: any) =>
                                            setForgotPass({ ...forgotPass, otp: e.target.value })
                                        }
                                    />
                                </div>
                                <div className="block">
                                    {errors.otp && errors.otp.type === "required" && (
                                        <ErrorMessage message="Please Enter Password!" />
                                    )}
                                    {errors.otp && errors.otp.type === "pattern" && (
                                        <ErrorMessage message={errors.otp.message} />
                                    )}
                                </div>
                            </div>
                            <div className="mt-4">
                                <CaptchaBox
                                    captchaCode={resetCaptcha}
                                    generateCaptcha={generateResetCaptcha}
                                    handleCapthaChange={handleResetCapthaChange}
                                    onSubmit={handleSubmit(handleOTP)}
                                    capthaValue={resetCaptchaValue}
                                />
                            </div>
                            <div className="login-controls flex justify-between gap-3 forgotlogbutton py-3">
                                <ActionButton
                                    buttonText={"VERIFY"}
                                    handleSubmit={handleOTP}
                                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />

                                <ActionButton
                                    buttonText={"CANCEL"}
                                    handleSubmit={cancelFun}
                                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />
                            </div>
                        </div>
                    </div>
                ) : null}
                {openReset ? (
                    <div className="forgot-card block max-w-xs rounded-lg bg-white p-2 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                        <div className="loginCard">
                            <h1 className="text-center text-md font-bold pt-3">
                                Create New Password
                            </h1>
                            <div className="login-controls">

                                <div className="relative ">
                                    <Input
                                        type={showNewPassword ? "password" : "text"}
                                        label="Password"
                                        name="password"
                                        watch={watch}
                                        value={forgotPass.password}
                                        handleChange={(e: any) =>
                                            setForgotPass({ ...forgotPass, password: e.target.value })
                                        }
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
                                {forgotPass.password && !passwordPattern.test(forgotPass.password) &&
                                    <div className="text-xs text-red-500">
                                        Use 1 special charactors,1 Capital letter, 1 number, min 8 numbers
                                    </div>}
                            </div>
                            <div className="login-controls">
                                <div className="relative ">
                                    <Input
                                        type={showConfPassword ? "password" : "text"}
                                        label="Confirm Password"
                                        name="confirmPassword"
                                        watch={watch}
                                        value={forgotPass.confirmPassword}
                                        handleChange={(e: any) =>
                                            setForgotPass({
                                                ...forgotPass,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                    // inputRef={register("password", {
                                    //     required: true,
                                    //     pattern: {
                                    //         value: passwordPattern,
                                    //         message:
                                    //             "Use 1 special charactors,1 Capital letter, 1 number, min 8 numbers",
                                    //     },
                                    // })}
                                    />
                                    <span className="demo cursor-pointer text-blue-gray-700 absolute right-5 bottom-3 text-sm inset-y-1/4 flex items-center">
                                        {showConfPassword ? (
                                            <VisibilityIcon
                                                onClick={() => {
                                                    handleConfPasswordIcon(false);
                                                }}
                                                fontSize="inherit"
                                            />
                                        ) : (
                                            <VisibilityOffIcon
                                                onClick={() => {
                                                    handleConfPasswordIcon(true);
                                                }}
                                                fontSize="inherit"
                                            />
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="w-full">
                                {forgotPass.confirmPassword && !passwordPattern.test(forgotPass.confirmPassword) &&
                                    <div className="text-xs text-red-500">
                                        Use 1 special charactors,1 Capital letter, 1 number, min 8 numbers
                                    </div>}
                            </div>
                            <div className="mt-3">
                                <CaptchaBox
                                    captchaCode={confCaptcha}
                                    generateCaptcha={generateConfCaptcha}
                                    handleCapthaChange={handleConfCapthaChange}
                                    onSubmit={handleSubmit(handleResetPassword)}
                                    capthaValue={confCaptchaValue}
                                />
                            </div>
                            <div className="login-controls gap-4 flex   py-3">
                                <ActionButton
                                    buttonText={"SUBMIT"}
                                    handleSubmit={handleResetPassword}
                                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />
                                <ActionButton
                                    buttonText={"CANCEL"}
                                    handleSubmit={cancelFun}
                                    width="w-full text-white  text-[14px] h-[42px] !bg-[#006AC9] hover:bg-[#006AC9] border-[#006AC9]"
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </main>
    );
}
