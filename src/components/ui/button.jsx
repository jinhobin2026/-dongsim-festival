import React from "react";

export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}