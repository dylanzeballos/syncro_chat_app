export const Divider = ({ text = "OR", className = "" }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-300"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-2 bg-surface text-text-muted">{text}</span>
      </div>
    </div>
  );
};
