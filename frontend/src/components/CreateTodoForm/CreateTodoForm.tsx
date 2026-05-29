import { useForm, Controller } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  TextField,
} from "@mui/material";
import type { Category } from "../../types/categories";
import type { CreateTodoDto } from "../../types/todos";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import CategorySelect from "../CategorySelect/CategorySelect";

interface CreateTodoFormProps {
  open: boolean;
  categories: Category[];
  onCreateTodo: (dto: CreateTodoDto) => Promise<void>;
  onClose: () => void;
}

const CreateTodoForm = ({
  open,
  categories,
  onCreateTodo,
  onClose,
}: CreateTodoFormProps) => {
  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoDto>();

  const onSubmit = async (data: CreateTodoDto) => {
    try {
      await onCreateTodo(data);
      reset();
      onClose();
    } catch (error) {
      setError("root", { message: extractErrorMessage(error) });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>New task</DialogTitle>
        <DialogContent>
          <TextField
            label="Task text"
            size="small"
            fullWidth
            margin="dense"
            error={!!errors.text}
            helperText={errors.text?.message}
            {...register("text", {
              required: "Text is required",
              validate: (value) =>
                value.trim() !== "" || "Text cannot be empty",
            })}
          />

          <Controller
            name="categoryId"
            control={control}
            rules={{ required: "Category is required" }}
            render={({ field }) => (
              <>
                <CategorySelect
                  categories={categories}
                  value={field.value ?? null}
                  onChange={(val) => field.onChange(val)}
                  fullWidth
                  margin="dense"
                  error={!!errors.categoryId}
                />
                {errors.categoryId && (
                  <FormHelperText error>
                    {errors.categoryId.message}
                  </FormHelperText>
                )}
              </>
            )}
          />

          {errors.root && (
            <FormHelperText error>{errors.root.message}</FormHelperText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Add
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CreateTodoForm;
