"use client";

import { createContext, useCallback, useContext, useState } from "react";

type ToastKind = "default" | "success";
type ToastItem = { id: string; msg: string; kind: ToastKind };

const Ctx = createContext<((msg: string, kind?: ToastKind) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((msg: string, kind: ToastKind = "default") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3000);
  }, []);

  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="a-toast-host">
        {toasts.map((t) => (
          <div key={t.id} className={`a-toast ${t.kind === "success" ? "a-toast--success" : ""}`}>
            <span className="a-toast__dot" />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
