"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CardComponent from "../_common/new-card-layout";
import Input from "../_common/input";
import ActionButton from "../_common/button";
import { sendCode, emailVerifySubmit } from "../utilities/api-urls";
import services from "../utilities/services";
import axios from "axios";

export default function ResetPassword(props: any) {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const [resp, setResp] = useState({
    statusMessage: '',
    txId: '',
    userName: '',
    userId: ''
  });

  const onSubmit = (data: any) => {
    let postObj = {
      username: data.username
    }
    axios
    .post(sendCode, postObj)
    .then((response) => {
      setResp(response.data);
    })
  }

  const verifyCode = (data: any) => {
    let postObj = {
      otp: data.enterCode,
      txId: resp.txId
    }
    axios
      .post(emailVerifySubmit, postObj)
      .then((response) => {
        })
        .catch((error) => {
        });
  }

  return (
    <div>
      <CardComponent
        label="Verify Your Email"
        content={
          <div>
            <div className="flex mt-2">
              <Input
                type="text"
                label="Username *"
                name="username"
                watch={watch}
                inputRef={register("username", {
                  required: true,
                })}
                //   handleChange={handleInput}
              />
              <div className="ml-2 mt-1">
                <ActionButton
                  width="fit-content"
                  buttonText="Send Code"
                  backgroundColor="blue"
                  handleSubmit={handleSubmit(onSubmit)}
                />
              </div>
            </div>
            <div className="mt-2">
              <Input
                type="text"
                label="Enter Code *"
                name="enterCode"
                watch={watch}
                inputRef={register("enterCode", {
                  required: false,
                })}
                //   handleChange={handleInput}
              />
            </div>
            <div className="ml-2 mt-2">
                <ActionButton
                  width="fit-content"
                  buttonText="Verify Code"
                  backgroundColor="blue"
                    handleSubmit={handleSubmit(verifyCode)}
                />
              </div>
          </div>
        }
      />
    </div>
  );
}
