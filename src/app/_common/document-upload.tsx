"use client";
import React from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";

export default function DocumentUpload(props: any) {
  return (
    <div className="upload-proimg">
      <input
        type="file"
        id={props.name + "contained-file"}
        style={{ opacity: "0" }}
        onChange={props.handleChange}
        name={props.name}
        ref={props.inputRef}
        accept={props.accept}
      />
      <label style={{ display: "flex" }}>
        <div>
          <span>{props.labelContent}</span>
          <AttachFileIcon style={{ fontSize: "16px" }} />
        </div>
      </label>
    </div>
  );
}
