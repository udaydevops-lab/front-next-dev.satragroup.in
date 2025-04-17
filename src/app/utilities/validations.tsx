export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,15}$/;
export const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i;
export const panNoPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const aadhaarPattern = /^\d{12}$/;
export const namePattern = /^[a-zA-Z]*$/;
export const alphaNumWithHyphen = /^[a-zA-Z0-9_ ]*$/;
export const alphaNumWithHyphenspacedash = /^[A-Za-z0-9\s-_]+$/;
export const allowOnlyNumbers = /^[0-9]*$/;
export const alphaNumWithFewSymbols = /^[a-zA-Z0-9\/,. -]*$/;
export const thirteenDigitPattern = /^\d{13}$/;
export const allowspacepattern = /^[A-Za-z0-9? ,_-]+$/;
export const websitepattern =
  /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
export const gstPattern =/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/
