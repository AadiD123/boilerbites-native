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

  return (
    <FormControl fullWidth>
      <InputLabel>Restrictions</InputLabel>
      <Select
        label="Restrictions"
        multiple
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 300,
            },
          },
        }}
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
