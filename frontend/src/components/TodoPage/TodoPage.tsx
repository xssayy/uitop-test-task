import { Button, Stack, Typography } from "@mui/material";
import styles from "./TodoPage.module.css";
import CreateTodoForm from "../CreateTodoForm/CreateTodoForm";
import { useState, useEffect } from "react";
import type { Category } from "../../types/categories";
import { getAllCategories } from "../../api/categories";
import { extractErrorMessage } from "../../utils/extractErrorMessage";
import CategorySelect from "../CategorySelect/CategorySelect";
import type { Todo, CreateTodoDto } from "../../types/todos";
import {
  getAllTodosByCategoryId,
  updateTodosStatusBulk,
  updateTodo,
  deleteTodo,
  createTodo,
} from "../../api/todos";
import TodoList from "../TodoList/TodoList";
import { toast, toastError } from "../Toast/toast";
import ConfirmationalModal from "../ConfirmationalModal/ConfirmationalModal";

const TodoPage = () => {
  const [isCreateTodoModalOpen, setIsCreateTodoModalOpen] =
    useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const categories = await getAllCategories();
        setCategories(categories);
      } catch (error) {
        const extractedError = extractErrorMessage(error);
        toastError(`Failed to load categories: ${extractedError}`);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [todos, setTodos] = useState<Todo[]>([]);
  const [isTodosLoading, setIsTodosLoading] = useState<boolean>(false);
  const [todosErrorMessage, setTodosErrorMessage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsTodosLoading(true);
        setTodosErrorMessage(null);
        const todos = await getAllTodosByCategoryId(
          selectedCategoryId ?? undefined,
        );
        setTodos(todos);
      } catch (error) {
        setTodosErrorMessage(extractErrorMessage(error));
      } finally {
        setIsTodosLoading(false);
      }
    };
    fetchTodos();
  }, [selectedCategoryId]);

  const handleStatusUpdate = async (id: number, completed: boolean) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed } : t)),
    );

    try {
      await updateTodo({ id, completed });
    } catch {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !completed } : t)),
      );
      toastError("Failed to update task status");
      return;
    }

    if (completed) {
      const todoText = todos.find((t) => t.id === id)?.text ?? "Task";
      toast(`"${todoText}" marked as complete`, async () => {
        setTodos((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: false } : t)),
        );
        try {
          await updateTodo({ id, completed: false });
        } catch {
          setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, completed: true } : t)),
          );
          toastError("Failed to undo status update");
        }
      });
    }
  };

  const handleCreateTodo = async (dto: CreateTodoDto) => {
    const newTodo = await createTodo(dto);
    setTodos((prev) => [newTodo, ...prev]);
  };

  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);

  const handleDeleteConfirm = async () => {
    if (!todoToDelete) return;
    const deleted = todoToDelete;
    const deletedIndex = todos.findIndex((t) => t.id === deleted.id);
    setTodos((prev) => prev.filter((t) => t.id !== deleted.id));
    setTodoToDelete(null);

    try {
      await deleteTodo(deleted.id);
    } catch {
      setTodos((prev) => {
        const next = [...prev];
        next.splice(deletedIndex, 0, deleted);
        return next;
      });
      toastError("Failed to delete task");
      return;
    }

    toast(`"${deleted.text}" deleted`, async () => {
      try {
        const restored = await updateTodo({ id: deleted.id, deletedAt: null });
        setTodos((prev) => {
          const next = [...prev];
          next.splice(deletedIndex, 0, restored);
          return next;
        });
      } catch {
        toastError("Failed to restore task");
      }
    });
  };

  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);
  const [isBulkCompleteModalOpen, setIsBulkCompleteModalOpen] =
    useState<boolean>(false);

  const handleSelect = (id: number) => {
    setSelectedTodos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleUpdateTodosStatusBulk = async () => {
    setIsBulkCompleteModalOpen(false);
    const prevTodos = todos;
    setTodos((prev) =>
      prev.map((t) =>
        selectedTodos.includes(t.id) ? { ...t, completed: true } : t,
      ),
    );
    setSelectedTodos([]);

    try {
      await updateTodosStatusBulk({ ids: selectedTodos, completed: true });
    } catch {
      setTodos(prevTodos);
      toastError("Failed to mark tasks as done");
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" gutterBottom>
        Todo Manager
      </Typography>
      <Stack direction="row" className={styles.headerRow}>
        <Typography align="center" color="text.secondary" gutterBottom>
          Manage your tasks efficiently
        </Typography>
        <Button
          onClick={() => setIsCreateTodoModalOpen(true)}
          variant="contained"
          className={styles.createButton}
        >
          Create Todo
        </Button>
      </Stack>
      <Stack direction="column" className={styles.content}>
        <CategorySelect
          categories={categories}
          value={selectedCategoryId}
          onChange={setSelectedCategoryId}
          withAllOption
          margin="normal"
          loading={isCategoriesLoading}
        />
        {(() => {
          const incompleteTodoIds = todos
            .filter((t) => !t.completed)
            .map((t) => t.id);
          const allSelected =
            incompleteTodoIds.length > 0 &&
            incompleteTodoIds.every((id) => selectedTodos.includes(id));
          return (
            <Stack direction="row" className={styles.actionsRow}>
              <Button
                variant="outlined"
                disabled={incompleteTodoIds.length === 0}
                onClick={() =>
                  setSelectedTodos(allSelected ? [] : incompleteTodoIds)
                }
              >
                {allSelected ? "Deselect All" : "Select All"}
              </Button>
              {selectedTodos.length > 0 && (
                <Button
                  variant="contained"
                  onClick={() => setIsBulkCompleteModalOpen(true)}
                >
                  Mark {selectedTodos.length} Todos as Completed
                </Button>
              )}
            </Stack>
          );
        })()}
        <TodoList
          todos={todos}
          loading={isTodosLoading}
          error={todosErrorMessage}
          selectedIds={selectedTodos}
          onSelect={handleSelect}
          onStatusUpdate={handleStatusUpdate}
          onDelete={(id) =>
            setTodoToDelete(todos.find((t) => t.id === id) ?? null)
          }
        />
      </Stack>
      <CreateTodoForm
        open={isCreateTodoModalOpen}
        categories={categories}
        onCreateTodo={handleCreateTodo}
        onClose={() => setIsCreateTodoModalOpen(false)}
      />
      <ConfirmationalModal
        open={todoToDelete !== null}
        title="Delete task"
        message={`Are you sure you want to delete "${todoToDelete?.text}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setTodoToDelete(null)}
      />
      <ConfirmationalModal
        open={isBulkCompleteModalOpen}
        title="Mark as completed"
        message={`Are you sure you want to mark ${selectedTodos.length} task${selectedTodos.length === 1 ? "" : "s"} as completed?`}
        onConfirm={handleUpdateTodosStatusBulk}
        onCancel={() => setIsBulkCompleteModalOpen(false)}
      />
    </>
  );
};

export default TodoPage;
