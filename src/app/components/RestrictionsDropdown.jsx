import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@mui/material";

export default function Restrictions(props) {
  const { selectedOptions, handleSelectionChange } = props;

  const options = [
    "vegetarian",
    "vegan",
    "no beef",
    "no pork",
    "gluten-free",
    "no nuts",
  ];

  const handleChange = (event) => {
    const { value } = event.target;
    handleSelectionChange(value);
  };

  const customStyle = {
    backgroundColor: "#cfb991",
  };

  return (
    <FormControl fullWidth>
      <InputLabel>Filter</InputLabel>
      <Select
        multiple
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
              backgroundColor: "#cfb991", // Set the background color for the dropdown list
            },
          },
        }}
        style={customStyle} // Apply custom styling to the entire dropdown
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            <Checkbox
              checked={selectedOptions.indexOf(option) > -1}
              onChange={handleChange}
            />
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
