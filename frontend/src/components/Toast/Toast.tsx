import { Alert, Button } from "@mui/material";
import { useState, useEffect } from "react";

import { UNDO_DELAY } from "./toast";
import type { ToastSeverity } from "./toast";

interface ToastProps {
  message: string;
  severity: ToastSeverity;
  onUndo?: () => void;
  onClose: () => void;
}

const Toast = ({ message, severity, onUndo, onClose }: ToastProps) => {
  const [countdown, setCountdown] = useState(UNDO_DELAY / 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      action={
        onUndo ? (
          <Button color="inherit" size="small" onClick={onUndo}>
            Undo ({countdown}s)
          </Button>
        ) : undefined
      }
    >
      {message}
    </Alert>
  );
};

export default Toast;
