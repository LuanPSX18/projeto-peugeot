"use client";

import type { AlertText } from "@/lib/types";
import { CloseIcon } from "./Icons";

type Props = {
  alert: AlertText;
  onDismiss: () => void;
};

export function AlertBanner({ alert, onDismiss }: Props) {
  return (
    <div className="alert" role="alert">
      <div className="alert-icon">!</div>
      <div className="alert-text">
        <div className="alert-title">{alert.title}</div>
        <div className="alert-body">{alert.body}</div>
      </div>
      <button className="alert-close" onClick={onDismiss} aria-label="Dispensar">
        <CloseIcon />
      </button>
    </div>
  );
}
