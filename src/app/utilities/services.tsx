import React from "react";
import axios from "axios";
import { getLocalItem } from "./local";
import { csrfToken } from "./api-urls";
import { sanitizeObject } from "./sanitizeObject";
import { getHeaderResponse } from "../_commonfeatures/header";
import api from "./axiosInstance";
  

const create = async (
  url: string,
  data: any,
  headers: any = {},
  isAuth: boolean = true
) => {
  var csrf = "";
  await axios.get(csrfToken).then(async (response) => {
    csrf = response.data.cuti;
  });
  if (isAuth) {
    if (Object.keys(headers).length === 0) {
      return api.post(url, sanitizeObject(data), {
        headers:{
          ...getHeaderResponse(),
          Authorization:
            ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
          "X-CSRF-TOKEN": csrf,
        },
      });
    } else {
      headers.Authorization =
        ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token;
      headers["X-CSRF-TOKEN"] = csrf;
      let obj:any={...getHeaderResponse(),...headers}
      return api.post(url, data, {headers:obj});
    }
  } else {
    // Non Auth User
    return api.get(url, {
      headers,
    });
  }
};

const get = async (url: string, headers: any = {}, isAuth: boolean = true) => {
  // var csrf = "";
  // await axios.get(csrfToken).then(async (response) => {
  //   csrf = response.data.csrfToken;
  // });
  if (isAuth) {
    // Auth User
    if (Object.keys(headers).length === 0) {
      return await api.get(url, {
        headers: {
          ...getHeaderResponse(),
          Authorization:
            ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
        },
      });
    } else {
      headers.Authorization =
        ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token;
        let obj:any={...getHeaderResponse(),...headers}
      return await api.get(url, {headers:obj});
    }
  } else {
    // Non Auth User
    let obj:any={...getHeaderResponse(),...headers}
    return api.get(url, {headers:obj});
  }
};
const put = async (url: string, data: any, headers: any = {}) => {
  var csrf = "";
  await api.get(csrfToken).then(async (response) => {
    csrf = response.data.csrfToken;
  });
  if (Object.keys(headers).length === 0) {
    return api.put(url, data, {
      headers: {
        ...getHeaderResponse(),
        Authorization:
          ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
        "X-CSRF-TOKEN": csrf,
      },
    });
  } else {
    headers.Authorization =
      ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token;
    headers["X-CSRF-TOKEN"] = csrf;
    return api.put(url, data, {
      ...getHeaderResponse(),
      headers,
    });
  }
};
const remove = (url: string, headers: any = {}) => {
  if (Object.keys(headers).length === 0) {
    return api.delete(url, {
      headers: {
        Authorization:
          ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token,
      },
    });
  } else {
    headers.Authorization =
      ` Bearer ` + JSON.parse(getLocalItem("loginResponse")!).token;
    return api.delete(url, {
      headers,
    });
  }
};

export default { create, get, put, remove };
