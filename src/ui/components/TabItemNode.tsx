import React, { useEffect, useRef } from "react";
import { setIcon } from "obsidian";
import { ArenaNode } from "../../types/tab-tree";
import { useTabStore } from "../../store/tab-store";

interface TabItemNodeProps {
  node: ArenaNode;
  onSelectTab: (leafId: string) => void;
}

export const TabItemNode: React.FC<TabItemNodeProps> = ({ node, onSelectTab }) => {
  const fileIconRef = useRef<HTMLDivElement>(null);
  const snowflakeIconRef = useRef<HTMLDivElement>(null);
  const activeNodeId = useTabStore((state) => state.activeNodeId);

  const isActive = activeNodeId === node.id;

  useEffect(() => {
    if (fileIconRef.current) {
      setIcon(fileIconRef.current, "file-text");
    }
    if (snowflakeIconRef.current && node.isHibernated) {
      setIcon(snowflakeIconRef.current, "snowflake");
    }
  }, [node.isHibernated]);

  const handleClick = () => {
    if (node.leafId) {
      onSelectTab(node.leafId);
    }
  };

  return (
    <div
      className={`vtp-tab-item ${isActive ? "is-active" : ""} ${
        node.isHibernated ? "is-hibernated" : ""
      }`}
      style={{ "--vtp-indent-level": node.depth } as React.CSSProperties}
      onClick={handleClick}
    >
      <div ref={fileIconRef} className="vtp-tab-icon" />
      <span className="vtp-tab-title">{node.title}</span>
      {node.isHibernated && (
        <div
          ref={snowflakeIconRef}
          className="vtp-snowflake-badge"
          title="Tab is hibernated (Memory Freed)"
        />
      )}
    </div>
  );
};
