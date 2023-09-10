import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function Restrictions(props) {
  const { options, selectedOptions, handleSelectionChange } = props;
  return (
    <FormControl fullWidth>
      <InputLabel>Restrictions</InputLabel>
      <Select
        label="Restrictions"
        multiple
        value={selectedOptions} // Pass an array for multiple selections
        onChange={handleSelectionChange}
      >
        {options.map((option, index) => (
          <MenuItem key={index} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
