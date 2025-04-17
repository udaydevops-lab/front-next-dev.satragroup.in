import React, { useState } from "react";
import { Input } from "@material-tailwind/react";

const NewAutocomplete = (props: any) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);
    const newFilteredOptions = props.options.filter((option: any) =>
      option[props.desc].toLowerCase().includes(newInputValue.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
  };

  const handleOptionClick = (option: any) => {
    props.getSelectedItems(option);
    setInputValue(option[props.desc]);
    setFilteredOptions([]);
    if (props.onSelect) {
      props.onSelect(option);
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        value={inputValue}
        onChange={(event: any) => handleInputChange(event)}
        placeholder={props.placeholder}
        className=""
        crossOrigin={undefined}
        label={props.label}
      />
      <ul
        className={`absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow ${
          inputValue ? "block" : "hidden"
        }`}
      >
        {filteredOptions.map((option: any, index) => (
          <li
            key={index}
            className="cursor-pointer p-2 hover:bg-blue-200"
            onClick={() => handleOptionClick(option)}
          >
            {option[props.desc]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewAutocomplete;
