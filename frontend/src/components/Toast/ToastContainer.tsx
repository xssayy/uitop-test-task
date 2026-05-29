import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { subscribeToasts, dismissToast, type ToastItem } from "./toast";
import Toast from "./Toast.tsx";
import styles from "./ToastContainer.module.css";

const ToastContainer = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribeToasts(setToasts);
  }, []);

  return createPortal(
    <div className={styles.container}>
      {toasts.map((t) => (
        <Toast
          key={t.id}
          message={t.message}
          severity={t.severity}
          onUndo={
            t.onUndo
              ? () => {
                  t.onUndo!();
                  dismissToast(t.id);
                }
              : undefined
          }
          onClose={() => dismissToast(t.id)}
        />
      ))}
    </div>,
    document.body,
  );
};

export default ToastContainer;
