import crypto from "crypto";
import * as CryptoJS from "crypto-js";

const secretKey: any = process.env.NEXT_PUBLIC_SECKRET_KET;
// //Encrypt Token functionality
export const encryptToken = (plainText: string): string | null => {
  try {
    const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
    return cipherText;
  } catch (error) {
    console.error(error)
    return null;
  }
};

// // Decrypt Token functionality
export const decryptToken = (cipherText: any) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const plainText = bytes.toString(CryptoJS.enc.Utf8);
    return plainText;
  } catch (error) {
    return null;
  }
};
