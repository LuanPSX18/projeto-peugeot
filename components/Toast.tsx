"use client";

type Props = {
  message: string;
  onClose: () => void;
};

export function Toast({ message, onClose }: Props) {
  return (
    <div className="toast" role="alert">
      <span>{message}</span>
      <button className="toast-close" onClick={onClose} aria-label="Fechar">
        ✕
      </button>
    </div>
  );
}
