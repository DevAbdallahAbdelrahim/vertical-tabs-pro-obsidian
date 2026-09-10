import React, { useEffect, useRef } from "react";
import { setIcon } from "obsidian";
import { ArenaNode } from "../../types/tab-tree";
import { useTabStore } from "../../store/tab-store";

interface TabGroupNodeProps {
  node: ArenaNode;
  saveCallback: any;
}

export const TabGroupNode: React.FC<TabGroupNodeProps> = ({
  node,
  saveCallback,
}) => {
  const foldIconRef = useRef<HTMLDivElement>(null);
  const groupIconRef = useRef<HTMLDivElement>(null);
  const toggleGroupCollapse = useTabStore((state) => state.toggleGroupCollapse);

  useEffect(() => {
    if (foldIconRef.current) {
      setIcon(foldIconRef.current, "chevron-down");
    }
    if (groupIconRef.current) {
      setIcon(groupIconRef.current, "folder");
    }
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleGroupCollapse(node.id, saveCallback);
  };

  return (
    <div
      className="vtp-group-header"
      style={{ "--vtp-indent-level": node.depth } as React.CSSProperties}
      onClick={handleToggle}
    >
      <div
        ref={foldIconRef}
        className={`vtp-fold-icon ${node.isCollapsed ? "is-collapsed" : ""}`}
      />
      <div ref={groupIconRef} className="vtp-group-icon" />
      <span className="vtp-group-title">{node.title}</span>
      <span className="vtp-badge-count">{node.childrenIds.length}</span>
    </div>
  );
};
