// Card component with UI Design System tokens:
// - White background (#FFFFFF)
// - rounded-2xl radius & border border-line
// - Soft shadow-sm with hover:shadow-md elevation
// - transition-all duration-300 ease-in-out
export default function Card({ children, className = "", as: Tag = "div", ...props }) {
  return (
    <Tag
      className={`rounded-2xl bg-white border border-line shadow-sm hover:shadow-md transition-all duration-300 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}
