"use client"

import * as React from "react";
import { Box, FormControl } from "@mui/material";
import TextField from "@mui/material/TextField";
import styled from "styled-components";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { Input } from "@material-tailwind/react";
import { getLocalItem } from "../utilities/local";
export default function FormPropsTextFields(props: any) {
      const [showPassword, setShowPassword] = React.useState(false);
      const [curser, setCurser] = React.useState(false);
      const loginResponse = JSON.parse(getLocalItem("loginResponse")!);
      const handleKeyPress = (e: any) => {
            if (e.key === "Enter") {
                  props.onSubmit();
            }
      };
      const handlePasswordIcon = (data: any) => {
            setShowPassword(data);
            props.handlePasswordIcon(data);
      };
      const handleChangeE = (e: any) => {

      };
      const handleSelect = () => {
            setCurser(true);
      };
      const handleBlur = (e: any) => {
            setCurser(false);
            if (props.handleBlur) {
                  props.handleBlur(e);
            }
      };

      return (
            <>
                  <form autoComplete="off">
                        <Input
                              autoComplete="off"
                              color="blue"
                              disabled={props.disabled}
                              required={props.required}
                              variant="outlined"
                              id={props.id}
                              label={props.label}
                              name={props.name}
                              style={{ width: props.width }}
                              size="md"
                              value={props.value}
                              type={props.type}
                              onChange={props.handleChange}
                              onSelect={handleSelect}
                              {...props.inputRef}
                              defaultValue={props.defaultValue}
                              helpertext={props.helpertext}
                              // inputRef={props.inputRef}
                              onBlur={handleBlur}
                              inputprops={{
                                    readOnly: props.readOnly,
                                    sx: {
                                          fontWeight: props.fontWeight,
                                    },
                                    endAdornment: (
                                          <InputAdornment position="end">
                                                {props.visibilityIcon ? (
                                                      showPassword ? (
                                                            <VisibilityIcon
                                                                  onClick={() => {
                                                                        handlePasswordIcon(false);
                                                                  }}
                                                            />
                                                      ) : (
                                                            <VisibilityOffIcon
                                                                  onClick={() => {
                                                                        handlePasswordIcon(true);
                                                                  }}
                                                            />
                                                      )
                                                ) : props.sbxAdorment ? (
                                                      `@${loginResponse?.abhaSuffix=='abdm'?'abdm':'sbx'}`
                                                ) : (
                                                      ""
                                                )}
                                          </InputAdornment>
                                    ),
                              }}
                              inputlabelprops={{
                                    shrink: props.shrink
                                          ? props.shrink
                                          : props.watch
                                                ? !!props.watch(props.name) ||
                                                      curser ||
                                                      props.value === 0 ||
                                                      props.value
                                                      ? true
                                                      : false
                                                : false,
                              }}
                              onKeyDown={props.handleKeyPress}
                              className={`${props.className} focus:border-t-0`}

                              onWheel={
                                    props.type === "number"
                                          ? (e) => (e.target as HTMLInputElement).blur()
                                          : null
                              }
                              containerProps={props.containerProps}
                        />
                  </form>
            </>
      );
}
