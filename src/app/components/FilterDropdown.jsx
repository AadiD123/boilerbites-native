import React, { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { CheckBox } from "@mui/icons-material";

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

export default function FilterDropdown() {
  const theme = useTheme();
  const [filter, setFilterName] = useState([]);

  useEffect(() => {
    // Load previously stored filters from local storage (or any other storage mechanism)
    const getFilters = async () => {
      const storedFilters = await store.get("selectedFilters");
      if (storedFilters) {
        setFilterName(JSON.parse(storedFilters));
      }
    };
    getFilters();
  });

  const handleChange = async (event) => {
    const {
      target: { value },
    } = event;
    setFilterName(value);
    // Store selected filters in local storage
    await store.set("selectedFilters", JSON.stringify(value));
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">Filter Dishes</InputLabel>
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
