import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import { store } from "../App";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
      overflowY: "hidden",
    },
  },
};

const filters = [
  "vegetarian",
  "vegan",
  "no beef",
  "no pork",
  "gluten-free",
  "no nuts",
];

function getStyles(name, filterName, theme) {
  return {
    fontWeight:
      filterName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function FilterDropdown({
  setSelectedOptions,
  selectedOptions,
}) {
  const theme = useTheme();
  const [filter, setFilterName] = useState(selectedOptions);

  useEffect(() => {
    setFilterName(selectedOptions);
  }, [selectedOptions]);

  const handleChange = async (event) => {
    const {
      target: { value },
    } = event;
    setFilterName(value);
    if (value.length === 0) {
      await store.remove("selectedFilters");
      setSelectedOptions([]);
      return;
    }
    await store.set("selectedFilters", JSON.stringify(value));
    setSelectedOptions(value);
    // console.log(value);
  };

  return (
    <div>
      <FormControl sx={{ width: "95%" }}>
        <InputLabel id="demo-multiple-chip-label">Filter</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={filter}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
          style={{ borderRadius: "8px" }}
        >
          {filters.map((filterOption) => (
            <MenuItem
              key={filterOption}
              value={filterOption}
              style={getStyles(filterOption, filter, theme)}
            >
              {filterOption}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
