"use client"
import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import SelectChangeEvent
import { Checkbox } from "@mui/material";

interface Props {
  listItems: string[];
  label:string // Assuming listItems is an array of strings
  multiple: boolean
  value: any
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MultiSelect: React.FC<Props> = (props) => {
  const [personName, setPersonName] = React.useState<string[]>([]); // Specify the type as an array of strings

  const handleChange = (event: SelectChangeEvent<string[]>) => { // Update the event type to SelectChangeEvent<string[]>
    const { value } = event.target;
    setPersonName(value as string[]);
  };

  return (
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">{props.label}</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          size={"small"}  
          id="demo-multiple-checkbox"
          multiple={props.multiple}
          value={props.value}
          onChange={handleChange}
          input={<OutlinedInput label={props.label} />}
          renderValue={(selected) => (selected as string[]).join(", ")}
          MenuProps={MenuProps}
        >
          {props.listItems.map((name:any) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={personName.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
  );
};

export default MultiSelect;
