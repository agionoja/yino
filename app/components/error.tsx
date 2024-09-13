import { useEffect, useRef, useState } from "react";

type Props = {
  showError: boolean;
  message?: string;
  autoClose?: boolean;
  duration?: number;
};

export function ErrorMessage({
  message,
  showError,
  autoClose = false,
  duration = 3000,
}: Props) {
  const [visible, setVisible] = useState(showError);
  const visibilityTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (showError && autoClose) {
      setVisible(true);
      visibilityTimer.current = setTimeout(() => {
        setVisible(false);
      }, duration);
    } else {
      setVisible(showError);
    }

    return () => {
      if (visibilityTimer.current) {
        clearTimeout(visibilityTimer.current);
      }
    };
  }, [showError, autoClose, duration]);

  return visible ? (
    <p className="text-center text-sm text-red-500">{message}</p>
  ) : (
    <>&nbsp;</>
  );
}
