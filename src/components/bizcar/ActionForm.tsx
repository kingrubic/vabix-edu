"use client";

import { useState } from "react";

type Result = { error?: string; ok?: boolean; message?: string } | void;

export function ActionForm({
  action,
  children,
  className,
}: {
  action: (formData: FormData) => Promise<Result>;
  children: React.ReactNode;
  className?: string;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className={className}
      action={async (formData) => {
        setError(null);
        setMessage(null);
        const result = await action(formData);
        if (result?.error) setError(result.error);
        else if (result?.message) setMessage(result.message);
      }}
    >
      {children}
      {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
      {message ? <p className="mt-3 text-sm text-cyan-100">{message}</p> : null}
    </form>
  );
}
