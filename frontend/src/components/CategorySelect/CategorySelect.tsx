import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import type { Category } from "../../types/categories";
import styles from "./CategorySelect.module.css";

interface CategorySelectProps {
  categories: Category[];
  value: number | null;
  onChange: (value: number | null) => void;
  withAllOption?: boolean;
  fullWidth?: boolean;
  margin?: "none" | "dense" | "normal";
  error?: boolean;
  loading?: boolean;
}

const CategorySelect = ({
  categories,
  value,
  onChange,
  withAllOption = false,
  fullWidth = false,
  margin = "none",
  error = false,
  loading = false,
}: CategorySelectProps) => {
  const handleChange = (e: SelectChangeEvent<number | "">) => {
    const val = e.target.value;
    onChange(val === "" ? null : Number(val));
  };

  return (
    <FormControl
      size="small"
      className={styles.formControl}
      fullWidth={fullWidth}
      margin={margin}
      error={error}
    >
      <InputLabel>Category</InputLabel>
      <Select value={value ?? ""} onChange={handleChange} label="Category">
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={16} className={styles.loadingIcon} /> Loading...
          </MenuItem>
        ) : [
          withAllOption ? <MenuItem key="all" value="">All</MenuItem> : null,
          ...categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          )),
        ]}
      </Select>
    </FormControl>
  );
};

export default CategorySelect;
