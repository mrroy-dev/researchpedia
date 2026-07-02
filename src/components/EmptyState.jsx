import "./EmptyState.css";

export default function EmptyState({ title, children }) {
  return (
    <div className="empty-state">
      <div className="empty-state__stamp">N/A</div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
