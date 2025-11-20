export const Input = ({
  label,
  error,
  icon: Icon,
  type = "text",
  className = "",
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label
          className="block text-sm font-medium mb-1"
          style={{ color: "var(--color-text)" }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5" style={{ color: "var(--color-400)" }} />
          </div>
        )}
        <input
          type={type}
          className={`
            block w-full rounded-lg border
            ${Icon ? "pl-10" : "pl-3"} pr-3 py-2
            focus:outline-none focus:ring-2 focus:border-transparent
            ${className}
          `}
          style={{
            borderColor: error ? "#DC2626" : "var(--color-300)",
            color: "var(--color-text)",
            backgroundColor: "var(--color-surface)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error
              ? "#DC2626"
              : "var(--color-primary)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? "#DC2626" : "var(--color-300)";
          }}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm" style={{ color: "#DC2626" }}>
          {error}
        </p>
      )}
    </div>
  );
};
