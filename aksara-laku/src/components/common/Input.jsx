import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, hint, id, className = "", ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-semibold text-ink">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`
          bg-white border px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/50
          rounded-xl shadow-xs transition-all duration-300 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-[#77642e] focus:border-transparent
          ${error ? "border-red-500 ring-1 ring-red-500/30 text-ink" : "border-[#77642e]/20 hover:border-[#77642e]/40"}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
          {error}
        </span>
      )}
      {!error && hint && <span className="text-xs text-ink-soft/75">{hint}</span>}
    </div>
  );
});

export default Input;
