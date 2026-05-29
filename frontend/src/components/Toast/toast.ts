export const UNDO_DELAY = 5000;
const ERROR_DELAY = 4000;

export type ToastSeverity = "info" | "error";

export type ToastItem = {
  id: number;
  message: string;
  severity: ToastSeverity;
  onUndo?: () => void;
};

type Listener = (items: ToastItem[]) => void;

let items: ToastItem[] = [];
let idCounter = 0;
let listener: Listener | null = null;

const notify = () => listener?.(items);

export const dismissToast = (id: number): void => {
  items = items.filter((t) => t.id !== id);
  notify();
};

export const toast = (message: string, onUndo?: () => void): void => {
  const id = ++idCounter;
  items = [...items, { id, message, severity: "info", onUndo }];
  notify();
  setTimeout(() => dismissToast(id), UNDO_DELAY);
};

export const toastError = (message: string): void => {
  const id = ++idCounter;
  items = [...items, { id, message, severity: "error" }];
  notify();
  setTimeout(() => dismissToast(id), ERROR_DELAY);
};

export const subscribeToasts = (cb: Listener): (() => void) => {
  listener = cb;
  return () => {
    listener = null;
  };
};
