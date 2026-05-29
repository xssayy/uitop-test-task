import {
  Button,
  Checkbox,
  Chip,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Todo } from "../../types/todos";
import styles from "./TodoItem.module.css";

interface TodoItemProps {
  todo: Todo;
  selected: boolean;
  onSelect: (id: number) => void;
  onStatusUpdate: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({
  todo,
  selected,
  onSelect,
  onStatusUpdate,
  onDelete,
}: TodoItemProps) => {
  return (
    <ListItem
      className={`${styles.todoItem} ${todo.completed ? styles.todoItemCompleted : ""}`}
      onClick={() => onSelect(todo.id)}
      secondaryAction={
        <IconButton edge="end" onClick={(e) => { e.stopPropagation(); onDelete(todo.id); }}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemIcon className={todo.completed ? styles.checkboxHidden : ""}>
        <Checkbox checked={selected} />
      </ListItemIcon>
      <ListItemText
        primary={todo.text}
        className={todo.completed ? styles.textCompleted : ""}
      />
      <Chip label={todo.category.name} size="small" className={styles.chip} />
      <Button
        size="small"
        variant="outlined"
        onClick={(e) => { e.stopPropagation(); onStatusUpdate(todo.id, !todo.completed); }}
        className={styles.actionButton}
      >
        {todo.completed ? "Mark As Incomplete" : "Mark As Complete"}
      </Button>
    </ListItem>
  );
};

export default TodoItem;
