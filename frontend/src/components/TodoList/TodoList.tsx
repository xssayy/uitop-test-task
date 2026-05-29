import { Alert, CircularProgress, List, Typography } from "@mui/material";
import type { Todo } from "../../types/todos";
import TodoItem from "../TodoItem/TodoItem";
import styles from "./TodoList.module.css";

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  selectedIds: number[];
  onSelect: (id: number) => void;
  onStatusUpdate: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TodoList = ({
  todos,
  loading,
  error,
  selectedIds,
  onSelect,
  onStatusUpdate,
  onDelete,
}: TodoListProps) => {
  if (loading) {
    return (
      <div className={styles.center}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.center}>
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className={styles.center}>
        <Typography color="textSecondary">No tasks</Typography>
      </div>
    );
  }

  return (
    <List className={styles.todoList}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          selected={selectedIds.includes(todo.id)}
          onSelect={onSelect}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
        />
      ))}
    </List>
  );
};

export default TodoList;
