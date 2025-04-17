import { useState } from "react";

const UseErrorMessage = () => {
  const [errorMsg, setErrorMsg] = useState<any>({});

  const setErrorMessage = (message: any) => {
    setErrorMsg(message);
  };

  const clearErrorMessage = (message: any) => {
    setErrorMsg(message);
  };

  return { errorMsg, setErrorMessage, clearErrorMessage };
};

export default UseErrorMessage;
