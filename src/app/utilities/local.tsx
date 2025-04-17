import axios from "axios";
import { snomedSearchByTermAndSemanticTag } from "./api-urls";
import { decryptToken, encryptToken } from "../_commonfeatures/Token";
import services from "./services";

export const setLocalItem = (itemName: string, item: string) => {
  if (typeof localStorage !== "undefined") {
    let data = encryptToken(item);
    localStorage.setItem(itemName, data ? data : "");
  }
};

export const getLocalItem = (itemName: string) => {
  if (typeof window !== "undefined") {
    return decryptToken(localStorage.getItem(itemName));
  }
  return null;
};

export const removeLocalItem = (itemName: string) => {
  if (typeof window !== "undefined") {
    return localStorage.removeItem(itemName);
  }
};

export const jsonParse = (itemName: string) => {
  if (typeof window !== "undefined") {
    return JSON.parse(getLocalItem(itemName)!);
  }
  return null;
};

export const clearLocalItems = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};

export const getToken = () => {
  jsonParse("loginResponse").token;
};

export const snomedSemanticURL = async (term: string, semantic: string) => {
  const Data = await services.get(
    `${snomedSearchByTermAndSemanticTag}term=${term}&state=both&semantictag=${semantic}&acceptability=all&returnlimit=10&refsetid=null&parentid=null&fullconcept=false`
  );
  return Data.data;
};
