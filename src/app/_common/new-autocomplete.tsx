import React, { useState, useEffect, useRef } from "react";
import { Input } from "@material-tailwind/react";

interface Option {
  [key: string]: string;
}

interface NewAutocompleteProps {
  label: string;
  value?: string;
  desc: string;
  options: Option[];
  getSelectedItems: (selected: Option[]) => void;
  checkbox?: boolean;
  width?: any;
  disabled?: boolean;
  onKeyPress?: (value: any) => void;
}

const NewAutocomplete: React.FC<NewAutocompleteProps> = (props) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [labelShrink, setLabelShrink] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const newFilteredOptions = props.options.filter((option) =>
      option[props.desc].toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(newFilteredOptions);
    handelpropsValue();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, props.options, props.desc, props.value]);
  const handelpropsValue = () => {
    if (props.value) {
      setInputValue(props.value);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setDropdownOpen(true);
  };

  const handleOptionClick = (option: Option) => {
    setLabelShrink(true);
    if (props.checkbox) {
      // If checkbox is enabled, toggle the selection of the clicked option
      const optionIndex = selectedOptions.findIndex(
        (selectedOption) => selectedOption === option
      );
      if (optionIndex === -1) {
        setSelectedOptions([...selectedOptions, option]);
      } else {
        const updatedOptions = [...selectedOptions];
        updatedOptions.splice(optionIndex, 1);
        setSelectedOptions(updatedOptions);
      }
    } else {
      // If checkbox is disabled, select only the clicked option
      setSelectedOptions([option]);
      setInputValue(option[props.desc]);
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    props.getSelectedItems(selectedOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOptions]);

  useEffect(() => {
    // Add an event listener to the document to close the dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative " ref={dropdownRef}>
      <div style={{ position: "relative" }}>
        {props.checkbox ? (
          <Input
            type="text"
            value={
              props.value
                ? props.value
                : selectedOptions.map((option) => option[props.desc]).join(", ")
            }
            onChange={handleInputChange}
            className=""
            crossOrigin={undefined}
            placeholder={props.label}
            label={props.label}
            onFocus={() => setDropdownOpen(true)}
            disabled={props.disabled}
            onKeyPress={props.onKeyPress}
          />
        ) : (
          <Input
            crossOrigin={undefined}
            type="text"
            value={props.value ? props.value : inputValue}
            onChange={handleInputChange}
            className={`border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 ${
              props.width ? props.width : "w-full"
            }`}
            onFocus={() => setDropdownOpen(true)}
            disabled={props.disabled}
            placeholder=""
            label={props.label}
            onKeyPress={props.onKeyPress}
          />
        )}
      </div>
      <ul
        className={`absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow overflow-y-scroll h-36 ${
          dropdownOpen ? "block" : "hidden"
        }`}
      >
        {filteredOptions.map((option, index) => (
          <li
            key={index}
            className="cursor-pointer p-2 mr-2 hover:bg-blue-200"
            onClick={() => handleOptionClick(option)}
          >
            {props.checkbox && (
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedOptions.includes(option)}
                readOnly
              />
            )}
            {option[props.desc]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewAutocomplete;
