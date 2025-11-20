import { LoadingSpinner } from "../icons";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "left",
  fullWidth = false,
  type = "button",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: { backgroundColor: "var(--color-primary)", color: "#fff" },
    secondary: { backgroundColor: "var(--color-secondary)", color: "#fff" },
    outline: { borderColor: "var(--color-300)", color: "var(--color-text)" },
    ghost: { color: "var(--color-text)" },
    danger: { backgroundColor: "#DC2626", color: "#fff" },
    success: { backgroundColor: "#059669", color: "#fff" },
    google: {
      backgroundColor: "var(--color-surface)",
      borderColor: "var(--color-300)",
      color: "var(--color-text)",
    },
  };

  const variants = {
    primary: "hover:opacity-90 focus:ring-2",
    secondary: "hover:opacity-90 focus:ring-2",
    outline: "border-2 hover:opacity-80 focus:ring-2",
    ghost: "hover:opacity-80 focus:ring-2",
    danger: "hover:opacity-90 focus:ring-2",
    success: "hover:opacity-90 focus:ring-2",
    google: "border hover:opacity-80 focus:ring-2",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      style={variantStyles[variant]}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner className={iconSizes[size]} />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon className={`${iconSizes[size]} ${children ? "mr-2" : ""}`} />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon className={`${iconSizes[size]} ${children ? "ml-2" : ""}`} />
          )}
        </>
      )}
    </button>
  );
};
