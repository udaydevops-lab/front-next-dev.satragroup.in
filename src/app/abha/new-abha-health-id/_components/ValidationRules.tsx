import React from "react";

export default function ValidationRules() {
  return (
    <div className=" border text-sm h-[140px] p-4  overflow-y-auto">
      <li>Minimum length - 8 characters.</li>
      <li>Maximum length - 18 characters.</li>
      <li>Special characters allowed - 1 dot (.) and/or 1 underscore (_)</li>
      <li>
        Special character dot and underscore should be in between. Special
        characters cannot be in the beginning or at the end.
      </li>
      <li>
        Alphanumeric - only numbers, only letters or any combination of numbers
        and letters is allowed.
      </li>
    </div>
  );
}
