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
  const { selectedOptions = [], handleSelectionChange = () => {} } = props;

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
    backgroundColor: "white",
    borderRadius: "8px",
  };

  const centerDropdownStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const labelStyle = {
    fontSize: "14px",
    color: "#555",
    // You can add more label-related styles here
  };

  const menuItemStyle = {
    fontSize: "14px",
  };

  const menuPaperStyle = {
    maxHeight: 300,
    backgroundColor: "#cfb991",
    ...centerDropdownStyle,
    overflowY: "hidden",
  };

  return (
    <FormControl style={{ width: "50%" }}>
      <InputLabel style={labelStyle} shrink={false}>
        Filter dishes
      </InputLabel>
      <Select
        multiple
        value={selectedOptions}
        onChange={handleChange}
        renderValue={(selected) =>
          Array.isArray(selected) ? selected.join(", ") : ""
        }
        MenuProps={{
          PaperProps: {
            style: menuPaperStyle,
          },
        }}
        style={customStyle}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option} style={menuItemStyle}>
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
