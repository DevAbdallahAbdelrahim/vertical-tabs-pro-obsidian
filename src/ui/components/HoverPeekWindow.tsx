import React from "react";

interface HoverPeekWindowProps {
  title: string;
  filePath: string | null;
  position: { x: number; y: number };
}

export const HoverPeekWindow: React.FC<HoverPeekWindowProps> = ({
  title,
  filePath,
  position,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        top: position.y + 10,
        left: position.x + 15,
        zIndex: 9999,
        width: "220px",
        padding: "8px 12px",
        borderRadius: "6px",
        backgroundColor: "var(--background-secondary-alt)",
        border: "1px solid var(--background-modifier-border-hover)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: "0.85rem",
          color: "var(--text-normal)",
          marginBottom: "4px",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          wordBreak: "break-all",
        }}
      >
        {filePath || "No file path"}
      </div>
    </div>
  );
};
